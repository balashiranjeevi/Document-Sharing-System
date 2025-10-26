package com.examly.springapp.dto;

import java.time.LocalDateTime;

public class DocumentPermissionDTO {
    private Long id;
    private Long documentId;
    private Long userId;
    private String username;
    private String email;
    private String permission;
    private Long grantedById;
    private String grantedByUsername;
    private LocalDateTime grantedAt;
    private LocalDateTime expiresAt;

    public DocumentPermissionDTO() {
    }

    public DocumentPermissionDTO(Long id, Long documentId, Long userId, String username, String email,
            String permission, Long grantedById, String grantedByUsername,
            LocalDateTime grantedAt, LocalDateTime expiresAt) {
        this.id = id;
        this.documentId = documentId;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.permission = permission;
        this.grantedById = grantedById;
        this.grantedByUsername = grantedByUsername;
        this.grantedAt = grantedAt;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public Long getGrantedById() {
        return grantedById;
    }

    public void setGrantedById(Long grantedById) {
        this.grantedById = grantedById;
    }

    public String getGrantedByUsername() {
        return grantedByUsername;
    }

    public void setGrantedByUsername(String grantedByUsername) {
        this.grantedByUsername = grantedByUsername;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
