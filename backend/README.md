# MHCQMS Backend

A FastAPI-based backend for the Mental Health Care Queue Management System (MHCQMS).

## 🚀 Quick Start

### 1. Environment Setup

Copy the environment template and configure your database:

```bash
cp env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations

```bash
alembic upgrade head
```

### 4. Start the Application

```bash
python start.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔐 Authentication

### Default Admin User

The system creates a default admin user on first run:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

### JWT Token Usage

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new staff user
- `POST /auth/login` - Login and get JWT token

### Patient Management
- `POST /patients/` - Create new patient
- `GET /patients/` - Get all patients
- `GET /patients/queue` - Get queue with counts
- `GET /patients/{id}` - Get specific patient
- `PUT /patients/{id}` - Update patient
- `PATCH /patients/{id}/serve` - Mark patient as served
- `DELETE /patients/{id}` - Delete patient

### Reports
- `GET /reports/daily-served` - Get daily served patients
- `GET /reports/daily-served/csv` - Export daily served as CSV
- `GET /reports/queue-stats` - Get queue statistics

## 🗄️ Database Models

### User Model
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `hashed_password`: Bcrypt hashed password
- `full_name`: User's full name
- `is_active`: Account status
- `is_staff`: Staff privileges
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Patient Model
- `id`: Primary key
- `name`: Patient's full name
- `age`: Patient's age
- `gender`: Patient's gender
- `contact`: Contact information
- `appointment_time`: Scheduled appointment
- `status`: Queue status (waiting/served)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

## 🔧 Development

### Running Tests

```bash
pytest
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | Required |
| `JWT_ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiry time | 30 |
| `DEBUG` | Enable debug mode | true |
| `HOST` | Application host | 0.0.0.0 |
| `PORT` | Application port | 8000 |

## 🚨 Security Notes

- Never commit real credentials to version control
- Use environment variables for sensitive configuration
- Change default passwords in production
- Enable HTTPS in production environments
