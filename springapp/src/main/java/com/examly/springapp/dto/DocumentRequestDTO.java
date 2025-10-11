package com.examly.springapp.dto;

import com.examly.springapp.model.Document;

public class DocumentRequestDTO {
    private Long ownerId;
    private String name;
    private String fileType;
    private String fileUrl;
    private Long size;
    private Document.Visibility visibility;
    private Long parentFolderId;

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }
    public Document.Visibility getVisibility() { return visibility; }
    public void setVisibility(Document.Visibility visibility) { this.visibility = visibility; }
    public Long getParentFolderId() { return parentFolderId; }
    public void setParentFolderId(Long parentFolderId) { this.parentFolderId = parentFolderId; }
}
