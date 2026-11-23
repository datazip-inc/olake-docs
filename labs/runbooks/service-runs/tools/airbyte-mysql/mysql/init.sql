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

-- A second database that the connector does not capture. Writing to it fills the binary log
-- without giving the connector a change to read.
CREATE DATABASE noise;
CREATE TABLE noise.ticks (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- The capture user, with the grants the Airbyte MySQL set-up guide lists for CDC.
CREATE USER 'airbyte'@'%' IDENTIFIED BY 'labpw';
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'airbyte'@'%';
FLUSH PRIVILEGES;
