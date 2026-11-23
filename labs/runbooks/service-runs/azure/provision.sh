#!/bin/bash
# The Azure resources of these runs, smallest sizes, and their removal.
# These are the commands of the runs of 23 November 2026, collected in one script afterwards; the script as a
# whole was not run again. logs/00-create.txt has the output of the day.
#
#   ./provision.sh group      one resource group for everything
#   ./provision.sh postgres   PostgreSQL flexible server 17, Burstable Standard_B1ms, 32 GB, open to this machine only
#   ./provision.sh sql        a logical SQL server and the database cdclab at the S0 service objective
#   ./provision.sh teardown   delete the resource group and everything in it
set -u
HERE=$(cd "$(dirname "$0")" && pwd); . "$HERE/env.sh"
SCR=$(mktemp -d); trap 'rm -rf "${SCR:?}"' EXIT; chmod 700 "$SCR"
TAGS="Project=runbook-service-tests Owner=shubham DeleteAfter=2026-11-24"
myip() { curl -s -m 8 https://checkip.amazonaws.com | tr -d '\n'; }

case "${1:-}" in
group)
  az group create --subscription "$AZ_SUB" -n "$AZ_RG" -l "$AZ_LOC" --tags $TAGS --query properties.provisioningState -o tsv ;;
postgres)
  # The admin password is read from a private file with the @file form, and -o none keeps the result,
  # which repeats the password, off the screen.
  ( set -a; . "$RB_SECRETS"; set +a; umask 077; printf '%s' "$DBPASS" > "$SCR/pw.txt" )
  az postgres flexible-server create --subscription "$AZ_SUB" -g "$AZ_RG" -n "$AZ_PG" -l "$AZ_PG_LOC" --tier Burstable --sku-name Standard_B1ms \
    --storage-size 32 --version 17 --admin-user "$AZ_ADMIN" --admin-password @"$SCR/pw.txt" --public-access "$(myip)" --backup-retention 7 \
    --high-availability Disabled --tags $TAGS --yes -o none
  az postgres flexible-server show --subscription "$AZ_SUB" -g "$AZ_RG" -n "$AZ_PG" --query '{state:state, version:version, minor:minorVersion, sku:sku.name, location:location}' -o json ;;
sql)
  ( set -a; . "$RB_SECRETS"; set +a; AZ_LOC=$AZ_LOC AZ_ADMIN=$AZ_ADMIN python3 - "$SCR/sql.json" <<'PY'
import json, os, sys
body = {"location": os.environ["AZ_LOC"], "tags": {"Project": "runbook-service-tests", "Owner": "shubham", "DeleteAfter": "2026-11-24"},
        "properties": {"administratorLogin": os.environ["AZ_ADMIN"], "administratorLoginPassword": os.environ["DBPASS"], "version": "12.0",
                       "minimalTlsVersion": "1.2", "publicNetworkAccess": "Enabled"}}
fd = os.open(sys.argv[1], os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "w") as f: json.dump(body, f)
PY
  )
  SUBID=$(az account show --subscription "$AZ_SUB" --query id -o tsv)
  az rest --subscription "$AZ_SUB" --method put --body @"$SCR/sql.json" -o none \
    --url "https://management.azure.com/subscriptions/$SUBID/resourceGroups/$AZ_RG/providers/Microsoft.Sql/servers/$AZ_SQL?api-version=2021-11-01"
  for i in $(seq 1 30); do [ "$(az sql server show --subscription "$AZ_SUB" -g "$AZ_RG" -n "$AZ_SQL" --query state -o tsv 2>/dev/null)" = Ready ] && break; sleep 10; done
  IP=$(myip); az sql server firewall-rule create --subscription "$AZ_SUB" -g "$AZ_RG" -s "$AZ_SQL" -n client --start-ip-address "$IP" --end-ip-address "$IP" --query name -o tsv
  az sql db create --subscription "$AZ_SUB" -g "$AZ_RG" -s "$AZ_SQL" -n cdclab --service-objective S0 --max-size 1GB --backup-storage-redundancy Local \
    --query '{name:name, status:status, objective:currentServiceObjectiveName, edition:edition}' -o json ;;
teardown)
  az group delete --subscription "$AZ_SUB" -n "$AZ_RG" --yes
  echo "resource group still there: $(az group exists --subscription "$AZ_SUB" -n "$AZ_RG")" ;;
*) sed -n '2,10p' "$0" ;;
esac
