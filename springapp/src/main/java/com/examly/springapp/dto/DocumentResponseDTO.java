package com.examly.springapp.dto;

import com.examly.springapp.model.Document;

public class DocumentResponseDTO {
    private Long id;
    private Long ownerId;
    private String name;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private String directUrl; // Direct S3 URL for cloud access
    private Long size;
    private Document.Visibility visibility;
    private Long parentFolderId;
    private String createdAt;
    private Long fileSize;
    private UserResponseDTO owner;

    public DocumentResponseDTO() {}

    public DocumentResponseDTO(Document doc) {
        this.id = doc.getId();
        this.ownerId = doc.getOwnerId();
        this.name = doc.getTitle();
        this.fileName = doc.getFileName();
        this.fileType = doc.getFileType();
        this.fileUrl = doc.getFileUrl();
        // Always generate direct S3 URL - cloud only
        if (doc.getFileUrl() != null) {
            if (doc.getFileUrl().startsWith("http")) {
                this.directUrl = doc.getFileUrl();
            } else {
                this.directUrl = String.format("https://document-sharing-system.s3.ap-south-1.amazonaws.com/%s", doc.getFileUrl());
            }
        }
        this.size = doc.getSize();
        this.fileSize = doc.getSize();
        this.visibility = doc.getVisibility();
        this.parentFolderId = doc.getParentFolderId();
        this.createdAt = "2024-01-15";
        this.owner = new UserResponseDTO();
        this.owner.setUsername("user");
    }

    public String getTitle() {
        return name;
    }

    public void setTitle(String title) {
        this.name = title;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public Document.Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Document.Visibility visibility) {
        this.visibility = visibility;
    }

    public Long getParentFolderId() {
        return parentFolderId;
    }

    public void setParentFolderId(Long parentFolderId) {
        this.parentFolderId = parentFolderId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public UserResponseDTO getOwner() {
        return owner;
    }

    public void setOwner(UserResponseDTO owner) {
        this.owner = owner;
    }

    public String getDirectUrl() {
        return directUrl;
    }

    public void setDirectUrl(String directUrl) {
        this.directUrl = directUrl;
    }
}