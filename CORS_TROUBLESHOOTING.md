# 🔒 CORS Troubleshooting Guide

This guide will help you resolve CORS (Cross-Origin Resource Sharing) issues between your deployed frontend and backend on Render.

## 🚨 Current Issue

You're getting a CORS error when trying to login from your deployed frontend to your deployed backend.

## ✅ What We've Fixed

### 1. Backend CORS Configuration Updated

**File: `backend/app/core/config.py`**
```python
# CORS - Allow multiple frontend ports for development and production
allowed_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:4173,http://localhost:8080,https://*.onrender.com"

@property
def allowed_origins_list(self) -> List[str]:
    """Convert allowed_origins string to list"""
    origins = [origin.strip() for origin in self.allowed_origins.split(",")]
    
    # Add additional development origins
    if self.environment == "development":
        origins.extend([
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://0.0.0.0:*"
        ])
    
    # Add production origins for Render deployment
    if self.environment == "production":
        origins.extend([
            "https://*.onrender.com",
            "https://mhcqms-frontend.onrender.com"
        ])
    
    return origins
```

### 2. Frontend CORS Settings Updated

**File: `frontend/src/config/api.js`**
```javascript
// CORS settings
CORS: {
  withCredentials: true, // Must match backend allow_credentials=True
},
```

### 3. Environment Variables Added

**File: `backend/render.yaml`**
```yaml
- key: ALLOWED_ORIGINS
  value: "https://mhcqms-frontend.onrender.com,https://*.onrender.com,http://localhost:3000,http://localhost:5173"
```

## 🔄 Next Steps

### 1. Redeploy Your Backend

After making these changes, you need to redeploy your backend:

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Fix CORS configuration for production deployment"
   git push origin main
   ```

2. **Render will automatically redeploy** your backend service

### 2. Test CORS Configuration

After redeployment, test the CORS configuration:

1. **Visit the CORS test endpoint:**
   ```
   https://mhcqms-backend.onrender.com/cors-test
   ```

2. **Check the response** - it should show your allowed origins

### 3. Test from Frontend

1. **Open your deployed frontend**
2. **Open browser developer tools** (F12)
3. **Go to Network tab**
4. **Try to login** and check for CORS errors

## 🚨 If CORS Issues Persist

### Check Backend Logs

1. Go to your Render dashboard
2. Click on your backend service
3. Check the logs for any CORS-related errors

### Verify Environment Variables

Make sure these are set in your Render backend service:

```
ENVIRONMENT=production
ALLOWED_ORIGINS=https://mhcqms-frontend.onrender.com,https://*.onrender.com,http://localhost:3000,http://localhost:5173
```

### Test CORS Manually

You can test CORS manually using curl:

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: https://mhcqms-frontend.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://mhcqms-backend.onrender.com/api/v1/auth/login

# Test actual request
curl -X POST \
  -H "Origin: https://mhcqms-frontend.onrender.com" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  https://mhcqms-backend.onrender.com/api/v1/auth/login
```

## 🔍 Common CORS Issues

### 1. Mismatched Credentials

- **Backend**: `allow_credentials=True`
- **Frontend**: `withCredentials: true`

### 2. Missing Headers

Make sure your backend allows these headers:
```python
allow_headers=["*"]  # This allows all headers
```

### 3. Wrong Origin Format

- ✅ `https://mhcqms-frontend.onrender.com`
- ✅ `https://*.onrender.com`
- ❌ `https://mhcqms-frontend.onrender.com/` (trailing slash)

## 📱 Testing Checklist

- [ ] Backend redeployed with new CORS config
- [ ] CORS test endpoint working
- [ ] Frontend can make requests to backend
- [ ] Login functionality working
- [ ] No CORS errors in browser console

## 🆘 Still Having Issues?

If CORS issues persist after following this guide:

1. **Check Render deployment logs**
2. **Verify all environment variables are set**
3. **Test with a simple endpoint first**
4. **Check if your frontend domain is exactly correct**

## 🔗 Useful Links

- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [CORS Browser Support](https://caniuse.com/cors)

---

**Good luck resolving your CORS issues! 🚀**
