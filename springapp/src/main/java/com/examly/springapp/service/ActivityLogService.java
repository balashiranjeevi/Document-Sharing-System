package com.examly.springapp.service;

import com.examly.springapp.model.ActivityLog;
import com.examly.springapp.model.Document;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logActivity(Document document, User user, String action, String details) {
        ActivityLog log = new ActivityLog();
        log.setDocument(document);
        log.setUser(user);
        log.setAction(action);
        log.setDetails(details);
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getDocumentActivity(Long documentId) {
        return activityLogRepository.findByDocumentIdOrderByTimestampDesc(documentId);
    }

    public List<ActivityLog> getUserActivity(Long userId) {
        return activityLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findRecentActivities();
    }

    public List<ActivityLog> getRecentUserActivities(Long userId) {
        return activityLogRepository.findRecentByUserId(userId);
    }
}
