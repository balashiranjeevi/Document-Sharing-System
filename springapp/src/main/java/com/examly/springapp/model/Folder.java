package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "folders")
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Folder name is required")
    private String name;
    
    @NotNull(message = "Owner ID is required")
    private Long ownerId;
    private Long parentFolderId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Long getParentFolderId() {
        return parentFolderId;
    }

    public void setParentFolderId(Long parentFolderId) {
        this.parentFolderId = parentFolderId;
    }
}