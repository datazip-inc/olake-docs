# Shared by the DMS PostgreSQL steps. Source after env.sh and lib.sh.
C=${RB_CLIENT:-rbt-awsp-pg}
SRC=$(rb_endpoint "$RB_PG"); TGT=$(rb_cluster_endpoint "$RB_APG")
RI_ARN=$(aws dms describe-replication-instances --filters Name=replication-instance-id,Values="$RB_DMS" --query 'ReplicationInstances[0].ReplicationInstanceArn' --output text)
ep_arn()   { aws dms describe-endpoints --filters Name=endpoint-id,Values="$1" --query 'Endpoints[0].EndpointArn' --output text; }
task_arn() { aws dms describe-replication-tasks --filters Name=replication-task-id,Values="$1" --query 'ReplicationTasks[0].ReplicationTaskArn' --output text 2>/dev/null; }
task_status() { aws dms describe-replication-tasks --filters Name=replication-task-id,Values="$1" --query 'ReplicationTasks[0].[Status,StopReason,LastFailureMessage]' --output text 2>/dev/null | tr '\t' ' '; }
wait_task() { # wait_task <id> <status-regex> [seconds]
  local i; for i in $(seq 1 $(( ${3:-600} / 10 ))); do task_status "$1" | grep -Eq "^($2)( |$)" && return 0; sleep 10; done; echo "  timed out waiting for $1 to be $2: $(task_status "$1")"; return 1; }
# psql against the source or the target; stderr merged inside the container so errors stay next to their statement
src()  { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -a -q 2>&1' sh "$SRC" "$RB_MASTER" "${1:-appdb}"; }
srcq() { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -q 2>&1' sh "$SRC" "$RB_MASTER" "${1:-appdb}"; }
one()  { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -q -At -c "$4" 2>&1' sh "$SRC" "$RB_MASTER" "${2:-appdb}" "$1"; }
tgt()  { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -a -q 2>&1' sh "$TGT" "$RB_MASTER" dmstarget; }
SLOTQ="SELECT slot_name, plugin, database, active, active_pid, restart_lsn, confirmed_flush_lsn,
       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal, wal_status, pg_size_pretty(safe_wal_size) AS safe_wal_size
FROM pg_replication_slots ORDER BY slot_name;"
slots() { echo "$SLOTQ" | srcq "${1:-appdb}"; }
senders() { echo "SELECT s.slot_name, r.pid, r.application_name, r.state, r.sent_lsn, r.flush_lsn, to_char(r.reply_time, 'HH24:MI:SS') AS reply_time FROM pg_replication_slots s LEFT JOIN pg_stat_replication r ON r.pid = s.active_pid ORDER BY s.slot_name;" | srcq "${1:-appdb}"; }
walsize() { one "SELECT count(*) || ' files, ' || pg_size_pretty(sum(size)) FROM pg_ls_waldir()"; }
line() { # one compact line per slot: name active restart confirmed retained | pg_wal
  one "SELECT string_agg(slot_name || ' active=' || active || ' restart_lsn=' || restart_lsn || ' confirmed_flush_lsn=' || coalesce(confirmed_flush_lsn::text, '-') || ' holds ' || pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)), '; ' ORDER BY slot_name) FROM pg_replication_slots" | sed "s/^/  $(stamp)  /; s/\$/   pg_wal: $(walsize)/"; }
metric() { # metric <name> <minutes back> <stat> [instance]
  TZ=UTC aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name "$1" --dimensions Name=DBInstanceIdentifier,Value="${4:-$RB_PG}" \
    --start-time "$(date -u -v-"$2"M '+%Y-%m-%dT%H:%M:%SZ')" --end-time "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" --period 60 --statistics "$3" \
    --query "sort_by(Datapoints,&Timestamp)[].[Timestamp,$3]" --output text | TZ=UTC awk '{printf "  %s  %.0f MB\n", $1, $2/1048576}'; }
checkpoints() { # checkpoints <n> <seconds between>: a checkpoint, then the slot line
  local i; for i in $(seq 1 "$1"); do one "CHECKPOINT" >/dev/null; echo "after checkpoint $i:"; line; [ "$i" -lt "$1" ] && sleep "$2"; done; }
tasklog() { # tasklog <task-id> <grep-regex> [lines]
  local t; t=$(task_arn "$1" | awk -F: '{print $NF}')
  aws logs filter-log-events --log-group-name "dms-tasks-$RB_DMS" --log-stream-names "dms-task-$t" --query 'events[].message' --output text 2>/dev/null | tr '\t' '\n' | grep -E "$2" | tail -"${3:-20}" | cut -c1-400; }
