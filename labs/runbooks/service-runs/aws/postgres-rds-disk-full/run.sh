#!/bin/bash
# Amazon RDS for PostgreSQL: a logical slot that nobody reads fills the 20 GB volume of the instance.
# Backs "Fix 5: the disk is already full" of docs/runbooks/postgres/replication-slot-filling-disk.mdx.
#
#   ./run.sh setup      settings, the lab's table and write_wal procedure, a pgoutput slot with no consumer
#   ./run.sh fill       1 GB of writes per round until something gives
#   ./run.sh observe    what the instance, its events, its metrics and its log say afterwards
#   ./run.sh recover    grow the volume, connect, drop the slot, checkpoint
set -u
HERE=$(cd "$(dirname "$0")" && pwd); . "$HERE/../env.sh"; . "$HERE/../lib.sh"
C=${RB_CLIENT:-rbt-awsp-pg}; LOG="$HERE/logs"; mkdir -p "$LOG"; ID=$RB_PGFULL
H=$(rb_endpoint "$ID")
sql()  { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -a -q 2>&1' sh "$H" "$RB_MASTER" appdb; }
one()  { docker exec -i "$C" env -u PGPASSWORD -u PGUSER sh -c 'exec psql -h "$1" -U "$2" -d "$3" -X -q -At -c "$4" 2>&1' sh "$H" "$RB_MASTER" appdb "$1"; }
cap()  { tee "$LOG/$1"; }
head_() { echo "# $1"; echo "# $(stamp), instance $ID, $(aws rds describe-db-instances --db-instance-identifier "$ID" --query 'DBInstances[0].[Engine,EngineVersion,DBInstanceClass,AllocatedStorage,StorageType]' --output text | tr '\t' ' ') (GiB, type), storage autoscaling $(aws rds describe-db-instances --db-instance-identifier "$ID" --query 'DBInstances[0].MaxAllocatedStorage' --output text | sed 's/None/off/')"; echo; }
status() { aws rds describe-db-instances --db-instance-identifier "$ID" --query 'DBInstances[0].DBInstanceStatus' --output text; }
metric() { # metric <name> <minutes back> <stat>
  TZ=UTC aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name "$1" --dimensions Name=DBInstanceIdentifier,Value="$ID" \
    --start-time "$(date -u -v-"$2"M '+%Y-%m-%dT%H:%M:%SZ')" --end-time "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" --period 60 --statistics "$3" \
    --query "sort_by(Datapoints,&Timestamp)[].[Timestamp,$3]" --output text | awk '{printf "  %s  %.0f MB\n", $1, $2/1048576}'; }
state() { echo "  $(stamp)  instance: $(status)   pg_wal: $(one "SELECT pg_size_pretty(sum(size)) FROM pg_ls_waldir()" | tail -1 | cut -c1-90)   slot holds: $(one "SELECT pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) || ', ' || wal_status FROM pg_replication_slots WHERE slot_name = 'cdc_slot'" | tail -1 | cut -c1-90)"; }

case "${1:-}" in
setup)
  { head_ "A logical slot with no consumer on a 20 GB instance"
    sql <<'SQL'
SELECT version();
SELECT name, setting, unit FROM pg_settings WHERE name IN ('rds.logical_replication','wal_level','max_wal_size','max_slot_wal_keep_size','idle_replication_slot_timeout','max_replication_slots','wal_sender_timeout') ORDER BY name;
CREATE TABLE orders (id bigserial PRIMARY KEY, customer_id int NOT NULL, status text NOT NULL, note text, updated_at timestamptz NOT NULL DEFAULT now()) WITH (autovacuum_enabled = off);
CREATE PROCEDURE write_wal(target_mb int) LANGUAGE plpgsql AS $$
DECLARE
  start_lsn pg_lsn := pg_current_wal_lsn();
BEGIN
  WHILE pg_wal_lsn_diff(pg_current_wal_lsn(), start_lsn) < target_mb::numeric * 1024 * 1024 LOOP
    INSERT INTO orders (customer_id, status, note)
    SELECT g % 1000, 'new', repeat(md5(g::text), 8) FROM generate_series(1, 5000) g;
    COMMIT;
    IF (SELECT count(*) FROM orders) >= 50000 THEN
      TRUNCATE orders;
      COMMIT;
    END IF;
  END LOOP;
END $$;
CREATE PUBLICATION cdc_pub FOR TABLE orders;
SELECT * FROM pg_create_logical_replication_slot('cdc_slot', 'pgoutput');
SELECT count(*) AS wal_files, pg_size_pretty(sum(size)) AS pg_wal_size FROM pg_ls_waldir();
SELECT pg_size_pretty(pg_database_size('appdb')) AS appdb_size;
SQL
    echo; echo "# backups: $(aws rds describe-db-instances --db-instance-identifier "$ID" --query 'DBInstances[0].BackupRetentionPeriod' --output text) days of automated backups"
    echo "# FreeStorageSpace (CloudWatch, minimum per minute)"; metric FreeStorageSpace 15 Minimum | tail -3
  } | cap 01-setup.txt ;;

fill)
  { head_ "1 GB of writes per round, with nobody reading the slot"
    state
    failed() { case "$1" in *ERROR*|*FATAL*|*PANIC*|*"server closed"*|*"could not"*|*"connection to server"*) return 0 ;; *) return 1 ;; esac; }
    for round in $(seq 1 40); do
      t0=$(date +%s); out=$(one "CALL write_wal(1024);" | head -4 | tr '\n' ' ')
      if failed "$out"; then echo "round $round: CALL write_wal(1024); -> $out  [$(( $(date +%s) - t0 )) s]"; state; break; fi
      echo "round $round: CALL write_wal(1024); -> CALL  [$(( $(date +%s) - t0 )) s]"; state
    done
    if [ "$(one 'SELECT 1' | tail -1)" = "1" ]; then
      echo; echo "# The statement failed and the server still answers. Keep writing WAL with records that need no data page."
      for round in $(seq 1 3000); do
        out=$(one "SELECT pg_logical_emit_message(false, 'lab', repeat('x', 16777216));" | head -3 | tr '\n' ' ')
        if failed "$out"; then echo "16 MB record $round: SELECT pg_logical_emit_message(false, 'lab', repeat('x', 16777216)); -> $out"; break; fi
        [ $(( round % 16 )) -eq 0 ] && state
      done
    fi
    echo; echo "# straight after"
    for i in 1 2 3 4 5 6 7 8 9; do echo "  $(stamp)  instance: $(status)   SELECT 1 -> $(one 'SELECT 1' | tr '\n' ' ' | cut -c1-200)"; sleep 20; done
  } 2>&1 | cap "${2:-02-fill.txt}" ;;

observe)
  { head_ "After the volume filled up"
    echo "# instance status and a connection attempt, every 30 s"
    for i in $(seq 1 "${2:-10}"); do echo "  $(stamp)  instance: $(status)   SELECT 1 -> $(one 'SELECT 1' | tr '\n' ' ' | cut -c1-220)"; sleep 30; done
    echo; echo "# RDS events"; aws rds describe-events --source-identifier "$ID" --source-type db-instance --duration 180 --query 'Events[].[Date,Message]' --output text
    echo; echo "# FreeStorageSpace (minimum per minute)"; metric FreeStorageSpace 60 Minimum
    echo; echo "# TransactionLogsDiskUsage (maximum per minute)"; metric TransactionLogsDiskUsage 60 Maximum
    echo; echo "# OldestReplicationSlotLag (maximum per minute)"; metric OldestReplicationSlotLag 60 Maximum
    echo; echo "# PostgreSQL log, lines about the disk"
    for f in $(aws rds describe-db-log-files --db-instance-identifier "$ID" --query 'DescribeDBLogFiles[].LogFileName' --output text); do
      aws rds download-db-log-file-portion --db-instance-identifier "$ID" --log-file-name "$f" --starting-token 0 --output text 2>/dev/null \
        | grep -E 'PANIC|No space left|could not (write|extend|create)|Check free disk|terminated by signal|reinitializing|not properly shut down|redo (starts|done)|startup process|shutting down|is shut down|ready to accept|invalidating' | sed "s|^|  [$f] |" | cut -c1-330
    done | tail -60
  } 2>&1 | cap "${3:-03-observe.txt}" ;;

recover)
  NEW=${2:-25}
  { head_ "Grow the volume, then drop the slot"
    echo "\$ aws rds modify-db-instance --db-instance-identifier $ID --allocated-storage $NEW --apply-immediately"; t0=$(date +%s)
    aws rds modify-db-instance --db-instance-identifier "$ID" --allocated-storage "$NEW" --apply-immediately --query 'DBInstance.[DBInstanceStatus,AllocatedStorage,PendingModifiedValues.AllocatedStorage]' --output text 2>&1 | tail -2
    prev=""; for i in $(seq 1 240); do
      st=$(status); ok=$(one 'SELECT 1' | tail -1)
      if [ "$st|$ok" != "$prev" ]; then echo "  $(stamp)  [+$(( $(date +%s) - t0 )) s] instance: $st   SELECT 1 -> $(echo "$ok" | cut -c1-160)"; prev="$st|$ok"; fi
      [ "$ok" = "1" ] && [ "$st" != "storage-full" ] && [ $i -gt 3 ] && break; sleep 15
    done
    echo; echo "# the slot is still there"
    sql <<'SQL'
SELECT slot_name, active, restart_lsn, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal, wal_status, invalidation_reason FROM pg_replication_slots;
SELECT count(*) AS wal_files, pg_size_pretty(sum(size)) AS pg_wal_size FROM pg_ls_waldir();
SELECT pg_drop_replication_slot('cdc_slot');
CHECKPOINT;
SELECT count(*) AS wal_files, pg_size_pretty(sum(size)) AS pg_wal_size FROM pg_ls_waldir();
INSERT INTO orders (customer_id, status) VALUES (1, 'after recovery') RETURNING id, status;
SQL
    sleep 150
    echo; echo "# instance: $(status), allocated $(aws rds describe-db-instances --db-instance-identifier "$ID" --query 'DBInstances[0].AllocatedStorage' --output text) GiB"
    echo "# FreeStorageSpace (minimum per minute)"; metric FreeStorageSpace 12 Minimum
    echo; echo "# RDS events"; aws rds describe-events --source-identifier "$ID" --source-type db-instance --duration 240 --query 'Events[].[Date,Message]' --output text
  } 2>&1 | cap 04-recover.txt ;;
*) sed -n '2,8p' "$0" ;;
esac
