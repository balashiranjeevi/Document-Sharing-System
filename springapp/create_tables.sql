-- Create folders table
CREATE TABLE folders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id BIGINT NOT NULL,
    parent_folder_id BIGINT,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (parent_folder_id) REFERENCES folders(id)
);

-- Create permissions table
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_id BIGINT,
    folder_id BIGINT,
    permission_type ENUM('READ', 'write', 'delete') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (folder_id) REFERENCES folders(id)
);