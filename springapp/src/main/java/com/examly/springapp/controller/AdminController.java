package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Document;
import com.examly.springapp.model.DocumentActivity;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.DocumentService;
import com.examly.springapp.service.ActivityLogService;
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

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private com.examly.springapp.service.FileStorageService fileStorageService;

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
            List<Document> documents = documentService.getAllActiveDocuments();
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

    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities() {
        try {
            List<DocumentActivity> activities = activityLogService.getRecentActivities();
            List<Map<String, Object>> activityList = activities.stream()
                    .map(activity -> {
                        Map<String, Object> activityMap = new HashMap<>();
                        activityMap.put("id", activity.getId());
                        activityMap.put("type", mapActionToType(activity.getAction()));
                        activityMap.put("description", activity.getDetails());
                        activityMap.put("timestamp",
                                activity.getTimestamp() != null ? activity.getTimestamp().toString() : null);
                        return activityMap;
                    })
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(activityList);
        } catch (Exception e) {
            System.err.println("Error getting recent activities: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        try {
            Document document = documentService.getDocumentById(documentId);

            // Move to trash instead of permanent deletion for admin
            documentService.moveToTrash(documentId);

            // Log admin delete activity
            activityLogService.logActivity(documentId, document.getOwnerId(), "DELETED",
                    "Document deleted by admin: " + document.getFileName());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting document by admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(@PathVariable Long documentId) {
        try {
            Document document = documentService.getDocumentById(documentId);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            java.nio.file.Path filePath = fileStorageService.getFilePath(document.getFileUrl());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Log admin download activity
                activityLogService.logActivity(documentId, document.getOwnerId(), "DOWNLOADED",
                        "Document downloaded by admin: " + document.getFileName());

                return ResponseEntity.ok()
                        .header("Content-Disposition", "attachment; filename=\"" + document.getFileName() + "\"")
                        .header("Content-Type", document.getFileType())
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error downloading document by admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    private String mapActionToType(String action) {
        switch (action) {
            case "UPLOADED":
                return "upload";
            case "VIEWED":
                return "view";
            case "DOWNLOADED":
                return "download";
            case "SHARED":
                return "share";
            case "RENAMED":
                return "edit";
            case "DELETED":
                return "delete";
            case "RESTORED":
                return "restore";
            case "SHARED_VIEW":
                return "share";
            case "AUTO_DELETED":
                return "delete";
            default:
                return "edit";
        }
    }
}
