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
@CrossOrigin(origins = "*", allowedHeaders = "*")
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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        try {
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
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            java.nio.file.Path filePath = fileStorageService.getFilePath(document.getFileUrl());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists() && resource.isReadable()) {

                return ResponseEntity.ok()
                        .header("Content-Disposition", "attachment; filename=\"" + document.getFileName() + "\"")
                        .header("Content-Type", document.getFileType())
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("title") String title) {
        try {
            Long userId = 1L; // Get from authentication context in real app

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
    public ResponseEntity<List<Map<String, Object>>> getRecentDocuments() {
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
    public ResponseEntity<?> shareDocument(@PathVariable Long id, jakarta.servlet.http.HttpServletRequest request) {
        try {
            System.out.println("Sharing document with ID: " + id);
            Document document = documentService.getDocumentById(id);
            System.out.println("Document found: " + document.getTitle());

            document.setVisibility(Document.Visibility.PUBLIC);
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

            // Generate proper share URL
            String baseUrl = request.getScheme() + "://" + request.getServerName();
            if (request.getServerPort() != 80 && request.getServerPort() != 443) {
                baseUrl += ":" + request.getServerPort();
            }
            String shareUrl = baseUrl + "/api/documents/shared/" + id;
            System.out.println("Generated share URL: " + shareUrl);

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("document", new DocumentResponseDTO(updated));
            response.put("shareUrl", shareUrl);

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
            Long userId = Long.valueOf(request.get("userId").toString());
            String permissionStr = (String) request.get("permission");
            DocumentPermission.Permission permission = DocumentPermission.Permission
                    .valueOf(permissionStr.toUpperCase());

            Document document = documentService.getDocumentById(documentId);
            User user = userService.getUserById(userId);
            User grantedBy = userService.getUserById(document.getOwnerId()); // Assuming owner grants

            DocumentPermission documentPermission = documentPermissionService.grantPermission(document, user,
                    permission, grantedBy);

            // Send WebSocket notification
            WebSocketController.DocumentShareMessage shareMessage = new WebSocketController.DocumentShareMessage();
            shareMessage.setDocumentId(documentId);
            shareMessage.setDocumentTitle(document.getTitle());
            shareMessage.setSharedByUserId(document.getOwnerId());
            shareMessage.setSharedByUserName("User"); // Replace with actual user name
            shareMessage.setPermission(permissionStr);
            messagingTemplate.convertAndSend("/topic/document/" + documentId + "/shares", shareMessage);

            return ResponseEntity.ok(documentPermission);
        } catch (Exception e) {
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
            List<DocumentPermission> permissions = documentPermissionService.getPermissionsForDocument(documentId);
            return ResponseEntity.ok(permissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Get permissions failed: " + e.getMessage()));
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
    public ResponseEntity<org.springframework.core.io.Resource> viewDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            if (document.getFileUrl() == null) {
                return ResponseEntity.notFound().build();
            }

            java.nio.file.Path filePath = fileStorageService.getFilePath(document.getFileUrl());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists() && resource.isReadable()) {

                return ResponseEntity.ok()
                        .header("Content-Type", document.getFileType())
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
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
    public ResponseEntity<org.springframework.core.io.Resource> getSharedDocument(@PathVariable Long id) {
        try {
            System.out.println("Accessing shared document with ID: " + id);
            Document document = documentService.getDocumentById(id);
            System.out.println("Document visibility: " + document.getVisibility());

            // Check if document is public
            if (document.getVisibility() != Document.Visibility.PUBLIC) {
                System.out.println("Document is not public, returning 404");
                return ResponseEntity.notFound().build();
            }

            if (document.getFileUrl() == null) {
                System.out.println("Document file URL is null, returning 404");
                return ResponseEntity.notFound().build();
            }

            java.nio.file.Path filePath = fileStorageService.getFilePath(document.getFileUrl());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                System.out.println("Serving shared document: " + document.getFileName());

                return ResponseEntity.ok()
                        .header("Content-Type", document.getFileType())
                        .header("Content-Disposition", "inline; filename=\"" + document.getFileName() + "\"")
                        .body(resource);
            } else {
                System.out.println("File does not exist or is not readable");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error accessing shared document: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
