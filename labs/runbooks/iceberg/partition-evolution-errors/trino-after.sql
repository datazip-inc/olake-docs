-- Run after ./run.sh clean-specs: the tables Spark changed with DROP COLUMN, read again.
DEBUG SELECT * FROM iceberg.db.dc_v2 ORDER BY id
DEBUG SELECT * FROM iceberg.db.dc_v1 ORDER BY id
