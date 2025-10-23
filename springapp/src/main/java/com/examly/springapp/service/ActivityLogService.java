package com.examly.springapp.service;

import com.examly.springapp.model.DocumentActivity;
import com.examly.springapp.repository.DocumentActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {
    
    @Autowired
    private DocumentActivityRepository activityRepository;
    
    public void logActivity(Long documentId, Long userId, String action, String details) {
        DocumentActivity activity = new DocumentActivity();
        activity.setDocumentId(documentId);
        activity.setUserId(userId);
        activity.setAction(action);
        activity.setDetails(details);
        activityRepository.save(activity);
    }
    
    public java.util.List<DocumentActivity> getRecentActivities() {
        return activityRepository.findAll(
            org.springframework.data.domain.PageRequest.of(0, 50, 
                org.springframework.data.domain.Sort.by("timestamp").descending())
        ).getContent();
    }
}