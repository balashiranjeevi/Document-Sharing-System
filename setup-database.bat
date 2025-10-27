@echo off
echo Setting up database...

mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS documentdb;"
mysql -u root -proot -e "USE documentdb; CREATE TABLE IF NOT EXISTS users (id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER', status VARCHAR(50) DEFAULT 'ACTIVE', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"

echo Inserting test user...
mysql -u root -proot -e "USE documentdb; INSERT IGNORE INTO users (name, email, password_hash, role) VALUES ('Test User', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER');"

echo Database setup complete!
echo Test user: test@example.com
echo Password: admin123
pause