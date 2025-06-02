from __future__ import annotations

import pendulum

from airflow.models.dag import DAG
from airflow.providers.cncf.kubernetes.operators.pod import KubernetesPodOperator
from kubernetes.client import models as k8s
from airflow.operators.python import PythonOperator
from airflow.providers.cncf.kubernetes.hooks.kubernetes import KubernetesHook
from kubernetes import client

# --- Configuration ---
# !!! IMPORTANT: Set this to the ID of your configured Kubernetes connection in Airflow !!!
# This connection tells Airflow how to authenticate with your K8s cluster.
KUBERNETES_CONN_ID = "kubernetes_default" # <-- EDIT THIS LINE

# !!! IMPORTANT: Set this to the Kubernetes namespace where Olake pods should run !!!
# Ensure ConfigMaps and the PVC exist or will be created in this namespace.
TARGET_NAMESPACE = "olake" # <-- EDIT THIS LINE

# !!! IMPORTANT: Set this to the correct Olake image for your source database !!!
# Find images at: https://hub.docker.com/u/olakego
# Examples: "olakego/source-mongodb:latest", "olakego/source-mysql:latest", "olakego/source-postgres:latest"
OLAKE_IMAGE = "olakego/source-db:latest" # <-- EDIT THIS LINE

# !!! IMPORTANT: Set this to the name of a StorageClass in your K8s cluster !!!
# This StorageClass MUST support ReadWriteMany (RWX) access mode.
# Examples: "azurefile" (AKS), "standard-rwx" (GKE Filestore), an EFS provisioner (EKS)
STORAGE_CLASS_NAME = "default" # <-- EDIT THIS LINE

# --- Optional Node Affinity ---
# Set NODE_AFFINITY_LABEL_KEY and NODE_AFFINITY_LABEL_VALUE to target specific nodes.
# Set NODE_AFFINITY_REQUIRED to True for hard requirement, False for preference.
NODE_AFFINITY_REQUIRED = False # <-- EDIT THIS LINE (True/False)
NODE_AFFINITY_LABEL_KEY = "nodegroup_name" # <-- EDIT THIS LINE (e.g., "topology.kubernetes.io/zone")
NODE_AFFINITY_LABEL_VALUE = "olake" # <-- EDIT THIS LINE (e.g., "us-central1-a")

# --- Names of ConfigMaps ---
# Ensure ConfigMaps with these names exist in the TARGET_NAMESPACE
# containing your source, destination, and streams JSON configurations respectively.
SOURCE_CONFIG_MAP_NAME = "olake-source-config"
DESTINATION_CONFIG_MAP_NAME = "olake-destination-config"
STREAMS_CONFIG_MAP_NAME = "olake-streams-config"

# --- DAG Definition ---
# Set the start date to the current time in the Asia/Kolkata timezone
dag_start_date = pendulum.now("UTC")

with DAG(
    dag_id="olake_sync_from_source",
    start_date=dag_start_date,
    schedule=None,  # Manual trigger only
    catchup=False,
    # Generic tags
    tags=["kubernetes", "olake", "etl", "sync"],
    doc_md="""
    ### Olake Sync DAG

    This DAG runs the Olake `sync` command using pre-created ConfigMaps
    for source, destination, and streams configuration. It ensures a persistent
    volume claim exists before running the sync task.

    **Requires pre-configured Kubernetes Connection, ConfigMaps, and appropriate StorageClass.**
    """,
) as dag:
    
    # --- Volume Definitions ---
    
    # Source config volume: Contains source database connection details
    source_config_volume = k8s.V1Volume(
        name="source-config-volume",
        config_map=k8s.V1ConfigMapVolumeSource(
            name=SOURCE_CONFIG_MAP_NAME,
            items=[k8s.V1KeyToPath(key="source.json", path="source.json")]
        )
    )
    
    # Destination config volume: Contains destination configuration
    destination_config_volume = k8s.V1Volume(
        name="destination-config-volume", 
        config_map=k8s.V1ConfigMapVolumeSource(
            name=DESTINATION_CONFIG_MAP_NAME,
            items=[k8s.V1KeyToPath(key="destination.json", path="destination.json")]
        )
    )
    
    # Streams config volume: Contains pre-generated streams configuration
    streams_config_volume = k8s.V1Volume(
        name="streams-config-volume",
        config_map=k8s.V1ConfigMapVolumeSource(
            name=STREAMS_CONFIG_MAP_NAME,
            items=[k8s.V1KeyToPath(key="streams.json", path="streams.json")]
        )
    )
    
    # Persistent Volume Claim spec to share data between tasks
    # Note: This is the PVC definition model but not used directly 
    # (created via API call in the create_pvc_with_hook function)
    shared_pvc = k8s.V1PersistentVolumeClaim(
        metadata=k8s.V1ObjectMeta(name="olake-shared-data"),
        spec=k8s.V1PersistentVolumeClaimSpec(
            access_modes=["ReadWriteMany"],  # Allow multiple pods to read/write
            resources=k8s.V1ResourceRequirements(
                requests={"storage": "1Gi"}
            )
        )
    )

    # Shared volume reference for pods to mount the PVC
    shared_volume = k8s.V1Volume(
        name="shared-data",  # This name is referenced in volume_mounts
        persistent_volume_claim=k8s.V1PersistentVolumeClaimVolumeSource(
            claim_name="olake-shared-data"  # The actual PVC name in Kubernetes
        )
    )
    
    # --- PVC Creation Function ---
    def create_pvc_with_hook(**context):
        """
        Creates the 'olake-shared-data' PVC in the TARGET_NAMESPACE if it doesn't exist,
        using the globally defined STORAGE_CLASS_NAME.
        """
        k8s_hook = KubernetesHook(conn_id=KUBERNETES_CONN_ID)
        api_client = k8s_hook.get_conn()
        core_v1_api = client.CoreV1Api(api_client=api_client)
        pvc_name = "olake-shared-data"
        # Use the globally defined Storage Class Name
        storage_class = STORAGE_CLASS_NAME

        pvc = client.V1PersistentVolumeClaim(
            api_version="v1",
            kind="PersistentVolumeClaim",
            metadata=client.V1ObjectMeta(name=pvc_name),
            spec=client.V1PersistentVolumeClaimSpec(
                access_modes=["ReadWriteMany"],
                resources=client.V1ResourceRequirements(requests={"storage": "1Gi"}),
                storage_class_name=storage_class # Uses the top-level variable
            )
        )
        try:
            core_v1_api.read_namespaced_persistent_volume_claim(name=pvc_name, namespace=TARGET_NAMESPACE)
            print(f"PVC '{pvc_name}' already exists in namespace '{TARGET_NAMESPACE}'.")
        except client.rest.ApiException as e:
            if e.status == 404:
                print(f"PVC '{pvc_name}' not found in namespace '{TARGET_NAMESPACE}'. Creating using StorageClass '{storage_class}'...")
                core_v1_api.create_namespaced_persistent_volume_claim(namespace=TARGET_NAMESPACE, body=pvc)
                print(f"PVC '{pvc_name}' created successfully.")
            else:
                print("Error checking or creating PVC status:")
                raise e

    # --- Task 1: Create PVC ---
    create_pvc = PythonOperator(
        task_id='create_pvc',
        python_callable=create_pvc_with_hook,
        dag=dag
    )
    
    # --- Init Container for Sync Task ---
    # Copies source, destination, AND streams configs from ConfigMaps to the shared PVC
    # Also ensures an empty state.json exists if one is not already present.
    # Define a security context that will be used by both containers
    security_context = k8s.V1SecurityContext(
        run_as_user=0,         # Choose a user ID
        run_as_group=0,        # Choose a group ID
    )

    # Updated command to copy all three files and conditionally create state.json
    init_container_sync = k8s.V1Container(
        name="init-config",
        image="busybox", # Standard utility image
        command=["sh", "-c", 
            "mkdir -p /mnt/workspace && \
            cp /etc/source-config/source.json /mnt/workspace/ && \
            cp /etc/destination-config/destination.json /mnt/workspace/ && \
            cp /etc/streams-config/streams.json /mnt/workspace/ && \
            if [ ! -f /mnt/workspace/state.json ]; then \
            echo '{}' > /mnt/workspace/state.json; \
            fi && \
            ls -la /mnt/workspace"
        ],
        volume_mounts=[
            # Mount ConfigMaps read-only to copy from
            k8s.V1VolumeMount(name="source-config-volume", mount_path="/etc/source-config", read_only=True),
            k8s.V1VolumeMount(name="destination-config-volume", mount_path="/etc/destination-config", read_only=True),
            k8s.V1VolumeMount(name="streams-config-volume", mount_path="/etc/streams-config", read_only=True),
            # Mount the shared PVC writable to copy into and potentially create state.json
            k8s.V1VolumeMount(name="shared-data", mount_path="/mnt/workspace", read_only=False)
        ],
        security_context=security_context
    )
    
    # --- Node Affinity Definition (Conditional) ---
    affinity_spec = None
    if NODE_AFFINITY_LABEL_KEY and NODE_AFFINITY_LABEL_VALUE and NODE_AFFINITY_REQUIRED is not None:
        node_selector_term = k8s.V1NodeSelectorTerm(
            match_expressions=[
                k8s.V1NodeSelectorRequirement(
                    key=NODE_AFFINITY_LABEL_KEY,
                    operator='In',
                    values=[NODE_AFFINITY_LABEL_VALUE]
                )
            ]
        )
        node_affinity = k8s.V1NodeAffinity()
        if NODE_AFFINITY_REQUIRED:
            # Hard requirement: Pod must run on a matching node
            node_affinity.required_during_scheduling_ignored_during_execution = k8s.V1NodeSelector(
                node_selector_terms=[node_selector_term]
            )
        else:
            # Soft preference: Try to run on a matching node, but allow others if necessary
            node_affinity.preferred_during_scheduling_ignored_during_execution = [
                k8s.V1PreferredSchedulingTerm(
                    weight=1, # Priority weight (1-100)
                    preference=node_selector_term
                )
            ]
        affinity_spec = k8s.V1Affinity(node_affinity=node_affinity)
        print(f"Applying Node Affinity: Key='{NODE_AFFINITY_LABEL_KEY}', Value='{NODE_AFFINITY_LABEL_VALUE}', Required={NODE_AFFINITY_REQUIRED}")
    else:
        print("Node Affinity is disabled or not fully configured.")

    # --- Task 2: Sync Data ---
    sync_data = KubernetesPodOperator(
        task_id="sync_data",
        name="olake-sync",
        namespace=TARGET_NAMESPACE,
        image=OLAKE_IMAGE,
        kubernetes_conn_id=KUBERNETES_CONN_ID,

        # Run the init container first to prepare the workspace
        init_containers=[init_container_sync],

        # Define volumes needed by init and main containers
        volumes=[
            source_config_volume,
            destination_config_volume,
            streams_config_volume,
            shared_volume,
        ],
        # Define how the main container mounts the shared volume
        volume_mounts=[
            k8s.V1VolumeMount(
                name="shared-data",
                mount_path="/mnt/config",
                read_only=False,  # Must be false for write access
                mount_propagation="HostToContainer"  # May help with permission propagation
            ),
        ],

        # Use the container's default entrypoint (should be the Olake binary)
        cmds=None,
        # Pass arguments for the 'sync' command
        arguments=[
            "sync",
            "--config", "/mnt/config/source.json",     # Path within the mounted volume
            "--catalog", "/mnt/config/streams.json",    # Path within the mounted volume
            "--destination", "/mnt/config/destination.json", # Path within the mounted volume
            "--state", "/mnt/config/state.json"
        ],

        # Operator settings
        get_logs=True,             # Stream pod logs to Airflow task logs
        log_events_on_failure=True,# Log K8s events if the pod fails
        do_xcom_push=False,        # We aren't expecting XCom results
        is_delete_operator_pod=True,# Clean up pod upon task completion/failure
        startup_timeout_seconds=300,# Max time to wait for pod to start
        # Add resource requests/limits if needed, e.g.:
        # resources=k8s.V1ResourceRequirements(
        #     requests={"cpu": "1", "memory": "2Gi"},
        #     limits={"cpu": "2", "memory": "4Gi"}
        # )

        # Add the affinity specification here
        affinity=affinity_spec, # Assign the constructed affinity object (or None)
        security_context=security_context,
    )
    
    # --- Define Task Dependencies ---
    # 1. Ensure PVC exists
    # 2. Run the sync task
    create_pvc >> sync_data
