package com.examly.springapp.service;

import com.examly.springapp.model.Document;
import com.examly.springapp.repository.DocumentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Page<Document> getAllDocuments(Pageable pageable) {
        return documentRepository.findAll(pageable);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
    }

    public Document createDocument(Document document) {
        return documentRepository.save(document);
    }

    public Document updateDocument(Long id, Document updatedDoc) {
        Document existingDoc = getDocumentById(id);
        if (updatedDoc.getTitle() != null) existingDoc.setTitle(updatedDoc.getTitle());
        if (updatedDoc.getFileType() != null) existingDoc.setFileType(updatedDoc.getFileType());
        if (updatedDoc.getFileUrl() != null) existingDoc.setFileUrl(updatedDoc.getFileUrl());
        if (updatedDoc.getSize() != null) existingDoc.setSize(updatedDoc.getSize());
        if (updatedDoc.getVisibility() != null) existingDoc.setVisibility(updatedDoc.getVisibility());
        if (updatedDoc.getParentFolderId() != null) existingDoc.setParentFolderId(updatedDoc.getParentFolderId());
        return documentRepository.save(existingDoc);
    }

    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new EntityNotFoundException("Document not found");
        }
        documentRepository.deleteById(id);
    }

    public List<Document> getDocumentsByOwner(Long ownerId) {
        return documentRepository.findByOwnerId(ownerId);
    }

    public List<Document> getDocumentsByParentFolder(Long parentFolderId) {
        return documentRepository.findByParentFolderId(parentFolderId);
    }
}
