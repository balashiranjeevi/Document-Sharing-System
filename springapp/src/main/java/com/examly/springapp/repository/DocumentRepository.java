package com.examly.springapp.repository;

import com.examly.springapp.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwnerId(Long ownerId);

    List<Document> findByParentFolderId(Long parentFolderId);
    List<Document> findByTitleContainingIgnoreCase(String title);
    Page<Document> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    List<Document> findByFileNameContainingIgnoreCase(String fileName);
}
