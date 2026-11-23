# Shared by the MySQL runs. Source after env.sh and lib.sh.
MYC=rbt-awsm-mysql
mask() { sed -l -E "s/\.(cluster-|cluster-ro-)?[a-z0-9]{10,14}\.ap-south-1\.rds\.amazonaws\.com/.\1<id>.ap-south-1.rds.amazonaws.com/g; s/:[0-9]{12}:/:<account>:/g"; }
# run_sql <host> <logfile> <title>   SQL on stdin; statements are echoed, errors do not stop the batch
run_sql() { local h=$1 log=$2 title=$3; { echo "=== $(stamp) $title"; docker exec -i $MYC mysql -h "$h" -u "$RB_MASTER" --ssl-mode=REQUIRED --force -n -vv -t 2>&1; echo; } | mask | tee -a "$log"; }
# one value, no decoration
sql_val() { local h=$1; shift; docker exec -i $MYC mysql -h "$h" -u "$RB_MASTER" --ssl-mode=REQUIRED -N -B -e "$*" 2>&1; }
