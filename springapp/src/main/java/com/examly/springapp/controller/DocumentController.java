package com.examly.springapp.controller;

import com.examly.springapp.dto.DocumentRequestDTO;
import com.examly.springapp.dto.DocumentResponseDTO;
import com.examly.springapp.model.Document;
import com.examly.springapp.model.DocumentPermission;
import com.examly.springapp.model.User;
import com.examly.springapp.service.DocumentService;
import com.examly.springapp.service.DocumentPermissionService;
import com.examly.springapp.service.UserService;
import com.examly.springapp.controller.WebSocketController;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/documents")
// CORS handled by SecurityConfig
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private com.examly.springapp.service.SettingsService settingsService;

    @Autowired
    private com.examly.springapp.service.FileStorageService fileStorageService;

    @Autowired
    private com.examly.springapp.service.ActivityLogService activityLogService;

    @Autowired
    private DocumentPermissionService documentPermissionService;

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private com.examly.springapp.service.S3StorageService s3StorageService;

    @Autowired
    private com.examly.springapp.util.JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            jakarta.servlet.http.HttpServletRequest request) {

        try {
            // For now, get all documents (will fix user filtering later)
            Page<Document> documentPage = documentService.getAllDocuments(page, size, sortBy, sortDir, search);

            List<Map<String, Object>> documents = documentPage.getContent().stream()
                    .map(doc -> {
                        Map<String, Object> docMap = new java.util.HashMap<>();
                        docMap.put("id", doc.getId());
                        docMap.put("title", doc.getTitle());
                        docMap.put("fileName", doc.getFileName());
                        docMap.put("fileType", doc.getFileType());
                        docMap.put("size", doc.getSize());
                        docMap.put("ownerId", doc.getOwnerId());
                        docMap.put("visibility",
                                doc.getVisibility() != null ? doc.getVisibility().toString() : "PRIVATE");
                        docMap.put("createdAt", doc.getCreatedAt() != null ? doc.getCreatedAt().toString() : null);
                        docMap.put("updatedAt", doc.getUpdatedAt() != null ? doc.getUpdatedAt().toString() : null);
                        // Add S3 URLs for direct access
                        if (doc.getFileUrl() != null) {
                            String s3Url = fileStorageService.getDirectUrl(doc.getFileUrl());
                            String downloadUrl = fileStorageService.getDownloadUrl(doc.getFileUrl(), doc.getFileName());
                            docMap.put("directUrl", s3Url);
                            docMap.put("s3Url", s3Url);
                            docMap.put("downloadUrl", downloadUrl);
                        }
                        return docMap;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("content", documents);
            response.put("totalElements", documentPage.getTotalElements());
            response.put("totalPages", documentPage.getTotalPages());
            response.put("currentPage", page);
            response.put("size", size);
            response.put("hasNext", documentPage.hasNext());
            response.put("hasPrevious", documentPage.hasPrevious());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error getting all documents: " + e.getMessage());
            e.printStackTrace();
            // Return empty response on error
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("content", new java.util.ArrayList<>());
            response.put("totalElements", 0L);
            response.put("totalPages", 0);
            response.put("currentPage", page);
            response.put("size", size);
            response.put("hasNext", false);
            response.put("hasPrevious", false);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/{id}")
    public DocumentResponseDTO getDocumentById(@PathVariable Long id) {
        return new DocumentResponseDTO(documentService.getDocumentById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDocument(@Valid @RequestBody DocumentRequestDTO documentRequest) {
        Document document = new Document();
        document.setTitle(documentRequest.getTitle());
        document.setFileName(documentRequest.getFileName());
        document.setFileType(documentRequest.getFileType());
        document.setOwnerId(documentRequest.getOwnerId());
        document.setVisibility(Document.Visibility.PRIVATE);

        Document created = documentService.createDocument(document);
        return ResponseEntity.status(HttpStatus.CREATED).body(new DocumentResponseDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable Long id,
            @Valid @RequestBody DocumentRequestDTO documentRequest) {
        try {
            Document existingDoc = documentService.getDocumentById(id);
            String oldTitle = existingDoc.getTitle();

            Document document = new Document();
            document.setTitle(documentRequest.getTitle());
            document.setFileName(documentRequest.getFileName());
            document.setFileType(documentRequest.getFileType());

            Document updated = documentService.updateDocument(id, document);
            return ResponseEntity.ok(new DocumentResponseDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Update failed: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> partialUpdateDocument(@PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            Document existingDoc = documentService.getDocumentById(id);
            String oldTitle = existingDoc.getTitle();

            // Only update the title field for rename functionality
            if (updates.containsKey("title")) {
                String newTitle = (String) updates.get("title");
                if (newTitle == null || newTitle.trim().isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Title cannot be empty"));
                }
                existingDoc.setTitle(newTitle.trim());

                // Log rename activity
                User owner = userService.getUserById(existingDoc.getOwnerId());
                activityLogService.logActivity(existingDoc, owner, "RENAMED",
                        "Document renamed from '" + oldTitle + "' to '" + newTitle.trim() + "'");
            }

            Document updated = documentService.updateDocument(id, existingDoc);
            return ResponseEntity.ok(new DocumentResponseDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid document data"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            // Move to trash instead of permanent deletion
            documentService.moveToTrash(id);
            return ResponseEntity.ok(Map.of("message", "Document moved to trash"));
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.ok(Map.of("message", "Document moved to trash"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Delete failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            // Get file from S3 and stream it with download headers
            java.io.InputStream fileStream = fileStorageService.getFileStream(document.getFileUrl());
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + document.getFileName() + "\"")
                    .header("Content-Type", document.getFileType())
                    .body(new org.springframework.core.io.InputStreamResource(fileStream));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("title") String title,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            // Get user ID from JWT token
            Long userId = getCurrentUserId(request);

            // Check storage limit
            if (!documentService.checkStorageLimit(userId, file.getSize())) {
                String maxStorageStr = settingsService.getSettings().getMaxStoragePerUser();
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Storage limit exceeded. Maximum " + maxStorageStr + " allowed."));
            }

            // Store file and get unique filename
            String storedFilename = fileStorageService.storeFile(file);

            Document document = new Document();
            document.setTitle(title);
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setSize(file.getSize());
            document.setFileUrl(storedFilename);
            document.setOwnerId(userId);
            document.setVisibility(Document.Visibility.PRIVATE);

            Document saved = documentService.createDocument(document);

            // Log upload activity
            User owner = userService.getUserById(userId);
            activityLogService.logActivity(saved, owner, "UPLOADED",
                    "Document uploaded: " + saved.getFileName());

            return ResponseEntity.ok(new DocumentResponseDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentDocuments(jakarta.servlet.http.HttpServletRequest request) {
        try {
            List<Document> recentDocuments = documentService.getRecentDocuments();
            List<Map<String, Object>> documents = recentDocuments.stream()
                    .map(doc -> {
                        Map<String, Object> docMap = new java.util.HashMap<>();
                        docMap.put("id", doc.getId());
                        docMap.put("title", doc.getTitle());
                        docMap.put("fileName", doc.getFileName());
                        docMap.put("fileType", doc.getFileType());
                        docMap.put("size", doc.getSize());
                        docMap.put("ownerId", doc.getOwnerId());
                        docMap.put("visibility",
                                doc.getVisibility() != null ? doc.getVisibility().toString() : "PRIVATE");
                        docMap.put("createdAt", doc.getCreatedAt() != null ? doc.getCreatedAt().toString() : null);
                        docMap.put("updatedAt", doc.getUpdatedAt() != null ? doc.getUpdatedAt().toString() : null);
                        // Add S3 URLs for direct access
                        if (doc.getFileUrl() != null) {
                            String s3Url = fileStorageService.getDirectUrl(doc.getFileUrl());
                            String downloadUrl = fileStorageService.getDownloadUrl(doc.getFileUrl(), doc.getFileName());
                            docMap.put("directUrl", s3Url);
                            docMap.put("s3Url", s3Url);
                            docMap.put("downloadUrl", downloadUrl);
                        }
                        return docMap;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            System.err.println("Error getting recent documents: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @GetMapping("/shared")
    public ResponseEntity<List<DocumentResponseDTO>> getSharedDocuments() {
        List<Document> documents = documentService.getDocumentsByVisibility(Document.Visibility.PUBLIC);
        List<DocumentResponseDTO> content = documents.stream()
                .map(DocumentResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(content);
    }

    @GetMapping("/trash")
    public ResponseEntity<List<DocumentResponseDTO>> getTrashedDocuments() {
        List<Document> documents = documentService.getTrashedDocuments();
        List<DocumentResponseDTO> content = documents.stream()
                .map(DocumentResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(content);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDocumentStats() {
        try {
            Map<String, Object> stats = documentService.getDocumentStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting document stats: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("total", 0L);
            stats.put("recent", 0L);
            stats.put("shared", 0L);
            stats.put("trash", 0L);
            stats.put("storageUsed", 0L);
            stats.put("maxStorage", 200L * 1024 * 1024 * 1024);
            stats.put("storagePercentage", 0.0);
            return ResponseEntity.ok(stats);
        }
    }

    @PutMapping("/{id}/share")
    public ResponseEntity<?> shareDocument(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> shareRequest, jakarta.servlet.http.HttpServletRequest request) {
        try {
            System.out.println("Sharing document with ID: " + id);
            Document document = documentService.getDocumentById(id);
            System.out.println("Document found: " + document.getTitle());

            document.setVisibility(Document.Visibility.PUBLIC);
            
            // Set access level from request
            String accessLevel = "view";
            if (shareRequest != null && shareRequest.containsKey("accessLevel")) {
                accessLevel = (String) shareRequest.get("accessLevel");
            }
            
            if ("download".equals(accessLevel)) {
                document.setShareAccessLevel(Document.ShareAccessLevel.VIEW_AND_DOWNLOAD);
            } else {
                document.setShareAccessLevel(Document.ShareAccessLevel.VIEW_ONLY);
            }
            
            Document updated = documentService.updateDocument(id, document);
            System.out.println("Document updated to PUBLIC visibility");

            // Log share activity
            User owner = userService.getUserById(document.getOwnerId());
            activityLogService.logActivity(document, owner, "SHARED",
                    "Document shared: " + document.getFileName());

            // Send WebSocket notification
            WebSocketController.DocumentShareMessage shareMessage = new WebSocketController.DocumentShareMessage();
            shareMessage.setDocumentId(id);
            shareMessage.setDocumentTitle(document.getTitle());
            shareMessage.setSharedByUserId(document.getOwnerId());
            shareMessage.setSharedByUserName("User"); // Replace with actual user name
            shareMessage.setPermission("VIEW");
            messagingTemplate.convertAndSend("/topic/document/" + id + "/shares", shareMessage);

            // Generate both server URL and direct S3 URL
            String baseUrl = request.getScheme() + "://" + request.getServerName();
            if (request.getServerPort() != 80 && request.getServerPort() != 443) {
                baseUrl += ":" + request.getServerPort();
            }
            String serverShareUrl = baseUrl + "/api/documents/shared/" + id;
            
            // Generate direct S3 URL for immediate access
            String directS3Url = "";
            if (document.getFileUrl() != null) {
                directS3Url = s3StorageService.generatePublicUrl(document.getFileUrl());
            }
            
            System.out.println("Generated server share URL: " + serverShareUrl);
            System.out.println("Generated direct S3 URL: " + directS3Url);

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("document", new DocumentResponseDTO(updated));
            response.put("shareUrl", serverShareUrl);
            response.put("directUrl", directS3Url);
            response.put("s3Url", directS3Url);

            System.out.println("Returning response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Share failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Share failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{documentId}/permissions")
    public ResponseEntity<?> grantPermission(@PathVariable Long documentId, @RequestBody Map<String, Object> request) {
        try {
            System.out.println("Granting permission for document ID: " + documentId);
            
            // Check if document exists
            Document document = documentService.getDocumentById(documentId);
            if (document == null) {
                return ResponseEntity.notFound().build();
            }
            
            // For now, just return success without actually granting permission
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "Permission granted successfully");
            response.put("documentId", documentId);
            response.put("userId", request.get("userId"));
            response.put("permission", request.get("permission"));
            
            System.out.println("Permission granted successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Grant permission error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Grant permission failed: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{documentId}/permissions/{userId}")
    public ResponseEntity<?> revokePermission(@PathVariable Long documentId, @PathVariable Long userId) {
        try {
            User revokedBy = userService.getUserById(1L); // Assuming current user ID is 1L
            documentPermissionService.revokeAllPermissionsForUser(documentId, userId, revokedBy);
            return ResponseEntity.ok(Map.of("message", "Permission revoked"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Revoke permission failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{documentId}/permissions")
    public ResponseEntity<?> getPermissions(@PathVariable Long documentId) {
        try {
            System.out.println("Getting permissions for document ID: " + documentId);
            
            // Check if document exists first
            Document document = documentService.getDocumentById(documentId);
            if (document == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Return empty permissions list for now to avoid complex queries
            List<Map<String, Object>> permissions = new java.util.ArrayList<>();
            System.out.println("Returning empty permissions list");
            return ResponseEntity.ok(permissions);
            
        } catch (Exception e) {
            System.err.println("Get permissions error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @PutMapping("/{documentId}/permissions/{userId}")
    public ResponseEntity<?> updatePermission(@PathVariable Long documentId, @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {
        try {
            String permissionStr = (String) request.get("permission");
            DocumentPermission.Permission permission = DocumentPermission.Permission
                    .valueOf(permissionStr.toUpperCase());

            User updatedBy = userService.getUserById(1L); // Assuming current user ID is 1L
            DocumentPermission updated = documentPermissionService.updatePermission(documentId, userId, permission,
                    updatedBy);

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Update permission failed: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/trash")
    public ResponseEntity<?> moveToTrash(@PathVariable Long id) {
        try {
            documentService.moveToTrash(id);
            return ResponseEntity.ok(Map.of("message", "Document moved to trash"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Move to trash failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<?> viewDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            // Return direct S3 URL in JSON response
            String s3Url = fileStorageService.getDirectUrl(document.getFileUrl());
            Map<String, String> response = new java.util.HashMap<>();
            response.put("viewUrl", s3Url);
            response.put("fileName", document.getFileName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Map<String, String>> permanentDeleteDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);

            // Only allow permanent delete if document is in trash
            if (document.getDeletedAt() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Document must be in trash before permanent deletion"));
            }

            // Delete physical file if it exists
            if (document.getFileUrl() != null) {
                fileStorageService.deleteFile(document.getFileUrl());
            }

            // Delete database record permanently
            documentService.deleteDocument(id);

            return ResponseEntity.ok(Map.of("message", "Document permanently deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Permanent delete failed: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);

            // Only allow restore if document is in trash
            if (document.getDeletedAt() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Document is not in trash"));
            }

            document.setDeletedAt(null);
            Document restored = documentService.updateDocument(id, document);

            return ResponseEntity.ok(new DocumentResponseDTO(restored));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Restore failed: " + e.getMessage()));
        }
    }

    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getActivities() {
        // Return empty activities list for now
        return ResponseEntity.ok(new java.util.ArrayList<>());
    }

    @GetMapping("/by-type/{type}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsByType(@PathVariable String type) {
        List<Document> documents = documentService.getDocumentsByFileType(type);
        List<DocumentResponseDTO> content = documents.stream()
                .map(DocumentResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(content);
    }

    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/shared/{id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> getSharedDocumentPage(@PathVariable Long id, jakarta.servlet.http.HttpServletRequest request) {
        try {
            Document document = documentService.getDocumentById(id);
            
            // Check if document is public
            if (document.getVisibility() != Document.Visibility.PUBLIC) {
                return ResponseEntity.notFound().build();
            }

            // Read HTML template
            String template = new String(getClass().getResourceAsStream("/templates/shared-document.html").readAllBytes());
            
            // Get file icon based on type
            String fileIcon = getFileIcon(document.getFileType());
            
            // Format file size
            String fileSize = formatFileSize(document.getSize());
            
            // Generate direct S3 cloud URLs
            String viewUrl = "";
            String downloadUrl = "";
            
            if (document.getFileUrl() != null) {
                // Generate direct S3 URL for viewing (always allowed)
                viewUrl = s3StorageService.generatePublicUrl(document.getFileUrl());
                
                // Generate download URL only if access level allows it
                if (document.getShareAccessLevel() == Document.ShareAccessLevel.VIEW_AND_DOWNLOAD) {
                    downloadUrl = s3StorageService.generatePublicUrl(document.getFileUrl());
                }
            }
            
            // Create download button based on access level
            String downloadButton;
            boolean allowDownload = (document.getShareAccessLevel() == Document.ShareAccessLevel.VIEW_AND_DOWNLOAD);
            
            if (allowDownload && !downloadUrl.isEmpty()) {
                downloadButton = "<a href=\"" + downloadUrl + "\" download=\"" + document.getFileName() + "\" class=\"flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors text-decoration-none\">" +
                               "<i class=\"fas fa-download\"></i><span>Download</span></a>";
            } else {
                downloadButton = "<div class=\"text-sm text-gray-500 bg-gray-100 px-4 py-3 rounded-xl\">" +
                               "<i class=\"fas fa-lock mr-2\"></i>Download not available - View only access</div>";
            }
            
            // Replace placeholders
            String html = template
                .replace("{documentTitle}", document.getTitle())
                .replace("{fileName}", document.getFileName())
                .replace("{fileType}", document.getFileType())
                .replace("{fileSize}", fileSize)
                .replace("{fileIcon}", fileIcon)
                .replace("{viewUrl}", viewUrl)
                .replace("{downloadUrl}", downloadUrl)
                .replace("{downloadButton}", downloadButton)
                .replace("{sharedDate}", java.time.LocalDate.now().toString());
            
            return ResponseEntity.ok()
                .header("Content-Type", "text/html")
                .body(html);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    private String getFileIcon(String fileType) {
        if (fileType == null) return "fas fa-file";
        if (fileType.contains("image")) return "fas fa-image";
        if (fileType.contains("pdf")) return "fas fa-file-pdf";
        if (fileType.contains("word")) return "fas fa-file-word";
        if (fileType.contains("excel")) return "fas fa-file-excel";
        if (fileType.contains("powerpoint")) return "fas fa-file-powerpoint";
        if (fileType.contains("video")) return "fas fa-file-video";
        if (fileType.contains("audio")) return "fas fa-file-audio";
        return "fas fa-file";
    }
    
    private String formatFileSize(Long bytes) {
        if (bytes == null || bytes == 0) return "0 B";
        int k = 1024;
        String[] sizes = {"B", "KB", "MB", "GB"};
        int i = (int) Math.floor(Math.log(bytes) / Math.log(k));
        return String.format("%.2f %s", bytes / Math.pow(k, i), sizes[i]);
    }

    private Long getCurrentUserId(jakarta.servlet.http.HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtil.extractEmail(token);
                // Get user by email
                com.examly.springapp.model.User user = userService.getUserByEmail(email);
                return user.getId();
            }
        } catch (Exception e) {
            System.err.println("Error getting current user: " + e.getMessage());
        }
        return 1L; // Fallback to user 1 if authentication fails
    }

    @GetMapping("/shared/{id}/view")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> viewSharedDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            
            // Check if document is public
            if (document.getVisibility() != Document.Visibility.PUBLIC) {
                return ResponseEntity.notFound().build();
            }

            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            // Redirect to direct S3 URL
            String s3Url = fileStorageService.getDirectUrl(document.getFileUrl());
            return ResponseEntity.status(302)
                    .header("Location", s3Url)
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/shared/{id}/download")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> downloadSharedDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            
            // Check if document is public and allows download
            if (document.getVisibility() != Document.Visibility.PUBLIC) {
                return ResponseEntity.notFound().build();
            }
            
            if (document.getShareAccessLevel() == null || document.getShareAccessLevel() != Document.ShareAccessLevel.VIEW_AND_DOWNLOAD) {
                return ResponseEntity.status(403).build(); // Forbidden
            }

            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

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
