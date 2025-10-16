package com.examly.springapp.controller;

import com.examly.springapp.repository.DocumentRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepository.count();
        long totalDocuments = documentRepository.count();
        
        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalDocuments", totalDocuments,
            "totalStorage", "12.4 GB",
            "activeUsers", totalUsers
        ));
    }
}