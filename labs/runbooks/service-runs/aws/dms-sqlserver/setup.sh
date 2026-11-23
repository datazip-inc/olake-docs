#!/bin/bash
# Creates the DMS source endpoint and the task for the SQL Server run. The target is the endpoint
# of the MySQL run (the Aurora MySQL test cluster), in a schema of its own.
set -u
HERE=$(cd "$(dirname "$0")/.." && pwd); source "$HERE/env.sh"; source "$HERE/lib.sh"
SEC=$(dirname "$RB_SECRETS"); set -a; . "$RB_SECRETS"; set +a
export SRC_HOST=${RB_MSSQL_HOST:-$(rb_endpoint "$RB_MSSQL")}
python3 - <<'PY'
import json, os
sec = os.path.dirname(os.environ["RB_SECRETS"])
tags = [{"Key": "Project", "Value": "runbook-service-tests"}, {"Key": "Owner", "Value": "shubham"}, {"Key": "DeleteAfter", "Value": "2026-11-24"}]
body = dict(EndpointIdentifier="rbtest-q-src", EndpointType="source", EngineName="sqlserver", ServerName=os.environ["SRC_HOST"], Port=1433,
            DatabaseName="dmslab", Username=os.environ["RB_MASTER"], Password=os.environ["DBPASS"], SslMode="none", Tags=tags)
fd = os.open(os.path.join(sec, "q-src.json"), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "w") as f: json.dump(body, f)
PY
unset DBPASS
aws dms create-endpoint --cli-input-json "file://$SEC/q-src.json" --query 'Endpoint.[EndpointIdentifier,EndpointType,EngineName,Status]' --output text; rm -f "$SEC/q-src.json"
