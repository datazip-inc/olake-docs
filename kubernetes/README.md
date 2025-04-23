---
sidebar_label: 'Kubernetes CronJob Setup'
---

# Setup Olake Sync as a Kubernetes CronJob

This guide details the process for deploying and managing an Olake data synchronization task as a scheduled Kubernetes CronJob. This configuration is suitable for automating recurring sync operations, particularly when using a static or pre-generated Olake catalog.

## Introduction

Running Olake as a Kubernetes CronJob provides automated, scheduled execution of the `sync` command. This leverages Kubernetes features for scheduling, reliability, and resource management, moving beyond manual Docker runs.

This setup utilizes several Kubernetes resources to manage configuration, state, and execution:

1.  **ConfigMaps:** Externalize Olake configurations:
    *   Source connection details (`cm_olake-source-config.yaml`).
    *   Destination writer settings (`cm_olake-writer-config.yaml`).
    *   Pre-generated Olake catalog (`cm_olake-catalog-config.yaml`).
2.  **PersistentVolumeClaim (PVC):** Provides a persistent storage volume (`olake-config-pvc`) used as a workspace. An init container copies configurations into this volume before the main Olake process starts. This volume persists Olake state files (`state.json`) and logs across job runs. Requires a `ReadWriteMany`-capable StorageClass.
3.  **CronJob:** The core scheduler resource defining the sync schedule, job template, and concurrency control (`concurrencyPolicy: Forbid` prevents overlapping runs).

## Prerequisites

Ensure the following requirements are met before proceeding:

1.  **Kubernetes Cluster Access**: Administrative access to a Kubernetes cluster.
2.  **`kubectl`**: Configured `kubectl` command-line tool. [Installation Guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
3.  **`ReadWriteMany` StorageClass**: A Kubernetes StorageClass supporting `ReadWriteMany` access mode must be available and correctly specified in `cronjob_olake.yaml` (replacing `${STORAGE_CLASS}`). Common examples include:
    *   AKS: `azurefile`
    *   GKE: `standard-rwx` (Filestore) or equivalent.
    *   EKS: An EFS CSI driver storage class.
4.  **Pre-generated Olake Catalog (`catalog.json`)**: This configuration runs the `sync` command directly and requires a `catalog.json` generated beforehand using the Olake `discover` command against your source.
    *   Catalog Generation Guides:
        *   [MongoDB](https://olake.io/docs/getting-started/mongodb#step-2-generate-a-catalog-file)
        *   [MySQL](https://olake.io/docs/getting-started/mysql#step-2-generate-a-catalog-file)
        *   [Postgres](https://olake.io/docs/getting-started/postgres#step-2-generate-a-catalog-file)
    *   The content of this file must be placed within `cm_olake-catalog-config.yaml`.
5.  **Kubernetes Namespace**: The manifests target the `olake` namespace. Create it if necessary (`kubectl create namespace olake`) or update the `namespace` fields in all YAML files if using a different one.
6.  **Node Labels (Optional)**: If using `nodeAffinity` in `cronjob_olake.yaml`, ensure target nodes possess the specified labels (e.g., `${LABEL:Key}=${LABEL:Value}`). Remove the `affinity` block if node targeting is not required.

## Configuration Steps

This setup requires several Kubernetes manifest files. You'll need to download these files first and then customize them for your specific environment.

**1. Download Manifest Files**

Use the links below to download the necessary YAML files. You can right-click the link and choose "Save Link As..." or use the provided `curl` commands in your terminal.

*   **Source ConfigMap:** Holds MongoDB connection details.
    *   [Download `cm_olake-source-config.yaml`](https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cm_olake-source-config.yaml)
        ```bash
        curl -Lo cm_olake-source-config.yaml https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cm_olake-source-config.yaml
        ```

*   **Writer ConfigMap:** Holds destination (e.g., Iceberg/S3) configuration.
    *   [Download `cm_olake-writer-config.yaml`](https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cm_olake-writer-config.yaml)
        ```bash
        curl -Lo cm_olake-writer-config.yaml https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cm_olake-writer-config.yaml
        ```

*   **Catalog ConfigMap:** Holds the pre-generated Olake catalog.
    *   [Download `cm_olake-catalog-config.yaml`](https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cm_olake-catalog-config.yaml)
        ```bash
        curl -Lo cm_olake-catalog-config.yaml https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cm_olake-catalog-config.yaml
        ```

*   **CronJob & PVC Manifest:** Defines the scheduled job and persistent storage.
    *   [Download `cronjob_olake.yaml`](https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cronjob_olake.yaml)
        ```bash
        curl -Lo cronjob_olake.yaml https://raw.githubusercontent.com/datazip-inc/olake-docs/master/path/to/manifests/cronjob_olake.yaml
        ```

*(**Note:** Please replace `/path/to/manifests/` in the URLs above with the actual path where these files will reside within the `datazip-inc/olake-docs` repository on the `master` branch).*

**2. Customize Downloaded Files**

After downloading the files, you **must edit them** to match your environment:

*   **`cm_olake-source-config.yaml`**:
    *   Edit the multi-line string under `config.json:` with your accurate MongoDB source connection parameters.
*   **`cm_olake-writer-config.yaml`**:
    *   Edit the multi-line string under `writer.json:` with your correct destination configuration (e.g., Iceberg settings, S3 path, AWS region).
    *   **Security Recommendation**: Manage sensitive credentials (like AWS keys) using Kubernetes Secrets instead of embedding them here.
*   **`cm_olake-catalog-config.yaml`**:
    *   Edit the multi-line string under `catalog.json:` and replace its content with your complete, pre-generated Olake catalog JSON.
*   **`cronjob_olake.yaml`**:
    *   `metadata.namespace` / `spec.jobTemplate.metadata.namespace` / PVC `metadata.namespace`: Change `olake` if using a different namespace.
    *   `spec.schedule`: Set the desired cron schedule.
    *   `spec.suspend`: Set to `false` to enable scheduling.
    *   `spec.jobTemplate.spec.template.spec.affinity`: If used, replace `${LABEL:Key}` and `${LABEL:Value}`. Otherwise, remove the `affinity` block.
    *   `spec.jobTemplate.spec.template.spec.containers[0].image`: Verify/update the Olake image tag.
    *   `spec.jobTemplate.spec.template.spec.containers[0].resources`: Adjust CPU/memory `requests` and `limits`.
    *   `PersistentVolumeClaim` section (at the end): **Crucially, replace `${STORAGE_CLASS}` with the name of your `ReadWriteMany`-capable StorageClass.**

Once you have customized these four files locally, proceed to the deployment steps.

## Deployment Procedure

Apply the configured manifests to your Kubernetes cluster:

1.  **Apply ConfigMaps**:
    ```bash
    kubectl apply -f cm_olake-source-config.yaml -n olake
    kubectl apply -f cm_olake-writer-config.yaml -n olake
    kubectl apply -f cm_olake-catalog-config.yaml -n olake
    ```

2.  **Apply CronJob and PVC**: This single file defines both resources.
    ```bash
    kubectl apply -f cronjob_olake.yaml -n olake
    ```

3.  **Verify PVC Status**: Confirm the PVC is created and bound to a persistent volume.
    ```bash
    kubectl get pvc olake-config-pvc -n olake
    ```
    *(Expected `STATUS` is `Bound`. If `Pending`, verify the StorageClass name and functionality via `kubectl get sc` and provisioner logs).*

4.  **Verify CronJob Status**:
    ```bash
    kubectl get cronjob olake-mongodb-sync -n olake
    ```

## Monitoring and Operations

Monitor the CronJob and its associated Jobs/Pods:

1.  **List Jobs**: View jobs created by the CronJob.
    ```bash
    kubectl get jobs -l cronjob-name=olake-mongodb-sync -n olake
    ```

2.  **List Pods for a Job**: Identify pods associated with a specific job instance.
    ```bash
    kubectl get pods -l job-name=<job-name> -n olake
    ```

3.  **View Pod Logs**: Access logs from the main Olake container or the init container.
    ```bash
    # Main container logs
    kubectl logs <pod-name> -n olake

    # Init container logs
    kubectl logs <pod-name> -c init-config -n olake
    ```

4.  **Inspect Resources**: Use `describe` for detailed status and events, useful for troubleshooting.
    ```bash
    kubectl describe pod <pod-name> -n olake
    kubectl describe job <job-name> -n olake
    ```

## Manual Job Execution and Control

*   **Trigger Manually**: Create a Job instance immediately from the CronJob template.
    ```bash
    kubectl create job --from=cronjob/olake-mongodb-sync manual-olake-sync-$(date +%s) -n olake
    ```

*   **Suspend CronJob**: Prevent the CronJob from creating new jobs based on the schedule.
    ```bash
    kubectl patch cronjob olake-mongodb-sync -n olake -p '{"spec":{"suspend":true}}'
    ```

*   **Unsuspend CronJob**: Re-enable the CronJob's schedule.
    ```bash
    kubectl patch cronjob olake-mongodb-sync -n olake -p '{"spec":{"suspend":false}}'
    ```

## Cleanup

To remove the deployed resources:

1.  **Delete CronJob**: Stops future scheduled jobs.
    ```bash
    kubectl delete cronjob olake-mongodb-sync -n olake
    ```

2.  **Delete PersistentVolumeClaim**: **Caution:** This action permanently deletes the underlying persistent volume and all data stored within it (copied configurations, state files, logs).
    ```bash
    kubectl delete pvc olake-config-pvc -n olake
    ```

3.  **Delete ConfigMaps**:
    ```bash
    kubectl delete configmap olake-source-config -n olake
    kubectl delete configmap olake-writer-config -n olake
    kubectl delete configmap olake-catalog-config -n olake
    ```

## Support

For further assistance or inquiries:

*   **Email:** `hello@olake.io`
*   **Slack Community:** ([Link to Slack Community - *Add Link Here*])
*   **Schedule a Call:** ([Link to Schedule Call - *Add Link Here*])

---
