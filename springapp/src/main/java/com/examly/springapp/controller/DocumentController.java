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

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public List<DocumentResponseDTO> getAllDocuments() {
        return documentService.getAllDocuments()
                .stream()
                .map(DocumentResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public DocumentResponseDTO getDocumentById(@PathVariable Long id) {
        return new DocumentResponseDTO(documentService.getDocumentById(id));
    }

    @PostMapping
    public ResponseEntity<?> createDocument(@RequestBody Document document) {
        try {
            Document created = documentService.createDocument(document);
            return ResponseEntity.status(HttpStatus.CREATED).body(new DocumentResponseDTO(created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid document data"));
        }
    }

    @PutMapping("/{id}")
    public DocumentResponseDTO updateDocument(@PathVariable Long id, @RequestBody Document document) {
        return new DocumentResponseDTO(documentService.updateDocument(id, document));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
    }
}
