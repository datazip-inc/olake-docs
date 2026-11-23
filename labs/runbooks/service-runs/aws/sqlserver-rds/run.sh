#!/bin/bash
# Runs one SQL file against the RDS for SQL Server test instance and prints each batch before its output.
# Usage: run.sh <file under sql/, or a path> [starting database] [login]
# Every batch (the text between two GO lines) runs in its own sqlcmd session, as in the local lab,
# because sqlcmd 18 answers "Invalid cursor state" to what follows a failed procedure call.
# sqlcmd runs in a local container and takes the password from its environment (SQLCMDPASSWORD).
# A script that has to set a password uses $(OLAKEPW): sqlcmd does not substitute $(SQLCMDPASSWORD).
set -u
HERE=$(cd "$(dirname "$0")" && pwd); source "$HERE/../env.sh"; source "$HERE/../lib.sh"
HOST=${RB_MSSQL_HOST:-$(rb_endpoint "$RB_MSSQL")}
C=rbt-awsm-sqlcmd; SQLCMD=/opt/mssql-tools18/bin/sqlcmd
file=$1; db=${2:-master}; login=${3:-$RB_MASTER}
mask() { sed -l -E "s/\.(cluster-|cluster-ro-)?[a-z0-9]{10,14}\.ap-south-1\.rds\.amazonaws\.com/.\1<id>.ap-south-1.rds.amazonaws.com/g; s/:[0-9]{12}:/:<account>:/g"; }
case "$file" in */*) path="$file" ;; *) path="$HERE/sql/$file" ;; esac
batch=""
echo "=== $(stamp) $(basename "$file") (database $db, login $login)"
while IFS= read -r line || [[ -n "$line" ]]; do
  if [[ "$line" != "GO" ]]; then batch+="$line"$'\n'; continue; fi
  code="$(printf '%s' "$batch" | grep -v -E '^[[:space:]]*(--|$)' || true)"
  if [[ "$code" =~ ^USE[[:space:]]+([A-Za-z0-9_]+)\;$ ]]; then
    db="${BASH_REMATCH[1]}"
  elif [[ -n "$code" ]]; then
    printf '%s' "$batch"
    docker exec -i "$C" sh -c 'OLAKEPW="$SQLCMDPASSWORD" exec "$0" "$@"' "$SQLCMD" -S "$HOST,1433" -U "$login" -C -I -d "$db" -W -s '|' -w 600 -Q "$batch" < /dev/null 2>&1 | tr -d '\r' | mask || true
    echo
  fi
  batch=""
done < "$path"
