-- prepares mysql server for the project
CREATE DATABASE IF NOT EXISTS moes_collection_db;
CREATE USER
    IF NOT EXISTS 'moes_collection'@'localhost'
    IDENTIFIED BY 'Mosunmola';
GRANT ALL PRIVILEGES
    ON moes_collection_db.*
    TO 'moes_collection'@'localhost';
GRANT SELECT
    ON performance_schema.*
    TO 'moes_collection'@'localhost';
FLUSH PRIVILEGES;