-- One database with three tables and one publication.
--   documents     large values of four types, stored out of line (TOAST), and one large value that
--                 compresses so well that it stays in the row
--   orders        200,000 small rows, for the lock and the write-ahead log (WAL) measurements
--   measurements  a partitioned table with two partitions

CREATE DATABASE appdb;

\connect appdb

CREATE TABLE documents (
  id         bigint PRIMARY KEY,
  title      text NOT NULL,
  body       text,
  attachment bytea,
  meta       jsonb,
  tags       text[],
  summary    text
);

-- md5 output does not compress, so each of the first four values is moved out of line. summary is
-- 100,000 characters of one letter: it compresses to about 1 kB and stays in the row.
INSERT INTO documents
SELECT d, 'title ' || d,
       (SELECT string_agg(md5(d::text || g::text), '') FROM generate_series(1, 1000) g),
       (SELECT decode(string_agg(md5(d::text || g::text || 'b'), ''), 'hex') FROM generate_series(1, 1000) g),
       (SELECT jsonb_build_object('doc', d, 'text', string_agg(md5(d::text || g::text || 'j'), '')) FROM generate_series(1, 1000) g),
       (SELECT array_agg(md5(d::text || g::text || 't')) FROM generate_series(1, 1000) g),
       repeat('s', 100000)
FROM generate_series(1, 2) d;

CREATE TABLE orders (
  id          bigint PRIMARY KEY,
  customer_id int  NOT NULL,
  status      text NOT NULL,
  note        text
);
INSERT INTO orders SELECT g, g % 1000, 'new', 'order ' || g FROM generate_series(1, 200000) g;
-- Keep autovacuum out of the WAL measurements.
ALTER TABLE orders SET (autovacuum_enabled = off);

CREATE TABLE measurements (
  id      int  NOT NULL,
  region  text NOT NULL,
  reading numeric,
  PRIMARY KEY (id, region)
) PARTITION BY LIST (region);
CREATE TABLE measurements_eu PARTITION OF measurements FOR VALUES IN ('eu');
CREATE TABLE measurements_us PARTITION OF measurements FOR VALUES IN ('us');
INSERT INTO measurements VALUES (1, 'eu', 10), (2, 'us', 20);

CREATE PUBLICATION cdc_pub FOR TABLE documents, orders, measurements;

VACUUM ANALYZE;
