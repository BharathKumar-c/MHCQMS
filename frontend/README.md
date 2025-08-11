# MHCQMS Frontend

A modern, responsive React.js frontend application for the Mental Health Care Quality Management System (MHCQMS). Built with React 19, Vite, Tailwind CSS, and Material-UI components.

## 🚀 Features

- **Modern React 19**: Built with the latest React features and hooks
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Material-UI Components**: Professional UI components for consistent design
- **State Management**: Redux Toolkit for centralized state management
- **Routing**: React Router DOM for client-side navigation
- **Authentication**: Protected routes and user authentication system
- **Patient Management**: Patient registration and management features
- **Queue Management**: Healthcare queue management system
- **Reporting**: Analytics and reporting dashboard
- **Fast Development**: Vite for lightning-fast development experience

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.0
- **Styling**: Tailwind CSS 4.1.11 + Material-UI 7.3.1
- **State Management**: Redux Toolkit 2.8.2
- **Routing**: React Router DOM 7.8.0
- **HTTP Client**: Axios 1.11.0
- **Development**: ESLint, PostCSS, Autoprefixer

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see backend README for setup)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=MHCQMS
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # App-level store configuration
│   ├── assets/            # Images, icons, and static files
│   ├── components/        # Reusable UI components
│   │   ├── Layout/        # Layout components (Header, Layout)
│   │   └── ProtectedRoute.jsx
│   ├── features/          # Redux slices and feature logic
│   │   ├── authSlice.js   # Authentication state management
│   │   └── patientSlice.js # Patient data management
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Home.jsx       # Home page
│   │   ├── Login.jsx      # Login form
│   │   ├── PatientRegistration.jsx
│   │   ├── QueueManagement.jsx
│   │   └── Reports.jsx    # Reports and analytics
│   ├── services/          # API services and utilities
│   │   ├── api.js         # Base API configuration
│   │   ├── authService.js # Authentication API calls
│   │   └── patientService.js # Patient API calls
│   ├── store/             # Redux store configuration
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── eslint.config.js        # ESLint configuration
```

## 🎨 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint for code quality

## 🔧 Configuration

### Vite Configuration

The application uses Vite for fast development and building. Configuration is in `vite.config.js`.

### Tailwind CSS

Tailwind CSS is configured in `tailwind.config.js` and provides utility-first CSS classes for rapid UI development.

### ESLint

Code quality is maintained with ESLint. Configuration is in `eslint.config.js`.

## 🏗️ Architecture

### Component Structure

- **Layout Components**: Header, navigation, and main layout wrapper
- **Page Components**: Individual page views for different features
- **Feature Components**: Reusable components specific to features
- **Protected Routes**: Authentication-based route protection

### State Management

- **Redux Toolkit**: Centralized state management
- **Auth Slice**: User authentication state
- **Patient Slice**: Patient data management
- **Store**: Configured Redux store with middleware

### API Integration

- **Axios**: HTTP client for API calls
- **Service Layer**: Organized API calls by feature
- **Error Handling**: Centralized error handling and user feedback

## 🎯 Key Features

### Authentication System
- User login/logout
- Protected routes
- Session management

### Patient Management
- Patient registration
- Patient search and filtering
- Patient data updates

### Queue Management
- Healthcare queue management
- Priority-based queuing
- Real-time updates

### Dashboard & Reports
- Analytics dashboard
- Performance metrics
- Custom report generation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Environment Variables

Set the following environment variables for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=MHCQMS
```

### Static Hosting

The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## 🔍 Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Use TypeScript-like prop validation

### Component Structure
- Keep components focused and single-purpose
- Use proper prop drilling or context when needed
- Implement proper error boundaries

### State Management
- Use Redux Toolkit for global state
- Keep local state in components when appropriate
- Follow Redux best practices

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process using port 5173
   npx kill-port 5173
   ```

2. **Dependencies Issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build Errors**
   - Check for syntax errors in components
   - Verify all imports are correct
   - Check environment variables

### Development Tips

- Use React Developer Tools for debugging
- Check browser console for errors
- Verify API endpoints are accessible
- Test responsive design on different screen sizes

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## 🤝 Contributing

1. Follow the established code structure
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the backend documentation
- Create an issue in the project repository

---

**Built with ❤️ for Mental Health Care Quality Management**
