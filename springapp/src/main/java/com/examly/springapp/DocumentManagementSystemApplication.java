package com.examly.springapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan
public class DocumentManagementSystemApplication {

	private static final Logger logger = LoggerFactory.getLogger(DocumentManagementSystemApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(DocumentManagementSystemApplication.class, args);
		logger.info("Document Management System Application started successfully");
	}

}
