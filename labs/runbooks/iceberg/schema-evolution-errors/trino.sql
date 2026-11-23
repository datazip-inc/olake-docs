-- One statement per line. run.sh runs each with the Trino CLI and records what it returned.
SELECT * FROM iceberg.db.types_t
SELECT * FROM iceberg.db.ren_t ORDER BY id
SELECT * FROM iceberg.db.case_t
SELECT "ID" FROM iceberg.db.case_t
SELECT * FROM iceberg.db.case_fix_t
CREATE TABLE iceberg.db.trino_t (id integer, name varchar, amount real)
INSERT INTO iceberg.db.trino_t VALUES (1, 'a', 1.5)
ALTER TABLE iceberg.db.trino_t ALTER COLUMN id SET DATA TYPE bigint
ALTER TABLE iceberg.db.trino_t ALTER COLUMN amount SET DATA TYPE double
ALTER TABLE iceberg.db.trino_t ALTER COLUMN id SET DATA TYPE integer
ALTER TABLE iceberg.db.trino_t ALTER COLUMN name SET DATA TYPE integer
ALTER TABLE iceberg.db.trino_t ALTER COLUMN amount SET DATA TYPE varchar
INSERT INTO iceberg.db.trino_t VALUES (2, 'b')
INSERT INTO iceberg.db.trino_t VALUES ('x', 'b', 2.0)
ALTER TABLE iceberg.db.trino_t ADD COLUMN email varchar
INSERT INTO iceberg.db.trino_t (id, name) VALUES (3, 'c')
ALTER TABLE iceberg.db.trino_t ADD COLUMN "ID" integer
ALTER TABLE iceberg.db.trino_t ADD COLUMN code integer NOT NULL
ALTER TABLE iceberg.db.trino_t RENAME COLUMN name TO full_name
SELECT * FROM iceberg.db.trino_t ORDER BY id
