package com.examly.springapp.controller;

import com.examly.springapp.model.Document;
import com.examly.springapp.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ActivityLogService activityLogService;

    @MessageMapping("/document.share")
    public void handleDocumentShare(@Payload DocumentShareMessage message) {
        // Broadcast to all subscribers of the document
        messagingTemplate.convertAndSend("/topic/document/" + message.getDocumentId() + "/shares",
                message);

        // Log activity
        activityLogService.logActivity(null, null, "SHARE_NOTIFICATION",
                "Document shared notification sent for document ID: " + message.getDocumentId());
    }

    @MessageMapping("/document.activity")
    public void handleDocumentActivity(@Payload DocumentActivityMessage message) {
        // Broadcast activity to document subscribers
        messagingTemplate.convertAndSend("/topic/document/" + message.getDocumentId() + "/activity",
                message);
    }

    public static class DocumentShareMessage {
        private Long documentId;
        private String documentTitle;
        private Long sharedByUserId;
        private String sharedByUserName;
        private Long sharedWithUserId;
        private String sharedWithUserName;
        private String permission;

        // Getters and Setters
        public Long getDocumentId() {
            return documentId;
        }

        public void setDocumentId(Long documentId) {
            this.documentId = documentId;
        }

        public String getDocumentTitle() {
            return documentTitle;
        }

        public void setDocumentTitle(String documentTitle) {
            this.documentTitle = documentTitle;
        }

        public Long getSharedByUserId() {
            return sharedByUserId;
        }

        public void setSharedByUserId(Long sharedByUserId) {
            this.sharedByUserId = sharedByUserId;
        }

        public String getSharedByUserName() {
            return sharedByUserName;
        }

        public void setSharedByUserName(String sharedByUserName) {
            this.sharedByUserName = sharedByUserName;
        }

        public Long getSharedWithUserId() {
            return sharedWithUserId;
        }

        public void setSharedWithUserId(Long sharedWithUserId) {
            this.sharedWithUserId = sharedWithUserId;
        }

        public String getSharedWithUserName() {
            return sharedWithUserName;
        }

        public void setSharedWithUserName(String sharedWithUserName) {
            this.sharedWithUserName = sharedWithUserName;
        }

        public String getPermission() {
            return permission;
        }

        public void setPermission(String permission) {
            this.permission = permission;
        }
    }

    public static class DocumentActivityMessage {
        private Long documentId;
        private String action;
        private Long userId;
        private String userName;
        private String details;

        // Getters and Setters
        public Long getDocumentId() {
            return documentId;
        }

        public void setDocumentId(Long documentId) {
            this.documentId = documentId;
        }

        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }
    }
}
