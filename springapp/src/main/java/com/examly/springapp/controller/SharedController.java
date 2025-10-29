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
    public ResponseEntity<?> getSharedDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);

            // Check if document is public
            if (document.getVisibility() != Document.Visibility.PUBLIC) {
                return ResponseEntity.notFound().build();
            }

            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            // Log view activity for shared document
            activityLogService.logActivity(document, null, "SHARED_VIEW",
                    "Shared document viewed: " + document.getFileName());

            // Redirect to direct S3 URL
            String s3Url = fileStorageService.getDirectUrl(document.getFileUrl());
            return ResponseEntity.status(302)
                    .header("Location", s3Url)
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}