package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Document;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
// @PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private DocumentService documentService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            List<User> allUsers = userService.getAllUsers();
            stats.put("totalUsers", allUsers.size());
            stats.put("activeUsers", allUsers.stream().mapToInt(u -> "ACTIVE".equals(u.getStatus()) ? 1 : 0).sum());
            stats.put("totalDocuments", documentService.getTotalDocumentCount());
            stats.put("totalStorage", documentService.getTotalStorageUsed());
        } catch (Exception e) {
            System.err.println("Error getting admin stats: " + e.getMessage());
            e.printStackTrace();
            stats.put("totalUsers", 0);
            stats.put("activeUsers", 0);
            stats.put("totalDocuments", 0);
            stats.put("totalStorage", "0 GB");
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            System.err.println("Error getting all users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        User updatedUser = userService.updateUserStatus(userId, status);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/documents")
    public ResponseEntity<List<Map<String, Object>>> getAllDocuments() {
        try {
            List<Document> documents = documentService.getAllDocuments();
            List<Map<String, Object>> documentList = documents.stream()
                    .map(doc -> {
                        Map<String, Object> docMap = new HashMap<>();
                        docMap.put("id", doc.getId());
                        docMap.put("name", doc.getTitle());
                        docMap.put("type", doc.getFileType());
                        docMap.put("size", doc.getSize());
                        docMap.put("owner", doc.getOwnerId() != null ? "User " + doc.getOwnerId() : "Unknown");
                        docMap.put("uploadedAt", doc.getCreatedAt() != null ? doc.getCreatedAt().toString() : null);
                        return docMap;
                    })
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(documentList);
        } catch (Exception e) {
            System.err.println("Error getting all documents for admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }
}
