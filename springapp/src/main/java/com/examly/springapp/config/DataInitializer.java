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
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = new User();
            admin.setName("admin");
            admin.setEmail("admin@example.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);

            // Create regular user
            User user = new User();
            user.setName("user");
            user.setEmail("user@example.com");
            user.setPasswordHash(passwordEncoder.encode("user123"));
            user.setRole(User.Role.USER);
            userRepository.save(user);
        }

        if (documentRepository.count() == 0) {
            // Create sample documents
            Document doc1 = new Document();
            doc1.setTitle("Project Proposal.pdf");
            doc1.setFileName("project-proposal.pdf");
            doc1.setFileType("application/pdf");
            doc1.setSize(2048576L);
            doc1.setOwnerId(1L);
            doc1.setVisibility(Document.Visibility.PRIVATE);
            documentRepository.save(doc1);

            Document doc2 = new Document();
            doc2.setTitle("Meeting Notes.docx");
            doc2.setFileName("meeting-notes.docx");
            doc2.setFileType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            doc2.setSize(1024000L);
            doc2.setOwnerId(2L);
            doc2.setVisibility(Document.Visibility.PUBLIC);
            documentRepository.save(doc2);

            Document doc3 = new Document();
            doc3.setTitle("Budget Report.xlsx");
            doc3.setFileName("budget-report.xlsx");
            doc3.setFileType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            doc3.setSize(3072000L);
            doc3.setOwnerId(1L);
            doc3.setVisibility(Document.Visibility.PRIVATE);
            documentRepository.save(doc3);
        }
    }
}