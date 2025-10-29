package com.examly.springapp.config;

import com.examly.springapp.model.Document;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.DocumentRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize users if database is empty
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setStatus("ACTIVE");
            userRepository.save(admin);
            
            User user1 = new User();
            user1.setName("John Doe");
            user1.setEmail("john@example.com");
            user1.setPasswordHash(passwordEncoder.encode("user123"));
            user1.setRole(User.Role.USER);
            user1.setStatus("ACTIVE");
            userRepository.save(user1);
            
            System.out.println("Sample users initialized successfully!");
        }
        
        // Initialize with some sample data if database is empty
        if (documentRepository.count() == 0) {
            Document doc1 = new Document();
            doc1.setTitle("Sample Document 1");
            doc1.setFileName("sample1.pdf");
            doc1.setFileType("application/pdf");
            doc1.setOwnerId(1L);
            doc1.setSize(1024L);
            doc1.setVisibility(Document.Visibility.PRIVATE);
            documentRepository.save(doc1);

            Document doc2 = new Document();
            doc2.setTitle("Sample Document 2");
            doc2.setFileName("sample2.docx");
            doc2.setFileType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            doc2.setOwnerId(1L);
            doc2.setSize(2048L);
            doc2.setVisibility(Document.Visibility.PUBLIC);
            documentRepository.save(doc2);

            System.out.println("Sample documents initialized successfully!");
        }
    }
}