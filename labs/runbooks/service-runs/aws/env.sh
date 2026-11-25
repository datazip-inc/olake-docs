# Names of the throwaway AWS resources of these runs, and where to find them. No secrets in this file.
# Set three things before sourcing it:
#   RB_VPC       a VPC whose subnets can reach the internet (the runs used the default VPC of a test account)
#   RB_SUBNETS   three subnet ids of that VPC, separated by spaces
#   RB_SECRETS   a private file outside the repository with two lines: DBPASS=... and CDCPASS=...
export AWS_PAGER="" AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-ap-south-1}"
export RB_VPC="${RB_VPC:?set RB_VPC to the VPC to use}"
export RB_SUBNETS="${RB_SUBNETS:?set RB_SUBNETS to three subnet ids of that VPC}"
export RB_SECRETS="${RB_SECRETS:-$HOME/.config/runbook-service-tests/secrets.env}"
export RB_TAGS="Key=Project,Value=runbook-service-tests Key=Owner,Value=shubham Key=DeleteAfter,Value=2026-11-24"
export RB_SG_NAME=rbtest-sg
export RB_DBSUBNET=rbtest-subnets
export RB_MASTER=rbadmin
# instances
export RB_PG=rbtest-pg            # RDS PostgreSQL 17.11, db.t4g.micro
export RB_PGFULL=rbtest-pgfull    # RDS PostgreSQL 18.6, db.t4g.micro, for the full-disk run
export RB_APG=rbtest-apg          # Aurora PostgreSQL 17.11 cluster, writer rbtest-apg-1, db.t3.medium
export RB_MYSQL=rbtest-mysql      # RDS MySQL 8.4.13, db.t4g.micro
export RB_AMYSQL=rbtest-amysql    # Aurora MySQL 3.14.0 cluster, writer rbtest-amysql-1, db.t3.medium
export RB_MSSQL=rbtest-mssql      # RDS SQL Server Standard 2022 (16.00.4305.5.v1), db.t3.xlarge
export RB_DMS=rbtest-dms          # DMS replication instance, dms.t3.small, engine 3.6.1
export RB_DMS_SUBNET=rbtest-dms-subnets
# Looked up from the names above, so that nothing of the account is written here. Empty until provision.sh has run.
rb_lookup() { "$@" 2>/dev/null | grep -v '^None$' || true; }
export RB_SG="${RB_SG:-$(rb_lookup aws ec2 describe-security-groups --filters Name=group-name,Values=$RB_SG_NAME Name=vpc-id,Values=$RB_VPC --query 'SecurityGroups[0].GroupId' --output text)}"
export RB_MYSQL_HOST="${RB_MYSQL_HOST:-$(rb_lookup aws rds describe-db-instances --db-instance-identifier $RB_MYSQL --query 'DBInstances[0].Endpoint.Address' --output text)}"
export RB_AMYSQL_HOST="${RB_AMYSQL_HOST:-$(rb_lookup aws rds describe-db-clusters --db-cluster-identifier $RB_AMYSQL --query 'DBClusters[0].Endpoint' --output text)}"
export RB_MSSQL_HOST="${RB_MSSQL_HOST:-$(rb_lookup aws rds describe-db-instances --db-instance-identifier $RB_MSSQL --query 'DBInstances[0].Endpoint.Address' --output text)}"
export RB_DMS_ARN="${RB_DMS_ARN:-$(rb_lookup aws dms describe-replication-instances --filters Name=replication-instance-id,Values=$RB_DMS --query 'ReplicationInstances[0].ReplicationInstanceArn' --output text)}"
