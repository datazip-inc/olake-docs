#!/bin/bash
# An external reader of the binary log: a local MySQL 8.4.13 container set up as a replica of the
# managed instance over TLS. Usage: mysql-reader.sh <rds|aurora> <step>
#   seed      create inventory.customers on the source with 4 rows
#   up        start the local replica container and load the same 4 rows
#   attach    point the replica at the source's current position and start it
#   status    SHOW REPLICA STATUS (the fields that matter) and row counts on both sides
#   stop      STOP REPLICA
#   start     START REPLICA, wait, status
#   down      remove the replica container
set -u
HERE=$(cd "$(dirname "$0")" && pwd); source "$HERE/env.sh"; source "$HERE/lib.sh"; source "$HERE/mysql-common.sh"
which=$1; step=$2
case $which in
  rds)    SRC=$(rb_endpoint "$RB_MYSQL");  REP=rbt-awsm-replica-rds; SID=7001 ;;
  aurora) SRC=$RB_AMYSQL_HOST;             REP=rbt-awsm-replica-aur; SID=7002 ;;
esac
SEC=$(dirname "$RB_SECRETS")
# the local root password comes from the container's own environment, never from a command line
rmysql() { docker exec -i "$REP" sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -uroot "$@"' sh "$@"; }
rep_sql() { rmysql --force -n -vv -t 2>&1; }
src_sql() { docker exec -i $MYC mysql -h "$SRC" -u "$RB_MASTER" --ssl-mode=REQUIRED --force -n -vv -t 2>&1; }
status() {
  echo "--- $(stamp) replica status"
  rmysql -e 'SHOW REPLICA STATUS\G' 2>&1 | grep -E "Replica_IO_State|Source_Log_File|Read_Source_Log_Pos|Relay_Source_Log_File|Exec_Source_Log_Pos|Replica_IO_Running|Replica_SQL_Running:|Last_IO_Errno|Last_IO_Error:|Last_SQL_Errno|Last_SQL_Error:|Seconds_Behind_Source|Source_SSL_Allowed" | mask
  echo "--- rows in inventory.customers: source $(sql_val "$SRC" 'SELECT COUNT(*) FROM inventory.customers'), replica $(rmysql -N -B -e 'SELECT COUNT(*) FROM inventory.customers' 2>&1)"
}
case $step in
  seed)
    echo "=== $(stamp) seed the source"
    src_sql <<'SQL'
CREATE DATABASE IF NOT EXISTS inventory;
CREATE TABLE IF NOT EXISTS inventory.customers (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(64) NOT NULL, email VARCHAR(128) NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
INSERT INTO inventory.customers (id, name, email) VALUES (1,'Asha','asha@example.com'),(2,'Bilal','bilal@example.com'),(3,'Chen','chen@example.com'),(4,'Dara','dara@example.com') ON DUPLICATE KEY UPDATE name = VALUES(name);
SELECT COUNT(*) FROM inventory.customers;
SQL
    ;;
  up)
    [ -f "$SEC/replica.env" ] || ( set -a; . "$RB_SECRETS"; set +a; umask 077; printf 'MYSQL_ROOT_PASSWORD=%s\nSRCPASS=%s\n' "$DBPASS" "$DBPASS" > "$SEC/replica.env" )
    echo "=== $(stamp) start the local replica container ($REP, mysql:8.4.13, server-id $SID)"
    docker run -d --name "$REP" --memory 768m --env-file "$SEC/replica.env" mysql:8.4.13 --server-id=$SID --skip-log-bin --relay-log=relay-bin >/dev/null
    for i in $(seq 1 60); do rmysql -N -e 'SELECT 1' >/dev/null 2>&1 && docker logs "$REP" 2>&1 | grep -q "port: 3306" && break; sleep 2; done
    rep_sql <<'SQL'
SELECT @@version, @@server_id, @@gtid_mode;
CREATE DATABASE inventory;
CREATE TABLE inventory.customers (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(64) NOT NULL, email VARCHAR(128) NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
INSERT INTO inventory.customers (id, name, email) VALUES (1,'Asha','asha@example.com'),(2,'Bilal','bilal@example.com'),(3,'Chen','chen@example.com'),(4,'Dara','dara@example.com');
SQL
    ;;
  attach)
    read -r F P <<<"$(sql_val "$SRC" 'SHOW BINARY LOG STATUS' 2>/dev/null | awk 'NR==1{print $1, $2}')"
    case "$F" in mysql-bin*) ;; *) read -r F P <<<"$(sql_val "$SRC" 'SHOW MASTER STATUS' | awk 'NR==1{print $1, $2}')" ;; esac
    echo "=== $(stamp) attach the replica at the source's current position: $F $P"
    docker exec -i -e SRC="$SRC" -e RBU="$RB_MASTER" -e F="$F" -e P="$P" "$REP" sh -c 'printf "CHANGE REPLICATION SOURCE TO SOURCE_HOST=\047%s\047, SOURCE_PORT=3306, SOURCE_USER=\047%s\047, SOURCE_PASSWORD=\047%s\047, SOURCE_LOG_FILE=\047%s\047, SOURCE_LOG_POS=%s, SOURCE_SSL=1, GET_SOURCE_PUBLIC_KEY=1; START REPLICA;\n" "$SRC" "$RBU" "$SRCPASS" "$F" "$P" | MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot 2>&1' | mask
    sleep 8; status
    ;;
  status) status ;;
  stop)  echo "=== $(stamp) STOP REPLICA"; rmysql -e 'STOP REPLICA' 2>&1; status ;;
  start) echo "=== $(stamp) START REPLICA"; rmysql -e 'START REPLICA' 2>&1; sleep 12; status ;;
  down)  docker rm -f "$REP" >/dev/null 2>&1 && echo "removed $REP" ;;
esac
