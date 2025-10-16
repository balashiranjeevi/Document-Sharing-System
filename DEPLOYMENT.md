# Document Management System - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- MySQL 8.0+
- Docker (optional)

### Local Development Setup

#### 1. Database Setup
```bash
# Start MySQL and create database
mysql -u root -p
CREATE DATABASE documentdb;
```

#### 2. Backend Setup
```bash
cd springapp
./mvnw clean install
./mvnw spring-boot:run
```

#### 3. Frontend Setup
```bash
cd reactapp
npm install
npm start
```

### 🐳 Docker Deployment

#### Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:8080/api
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### ☁️ Cloud Deployment

#### Render Deployment
1. **Backend (Spring Boot)**
   - Connect GitHub repository
   - Set build command: `cd springapp && ./mvnw clean package -DskipTests`
   - Set start command: `java -jar springapp/target/springapp-0.0.1-SNAPSHOT.jar`
   - Add environment variables:
     ```
     SPRING_PROFILES_ACTIVE=prod
     DATABASE_URL=your_mysql_url
     DATABASE_USERNAME=your_username
     DATABASE_PASSWORD=your_password
     JWT_SECRET=your_jwt_secret
     ```

2. **Frontend (React)**
   - Connect GitHub repository
   - Set build command: `cd reactapp && npm install && npm run build`
   - Set publish directory: `reactapp/build`
   - Add environment variables:
     ```
     REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api
     ```

#### Vercel Deployment (Frontend)
```bash
cd reactapp
npm install -g vercel
vercel --prod
```

#### AWS Deployment
1. **EC2 Instance Setup**
   - Launch Ubuntu 20.04 instance
   - Install Docker and Docker Compose
   - Clone repository and run docker-compose

2. **RDS MySQL Database**
   - Create MySQL RDS instance
   - Update environment variables with RDS endpoint

### 🔧 Environment Configuration

#### Development (.env.development)
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

#### Production (.env.production)
```
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_ENVIRONMENT=production
```

### 🧪 Testing

#### Frontend Tests
```bash
cd reactapp
npm test
```

#### Backend Tests
```bash
cd springapp
./mvnw test
```

### 📊 Monitoring & Logging

- **Application Logs**: Available in `/var/log/` in Docker containers
- **Database Monitoring**: Use MySQL Workbench or phpMyAdmin
- **API Documentation**: Available at `/swagger-ui.html`

### 🔒 Security Considerations

1. **JWT Secret**: Use strong, unique secrets in production
2. **Database**: Use strong passwords and restrict access
3. **CORS**: Configure allowed origins properly
4. **HTTPS**: Always use HTTPS in production
5. **File Upload**: Implement file type and size restrictions

### 🚨 Troubleshooting

#### Common Issues
1. **Port Conflicts**: Ensure ports 3000, 8080, 3306 are available
2. **Database Connection**: Verify MySQL is running and credentials are correct
3. **CORS Errors**: Check CORS configuration in SecurityConfig.java
4. **File Upload Issues**: Verify upload directory permissions

#### Health Checks
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/actuator/health
- Database: Connect via MySQL client

### 📈 Performance Optimization

1. **Frontend**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement lazy loading

2. **Backend**
   - Configure connection pooling
   - Enable caching
   - Optimize database queries

3. **Database**
   - Add proper indexes
   - Regular maintenance
   - Monitor query performance