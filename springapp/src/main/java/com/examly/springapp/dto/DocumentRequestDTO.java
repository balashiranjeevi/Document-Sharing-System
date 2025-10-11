package com.examly.springapp.dto;

import com.examly.springapp.model.Document;
import lombok.Data;

@Data
public class DocumentRequestDTO {
    private Long ownerId;
    private String name;
    private String fileType;
    private String fileUrl;
    private Long size;
    private Document.Visibility visibility;
    private Long parentFolderId;
}
