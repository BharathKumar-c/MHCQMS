# MHCQMS Deployment Guide 🚀

This guide will help you deploy your MHCQMS (Mental Health Clinic Queue Management System) application to Render.

## 🗄️ Database Configuration

Your PostgreSQL database is already set up at:
```
postgres://avnadmin:YOUR_DATABASE_PASSWORD@pg-freedb-mhcqmsdb.d.aivencloud.com:28374/defaultdb?sslmode=require
```

**Important**: Replace `YOUR_DATABASE_PASSWORD` with your actual database password.

## 🎯 Backend Deployment ✅ COMPLETED

Your backend is already deployed successfully at:
**https://mhcqms-backend.onrender.com**

### Backend Environment Variables (Already Set):
```
DATABASE_URL=postgres://avnadmin:YOUR_DATABASE_PASSWORD@pg-freedb-mhcqmsdb.d.aivencloud.com:28374/defaultdb?sslmode=require
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=false
```

## 🎨 Frontend Deployment

### Step 1: Create Static Site
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Select the `MHCQMS` repository

### Step 2: Configure Frontend Service
- **Name**: `mhcqms-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 3: Set Environment Variables
```
VITE_API_URL=https://mhcqms-backend.onrender.com/api/v1
```

**Important**: This URL is already configured in your `render.yaml` file.

### Step 4: Deploy
Click "Create Static Site" and wait for deployment to complete.

## 🔗 API Configuration Fixed ✅

The following files have been updated to use your deployed backend:

1. **`frontend/src/config/api.js`** - Updated BASE_URL fallback
2. **`frontend/src/components/ApiTest.jsx`** - Updated debug display
3. **`frontend/render.yaml`** - Set production API URL
4. **`frontend/env.production`** - Created production environment file

## 🌐 Access Your Application

- **Frontend**: `https://mhcqms-frontend.onrender.com` (after deployment)
- **Backend API**: `https://mhcqms-backend.onrender.com`
- **API Documentation**: `https://mhcqms-backend.onrender.com/docs`

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, random JWT secret key
2. **Environment Variables**: Never commit sensitive data to Git
3. **CORS**: Backend is configured to allow frontend domain
4. **HTTPS**: Render provides SSL certificates automatically

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render
   - Ensure all dependencies are in requirements.txt
   - Verify Python version compatibility

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check if database is accessible from Render
   - Ensure SSL mode is properly configured

3. **Frontend API Errors**
   - Verify VITE_API_URL is correct
   - Check CORS configuration
   - Ensure backend is running

### Logs and Monitoring

- **Backend Logs**: Available in Render dashboard
- **Frontend Build Logs**: Check build process logs
- **Database**: Monitor connection status

## 📱 Testing After Deployment

1. **Test Backend API**:
   - Visit `/docs` endpoint for Swagger UI
   - Test authentication endpoints
   - Verify database connections

2. **Test Frontend**:
   - Verify login functionality
   - Test patient registration
   - Check queue management features

## 🔧 Development Setup

For local development, create a `.env` file in the backend directory:

```bash
# Copy the example file
cp backend/env.example backend/.env

# Edit the .env file with your local values
# Make sure to use placeholder values for sensitive data
```

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Support

If you encounter issues during deployment:
1. Check the Render logs first
2. Verify all environment variables are set correctly
3. Ensure your database is accessible
4. Check the troubleshooting section above

---

**Happy Deploying! 🎉**
