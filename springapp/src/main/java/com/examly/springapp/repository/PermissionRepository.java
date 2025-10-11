package com.examly.springapp.repository;

import com.examly.springapp.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByUserId(Long userId);
    List<Permission> findByDocumentId(Long documentId);
    List<Permission> findByFolderId(Long folderId);
}