package com.examly.springapp.service;

import com.examly.springapp.model.Document;
import com.examly.springapp.repository.DocumentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public Page<Document> getAllDocuments(int page, int size, String sortBy, String sortDir, String search) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);

            if (search != null && !search.isEmpty()) {
                return documentRepository.findByTitleContainingIgnoreCaseAndDeletedAtIsNull(search, pageable);
            }
            return documentRepository.findByDeletedAtIsNull(pageable);
        } catch (Exception e) {
            System.err.println("Error getting documents: " + e.getMessage());
            e.printStackTrace();
            // Return empty page
            return Page.empty();
        }
    }

    public Page<Document> getAllDocuments(Pageable pageable) {
        return documentRepository.findAll(pageable);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
    }

    public Document createDocument(Document document) {
        return documentRepository.save(document);
    }

    public Document updateDocument(Long id, Document updatedDoc) {
        Document existingDoc = getDocumentById(id);
        if (updatedDoc.getTitle() != null)
            existingDoc.setTitle(updatedDoc.getTitle());
        if (updatedDoc.getFileType() != null)
            existingDoc.setFileType(updatedDoc.getFileType());
        if (updatedDoc.getFileUrl() != null)
            existingDoc.setFileUrl(updatedDoc.getFileUrl());
        if (updatedDoc.getSize() != null)
            existingDoc.setSize(updatedDoc.getSize());
        if (updatedDoc.getVisibility() != null)
            existingDoc.setVisibility(updatedDoc.getVisibility());
        if (updatedDoc.getParentFolderId() != null)
            existingDoc.setParentFolderId(updatedDoc.getParentFolderId());
        return documentRepository.save(existingDoc);
    }

    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new EntityNotFoundException("Document not found");
        }
        documentRepository.deleteById(id);
    }

    public List<Document> getDocumentsByOwner(Long ownerId) {
        return documentRepository.findByOwnerId(ownerId);
    }

    public List<Document> getDocumentsByParentFolder(Long parentFolderId) {
        return documentRepository.findByParentFolderId(parentFolderId);
    }

    public List<Document> getDocumentsByVisibility(Document.Visibility visibility) {
        return documentRepository.findByVisibilityAndDeletedAtIsNull(visibility);
    }

    public List<Document> getTrashedDocuments() {
        return documentRepository.findByDeletedAtIsNotNull();
    }

    public long getTotalDocuments() {
        try {
            return documentRepository.countByDeletedAtIsNull();
        } catch (Exception e) {
            System.err.println("Error counting total documents: " + e.getMessage());
            return 0;
        }
    }

    public long getRecentDocumentsCount() {
        try {
            java.time.LocalDateTime weekAgo = java.time.LocalDateTime.now().minusDays(7);
            return documentRepository.countByCreatedAtAfterAndDeletedAtIsNull(weekAgo);
        } catch (Exception e) {
            System.err.println("Error counting recent documents: " + e.getMessage());
            return 0;
        }
    }

    public long getSharedDocumentsCount() {
        try {
            return documentRepository.countByVisibilityAndDeletedAtIsNull(Document.Visibility.PUBLIC);
        } catch (Exception e) {
            System.err.println("Error counting shared documents: " + e.getMessage());
            return 0;
        }
    }

    public long getTrashedDocumentsCount() {
        try {
            return documentRepository.countByDeletedAtIsNotNull();
        } catch (Exception e) {
            System.err.println("Error counting trashed documents: " + e.getMessage());
            return 0;
        }
    }

    public void moveToTrash(Long id) {
        Document document = getDocumentById(id);
        document.setDeletedAt(java.time.LocalDateTime.now());
        documentRepository.save(document);
    }

    public long getDocumentCountByType(String type) {
        switch (type.toLowerCase()) {
            case "document":
                return documentRepository.countByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("pdf") +
                        documentRepository.countByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("doc") +
                        documentRepository.countByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("txt");
            case "image":
                return documentRepository.countByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("image");
            case "video":
                return documentRepository.countByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("video");
            case "audio":
                return documentRepository.countByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("audio");
            default:
                return 0;
        }
    }

    public long getUserStorageUsed(Long userId) {
        try {
            return documentRepository.getTotalStorageByOwnerId(userId);
        } catch (Exception e) {
            System.err.println("Error getting user storage: " + e.getMessage());
            return 0;
        }
    }

    public boolean checkStorageLimit(Long userId, long fileSize) {
        long currentUsage = getUserStorageUsed(userId);
        long maxStorage = 200 * 1024 * 1024; // 200MB in bytes
        return (currentUsage + fileSize) <= maxStorage;
    }

    public List<Document> getDocumentsByFileType(String type) {
        switch (type.toLowerCase()) {
            case "images":
                return documentRepository.findByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("image");
            case "documents":
                List<Document> docs = new java.util.ArrayList<>();
                docs.addAll(documentRepository.findByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("pdf"));
                docs.addAll(documentRepository.findByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("doc"));
                docs.addAll(documentRepository.findByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("txt"));
                return docs;
            case "videos":
                return documentRepository.findByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("video");
            case "audio":
                return documentRepository.findByFileTypeContainingIgnoreCaseAndDeletedAtIsNull("audio");
            default:
                return new java.util.ArrayList<>();
        }
    }

    public long getTotalDocumentCount() {
        return documentRepository.count();
    }

    public String getTotalStorageUsed() {
        long totalBytes = documentRepository.getTotalStorage();
        if (totalBytes == 0)
            return "0 GB";

        double gb = totalBytes / (1024.0 * 1024.0 * 1024.0);
        if (gb < 1) {
            double mb = totalBytes / (1024.0 * 1024.0);
            return String.format("%.1f MB", mb);
        }
        return String.format("%.2f GB", gb);
    }

    public Map<String, Object> getDocumentStats() {
        try {
            Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("total", getTotalDocuments());
            stats.put("recent", getRecentDocumentsCount());
            stats.put("shared", getSharedDocumentsCount());
            stats.put("trash", getTrashedDocumentsCount());
            stats.put("storageUsed", documentRepository.getTotalStorage());
            stats.put("maxStorage", 200L * 1024 * 1024); // 200MB in bytes
            long storageUsed = (Long) stats.get("storageUsed");
            long maxStorage = (Long) stats.get("maxStorage");
            stats.put("storagePercentage", maxStorage > 0 ? (double) storageUsed / maxStorage : 0.0);
            return stats;
        } catch (Exception e) {
            System.err.println("Error getting document stats: " + e.getMessage());
            e.printStackTrace();
            // Return default stats
            Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("total", 0L);
            stats.put("recent", 0L);
            stats.put("shared", 0L);
            stats.put("trash", 0L);
            stats.put("storageUsed", 0L);
            stats.put("maxStorage", 200L * 1024 * 1024 * 1024);
            stats.put("storagePercentage", 0.0);
            return stats;
        }
    }

    public List<Document> getRecentDocuments() {
        try {
            java.time.LocalDateTime weekAgo = java.time.LocalDateTime.now().minusDays(7);
            return documentRepository.findByCreatedAtAfterAndDeletedAtIsNull(weekAgo);
        } catch (Exception e) {
            System.err.println("Error getting recent documents: " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    public List<Document> getAllDocuments() {
        try {
            return documentRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error getting all documents: " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    public List<Document> getAllActiveDocuments() {
        try {
            return documentRepository.findByDeletedAtIsNull();
        } catch (Exception e) {
            System.err.println("Error getting all active documents: " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    /**
     * Scheduled task to clean up orphaned files in the document storage directory.
     * Runs daily at 2 AM. Checks for files that exist in the storage directory
     * but have no corresponding database records, and deletes them.
     */
    @Scheduled(cron = "0 0 2 * * ?") // Run daily at 2 AM
    public void cleanupOrphanedFiles() {
        try {
            String storagePath = "DocumentStorage/";
            Path storageDir = Paths.get(storagePath);

            if (!Files.exists(storageDir) || !Files.isDirectory(storageDir)) {
                System.out.println("Document storage directory does not exist: " + storagePath);
                return;
            }

            // Get all files in the storage directory recursively
            try (Stream<Path> paths = Files.walk(storageDir)) {
                paths.filter(Files::isRegularFile)
                        .forEach(filePath -> {
                            try {
                                String fileName = filePath.getFileName().toString();

                                // Check if this file exists in the database
                                boolean existsInDb = documentRepository.existsByFileUrlContaining(fileName);

                                if (!existsInDb) {
                                    // File exists in storage but not in database - delete it
                                    Files.delete(filePath);
                                    System.out.println("Deleted orphaned file: " + filePath.toString());
                                }
                            } catch (IOException e) {
                                System.err.println("Error processing file " + filePath + ": " + e.getMessage());
                            }
                        });
            }

            System.out.println("Orphaned file cleanup completed successfully");

        } catch (Exception e) {
            System.err.println("Error during orphaned file cleanup: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
