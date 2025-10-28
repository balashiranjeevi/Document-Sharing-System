package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
public class S3StorageService {

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public String storeFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        try {
            System.out.println("Uploading to S3 bucket: " + bucketName + ", file: " + uniqueFilename);
            
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(uniqueFilename)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            System.out.println("Successfully uploaded to S3: " + uniqueFilename);
            return uniqueFilename;
        } catch (software.amazon.awssdk.core.exception.SdkException e) {
            System.err.println("AWS SDK Error: " + e.getMessage());
            throw new IOException("Failed to store file in S3: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("General Error: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to store file in S3: " + e.getMessage(), e);
        }
    }

    public String copyToSharedFolder(String filename) throws IOException {
        try {
            String sharedKey = "shared/" + filename;
            
            CopyObjectRequest copyRequest = CopyObjectRequest.builder()
                    .sourceBucket(bucketName)
                    .sourceKey(filename)
                    .destinationBucket(bucketName)
                    .destinationKey(sharedKey)
                    .build();

            s3Client.copyObject(copyRequest);
            return sharedKey;
        } catch (Exception e) {
            throw new IOException("Failed to copy file to shared folder: " + e.getMessage(), e);
        }
    }

    public InputStream getFile(String filename) throws IOException {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filename)
                    .build();

            return s3Client.getObject(getObjectRequest);
        } catch (Exception e) {
            throw new IOException("Failed to retrieve file from S3: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String filename) throws IOException {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filename)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            throw new IOException("Failed to delete file from S3: " + e.getMessage(), e);
        }
    }

    public String generatePublicUrl(String filename) {
        // Generate direct S3 URL (bucket must be public)
        return String.format("https://%s.s3.ap-south-1.amazonaws.com/%s", bucketName, filename);
    }
}