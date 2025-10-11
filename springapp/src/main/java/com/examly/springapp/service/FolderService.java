package com.examly.springapp.service;

import com.examly.springapp.model.Folder;
import com.examly.springapp.repository.FolderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;

    public List<Folder> getAllFolders() {
        return folderRepository.findAll();
    }

    public Folder getFolderById(Long id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Folder not found"));
    }

    public Folder createFolder(Folder folder) {
        return folderRepository.save(folder);
    }

    public Folder updateFolder(Long id, Folder folder) {
        Folder existing = getFolderById(id);
        existing.setName(folder.getName());
        existing.setParentFolderId(folder.getParentFolderId());
        return folderRepository.save(existing);
    }

    public void deleteFolder(Long id) {
        if (!folderRepository.existsById(id)) {
            throw new EntityNotFoundException("Folder not found");
        }
        folderRepository.deleteById(id);
    }
}