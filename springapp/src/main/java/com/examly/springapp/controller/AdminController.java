package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Document;
import com.examly.springapp.model.ActivityLog;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.DocumentService;
import com.examly.springapp.service.ActivityLogService;
import com.examly.springapp.service.FileStorageService;
import com.examly.springapp.service.SettingsService;
import com.examly.springapp.model.Settings;
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
    private FileStorageService fileStorageService;

    @Autowired
    private SettingsService settingsService;

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

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            System.err.println("Error getting user by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
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

    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        User updatedUser;
        if (password != null && !password.trim().isEmpty()) {
            // Update both user info and password
            updatedUser = userService.updateUser(userId, name, email);
            updatedUser = userService.updateUserPassword(userId, password);
        } else {
            // Update only user info
            updatedUser = userService.updateUser(userId, name, email);
        }

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
                        docMap.put("title", doc.getTitle());
                        docMap.put("fileName", doc.getFileName());
                        docMap.put("type", doc.getFileType());
                        docMap.put("fileType", doc.getFileType());
                        docMap.put("size", doc.getSize());
                        docMap.put("owner", doc.getOwnerId() != null ? "User " + doc.getOwnerId() : "Unknown");
                        docMap.put("ownerId", doc.getOwnerId());
                        docMap.put("uploadedAt", doc.getCreatedAt() != null ? doc.getCreatedAt().toString() : null);
                        docMap.put("createdAt", doc.getCreatedAt() != null ? doc.getCreatedAt().toString() : null);
                        // Add S3 URLs for direct access
                        if (doc.getFileUrl() != null) {
                            String s3Url = fileStorageService.getDirectUrl(doc.getFileUrl());
                            String downloadUrl = fileStorageService.getDownloadUrl(doc.getFileUrl(), doc.getFileName());
                            docMap.put("s3Url", s3Url);
                            docMap.put("directUrl", s3Url);
                            docMap.put("downloadUrl", downloadUrl);
                            docMap.put("fileUrl", doc.getFileUrl());
                        }
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
            List<ActivityLog> activities = activityLogService.getRecentActivities();
            List<Map<String, Object>> activityList = activities.stream()
                    .map(activity -> {
                        Map<String, Object> activityMap = new HashMap<>();
                        activityMap.put("id", activity.getId());
                        activityMap.put("type", mapActionToType(activity.getAction()));
                        activityMap.put("description", activity.getDetails());
                        activityMap.put("timestamp",
                                activity.getTimestamp() != null ? activity.getTimestamp().toString() : null);
                        activityMap.put("userId", activity.getUser() != null ? activity.getUser().getId() : null);
                        activityMap.put("documentId",
                                activity.getDocument() != null ? activity.getDocument().getId() : null);
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
            activityLogService.logActivity(document, userService.getUserById(document.getOwnerId()), "DELETED",
                    "Document deleted by admin: " + document.getFileName());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting document by admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<?> downloadDocument(@PathVariable Long documentId) {
        try {
            Document document = documentService.getDocumentById(documentId);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            // Log admin download activity
            activityLogService.logActivity(document, userService.getUserById(document.getOwnerId()), "DOWNLOADED",
                    "Document downloaded by admin: " + document.getFileName());

            // Return S3 download URL with proper Content-Disposition header
            String downloadUrl = fileStorageService.getDownloadUrl(document.getFileUrl(), document.getFileName());
            Map<String, String> response = new HashMap<>();
            response.put("downloadUrl", downloadUrl);
            response.put("fileName", document.getFileName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error downloading document by admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/documents/{documentId}/view")
    public ResponseEntity<?> viewDocument(@PathVariable Long documentId) {
        try {
            Document document = documentService.getDocumentById(documentId);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            // Log admin view activity
            activityLogService.logActivity(document, userService.getUserById(document.getOwnerId()), "VIEWED",
                    "Document viewed by admin: " + document.getFileName());

            // Return direct S3 URL in JSON response
            String s3Url = fileStorageService.getDirectUrl(document.getFileUrl());
            Map<String, String> response = new HashMap<>();
            response.put("viewUrl", s3Url);
            response.put("fileName", document.getFileName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error viewing document by admin: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/documents/{documentId}/share")
    public ResponseEntity<?> getShareUrl(@PathVariable Long documentId) {
        try {
            Document document = documentService.getDocumentById(documentId);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            // Return direct S3 URL for sharing
            String s3Url = fileStorageService.getDirectUrl(document.getFileUrl());
            Map<String, String> response = new HashMap<>();
            response.put("shareUrl", s3Url);
            response.put("fileName", document.getFileName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error getting share URL by admin: " + e.getMessage());
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

    @GetMapping("/settings")
    public ResponseEntity<Settings> getSettings() {
        try {
            Settings settings = settingsService.getSettings();
            return ResponseEntity.ok(settings);
        } catch (Exception e) {
            System.err.println("Error getting settings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/settings")
    public ResponseEntity<Settings> updateSettings(@RequestBody Settings settings) {
        try {
            Settings updatedSettings = settingsService.updateSettings(settings);
            return ResponseEntity.ok(updatedSettings);
        } catch (Exception e) {
            System.err.println("Error updating settings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
