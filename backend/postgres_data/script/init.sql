-- Table For USER
CREATE TABLE "users" (
    id SERIAL PRIMARY KEY,
    
);

COPY "users"
FROM '/tmp/dump/users.csv'
DELIMITER ','
CSV HEADER;
