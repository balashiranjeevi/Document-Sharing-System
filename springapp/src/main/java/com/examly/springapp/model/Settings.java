package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "settings")
public class Settings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "max_storage_per_user")
    private String maxStoragePerUser = "200 MB";

    @NotNull
    @Column(name = "auto_delete_trash_after")
    private Integer autoDeleteTrashAfter = 7;

    @NotNull
    @Column(name = "require_email_verification")
    private Boolean requireEmailVerification = true;

    @NotNull
    @Column(name = "enable_two_factor_auth")
    private Boolean enableTwoFactorAuth = true;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaxStoragePerUser() {
        return maxStoragePerUser;
    }

    public void setMaxStoragePerUser(String maxStoragePerUser) {
        this.maxStoragePerUser = maxStoragePerUser;
    }

    public Integer getAutoDeleteTrashAfter() {
        return autoDeleteTrashAfter;
    }

    public void setAutoDeleteTrashAfter(Integer autoDeleteTrashAfter) {
        this.autoDeleteTrashAfter = autoDeleteTrashAfter;
    }

    public Boolean getRequireEmailVerification() {
        return requireEmailVerification;
    }

    public void setRequireEmailVerification(Boolean requireEmailVerification) {
        this.requireEmailVerification = requireEmailVerification;
    }

    public Boolean getEnableTwoFactorAuth() {
        return enableTwoFactorAuth;
    }

    public void setEnableTwoFactorAuth(Boolean enableTwoFactorAuth) {
        this.enableTwoFactorAuth = enableTwoFactorAuth;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
