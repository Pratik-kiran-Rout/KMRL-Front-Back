@echo off
echo ========================================
echo KMRL DocHub - Full Stack Setup
echo ========================================

echo [1/4] Installing frontend dependencies...
npm install

echo [2/4] Setting up backend virtual environment...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install --upgrade pip

echo [3/4] Installing backend dependencies...
pip install -e .

echo [4/4] Installing development tools...
pip install -e .[dev]

cd ..

echo.
echo ========================================
echo Setup Complete! 
echo ========================================
echo.
echo Available commands:
echo   npm run start        - Start both frontend and backend
echo   npm run dev          - Start frontend only
echo   npm run backend:dev  - Start backend only
echo   make docker-up       - Start with Docker
echo.
echo Quick start: npm run start
echo.
pause