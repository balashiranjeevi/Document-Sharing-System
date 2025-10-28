package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class FileStorageService {

    @Autowired
    private S3StorageService s3StorageService;

    public String storeFile(MultipartFile file) throws IOException {
        return s3StorageService.storeFile(file);
    }

    public InputStream getFileStream(String filename) throws IOException {
        return s3StorageService.getFile(filename);
    }

    public void deleteFile(String filename) throws IOException {
        s3StorageService.deleteFile(filename);
    }

    public String generateShareUrl(String filename) {
        return s3StorageService.generatePublicUrl(filename);
    }

    public String getDirectUrl(String filename) {
        return s3StorageService.generatePublicUrl(filename);
    }
}