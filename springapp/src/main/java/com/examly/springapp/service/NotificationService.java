package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyDocumentUpload(String username, String documentName) {
        String message = username + " uploaded " + documentName;
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }

    public void notifyDocumentShare(String username, String documentName, String sharedWith) {
        String message = username + " shared " + documentName + " with " + sharedWith;
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }

    public void notifyDocumentDelete(String username, String documentName) {
        String message = username + " deleted " + documentName;
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
}