@echo off
echo Setting AWS environment variables...
set AWS_S3_BUCKET_NAME=document-sharing-system
set AWS_REGION=us-east-1
set AWS_ACCESS_KEY_ID=AKIAWQUOZKDYZP7DPNGC
set AWS_SECRET_ACCESS_KEY=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
set STORAGE_TYPE=s3

echo Starting Spring Boot application...
mvn spring-boot:run