-- The index of Ask OLake: one row per chunk, and a full-text index over the titles and the text.
-- Loading the index replaces it, so both tables are dropped first.
DROP TABLE IF EXISTS chunks_fts;
DROP TABLE IF EXISTS chunks;

CREATE TABLE chunks (
  id INTEGER PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL
);

-- The full-text index reads the text from `chunks` and keeps no copy of it. With "porter" a word
-- matches its other forms: "replicating" finds "replication".
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  title,
  text,
  content = 'chunks',
  content_rowid = 'id',
  tokenize = 'porter unicode61'
);
