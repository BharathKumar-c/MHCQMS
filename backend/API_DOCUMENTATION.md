# MHCQMS API Documentation

## Overview

The MHCQMS (Master Health Checkup Queue Management System) API provides comprehensive management for health checkup queues, patient registration, and user authentication. This RESTful API is built with FastAPI and includes automatic Swagger/OpenAPI documentation.

## Quick Start

### Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.mhcqms.com`

### API Version
- **Current Version**: `v1`
- **Base Path**: `/api/v1`

### Documentation URLs
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI Schema**: `/openapi.json`

## Authentication

The API uses JWT (JSON Web Token) authentication. Most endpoints require authentication.

### Getting a Token

1. **Register a new user** (if you don't have an account):
   ```http
   POST /api/v1/auth/register
   Content-Type: application/json
   
   {
     "username": "your_username",
     "email": "your_email@example.com",
     "password": "your_password",
     "full_name": "Your Full Name"
   }
   ```

2. **Login to get a token**:
   ```http
   POST /api/v1/auth/login
   Content-Type: application/x-www-form-urlencoded
   
   username=your_username&password=your_password
   ```

3. **Use the token** in subsequent requests:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```

## API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | User login | No |
| GET | `/me` | Get current user info | Yes |

### Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required | Permissions |
|--------|----------|-------------|---------------|-------------|
| GET | `/` | Get all users | Yes | Superuser |
| GET | `/{user_id}` | Get user by ID | Yes | Self or Superuser |
| PUT | `/{user_id}` | Update user | Yes | Self or Superuser |
| DELETE | `/{user_id}` | Delete user | Yes | Superuser |

### Patients (`/api/v1/patients`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new patient | Yes |
| GET | `/` | Get all patients | Yes |
| GET | `/{patient_id}` | Get patient by ID | Yes |
| PUT | `/{patient_id}` | Update patient | Yes |
| DELETE | `/{patient_id}` | Delete patient | Yes |

### Queue Management (`/api/v1/queue`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Add patient to queue | Yes |
| GET | `/` | Get queue status | Yes |
| GET | `/{queue_id}` | Get queue entry by ID | Yes |
| PUT | `/{queue_id}` | Update queue entry | Yes |
| PATCH | `/{queue_id}/status` | Update queue status | Yes |
| DELETE | `/{queue_id}` | Remove from queue | Yes |
| GET | `/stats/summary` | Get queue statistics | Yes |

## Data Models

### User

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": null
}
```

### Patient

```json
{
  "id": 1,
  "patient_id": "P001",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "phone": "+1234567890",
  "email": "john.doe@example.com",
  "address": "123 Main St, City, State",
  "emergency_contact": "+1987654321",
  "medical_history": "No known allergies",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": null
}
```

### Queue Entry

```json
{
  "id": 1,
  "queue_number": "Q001",
  "patient_id": 1,
  "checkup_type": "General Checkup",
  "priority": 0,
  "status": "waiting",
  "notes": "Regular health checkup",
  "estimated_wait_time": 30,
  "check_in_time": "2024-01-01T10:00:00Z",
  "start_time": null,
  "end_time": null,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": null
}
```

## Queue Status Values

- `waiting` - Patient is waiting for checkup
- `in_progress` - Checkup is currently in progress
- `completed` - Checkup has been completed
- `cancelled` - Checkup was cancelled

## Priority Levels

- `0` - Normal priority
- `1` - Urgent priority
- `2` - Emergency priority

## Error Handling

The API returns standard HTTP status codes and detailed error messages:

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Response Format

```json
{
  "detail": "Error message description"
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per user.

## Pagination

List endpoints support pagination using `skip` and `limit` query parameters:

```http
GET /api/v1/patients?skip=0&limit=10
```

## Search and Filtering

Patient endpoints support search by name or patient ID:

```http
GET /api/v1/patients?search=john
```

Queue endpoints support filtering by status and priority:

```http
GET /api/v1/queue?status_filter=waiting&priority_filter=1
```

## Examples

### Creating a Patient

```bash
curl -X POST "http://localhost:8000/api/v1/patients" \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "date_of_birth": "1985-05-15",
    "gender": "female",
    "phone": "+1234567890",
    "email": "jane.smith@example.com"
  }'
```

### Adding Patient to Queue

```bash
curl -X POST "http://localhost:8000/api/v1/queue" \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "checkup_type": "Blood Test",
    "priority": 1,
    "notes": "Fasting required"
  }'
```

### Getting Queue Status

```bash
curl -X GET "http://localhost:8000/api/v1/queue?status_filter=waiting" \
  -H "Authorization: Bearer <your_token>"
```

## Development

### Running the API

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Run the server**:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Access documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Testing

The API includes comprehensive test coverage. Run tests with:

```bash
pytest
```

## Support

For support or questions:
- **Email**: dev@mhcqms.com
- **Documentation**: `/docs` or `/redoc`
- **API Schema**: `/openapi.json`

## License

This project is licensed under the MIT License.
