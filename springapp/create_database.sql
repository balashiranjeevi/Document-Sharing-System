-- Create database
CREATE DATABASE IF NOT EXISTS documentdb;

-- Use the database
USE documentdb;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER'
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    file_name VARCHAR(255),
    file_type VARCHAR(255),
    owner_id BIGINT,
    is_public BOOLEAN DEFAULT FALSE,
    file_url VARCHAR(500),
    size BIGINT,
    visibility ENUM('PRIVATE', 'PUBLIC') DEFAULT 'PRIVATE',
    parent_folder_id BIGINT,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);