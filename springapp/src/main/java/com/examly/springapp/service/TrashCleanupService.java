package com.examly.springapp.service;

import com.examly.springapp.model.Document;
import com.examly.springapp.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrashCleanupService {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private com.examly.springapp.service.FileStorageService fileStorageService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupOldTrashedFiles() {
        LocalDateTime twoDaysAgo = LocalDateTime.now().minusDays(2);
        List<Document> oldTrashedDocs = documentRepository.findByDeletedAtBefore(twoDaysAgo);
        
        for (Document doc : oldTrashedDocs) {
            try {
                // Delete physical file
                if (doc.getFileUrl() != null) {
                    fileStorageService.deleteFile(doc.getFileUrl());
                }
                
                // Log permanent deletion
                activityLogService.logActivity(doc.getId(), doc.getOwnerId(), "AUTO_DELETED", 
                    "File automatically deleted after 2 days in trash: " + doc.getFileName());
                
                // Delete from database
                documentRepository.delete(doc);
            } catch (Exception e) {
                // Log error but continue with other files
                System.err.println("Error deleting file: " + doc.getFileName() + " - " + e.getMessage());
            }
        }
    }
}