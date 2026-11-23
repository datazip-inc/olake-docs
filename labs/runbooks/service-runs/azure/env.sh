# Names of the throwaway Azure resources of these runs. No secrets in this file.
# Set before sourcing it:
#   AZ_SUB       the subscription to use
#   AZ_PG        a PostgreSQL server name that is unique across Azure (the runs used rbtest-pg-68vqkw-south)
#   AZ_SQL       a SQL server name that is unique across Azure (the runs used rbtest-sql-68vqkw)
#   RB_SECRETS   a private file outside the repository with two lines: DBPASS=... and CDCPASS=...
export AZ_SUB="${AZ_SUB:?set AZ_SUB to the Azure subscription to use}"
export AZ_PG="${AZ_PG:?set AZ_PG to a server name that is unique across Azure}"
export AZ_SQL="${AZ_SQL:?set AZ_SQL to a server name that is unique across Azure}"
export AZ_RG="${AZ_RG:-rbtest-rg}"          # everything is in this one resource group; deleting the group deletes it all
export AZ_LOC="${AZ_LOC:-centralindia}"
export AZ_PG_LOC="${AZ_PG_LOC:-southindia}" # the smallest PostgreSQL size was refused in centralindia on the day of the runs
export AZ_ADMIN=rbadmin
export RB_SECRETS="${RB_SECRETS:-$HOME/.config/runbook-service-tests/secrets.env}"
