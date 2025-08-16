# MHCQMS - Master Health Checkup Queue Management System

A modern, full-stack web application for managing health checkup queues efficiently. Built with FastAPI backend and React frontend, designed for production deployment on Render.

## 🏗️ Project Structure

```
MHCQMS/
├── backend/           # FastAPI application
│   ├── app/          # Application modules
│   │   ├── api/      # API endpoints
│   │   ├── core/     # Core configuration
│   │   ├── models/   # Database models
│   │   ├── schemas/  # Pydantic schemas
│   │   └── services/ # Business logic
│   ├── alembic/      # Database migrations
│   ├── requirements.txt
│   └── .env.example
├── frontend/          # React application
│   ├── src/          # Source code
│   ├── package.json
│   └── tailwind.config.js
├── README.md
├── .gitignore
└── LICENSE
```

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **PostgreSQL** - Reliable, open-source database
- **JWT** - JSON Web Token authentication
- **Python 3.8+** - Programming language

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - React UI component library
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing

### Deployment
- **Render** - Cloud platform for hosting web services

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Git

## 🛠️ Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/Scripts/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Set up PostgreSQL database:**
   - Create a database named `mhcqms_db`
   - Update the `DATABASE_URL` in your `.env` file

6. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

7. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🚀 Production Deployment on Render

### Backend Deployment

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `JWT_SECRET_KEY`: A secure random string
     - `JWT_ALGORITHM`: `HS256`
     - `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`
     - `ENVIRONMENT`: `production`
     - `DEBUG`: `False`

### Frontend Deployment

1. **Create a new Static Site on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL`: Your backend service URL

### Database Setup

1. **Create a new PostgreSQL service on Render**
2. **Copy the connection string to your backend environment variables**

## 📚 API Documentation

Once the backend is running, you can access:
- **Interactive API docs:** `http://localhost:8000/docs`
- **ReDoc documentation:** `http://localhost:8000/redoc`

## 🔧 Development Commands

### Backend
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Run tests
pytest

# Database migrations
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Note:** This is a scaffolded project structure. Application logic and business features need to be implemented according to your specific requirements.
