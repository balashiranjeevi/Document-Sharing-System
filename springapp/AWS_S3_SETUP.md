# AWS S3 Integration Setup Guide

## Prerequisites
1. AWS Account
2. AWS CLI installed (optional but recommended)

## Step 1: Create S3 Bucket
1. Go to AWS S3 Console
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `your-company-documents-bucket`)
4. Select your preferred region
5. Keep default settings for now
6. Click "Create bucket"

## Step 2: Create IAM User for S3 Access
1. Go to AWS IAM Console
2. Click "Users" → "Add user"
3. Enter username (e.g., `document-app-user`)
4. Select "Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search and select `AmazonS3FullAccess` (or create custom policy for specific bucket)
8. Complete user creation
9. **IMPORTANT**: Save the Access Key ID and Secret Access Key

## Step 3: Configure Application
1. Copy `.env.example` to `.env`
2. Update the following values:
```
AWS_S3_BUCKET_NAME=your-actual-bucket-name
AWS_REGION=your-bucket-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
STORAGE_TYPE=s3
```

## Step 4: Environment Variables (Production)
Set these environment variables in your production environment:
- `AWS_S3_BUCKET_NAME`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `STORAGE_TYPE=s3`

## Step 5: Test the Integration
1. Start your application
2. Upload a document through your API
3. Verify the file appears in your S3 bucket
4. Test download functionality

## Security Best Practices
1. **Never commit AWS credentials to version control**
2. Use IAM roles in production (EC2/ECS)
3. Create bucket-specific IAM policies instead of full S3 access
4. Enable S3 bucket versioning for backup
5. Configure S3 bucket policies for additional security

## Custom IAM Policy (Recommended)
Instead of `AmazonS3FullAccess`, create a custom policy:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name"
        }
    ]
}
```

## Switching Between Local and S3 Storage
- Set `STORAGE_TYPE=local` for local file storage
- Set `STORAGE_TYPE=s3` for S3 storage
- The application will automatically use the appropriate storage method

## Cost Optimization
- Use S3 Standard-IA for infrequently accessed documents
- Set up lifecycle policies to move old documents to Glacier
- Monitor S3 usage through AWS Cost Explorer