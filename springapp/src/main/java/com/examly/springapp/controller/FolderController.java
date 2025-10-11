package com.examly.springapp.controller;

import com.examly.springapp.model.Folder;
import com.examly.springapp.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    @Autowired
    private FolderService folderService;

    @GetMapping
    public List<Folder> getAllFolders() {
        return folderService.getAllFolders();
    }

    @GetMapping("/{id}")
    public Folder getFolderById(@PathVariable Long id) {
        return folderService.getFolderById(id);
    }

    @PostMapping
    public ResponseEntity<?> createFolder(@RequestBody @Valid Folder folder) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(folderService.createFolder(folder));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid folder data"));
        }
    }

    @PutMapping("/{id}")
    public Folder updateFolder(@PathVariable Long id, @RequestBody Folder folder) {
        return folderService.updateFolder(id, folder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFolder(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.ok(Map.of("message", "Folder deleted successfully"));
    }
}