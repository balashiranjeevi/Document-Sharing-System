# DocShare - Dropbox-Inspired Document Sharing System

A modern, secure document sharing platform built with React and Spring Boot, featuring JWT authentication, file management, and real-time collaboration.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based login/register with secure token management
- **Document Management**: Upload, download, edit, delete documents with metadata
- **Folder Organization**: Create, rename, delete folders with hierarchical structure
- **File Sharing**: Share documents with granular permissions (read/write)
- **Search & Filter**: Advanced search across documents with multiple filters
- **Responsive Design**: Mobile-first design with Dropbox-inspired UI

### Advanced Features
- **Drag & Drop Upload**: Multi-file upload with progress tracking
- **File Preview**: PDF and image preview capabilities
- **Admin Dashboard**: User management and system analytics
- **Real-time Notifications**: Toast notifications for user feedback
- **Storage Management**: Track storage usage and limits
- **Activity Logs**: Monitor document access and modifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library
- **React Dropzone** - Drag & drop file uploads
- **Axios** - HTTP client for API calls

### Backend Integration
- **Spring Boot** - RESTful API backend
- **JWT Authentication** - Secure token-based auth
- **MySQL** - Database for data persistence
- **Spring Security** - Security framework

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Java 17+ (for backend)
- MySQL 8.0+

### Frontend Setup

1. **Clone and navigate to the project**
   ```bash
   cd reactapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env` file in the root:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_MAX_FILE_SIZE=52428800
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`

### Backend Setup
Ensure the Spring Boot backend is running on `http://localhost:8080`

## 🎨 UI/UX Design

### Design System
- **Primary Color**: #0061ff (Dropbox Blue)
- **Secondary Color**: #f7f9fc (Light Gray)
- **Typography**: System fonts with clean hierarchy
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle elevation with soft shadows

### Components
- **Responsive Layout**: Mobile-first with breakpoints
- **Interactive Elements**: Hover states and smooth transitions
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Top navigation bar
│   ├── Sidebar.js      # Left navigation sidebar
│   ├── DocumentList.js # Document grid/list view
│   ├── UploadModal.js  # File upload modal
│   ├── ShareModal.js   # Document sharing modal
│   └── Toast.js        # Notification component
├── pages/              # Page components
│   ├── Landing.js      # Home/landing page
│   ├── Login.js        # Login form
│   ├── Register.js     # Registration form
│   ├── Dashboard.js    # Main dashboard
│   └── Admin.js        # Admin panel
├── contexts/           # React contexts
│   ├── AuthContext.js  # Authentication state
│   └── ToastContext.js # Toast notifications
├── services/           # API service layers
│   ├── authService.js  # Authentication API
│   ├── documentService.js # Document API
│   └── folderService.js   # Folder API
├── utils/              # Utility functions
│   ├── api.js          # Axios configuration
│   └── helpers.js      # Common helper functions
└── styles/             # Global styles
    └── index.css       # Tailwind CSS imports
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## 🔐 Authentication Flow

1. **Registration**: Users create account with email/username
2. **Login**: JWT token issued on successful authentication
3. **Token Storage**: Secure token storage in localStorage
4. **Auto-refresh**: Automatic token validation and refresh
5. **Logout**: Clean token removal and state reset

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)
- **Large Screens**: Optimized for large displays (1440px+)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_MAX_FILE_SIZE=52428800
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

Built with ❤️ using React and Spring Boot