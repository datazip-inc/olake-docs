#!/bin/bash
# Poll SHOW BINARY LOGS on the managed source once a minute and report when a given file is gone.
# Usage: mysql-poll.sh <rds|aurora> <file the stopped reader is on> <minutes> [flush every N minutes, 0 = never]
# Each round also inserts one row, so the source has ordinary write activity (NOINSERT=1 turns that off).
set -u
HERE=$(cd "$(dirname "$0")" && pwd); source "$HERE/env.sh"; source "$HERE/lib.sh"; source "$HERE/mysql-common.sh"
case $1 in rds) SRC=$(rb_endpoint "$RB_MYSQL") ;; aurora) SRC=$RB_AMYSQL_HOST ;; esac
FILE=$2; MIN=$3; FLUSH=${4:-0}
echo "=== $(stamp) watching for $FILE to leave SHOW BINARY LOGS on $1 (up to $MIN minutes, flush every $FLUSH minutes)"
for i in $(seq 1 "$MIN"); do
  [ "${NOINSERT:-0}" = 1 ] || sql_val "$SRC" "INSERT INTO inventory.customers (name,email) VALUES ('poll-$i','poll@example.com')" >/dev/null 2>&1
  if [ "$FLUSH" -gt 0 ] && [ $((i % FLUSH)) -eq 0 ]; then sql_val "$SRC" "FLUSH BINARY LOGS" >/dev/null 2>&1; fl=" (flushed)"; else fl=""; fi
  logs=$(sql_val "$SRC" "SHOW BINARY LOGS" | awk '{print $1}')
  n=$(printf '%s\n' "$logs" | grep -c mysql-bin); first=$(printf '%s\n' "$logs" | head -1); last=$(printf '%s\n' "$logs" | tail -1)
  if printf '%s\n' "$logs" | grep -qx "$FILE"; then here=present; else here=GONE; fi
  echo "$(stamp) minute $i: $n files, $first to $last, $FILE $here$fl"
  [ "$here" = GONE ] && [ "$n" -gt 0 ] && { echo "=== $(stamp) $FILE is no longer listed"; exit 0; }
  sleep 60
done
echo "=== $(stamp) $FILE was still listed after $MIN minutes"
