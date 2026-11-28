-- One statement per line, run by ./run.sh fix after the Spark part of the step. Trino compacts the
-- equality delete table that Spark 3.3.3 with Iceberg 1.4.3 wrote, and lists its files before and after.
SELECT content, file_format, count(*) AS files, sum(record_count) AS records FROM iceberg.db."s33_v2_eq$files" GROUP BY content, file_format ORDER BY content
ALTER TABLE iceberg.db.s33_v2_eq EXECUTE optimize
SELECT content, file_format, count(*) AS files, sum(record_count) AS records FROM iceberg.db."s33_v2_eq$files" GROUP BY content, file_format ORDER BY content
