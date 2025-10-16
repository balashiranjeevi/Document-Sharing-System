package com.examly.springapp.controller;

import com.examly.springapp.dto.DocumentRequestDTO;
import com.examly.springapp.dto.DocumentResponseDTO;
import com.examly.springapp.model.Document;
import com.examly.springapp.service.DocumentService;
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
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDocuments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {
        
        Page<Document> documents = documentService.getAllDocuments(page, size, sortBy, sortDir, search);
        List<DocumentResponseDTO> content = documents.getContent().stream()
            .map(DocumentResponseDTO::new)
            .collect(Collectors.toList());
        
        Map<String, Object> response = Map.of(
            "content", content,
            "totalElements", documents.getTotalElements(),
            "totalPages", documents.getTotalPages(),
            "currentPage", documents.getNumber(),
            "size", documents.getSize(),
            "hasNext", documents.hasNext(),
            "hasPrevious", documents.hasPrevious()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public DocumentResponseDTO getDocumentById(@PathVariable Long id) {
        return new DocumentResponseDTO(documentService.getDocumentById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDocument(@Valid @RequestBody DocumentRequestDTO documentRequest) {
        try {
            Document document = new Document();
            document.setTitle(documentRequest.getTitle());
            document.setFileName(documentRequest.getFileName());
            document.setFileType(documentRequest.getFileType());
            document.setOwnerId(documentRequest.getOwnerId());
            document.setVisibility(Document.Visibility.PRIVATE);
            
            Document created = documentService.createDocument(document);
            return ResponseEntity.status(HttpStatus.CREATED).body(new DocumentResponseDTO(created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid document data: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable Long id, @Valid @RequestBody DocumentRequestDTO documentRequest) {
        try {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<String> downloadDocument(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=\"" + document.getFileName() + "\"")
            .body("File content for: " + document.getFileName());
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponseDTO> uploadDocument(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("title") String title) {
        try {
            Document document = new Document();
            document.setTitle(title);
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setSize(file.getSize());
            document.setOwnerId(1L);
            document.setVisibility(Document.Visibility.PRIVATE);
            
            Document saved = documentService.createDocument(document);
            return ResponseEntity.ok(new DocumentResponseDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
