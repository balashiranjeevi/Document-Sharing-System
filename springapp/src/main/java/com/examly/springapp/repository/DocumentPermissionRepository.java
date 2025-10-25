package com.examly.springapp.repository;

import com.examly.springapp.model.DocumentPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentPermissionRepository extends JpaRepository<DocumentPermission, Long> {

    List<DocumentPermission> findByDocumentId(Long documentId);

    List<DocumentPermission> findByUserId(Long userId);

    List<DocumentPermission> findByDocumentIdAndUserId(Long documentId, Long userId);

    Optional<DocumentPermission> findByDocumentIdAndUserIdAndPermission(Long documentId, Long userId, DocumentPermission.Permission permission);

    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId AND dp.user.id = :userId AND (dp.expiresAt IS NULL OR dp.expiresAt > CURRENT_TIMESTAMP)")
    List<DocumentPermission> findActivePermissionsByDocumentAndUser(@Param("documentId") Long documentId, @Param("userId") Long userId);

    @Query("SELECT dp FROM DocumentPermission dp WHERE dp.document.id = :documentId AND (dp.expiresAt IS NULL OR dp.expiresAt > CURRENT_TIMESTAMP)")
    List<DocumentPermission> findActivePermissionsByDocument(@Param("documentId") Long documentId);

    void deleteByDocumentId(Long documentId);

    void deleteByDocumentIdAndUserId(Long documentId, Long userId);
}
