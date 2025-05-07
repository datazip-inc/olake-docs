from __future__ import annotations

import pendulum
import base64
from datetime import timedelta
import logging
import time

from airflow.models.dag import DAG
from airflow.providers.amazon.aws.operators.ec2 import (
    EC2CreateInstanceOperator,
    EC2TerminateInstanceOperator,
)
from airflow.providers.amazon.aws.hooks.ec2 import EC2Hook
from airflow.providers.ssh.hooks.ssh import SSHHook
from airflow.operators.python import PythonOperator
from airflow.utils.trigger_rule import TriggerRule
from airflow.exceptions import AirflowSkipException

# --- Global Configuration ---
AWS_CONN_ID = "AWS_CONNECTION_ID"   # Connection ID for AWS
AWS_REGION_NAME = "AWS-REGION"      # AWS Region
SSH_CONN_ID = "SSH_CONNECTION_ID"   # SSH connection ID for connecting to instances

# EC2 Instance Configuration
AMI_ID = "ami-000ff0b5b095afd18"            # AMI ID for container-ready image
INSTANCE_TYPE = "ARM_INSTANCE_TYPE"         # Instance size based on workload requirements
KEY_NAME = "EC2_KEY_PAIR_NAME"              # SSH key pair name
SUBNET_ID = "VPC_SUBNET_ID" 
SECURITY_GROUP_ID = "VPC_SECUROTY_GROUP"    # Ensure required ports are open
IAM_ROLE_NAME = "INSTANCE_IAM_PROFILE_NAME" # IAM role for cloud storage access

DEFAULT_EC2_USER = "ubuntu"  # Default user for SSH connection

# ETL Configuration 
S3_BUCKET = "S3_BUCKET_NAME"
S3_PREFIX = "S3_BUCKET_PREFIX"
S3_STATE_KEY_PATH = f"{S3_PREFIX}state.json"

# Find images at: https://hub.docker.com/u/olakego
# Examples: "olakego/source-mongodb:latest", "olakego/source-mysql:latest", "olakego/source-postgres:latest"
OLAKE_IMAGE = "DOCKER_IMAGE_NAME"

DOCKER_NETWORK_MODE = "host"

# Directory structure for data and config files
EC2_OLAKE_BASE_DIR = "/opt/olake_run"
EC2_CONFIG_DIR = f"{EC2_OLAKE_BASE_DIR}/configs"
EC2_STATE_DIR = EC2_CONFIG_DIR  # Same directory for configs and state
EC2_STATE_FILE = f"{EC2_CONFIG_DIR}/state.json"

# --- Initialization script for compute instance ---
USER_DATA_SCRIPT_CONTENT = f"""#!/bin/bash -xe
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "--- Instance initialization: Starting Setup ---"

echo "Creating application directories ({EC2_OLAKE_BASE_DIR})..."
sudo mkdir -p {EC2_CONFIG_DIR}
sudo chmod -R 775 {EC2_OLAKE_BASE_DIR}

echo "--- Initialization script finished ---"
exit 0
"""
ENCODED_USER_DATA = base64.b64encode(USER_DATA_SCRIPT_CONTENT.encode('utf-8')).decode('ascii')

# --- Function to get connection information ---
def get_instance_connect_address_callable(ti, aws_conn_id: str, region_name: str):
    instance_ids = ti.xcom_pull(task_ids='create_ec2_instance_task', key='return_value')
    if not instance_ids:
        logging.error("No instance IDs found in XCom from create_ec2_instance_task.")
        raise AirflowSkipException("Could not retrieve instance IDs for create_ec2_instance_task.")

    instance_id = instance_ids[0]
    logging.info(f"Fetching connection address for instance: {instance_id}")

    hook = EC2Hook(aws_conn_id=aws_conn_id, region_name=region_name)
    
    ec2_resource = hook.get_conn()
    ec2_client = ec2_resource.meta.client
    connect_address = None

    try:
        logging.info(f"Waiting for instance {instance_id} to pass status checks...")
        waiter = ec2_client.get_waiter('instance_running')
        waiter.wait(InstanceIds=[instance_id], WaiterConfig={'Delay': 5, 'MaxAttempts': 24})
        logging.info(f"Instance {instance_id} passed status checks.")

        response = ec2_client.describe_instances(InstanceIds=[instance_id])
        
        if not response.get('Reservations') or not response['Reservations'][0].get('Instances'):
            logging.error(f"No instance details found for ID: {instance_id} in describe_instances response.")
            raise ValueError(f"No instance found for ID: {instance_id}")

        instance_info = response['Reservations'][0]['Instances'][0]
        public_ip = instance_info.get('PublicIpAddress')

        connect_address = public_ip

        if not connect_address:
            private_dns = instance_info.get('PrivateDnsName')
            private_ip = instance_info.get('PrivateIpAddress')
            connect_address = private_dns if private_dns else private_ip
            if connect_address:
                logging.warning(f"Instance {instance_id} does not have Public IP. Using Private address: {connect_address}.")
            else:
                logging.error(f"Instance {instance_id} has no accessible address.")
                raise ValueError(f"Instance {instance_id} has no connectable address.")
        
        logging.info(f"Found connect address for {instance_id}: {connect_address}")

        # Wait for SSH service to be ready
        logging.info("Waiting 60 seconds for SSH to be available...")
        time.sleep(60)

        ti.xcom_push(key='instance_connect_address', value=connect_address)
        return connect_address
    except Exception as e:
        logging.error(f"Error during address retrieval for instance {instance_id}: {e}")
        raise

def run_olake_docker_via_ssh(ti, ssh_conn_id, command):
    remote_host = ti.xcom_pull(task_ids='get_instance_ip_task', key='instance_connect_address')
    if not remote_host:
        raise ValueError("No remote_host found in XCom from get_instance_ip_task.")
        
    ssh_hook = SSHHook(ssh_conn_id=ssh_conn_id, remote_host=remote_host)
    logging.info(f"Connecting to remote host: {remote_host}")
    
    with ssh_hook.get_conn() as ssh_client:
        # Get a channel instead of using exec_command
        transport = ssh_client.get_transport()
        channel = transport.open_session()
        channel.exec_command(command)
        
        # Stream stdout in real-time
        stdout_buffer = ""
        stderr_buffer = ""
        
        # Read data as it becomes available and log it in real-time
        while True:
            # Check if the channel has data to read
            if channel.recv_ready():
                chunk = channel.recv(1024).decode('utf-8', errors='replace')
                if chunk:
                    stdout_buffer += chunk
                    # Split by newlines to process line by line
                    lines = stdout_buffer.split('\n')
                    # Keep the last (potentially incomplete) line in the buffer
                    stdout_buffer = lines.pop() if lines[-1] != '' else ""
                    # Log each complete line
                    for line in lines:
                        if line:
                            logging.info(f"STDOUT: {line}")
            
            # Check if stderr has data
            if channel.recv_stderr_ready():
                chunk = channel.recv_stderr(1024).decode('utf-8', errors='replace')
                if chunk:
                    stderr_buffer += chunk
                    # Split by newlines to process line by line
                    lines = stderr_buffer.split('\n')
                    # Keep the last line in the buffer
                    stderr_buffer = lines.pop() if lines[-1] != '' else ""
                    # Log each line
                    for line in lines:
                        if line:
                            logging.warning(f"STDERR: {line}")
            
            # Check if the command has finished
            if channel.exit_status_ready():
                # Process remaining data in buffers
                if stdout_buffer:
                    logging.info(f"STDOUT: {stdout_buffer}")
                if stderr_buffer:
                    logging.warning(f"STDERR: {stderr_buffer}")
                    
                # Get exit code
                exit_code = channel.recv_exit_status()
                logging.info(f"Command completed with exit code: {exit_code}")
                
                if exit_code != 0:
                    raise Exception(f"SSH command failed with exit code {exit_code}.")
                return
                
            # Small sleep to prevent CPU spinning
            time.sleep(0.1)

# --- Command to run ETL job via SSH ---
olake_ssh_command = f"""
set -eo pipefail
echo "--- Starting ETL Process on remote instance ---"
date

EC2_CONFIG_DIR="{EC2_OLAKE_BASE_DIR}/configs"
EC2_STATE_FILE="{EC2_CONFIG_DIR}/state.json"

echo "Creating directories if they don't exist..."
sudo mkdir -p $EC2_CONFIG_DIR

echo "Fetching configuration files from object storage..."
sudo aws s3 sync --region {AWS_REGION_NAME} s3://{S3_BUCKET}/{S3_PREFIX} $EC2_CONFIG_DIR --delete
if [ $? -ne 0 ]; then echo "ERROR: Failed to download configuration files."; exit 1; fi

echo "Fetching state file from object storage..."
sudo aws s3 cp --region {AWS_REGION_NAME} s3://{S3_BUCKET}/{S3_STATE_KEY_PATH} $EC2_STATE_FILE || {{
  echo "INFO: State file not found. Creating empty state file."
  sudo bash -c "echo '{{}}' > $EC2_STATE_FILE"
}}

echo "Pulling container image: {OLAKE_IMAGE}..."
sudo ctr image pull docker.io/{OLAKE_IMAGE}
if [ $? -ne 0 ]; then echo "ERROR: Failed to pull container image."; exit 101; fi

echo "Running data sync process..."
sudo ctr run --rm \
    --mount type=bind,src=$EC2_CONFIG_DIR,dst=/mnt/config,options=rbind:rw \
    --net-host \
    docker.io/{OLAKE_IMAGE} \
    olake-ssh-sync \
    /home/olake \
    sync \
    --config /mnt/config/source.json \
    --catalog /mnt/config/streams.json \
    --destination /mnt/config/destination.json \
    --state /mnt/config/state.json
OLAKE_EXIT_CODE=$?
echo "INFO: ETL process finished with exit code: $OLAKE_EXIT_CODE"

if [ $OLAKE_EXIT_CODE -ne 0 ]; then
  echo "ERROR: ETL job failed with exit code $OLAKE_EXIT_CODE."
  exit $OLAKE_EXIT_CODE
fi

echo "ETL sync successful. Uploading updated state file to storage..."
sudo aws s3 cp --region {AWS_REGION_NAME} $EC2_STATE_FILE s3://{S3_BUCKET}/{S3_STATE_KEY_PATH}
UPLOAD_STATE_EXIT_CODE=$?
if [ $UPLOAD_STATE_EXIT_CODE -ne 0 ]; then
    echo "ERROR: Failed to upload state file. Exit code: $UPLOAD_STATE_EXIT_CODE"
    exit $UPLOAD_STATE_EXIT_CODE
fi
echo "INFO: State file uploaded successfully."

echo "--- ETL Process Completed Successfully ---"
date
exit 0
"""

# --- DAG Definition ---
with DAG(
    dag_id="olake_sync_from_source",
    start_date=pendulum.datetime(2023, 10, 26, tz="UTC"),
    schedule=None,
    catchup=False,
    tags=['olake', 'ec2', 'ssh', 'containerd'],
    dagrun_timeout=timedelta(hours=4),
    default_args={
        'owner': 'airflow',
        'retries': 0,
    }
) as dag:

    create_ec2_instance_task = EC2CreateInstanceOperator(
        task_id="create_ec2_instance_task",
        aws_conn_id=AWS_CONN_ID,
        region_name=AWS_REGION_NAME,
        image_id=AMI_ID,
        min_count=1,
        max_count=1,
        config={
            "InstanceType": INSTANCE_TYPE,
            "KeyName": KEY_NAME,
            "SubnetId": SUBNET_ID,
            "SecurityGroupIds": [SECURITY_GROUP_ID],
            "IamInstanceProfile": {'Name': IAM_ROLE_NAME},
            "UserData": ENCODED_USER_DATA,
            "TagSpecifications": [
                {
                    'ResourceType': 'instance',
                    'Tags': [
                        {'Key': 'Name', 'Value': '{{ dag.dag_id }}-{{ run_id }}'},
                        {'Key': 'ManagedBy', 'Value': 'Airflow'},
                        {'Key': 'AirflowDAG', 'Value': '{{ dag.dag_id }}'},
                        {'Key': 'AirflowRunID', 'Value': '{{ run_id }}'}
                    ]
                }
            ]
        },
        wait_for_completion=True,
    )

    get_instance_ip_task = PythonOperator(
        task_id="get_instance_ip_task",
        python_callable=get_instance_connect_address_callable,
        op_kwargs={"aws_conn_id": AWS_CONN_ID, "region_name": AWS_REGION_NAME},
    )

    run_olake_docker_task = PythonOperator(
        task_id="run_olake_docker_task",
        python_callable=run_olake_docker_via_ssh,
        op_kwargs={
            "ssh_conn_id": SSH_CONN_ID,
            "command": olake_ssh_command,
        },
    )

    terminate_ec2_instance_task = EC2TerminateInstanceOperator(
        task_id="terminate_ec2_instance_task",
        aws_conn_id=AWS_CONN_ID,
        region_name=AWS_REGION_NAME,
        instance_ids=["{{ ti.xcom_pull(task_ids='create_ec2_instance_task', key='return_value')[0] }}"],
        trigger_rule=TriggerRule.ALL_DONE,
    )

    # Define Task Dependencies
    create_ec2_instance_task >> get_instance_ip_task >> run_olake_docker_task >> terminate_ec2_instance_task
