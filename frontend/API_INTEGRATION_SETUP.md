# API Integration Setup Guide

## Overview
This guide explains the fixes made to resolve frontend API integration issues with the MHCQMS backend.

## Issues Fixed

### 1. Missing Backend Endpoints
- Added `/patients/register` endpoint for combined patient + queue registration
- Added `/patients/{id}/serve` endpoint for marking patients as served
- Added `/patients/completed` endpoint for getting completed patients
- Added `/patients/stats` endpoint for patient statistics

### 2. Data Structure Mismatches
- Fixed field name mappings between frontend and backend
- Updated frontend to use correct backend schema fields:
  - `first_name`, `last_name` instead of `name`
  - `phone` instead of `contact`
  - `medical_history` instead of `symptoms`
  - `patient_id` instead of `id` for display
  - Priority values: 0=Normal, 1=Urgent, 2=Emergency

### 3. Missing Services
- Created `queueService.js` for queue-related API calls
- Created `queueSlice.js` for Redux state management
- Updated Redux store configuration

### 4. Frontend Component Updates
- Fixed `PatientRegistration.jsx` data transformation
- Updated `QueueManagement.jsx` to use correct field names
- Fixed patient editing and display logic

## Environment Setup

### 1. Create Frontend Environment File
Create a `.env` file in the frontend directory:

```bash
# Frontend Environment Variables
VITE_API_URL=http://localhost:8000/api/v1
VITE_DEBUG=false
```

### 2. Backend Requirements
Ensure the backend is running on `http://localhost:8000` with the following:
- FastAPI server running
- Database migrations applied
- Authentication endpoints working

## API Endpoints

### Patient Management
- `POST /api/v1/patients/register` - Register patient with queue
- `GET /api/v1/patients` - Get all patients
- `PUT /api/v1/patients/{id}` - Update patient
- `DELETE /api/v1/patients/{id}` - Delete patient
- `PATCH /api/v1/patients/{id}/serve` - Mark patient as served
- `GET /api/v1/patients/completed` - Get completed patients
- `GET /api/v1/patients/stats` - Get patient statistics

### Queue Management
- `GET /api/v1/queue` - Get queue status
- `POST /api/v1/queue` - Add to queue
- `PUT /api/v1/queue/{id}` - Update queue entry
- `PATCH /api/v1/queue/{id}/status` - Update queue status
- `DELETE /api/v1/queue/{id}` - Remove from queue
- `GET /api/v1/queue/stats/summary` - Get queue statistics

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout

## Data Flow

### Patient Registration
1. User fills out patient registration form
2. Frontend transforms data to match backend schema
3. API call to `/patients/register` creates patient and queue entry
4. Response includes both patient and queue data
5. Redux state updated with new patient

### Queue Management
1. Frontend fetches queue status from `/queue`
2. Patients displayed with correct field mappings
3. Actions (edit, delete, mark served) use proper API endpoints
4. State updates reflect backend changes

## Testing

### 1. Test Patient Registration
- Navigate to Patient Registration page
- Fill out form with valid data
- Submit and verify patient appears in queue

### 2. Test Queue Management
- Navigate to Queue Management page
- Verify patients display with correct information
- Test edit, delete, and mark served functionality

### 3. Test Authentication
- Login with valid credentials
- Verify token storage and API calls work
- Test protected route access

## Common Issues and Solutions

### 1. CORS Errors
- Ensure backend has CORS middleware configured
- Check API URL in frontend environment

### 2. Authentication Errors
- Verify JWT token format in localStorage
- Check token expiration handling

### 3. Data Display Issues
- Verify field mappings match backend schema
- Check Redux state structure

### 4. API 404 Errors
- Ensure all backend endpoints are implemented
- Check API route prefixes and paths

## Next Steps

1. Test all functionality end-to-end
2. Add error handling for edge cases
3. Implement loading states and user feedback
4. Add form validation and error messages
5. Consider adding real-time updates for queue status
