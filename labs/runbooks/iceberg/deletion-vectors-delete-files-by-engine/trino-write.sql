-- One statement per line. run.sh runs each with the Trino CLI and records what it returned. A line that
-- starts with DEBUG runs with --debug, and run.sh keeps the exception chain of a failure.
-- The lab's changes on a format version 2 and a format version 3 table, and the files each one left.
CREATE SCHEMA IF NOT EXISTS iceberg.db
DROP TABLE IF EXISTS iceberg.db.t_v2_pos
CREATE TABLE iceberg.db.t_v2_pos (id integer, v varchar) WITH (format_version = 2)
INSERT INTO iceberg.db.t_v2_pos VALUES (1, 'r1'), (2, 'r2'), (3, 'r3'), (4, 'r4'), (5, 'r5')
INSERT INTO iceberg.db.t_v2_pos VALUES (6, 'r6'), (7, 'r7'), (8, 'r8'), (9, 'r9'), (10, 'r10')
DELETE FROM iceberg.db.t_v2_pos WHERE id IN (3, 8)
UPDATE iceberg.db.t_v2_pos SET v = 'u5' WHERE id = 5
MERGE INTO iceberg.db.t_v2_pos t USING (VALUES (10, 'm10'), (11, 'm11')) AS s(id, v) ON t.id = s.id WHEN MATCHED THEN UPDATE SET v = s.v WHEN NOT MATCHED THEN INSERT (id, v) VALUES (s.id, s.v)
SELECT content, file_format, record_count FROM iceberg.db."t_v2_pos$files" ORDER BY content, file_path
SELECT operation, element_at(summary, 'added-position-delete-files') AS pos_files, element_at(summary, 'added-dvs') AS dvs, element_at(summary, 'removed-dvs') AS removed_dvs, element_at(summary, 'total-delete-files') AS delete_files FROM iceberg.db."t_v2_pos$snapshots" ORDER BY committed_at
DROP TABLE IF EXISTS iceberg.db.t_v3_dv
DEBUG CREATE TABLE iceberg.db.t_v3_dv (id integer, v varchar) WITH (format_version = 3)
INSERT INTO iceberg.db.t_v3_dv VALUES (1, 'r1'), (2, 'r2'), (3, 'r3'), (4, 'r4'), (5, 'r5')
INSERT INTO iceberg.db.t_v3_dv VALUES (6, 'r6'), (7, 'r7'), (8, 'r8'), (9, 'r9'), (10, 'r10')
DEBUG DELETE FROM iceberg.db.t_v3_dv WHERE id IN (3, 8)
DEBUG UPDATE iceberg.db.t_v3_dv SET v = 'u5' WHERE id = 5
DEBUG MERGE INTO iceberg.db.t_v3_dv t USING (VALUES (10, 'm10'), (11, 'm11')) AS s(id, v) ON t.id = s.id WHEN MATCHED THEN UPDATE SET v = s.v WHEN NOT MATCHED THEN INSERT (id, v) VALUES (s.id, s.v)
SELECT content, file_format, record_count FROM iceberg.db."t_v3_dv$files" ORDER BY content, file_path
SELECT operation, element_at(summary, 'added-position-delete-files') AS pos_files, element_at(summary, 'added-dvs') AS dvs, element_at(summary, 'removed-dvs') AS removed_dvs, element_at(summary, 'total-delete-files') AS delete_files FROM iceberg.db."t_v3_dv$snapshots" ORDER BY committed_at
-- Row-level changes on a format version 1 table, then the same delete after the move to version 2.
DROP TABLE IF EXISTS iceberg.db.t_v1
CREATE TABLE iceberg.db.t_v1 (id integer, v varchar) WITH (format_version = 1)
INSERT INTO iceberg.db.t_v1 VALUES (1, 'r1'), (2, 'r2'), (3, 'r3'), (4, 'r4'), (5, 'r5')
DELETE FROM iceberg.db.t_v1 WHERE id = 3
UPDATE iceberg.db.t_v1 SET v = 'u5' WHERE id = 5
MERGE INTO iceberg.db.t_v1 t USING (VALUES (4, 'm4')) AS s(id, v) ON t.id = s.id WHEN MATCHED THEN UPDATE SET v = s.v
ALTER TABLE iceberg.db.t_v1 SET PROPERTIES format_version = 2
DELETE FROM iceberg.db.t_v1 WHERE id = 3
SELECT * FROM iceberg.db.t_v1 ORDER BY id
SELECT content, file_format, record_count FROM iceberg.db."t_v1$files" ORDER BY content, file_path
DROP TABLE iceberg.db.t_v1
-- The default format version of a new table.
DROP TABLE IF EXISTS iceberg.db.t_default
CREATE TABLE iceberg.db.t_default (id integer, v varchar)
SHOW CREATE TABLE iceberg.db.t_default
DROP TABLE iceberg.db.t_default
