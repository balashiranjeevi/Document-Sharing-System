package com.examly.springapp.repository;

import com.examly.springapp.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwnerId(Long ownerId);
    List<Folder> findByParentFolderId(Long parentFolderId);
}