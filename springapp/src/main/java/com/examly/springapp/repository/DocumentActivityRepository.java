package com.examly.springapp.repository;

import com.examly.springapp.model.DocumentActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentActivityRepository extends JpaRepository<DocumentActivity, Long> {
    List<DocumentActivity> findByDocumentIdOrderByTimestampDesc(Long documentId);
    List<DocumentActivity> findByUserIdOrderByTimestampDesc(Long userId);
}