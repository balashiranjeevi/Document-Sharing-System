package com.examly.springapp.controller;

import com.examly.springapp.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    
    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFolders() {
        // Get dynamic counts based on file types
        long documentCount = documentService.getDocumentCountByType("document");
        long imageCount = documentService.getDocumentCountByType("image");
        long videoCount = documentService.getDocumentCountByType("video");
        long audioCount = documentService.getDocumentCountByType("audio");
        
        List<Map<String, Object>> folders = List.of(
            Map.of("id", 1, "name", "Documents", "count", documentCount, "type", "documents"),
            Map.of("id", 2, "name", "Images", "count", imageCount, "type", "images"),
            Map.of("id", 3, "name", "Videos", "count", videoCount, "type", "videos"),
            Map.of("id", 4, "name", "Audio", "count", audioCount, "type", "audio")
        );
        return ResponseEntity.ok(folders);
    }
}