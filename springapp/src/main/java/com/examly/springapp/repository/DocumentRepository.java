package com.examly.springapp.repository;

import com.examly.springapp.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    List<Document> findByVisibility(Document.Visibility visibility);

    List<Document> findByVisibilityAndDeletedAtIsNull(Document.Visibility visibility);

    List<Document> findByDeletedAtIsNotNull();

    @Query("SELECT d FROM Document d WHERE d.deletedAt IS NULL")
    List<Document> findAllActiveDocuments();

    List<Document> findByDeletedAtIsNull();

    Page<Document> findByDeletedAtIsNull(Pageable pageable);

    Page<Document> findByTitleContainingIgnoreCaseAndDeletedAtIsNull(String title, Pageable pageable);

    Page<Document> findByOwnerIdAndDeletedAtIsNull(Long ownerId, Pageable pageable);

    Page<Document> findByOwnerIdAndTitleContainingIgnoreCaseAndDeletedAtIsNull(Long ownerId, String title, Pageable pageable);

    long countByCreatedAtAfter(java.time.LocalDateTime date);

    long countByCreatedAtAfterAndDeletedAtIsNull(java.time.LocalDateTime date);

    long countByVisibility(Document.Visibility visibility);

    long countByVisibilityAndDeletedAtIsNull(Document.Visibility visibility);

    long countByDeletedAtIsNotNull();

    long countByDeletedAtIsNull();

    long countByFileTypeContainingIgnoreCaseAndDeletedAtIsNull(String fileType);

    List<Document> findByDeletedAtBefore(java.time.LocalDateTime date);

    List<Document> findByFileTypeContainingIgnoreCaseAndDeletedAtIsNull(String fileType);

    @Query("SELECT COALESCE(SUM(COALESCE(d.size, 0)), 0) FROM Document d WHERE d.ownerId = :ownerId AND d.deletedAt IS NULL")
    long getTotalStorageByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT COALESCE(SUM(COALESCE(d.size, 0)), 0) FROM Document d WHERE d.deletedAt IS NULL")
    long getTotalStorage();

    List<Document> findByCreatedAtAfterAndDeletedAtIsNull(java.time.LocalDateTime date);

    List<Document> findByOwnerIdAndCreatedAtAfterAndDeletedAtIsNull(Long ownerId, java.time.LocalDateTime date);

    boolean existsByFileUrlContaining(String fileName);
}
