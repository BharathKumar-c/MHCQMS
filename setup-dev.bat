@echo off
echo Setting up MHCQMS Development Environment...
echo.

echo Setting up Backend...
cd backend
echo Creating virtual environment...
python -m venv venv
echo Activating virtual environment...
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -r requirements.txt
echo Backend setup complete!
echo.
echo To start backend server:
echo cd backend
echo venv\Scripts\activate
echo python run.py
echo.
cd ..

echo Setting up Frontend...
cd frontend
echo Installing Node.js dependencies...
npm install
echo Frontend setup complete!
echo.
echo To start frontend server:
echo cd frontend
echo npm run dev
echo.
cd ..

echo.
echo Development environment setup complete!
echo.
echo Next steps:
echo 1. Copy backend\.env.example to backend\.env and update with your database credentials
echo 2. Start PostgreSQL database
echo 3. Run backend: cd backend ^&^& venv\Scripts\activate ^&^& python run.py
echo 4. Run frontend: cd frontend ^&^& npm run dev
echo.
pause
