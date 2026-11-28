CREATE DATABASE inventory;
USE inventory;

-- Captured from the start.
CREATE TABLE customers (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO customers (first_name, last_name, email) VALUES
  ('Sally', 'Thomas', 'sally.thomas@example.com'),
  ('George', 'Bailey', 'gbailey@example.com'),
  ('Edward', 'Walker', 'ed@example.com'),
  ('Anne', 'Kretchmar', 'annek@example.com');

-- The table added to the running connector: 20,000 existing rows.
CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  quantity INT NOT NULL,
  placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);

SET SESSION cte_max_recursion_depth = 20000;
INSERT INTO orders (customer_id, quantity)
WITH RECURSIVE n (i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 20000)
SELECT 1 + i % 4, 1 + i % 9 FROM n;

-- Never added to the include list.
CREATE TABLE shipments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  carrier VARCHAR(32) NOT NULL
);

INSERT INTO shipments (order_id, carrier) VALUES (1, 'ups'), (2, 'dhl'), (3, 'fedex');

-- A table without a primary key: 50 rows.
CREATE TABLE order_notes (
  note_id INT NOT NULL,
  order_id INT NOT NULL,
  note VARCHAR(255) NOT NULL
);

INSERT INTO order_notes (note_id, order_id, note)
WITH RECURSIVE n (i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 50)
SELECT i, i, CONCAT('note ', i) FROM n;

-- The grants the Debezium MySQL connector documents for a capture user.
CREATE USER 'debezium'@'%' IDENTIFIED BY 'dbz';
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium'@'%';
FLUSH PRIVILEGES;
