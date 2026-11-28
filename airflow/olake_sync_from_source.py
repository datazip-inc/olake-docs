# Written for Airflow 3 with the apache-airflow-providers-cncf-kubernetes and
# apache-airflow-providers-standard packages. On Airflow 2, import DAG from `airflow`
# and PythonOperator from `airflow.operators.python` instead.
from __future__ import annotations

import pendulum

from airflow.sdk import DAG
from airflow.providers.cncf.kubernetes.operators.pod import KubernetesPodOperator
from kubernetes.client import models as k8s
from airflow.providers.standard.operators.python import PythonOperator
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
# Examples: "olakego/source-mongodb:v1.2.2", "olakego/source-mysql:v1.2.2", "olakego/source-postgres:v1.2.2"
OLAKE_IMAGE = "olakego/source-postgres:v1.2.2" # <-- EDIT THIS LINE (image and version for your source)

# !!! IMPORTANT: Set this to the name of a StorageClass in your K8s cluster !!!
# It MUST support PVC_ACCESS_MODE (set next to the PVC below). ReadWriteMany examples:
# "azurefile" (AKS), "standard-rwx" (GKE Filestore), an EFS provisioner (EKS)
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
dag_start_date = pendulum.datetime(2025, 1, 1, tz="UTC")

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
            items=[
                k8s.V1KeyToPath(key="available_streams.json", path="available_streams.json"),
                k8s.V1KeyToPath(key="selected_streams.json", path="selected_streams.json"),
            ]
        )
    )
    
    # !!! IMPORTANT: Access mode of the shared PVC, which holds the configs, state.json and the row index !!!
    # If any stream uses update_type "pos" (positional deletes) or "dv" (deletion vectors), OLake Go
    # keeps a row index on this PVC (OLAKE_INDEX_DB_DIR in the sync task). The index needs block storage
    # with file locking and reliable fsync: set "ReadWriteOnce" and a block StorageClass (an EBS,
    # Persistent Disk or Azure Disk class). NFS, EFS, Filestore and Azure Files are not supported for it.
    # Keep "ReadWriteMany" only when every stream uses "eq" or append mode.
    PVC_ACCESS_MODE = "ReadWriteMany" # <-- EDIT THIS LINE ("ReadWriteMany" or "ReadWriteOnce")

    # Persistent Volume Claim spec to share data between tasks
    # Note: This is the PVC definition model but not used directly 
    # (created via API call in the create_pvc_with_hook function)
    shared_pvc = k8s.V1PersistentVolumeClaim(
        metadata=k8s.V1ObjectMeta(name="olake-shared-data"),
        spec=k8s.V1PersistentVolumeClaimSpec(
            access_modes=[PVC_ACCESS_MODE],
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
                access_modes=[PVC_ACCESS_MODE],
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
    # Copies source, destination, AND both streams files from ConfigMaps to the shared PVC.
    # It does not create or touch state.json: OLake Go writes that file itself after the first run.
    # Container-level security context for the init container
    container_security_context = k8s.V1SecurityContext(
        run_as_user=0,         # Choose a user ID
        run_as_group=0,        # Choose a group ID
    )
    # Pod-level security context for the sync pod
    pod_security_context = k8s.V1PodSecurityContext(
        run_as_user=0,         # Choose a user ID
        run_as_group=0,        # Choose a group ID
    )

    init_container_sync = k8s.V1Container(
        name="init-config",
        image="busybox", # Standard utility image
        command=["sh", "-c", 
            "mkdir -p /mnt/workspace && \
            cp /etc/source-config/source.json /mnt/workspace/ && \
            cp /etc/destination-config/destination.json /mnt/workspace/ && \
            cp /etc/streams-config/available_streams.json /mnt/workspace/ && \
            cp /etc/streams-config/selected_streams.json /mnt/workspace/ && \
            ls -la /mnt/workspace"
        ],
        volume_mounts=[
            # Mount ConfigMaps read-only to copy from
            k8s.V1VolumeMount(name="source-config-volume", mount_path="/etc/source-config", read_only=True),
            k8s.V1VolumeMount(name="destination-config-volume", mount_path="/etc/destination-config", read_only=True),
            k8s.V1VolumeMount(name="streams-config-volume", mount_path="/etc/streams-config", read_only=True),
            # Mount the shared PVC writable to copy into
            k8s.V1VolumeMount(name="shared-data", mount_path="/mnt/workspace", read_only=False)
        ],
        security_context=container_security_context
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

        # Keep the row index for "pos" and "dv" streams on the PVC, so the next run reuses it
        # instead of rebuilding it with a scan of the whole Iceberg table. Other streams ignore it.
        env_vars=[k8s.V1EnvVar(name="OLAKE_INDEX_DB_DIR", value="/mnt/config/index-db")],

        # Run the OLake Go binary through a shell so --state is passed only when a saved
        # state exists. OLake Go writes state.json next to source.json on the PVC after each
        # run. A first run without --state starts with the current state version; passing an
        # empty {} state would pin the pipeline to the legacy state version 0.
        cmds=["/bin/sh", "-c"],
        arguments=[
            'STATE=""; [ -s /mnt/config/state.json ] && STATE="--state /mnt/config/state.json"; '
            'exec /home/olake sync --config /mnt/config/source.json '
            '--destination /mnt/config/destination.json '
            '--available-streams /mnt/config/available_streams.json '
            '--selected-streams /mnt/config/selected_streams.json $STATE'
        ],

        # Operator settings
        get_logs=True,             # Stream pod logs to Airflow task logs
        log_events_on_failure=True,# Log K8s events if the pod fails
        do_xcom_push=False,        # We aren't expecting XCom results
        on_finish_action="delete_pod",  # Delete the pod when the task finishes (success or failure)
        startup_timeout_seconds=300,# Max time to wait for pod to start
        # Add resource requests/limits if needed, e.g.:
        # container_resources=k8s.V1ResourceRequirements(
        #     requests={"cpu": "1", "memory": "2Gi"},
        #     limits={"cpu": "2", "memory": "4Gi"}
        # )

        # Add the affinity specification here
        affinity=affinity_spec, # Assign the constructed affinity object (or None)
        security_context=pod_security_context,
    )
    
    # --- Define Task Dependencies ---
    # 1. Ensure PVC exists
    # 2. Run the sync task
    create_pvc >> sync_data
