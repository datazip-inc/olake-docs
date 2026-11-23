#!/bin/bash
# The AWS resources of these runs, smallest sizes, and their removal.
# These are the commands of the runs of 23 November 2026, collected in one script afterwards. Each resource was
# created when its run needed it and deleted when that run was done; the script as a whole was not run again.
#
#   ./provision.sh network      security group (this machine's address only), DB subnet group, parameter groups
#   ./provision.sh postgres     two RDS PostgreSQL instances and one Aurora PostgreSQL cluster
#   ./provision.sh mysql        one RDS MySQL instance and one Aurora MySQL cluster
#   ./provision.sh sqlserver    one RDS SQL Server Standard instance (the only costly one: create it late, delete it early)
#   ./provision.sh dms          the two IAM service roles DMS needs, a replication subnet group, a replication instance
#   ./provision.sh teardown     delete all of it, then list what is left under the test names
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
case "${1:-}" in network) RB_SG=pending ;; esac     # the lookups of env.sh find nothing before the first step
. "$HERE/env.sh"
SCR=$(mktemp -d); trap 'rm -rf "${SCR:?}"' EXIT; chmod 700 "$SCR"

request() { # request <file> <json template>: a request body with the password from the private file, never on a command line
  ( set -a; . "$RB_SECRETS"; set +a; RB_TEMPLATE=$2 python3 - "$SCR/$1" <<'PY'
import json, os, sys
body = json.loads(os.environ["RB_TEMPLATE"]); body["MasterUsername"] = os.environ["RB_MASTER"]; body["MasterUserPassword"] = os.environ["DBPASS"]
body["Tags"] = [{"Key": "Project", "Value": "runbook-service-tests"}, {"Key": "Owner", "Value": "shubham"}, {"Key": "DeleteAfter", "Value": "2026-11-24"}]
fd = os.open(sys.argv[1], os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "w") as f: json.dump(body, f)
PY
  ); }
instance() { # instance <identifier> <engine> <version> <class> <parameter group or -> <backup days> [database] [licence]
  request "$1.json" "{\"DBInstanceIdentifier\":\"$1\",\"Engine\":\"$2\",\"EngineVersion\":\"$3\",\"DBInstanceClass\":\"$4\",\"AllocatedStorage\":20,\"StorageType\":\"gp3\",\"MultiAZ\":false,\"PubliclyAccessible\":true,\"AutoMinorVersionUpgrade\":false,\"EnablePerformanceInsights\":false,\"MonitoringInterval\":0,\"DeletionProtection\":false,\"VpcSecurityGroupIds\":[\"$RB_SG\"],\"DBSubnetGroupName\":\"$RB_DBSUBNET\",\"BackupRetentionPeriod\":$6${5:+$([ "$5" = - ] || echo ",\"DBParameterGroupName\":\"$5\"")}${7:+,\"DBName\":\"$7\"}${8:+,\"LicenseModel\":\"$8\"}}"
  aws rds create-db-instance --cli-input-json "file://$SCR/$1.json" --query 'DBInstance.[DBInstanceIdentifier,Engine,EngineVersion,DBInstanceClass,DBInstanceStatus]' --output text; }
cluster() { # cluster <identifier> <engine> <version> <cluster parameter group> <database>; the writer is <identifier>-1
  request "$1.json" "{\"DBClusterIdentifier\":\"$1\",\"Engine\":\"$2\",\"EngineVersion\":\"$3\",\"DatabaseName\":\"$5\",\"DBClusterParameterGroupName\":\"$4\",\"BackupRetentionPeriod\":1,\"StorageEncrypted\":true,\"DeletionProtection\":false,\"VpcSecurityGroupIds\":[\"$RB_SG\"],\"DBSubnetGroupName\":\"$RB_DBSUBNET\"}"
  aws rds create-db-cluster --cli-input-json "file://$SCR/$1.json" --query 'DBCluster.[DBClusterIdentifier,Engine,EngineVersion,Status]' --output text
  # db.t4g.medium was refused on the day (InsufficientDBInstanceCapacity), db.t3.medium was accepted
  aws rds create-db-instance --db-instance-identifier "$1-1" --db-cluster-identifier "$1" --engine "$2" --db-instance-class db.t3.medium --publicly-accessible --no-auto-minor-version-upgrade --tags $RB_TAGS --query 'DBInstance.[DBInstanceIdentifier,DBInstanceClass,DBInstanceStatus]' --output text; }

case "${1:-}" in
network)
  MYIP=$(curl -s -m 8 https://checkip.amazonaws.com | tr -d '\n')
  SG=$(aws ec2 create-security-group --group-name $RB_SG_NAME --description "Runbook service runs: throwaway databases" --vpc-id $RB_VPC \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$RB_SG_NAME},{Key=Project,Value=runbook-service-tests},{Key=Owner,Value=shubham},{Key=DeleteAfter,Value=2026-11-24}]" --query GroupId --output text)
  for port in 5432 3306 1433; do aws ec2 authorize-security-group-ingress --group-id "$SG" --protocol tcp --port $port --cidr "$MYIP/32" --query Return --output text; done
  aws ec2 authorize-security-group-ingress --group-id "$SG" --protocol tcp --port 0-65535 --source-group "$SG" --query Return --output text   # DMS reaches the databases through this rule
  aws rds create-db-subnet-group --db-subnet-group-name $RB_DBSUBNET --db-subnet-group-description "Runbook service runs" --subnet-ids $RB_SUBNETS --tags $RB_TAGS --query 'DBSubnetGroup.DBSubnetGroupName' --output text
  aws rds create-db-parameter-group --db-parameter-group-name rbtest-pg17 --db-parameter-group-family postgres17 --description "Runbook runs: defaults first" --tags $RB_TAGS --query 'DBParameterGroup.DBParameterGroupName' --output text
  aws rds create-db-parameter-group --db-parameter-group-name rbtest-pg18-logical --db-parameter-group-family postgres18 --description "Runbook runs: logical replication on" --tags $RB_TAGS --query 'DBParameterGroup.DBParameterGroupName' --output text
  aws rds modify-db-parameter-group --db-parameter-group-name rbtest-pg18-logical --parameters "ParameterName=rds.logical_replication,ParameterValue=1,ApplyMethod=pending-reboot" --output text
  aws rds create-db-cluster-parameter-group --db-cluster-parameter-group-name rbtest-apg17 --db-parameter-group-family aurora-postgresql17 --description "Runbook runs: defaults first" --tags $RB_TAGS --query 'DBClusterParameterGroup.DBClusterParameterGroupName' --output text
  aws rds create-db-parameter-group --db-parameter-group-name rbtest-mysql84 --db-parameter-group-family mysql8.4 --description "Runbook runs: defaults" --tags $RB_TAGS --query 'DBParameterGroup.DBParameterGroupName' --output text
  aws rds create-db-cluster-parameter-group --db-cluster-parameter-group-name rbtest-amysql3 --db-parameter-group-family aurora-mysql8.0 --description "Runbook runs: defaults first" --tags $RB_TAGS --query 'DBClusterParameterGroup.DBClusterParameterGroupName' --output text ;;
postgres)
  instance $RB_PG postgres 17.11 db.t4g.micro rbtest-pg17 0 appdb               # no automated backups at first: see postgres-rds/logs/backups-off
  instance $RB_PGFULL postgres 18.6 db.t4g.micro rbtest-pg18-logical 0 appdb    # storage autoscaling stays off
  cluster $RB_APG aurora-postgresql 17.11 rbtest-apg17 appdb ;;
mysql)
  instance $RB_MYSQL mysql 8.4.13 db.t4g.micro rbtest-mysql84 1 inventory       # binary logging on RDS needs automated backups
  cluster $RB_AMYSQL aurora-mysql 8.0.mysql_aurora.3.14.0 rbtest-amysql3 inventory ;;
sqlserver)
  instance $RB_MSSQL sqlserver-se 16.00.4305.5.v1 db.t3.xlarge - 1 "" license-included ;;   # Standard is the smallest edition with CDC
dms)
  TRUST='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"dms.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
  for pair in "dms-vpc-role AmazonDMSVPCManagementRole" "dms-cloudwatch-logs-role AmazonDMSCloudWatchLogsRole"; do
    aws iam create-role --role-name "${pair%% *}" --assume-role-policy-document "$TRUST" --tags Key=Project,Value=runbook-service-tests --query 'Role.RoleName' --output text
    aws iam attach-role-policy --role-name "${pair%% *}" --policy-arn "arn:aws:iam::aws:policy/service-role/${pair##* }"
  done
  for i in 1 2 3 4 5 6; do   # the new role takes a few seconds to be usable
    aws dms create-replication-subnet-group --replication-subnet-group-identifier $RB_DMS_SUBNET --replication-subnet-group-description "Runbook service runs" --subnet-ids $RB_SUBNETS --tags $RB_TAGS --query 'ReplicationSubnetGroup.ReplicationSubnetGroupIdentifier' --output text 2>/dev/null && break; sleep 10
  done
  aws dms create-replication-instance --replication-instance-identifier $RB_DMS --replication-instance-class dms.t3.small --allocated-storage 20 --engine-version 3.6.1 --no-multi-az --publicly-accessible \
    --no-auto-minor-version-upgrade --vpc-security-group-ids "$RB_SG" --replication-subnet-group-identifier $RB_DMS_SUBNET --tags $RB_TAGS --query 'ReplicationInstance.[ReplicationInstanceIdentifier,ReplicationInstanceStatus]' --output text ;;
teardown)
  for t in $(aws dms describe-replication-tasks --query 'ReplicationTasks[?starts_with(ReplicationTaskIdentifier,`rbtest`)].ReplicationTaskArn' --output text); do aws dms delete-replication-task --replication-task-arn "$t" --query 'ReplicationTask.Status' --output text; done
  for e in $(aws dms describe-endpoints --query 'Endpoints[?starts_with(EndpointIdentifier,`rbtest`)].EndpointArn' --output text); do aws dms delete-endpoint --endpoint-arn "$e" --query 'Endpoint.Status' --output text; done
  for i in $RB_PG $RB_PGFULL $RB_MYSQL $RB_MSSQL; do aws rds delete-db-instance --db-instance-identifier $i --skip-final-snapshot --delete-automated-backups --query 'DBInstance.DBInstanceStatus' --output text 2>/dev/null; done
  for c in $RB_APG $RB_AMYSQL; do aws rds delete-db-instance --db-instance-identifier $c-1 --skip-final-snapshot --query 'DBInstance.DBInstanceStatus' --output text 2>/dev/null; aws rds delete-db-cluster --db-cluster-identifier $c --skip-final-snapshot --query 'DBCluster.Status' --output text 2>/dev/null; done
  [ -n "$RB_DMS_ARN" ] && aws dms delete-replication-instance --replication-instance-arn "$RB_DMS_ARN" --query 'ReplicationInstance.ReplicationInstanceStatus' --output text
  echo "waiting for the instances to be gone"
  for i in $(seq 1 90); do
    n=$(( $(aws rds describe-db-instances --query 'length(DBInstances[?starts_with(DBInstanceIdentifier,`rbtest`)])' --output text) + $(aws dms describe-replication-instances --query 'length(ReplicationInstances[?starts_with(ReplicationInstanceIdentifier,`rbtest`)])' --output text) ))
    [ "$n" = 0 ] && break; sleep 20
  done
  aws dms delete-replication-subnet-group --replication-subnet-group-identifier $RB_DMS_SUBNET
  for pair in "dms-vpc-role AmazonDMSVPCManagementRole" "dms-cloudwatch-logs-role AmazonDMSCloudWatchLogsRole"; do
    aws iam detach-role-policy --role-name "${pair%% *}" --policy-arn "arn:aws:iam::aws:policy/service-role/${pair##* }"; aws iam delete-role --role-name "${pair%% *}"
  done   # leave the two roles alone in an account that used DMS before these runs
  for g in rbtest-pg17 rbtest-pg18-logical rbtest-mysql84; do aws rds delete-db-parameter-group --db-parameter-group-name $g; done
  for g in rbtest-apg17 rbtest-amysql3; do aws rds delete-db-cluster-parameter-group --db-cluster-parameter-group-name $g; done
  aws rds delete-db-subnet-group --db-subnet-group-name $RB_DBSUBNET
  aws logs delete-log-group --log-group-name dms-tasks-$RB_DMS 2>/dev/null
  [ -n "$RB_SG" ] && aws ec2 delete-security-group --group-id "$RB_SG"
  echo "left under the test names or the test tag:"
  aws resourcegroupstaggingapi get-resources --tag-filters Key=Project,Values=runbook-service-tests --query 'ResourceTagMappingList[].ResourceARN' --output text ;;
*) sed -n '2,12p' "$0" ;;
esac
