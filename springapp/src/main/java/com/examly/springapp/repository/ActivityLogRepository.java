package com.examly.springapp.repository;

import com.examly.springapp.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByDocumentIdOrderByTimestampDesc(Long documentId);

    List<ActivityLog> findByUserIdOrderByTimestampDesc(Long userId);

    @Query("SELECT al FROM ActivityLog al WHERE al.document.id = :documentId ORDER BY al.timestamp DESC")
    List<ActivityLog> findByDocumentId(@Param("documentId") Long documentId);

    @Query("SELECT al FROM ActivityLog al WHERE al.user.id = :userId ORDER BY al.timestamp DESC LIMIT 50")
    List<ActivityLog> findRecentByUserId(@Param("userId") Long userId);

    @Query("SELECT al FROM ActivityLog al ORDER BY al.timestamp DESC LIMIT 100")
    List<ActivityLog> findRecentActivities();
}
