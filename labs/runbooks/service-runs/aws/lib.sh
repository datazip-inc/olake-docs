# Helpers for the AWS runs. Source env.sh first. Clients run in local Docker containers; passwords come
# from the private secrets file through an env file and never appear on a command line or in a log.
rb_client_env() {            # writes the client env file next to the secrets file
  local d; d=$(dirname "$RB_SECRETS"); ( set -a; . "$RB_SECRETS"; set +a; umask 077
    printf 'PGPASSWORD=%s\nPGUSER=%s\nPGSSLMODE=require\nPGCONNECT_TIMEOUT=10\nMYSQL_PWD=%s\nSQLCMDPASSWORD=%s\n' "$DBPASS" "$RB_MASTER" "$DBPASS" "$DBPASS" > "$d/client.env" )
}
rb_clients_up() {            # rb_clients_up <prefix>: long-lived client containers <prefix>-pg, <prefix>-mysql
  local p=$1 d; d=$(dirname "$RB_SECRETS"); [ -f "$d/client.env" ] || rb_client_env
  docker inspect "$p-pg" >/dev/null 2>&1 || docker run -d --name "$p-pg" --memory 256m --env-file "$d/client.env" --entrypoint sleep postgres:18.7 infinity >/dev/null
  docker inspect "$p-mysql" >/dev/null 2>&1 || docker run -d --name "$p-mysql" --memory 256m --env-file "$d/client.env" --entrypoint sleep mysql:8.4.13 infinity >/dev/null
}
rb_endpoint() { aws rds describe-db-instances --db-instance-identifier "$1" --query 'DBInstances[0].Endpoint.Address' --output text; }
rb_cluster_endpoint() { aws rds describe-db-clusters --db-cluster-identifier "$1" --query 'DBClusters[0].Endpoint' --output text; }
rb_status() { aws rds describe-db-instances --db-instance-identifier "$1" --query 'DBInstances[0].DBInstanceStatus' --output text; }
# pgq <container> <host> <db> [psql args]   SQL on stdin or with -c
pgq() { local c=$1 h=$2 d=$3; shift 3; docker exec -i "$c" psql -h "$h" -d "$d" -X -q "$@"; }
# myq <container> <host> [mysql args]
myq() { local c=$1 h=$2; shift 2; docker exec -i "$c" mysql -h "$h" -u "$RB_MASTER" --ssl-mode=REQUIRED "$@"; }
# stamp: a UTC timestamp line for logs
stamp() { date -u '+%F %T UTC'; }
