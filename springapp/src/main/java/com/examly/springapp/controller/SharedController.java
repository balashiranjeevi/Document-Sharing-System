package com.examly.springapp.controller;

import com.examly.springapp.model.Document;
import com.examly.springapp.service.DocumentService;
import com.examly.springapp.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/shared")
public class SharedController {
    
    @Autowired
    private DocumentService documentService;
    
    @Autowired
    private com.examly.springapp.service.FileStorageService fileStorageService;
    
    @Autowired
    private ActivityLogService activityLogService;
    
    @GetMapping("/{id}")
    public ResponseEntity<org.springframework.core.io.Resource> getSharedDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            
            // Check if document is public
            if (document.getVisibility() != Document.Visibility.PUBLIC) {
                return ResponseEntity.notFound().build();
            }
            
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path filePath = fileStorageService.getFilePath(document.getFileUrl());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                // Log view activity for shared document
                activityLogService.logActivity(id, 0L, "SHARED_VIEW", 
                    "Shared document viewed: " + document.getFileName());
                
                return ResponseEntity.ok()
                        .header("Content-Type", document.getFileType())
                        .header("Content-Disposition", "inline; filename=\"" + document.getFileName() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}