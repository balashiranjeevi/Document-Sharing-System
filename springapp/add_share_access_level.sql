-- Add share access level column to documents table
ALTER TABLE documents ADD COLUMN share_access_level VARCHAR(20) DEFAULT 'VIEW_ONLY';

-- Update existing public documents to have VIEW_AND_DOWNLOAD access
UPDATE documents SET share_access_level = 'VIEW_AND_DOWNLOAD' WHERE visibility = 'PUBLIC';