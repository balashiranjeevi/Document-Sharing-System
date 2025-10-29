package com.examly.springapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "document_permissions")
public class DocumentPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Permission permission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "granted_by", nullable = false)
    private User grantedBy;

    @Column(nullable = false)
    private java.time.LocalDateTime grantedAt;

    private java.time.LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        grantedAt = java.time.LocalDateTime.now();
    }

    public enum Permission {
        VIEW, EDIT, DOWNLOAD
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public User getGrantedBy() {
        return grantedBy;
    }

    public void setGrantedBy(User grantedBy) {
        this.grantedBy = grantedBy;
    }

    public java.time.LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(java.time.LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }

    public java.time.LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(java.time.LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
