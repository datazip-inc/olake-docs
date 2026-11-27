-- One statement per line. run.sh runs each with the Trino CLI and records what it returned. A line that
-- starts with DEBUG runs with --debug, and run.sh keeps the exception chain of a failure.
-- Partition declarations in the form Spark writes them, and the checks Iceberg runs on the ones Trino parses.
DROP TABLE IF EXISTS iceberg.db.trino_p
DROP TABLE IF EXISTS iceberg.db.t_nested
DROP TABLE IF EXISTS iceberg.db.t_nested_q
DROP TABLE IF EXISTS iceberg.db.t_bucket_ok
CREATE TABLE iceberg.db.t_days (id bigint, ts timestamp(6), category varchar, amount double) WITH (partitioning = ARRAY['days(ts)'])
CREATE TABLE iceberg.db.t_bucket (id bigint, ts timestamp(6), category varchar, amount double) WITH (partitioning = ARRAY['bucket(16, id)'])
CREATE TABLE iceberg.db.t_double (id bigint, ts timestamp(6), category varchar, amount double) WITH (partitioning = ARRAY['bucket(amount, 16)'])
CREATE TABLE iceberg.db.t_bucket_ok (id bigint, ts timestamp(6), category varchar, amount double) WITH (partitioning = ARRAY['bucket(id, 16)'])
SHOW CREATE TABLE iceberg.db.t_bucket_ok
CREATE TABLE iceberg.db.t_redundant (id bigint, ts timestamp(6), category varchar, amount double) WITH (partitioning = ARRAY['day(ts)', 'hour(ts)'])
CREATE TABLE iceberg.db.t_nested (id bigint, point ROW(x double, y double)) WITH (partitioning = ARRAY['point.x'])
CREATE TABLE iceberg.db.t_nested_q (id bigint, point ROW(x double, y double)) WITH (partitioning = ARRAY['"point.x"'])
-- Partition evolution in Trino: SET PROPERTIES partitioning.
CREATE TABLE iceberg.db.trino_p (id bigint, ts timestamp(6), category varchar, amount double) WITH (partitioning = ARRAY['day(ts)'])
INSERT INTO iceberg.db.trino_p VALUES (1, TIMESTAMP '2026-11-01 10:00:00', 'a', 1.0), (2, TIMESTAMP '2026-11-02 10:00:00', 'b', 2.0)
ALTER TABLE iceberg.db.trino_p SET PROPERTIES partitioning = ARRAY['day(ts)', 'hour(ts)']
ALTER TABLE iceberg.db.trino_p SET PROPERTIES partitioning = ARRAY['day(ts)', 'category']
INSERT INTO iceberg.db.trino_p VALUES (3, TIMESTAMP '2026-11-03 10:00:00', 'c', 3.0)
ALTER TABLE iceberg.db.trino_p SET PROPERTIES partitioning = ARRAY['hour(ts)', 'category']
INSERT INTO iceberg.db.trino_p VALUES (4, TIMESTAMP '2026-11-03 11:00:00', 'c', 4.0)
SELECT partition, record_count, file_format FROM iceberg.db."trino_p$files" ORDER BY record_count, file_path
ALTER TABLE iceberg.db.trino_p DROP COLUMN category
ALTER TABLE iceberg.db.trino_p SET PROPERTIES partitioning = ARRAY['hour(ts)']
ALTER TABLE iceberg.db.trino_p DROP COLUMN category
SELECT * FROM iceberg.db.trino_p ORDER BY id
-- Tables Spark created and changed in the same lab run.
SELECT * FROM iceberg.db.nested_p ORDER BY id
SHOW CREATE TABLE iceberg.db.prune_t
SELECT count(*) AS n, sum(amount) AS total FROM iceberg.db.prune_t WHERE category = 'b'
EXPLAIN ANALYZE SELECT count(*) AS n, sum(amount) AS total FROM iceberg.db.split_t WHERE category = 'b'
SELECT * FROM iceberg.db.evo_t ORDER BY id
DEBUG SELECT * FROM iceberg.db.dc_v2 ORDER BY id
SELECT * FROM iceberg.db."dc_v2$partitions"
DEBUG SELECT * FROM iceberg.db.dc_v1 ORDER BY id
SELECT * FROM iceberg.db."dc_v1$partitions"
SELECT * FROM iceberg.db.dc_v2_restored ORDER BY id
SELECT * FROM iceberg.db.dc_fix ORDER BY id
