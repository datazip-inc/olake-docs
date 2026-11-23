#!/bin/bash
# Steps on the DMS task of the MySQL run. Usage: task.sh <start-type|watch|logs|compare> [args]
#   start <resume-processing|reload-target|start-replication>   start the task that way
#   watch <rounds> [seconds]     task status, stop reason, failure message, table state and target row count
#   logs <epoch ms>              error and warning lines of the task log since that time
#   compare                      row counts and a checksum of id, name, email on source and target
set -u
HERE=$(cd "$(dirname "$0")/.." && pwd); source "$HERE/env.sh"; source "$HERE/lib.sh"; source "$HERE/mysql-common.sh"
TASK=${TASK:-rbtest-m-task}; STREAM=${STREAM:-dms-task-4E6QVESXQFDN7IS6EFXMDD3XCY}
ARN=$(aws dms describe-replication-tasks --filters Name=replication-task-id,Values=$TASK --query 'ReplicationTasks[0].ReplicationTaskArn' --output text)
case $1 in
  start) echo "=== $(stamp) start-replication-task --start-replication-task-type $2"
         aws dms start-replication-task --replication-task-arn "$ARN" --start-replication-task-type "$2" --query 'ReplicationTask.Status' --output text 2>&1 ;;
  watch) for i in $(seq 1 "$2"); do
           s=$(aws dms describe-replication-tasks --filters Name=replication-task-id,Values=$TASK --query 'ReplicationTasks[0].[Status,StopReason,LastFailureMessage,ReplicationTaskStats.FullLoadProgressPercent,ReplicationTaskStats.TablesErrored]' --output text | tr '\t' '|')
           t=$(aws dms describe-table-statistics --replication-task-arn "$ARN" --query 'TableStatistics[].[TableName,TableState,FullLoadRows,Inserts,Updates,Deletes]' --output text | tr '\t' ',' | tr '\n' ' ')
           echo "$(stamp) task: $s | tables: $t| target rows: $(sql_val "$RB_AMYSQL_HOST" 'SELECT COUNT(*) FROM dms_from_rds.customers' 2>&1 | tail -1)"
           sleep "${3:-15}"
         done ;;
  logs)  "$HERE/dms-logs.sh" "$STREAM" "$2" | grep -E "\]E:|\]W:|1236|binlog|Binlog|position|stopped|Stop|failed|Task|retr" | mask ;;
  compare) for side in source target; do
           case $side in source) h=$RB_MYSQL_HOST; t=inventory.customers ;; target) h=$RB_AMYSQL_HOST; t=dms_from_rds.customers ;; esac
           echo "$side: $(sql_val "$h" "SELECT COUNT(*), MIN(id), MAX(id), SUM(CRC32(CONCAT_WS('#', id, name, email))) FROM $t" | tr '\t' ' ')   (rows, min id, max id, checksum)"
         done ;;
esac
