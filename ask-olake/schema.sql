-- The index of Ask OLake: one row per chunk, a full-text index over the titles and the text, and
-- the chunks' vectors for meaning search. Loading the index replaces it, so its tables are
-- dropped first.
DROP TABLE IF EXISTS chunks_fts;
DROP TABLE IF EXISTS chunks;
DROP TABLE IF EXISTS vectors;
DROP TABLE IF EXISTS index_info;

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

-- The vectors of the chunks from `first_id` on, one after the other, as base64. Several chunks
-- share a row so that the Worker reads a few dozen rows, not thousands, when it starts.
CREATE TABLE vectors (first_id INTEGER PRIMARY KEY, data TEXT NOT NULL);

-- When this index was loaded. A running Worker sees from it that its copy of the vectors is old.
CREATE TABLE index_info (built INTEGER NOT NULL);

-- What was asked and answered, by the website widget and the Slack bot. It is kept when the index
-- is replaced. Questions are stored with credentials masked, and with nothing about who asked.
--
-- What the docs are missing, most asked first:
--   SELECT question, count(*) AS asked FROM questions
--   WHERE uncertain = 1 OR vote = -1 GROUP BY lower(question) ORDER BY asked DESC LIMIT 50;
-- What each day cost:
--   SELECT date(at, 'unixepoch') AS day, count(*) AS questions, round(sum(cost), 4) AS dollars
--   FROM questions GROUP BY day ORDER BY day DESC;
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  at INTEGER NOT NULL, -- seconds since 1970
  channel TEXT NOT NULL, -- 'web' or 'slack'
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sources TEXT NOT NULL, -- the cited URLs, as a JSON array
  uncertain INTEGER NOT NULL, -- 1 when the docs did not cover the question
  cost REAL NOT NULL, -- model calls, in US dollars
  vote INTEGER, -- 1 or -1, from the "Helpful?" buttons
  reason TEXT
);
CREATE INDEX IF NOT EXISTS questions_at ON questions (at);
