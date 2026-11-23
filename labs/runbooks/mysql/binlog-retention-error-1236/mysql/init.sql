CREATE DATABASE inventory;
USE inventory;

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

CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  quantity INT NOT NULL,
  placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);

INSERT INTO orders (customer_id, quantity) VALUES (1, 1), (2, 2), (3, 2), (4, 1);

-- A second database that no reader in this lab captures. Writing to it fills the binary log
-- without moving the position of a reader that only follows `inventory`.
CREATE DATABASE noise;
CREATE TABLE noise.ticks (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- A replication user for the second MySQL server, and a capture user with the grants the
-- Debezium MySQL connector documents.
CREATE USER 'repl'@'%' IDENTIFIED BY 'replpw';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
CREATE USER 'debezium'@'%' IDENTIFIED BY 'dbz';
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium'@'%';
FLUSH PRIVILEGES;
