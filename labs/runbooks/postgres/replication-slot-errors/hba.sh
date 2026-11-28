#!/usr/bin/env bash
# Lets the standby of the standby steps connect for physical replication. The image allows only
# ordinary connections from other hosts, and a replication connection needs its own line. It uses
# the same method as the image's own line: md5 on PostgreSQL 13, scram-sha-256 from 14.
method="$(awk '$1 == "host" && $2 == "all" && $3 == "all" && $4 == "all" { m = $5 } END { print m }' "$PGDATA/pg_hba.conf")"
echo "host replication all all ${method:-scram-sha-256}" >> "$PGDATA/pg_hba.conf"
