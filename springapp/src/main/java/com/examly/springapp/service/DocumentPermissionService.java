package com.examly.springapp.service;

import com.examly.springapp.model.Document;
import com.examly.springapp.model.DocumentPermission;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.DocumentPermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentPermissionService {

    @Autowired
    private DocumentPermissionRepository permissionRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public List<DocumentPermission> getPermissionsForDocument(Long documentId) {
        return permissionRepository.findByDocumentId(documentId);
    }

    public List<DocumentPermission> getPermissionsForUser(Long userId) {
        return permissionRepository.findByUserId(userId);
    }

    public List<DocumentPermission> getActivePermissionsForDocument(Long documentId) {
        return permissionRepository.findActivePermissionsByDocument(documentId);
    }

    public boolean hasPermission(Long documentId, Long userId, DocumentPermission.Permission permission) {
        List<DocumentPermission> permissions = permissionRepository.findActivePermissionsByDocumentAndUser(documentId,
                userId);
        return permissions.stream().anyMatch(p -> p.getPermission() == permission);
    }

    public boolean hasViewPermission(Long documentId, Long userId) {
        return hasPermission(documentId, userId, DocumentPermission.Permission.VIEW);
    }

    public boolean hasEditPermission(Long documentId, Long userId) {
        return hasPermission(documentId, userId, DocumentPermission.Permission.EDIT);
    }

    public boolean hasDownloadPermission(Long documentId, Long userId) {
        return hasPermission(documentId, userId, DocumentPermission.Permission.DOWNLOAD);
    }

    @Transactional
    public DocumentPermission grantPermission(Document document, User user, DocumentPermission.Permission permission,
            User grantedBy) {
        // Check if permission already exists
        Optional<DocumentPermission> existing = permissionRepository.findByDocumentIdAndUserIdAndPermission(
                document.getId(), user.getId(), permission);

        if (existing.isPresent()) {
            // Update expiration if needed
            DocumentPermission perm = existing.get();
            perm.setExpiresAt(null); // Remove expiration
            return permissionRepository.save(perm);
        }

        // Create new permission
        DocumentPermission newPermission = new DocumentPermission();
        newPermission.setDocument(document);
        newPermission.setUser(user);
        newPermission.setPermission(permission);
        newPermission.setGrantedBy(grantedBy);

        DocumentPermission saved = permissionRepository.save(newPermission);

        // Log activity
        activityLogService.logActivity(document, grantedBy, "SHARE",
                "Granted " + permission + " permission to " + user.getName());

        return saved;
    }

    @Transactional
    public void revokePermission(Long documentId, Long userId, DocumentPermission.Permission permission,
            User revokedBy) {
        Optional<DocumentPermission> permissionOpt = permissionRepository.findByDocumentIdAndUserIdAndPermission(
                documentId, userId, permission);

        if (permissionOpt.isPresent()) {
            permissionRepository.delete(permissionOpt.get());

            // Log activity
            activityLogService.logActivity(permissionOpt.get().getDocument(), revokedBy, "REVOKE_SHARE",
                    "Revoked " + permission + " permission from user ID: " + userId);
        }
    }

    @Transactional
    public void revokeAllPermissionsForDocument(Long documentId, User revokedBy) {
        List<DocumentPermission> permissions = permissionRepository.findByDocumentId(documentId);
        permissionRepository.deleteByDocumentId(documentId);

        // Log activity
        activityLogService.logActivity(null, revokedBy, "REVOKE_ALL_SHARES",
                "Revoked all permissions for document ID: " + documentId);
    }

    @Transactional
    public void revokeAllPermissionsForUser(Long documentId, Long userId, User revokedBy) {
        permissionRepository.deleteByDocumentIdAndUserId(documentId, userId);

        // Log activity
        activityLogService.logActivity(null, revokedBy, "REVOKE_USER_SHARES",
                "Revoked all permissions for user ID: " + userId + " on document ID: " + documentId);
    }

    public List<DocumentPermission> getSharedDocumentsForUser(Long userId) {
        return permissionRepository.findByUserId(userId);
    }
}
