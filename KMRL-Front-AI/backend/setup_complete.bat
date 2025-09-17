@echo off
echo ========================================
echo KMRL DocHub Backend - Complete Setup
echo ========================================

echo [1/6] Removing old virtual environment...
if exist venv rmdir /s /q venv

echo [2/6] Creating fresh virtual environment...
python -m venv venv

echo [3/6] Activating virtual environment...
call venv\Scripts\activate.bat

echo [4/6] Upgrading pip and build tools...
python -m pip install --upgrade pip setuptools wheel

echo [5/6] Installing project with all dependencies...
pip install -e .

echo [6/6] Installing development dependencies...
pip install -e .[dev]

echo.
echo ========================================
echo Setup Complete! 
echo ========================================
echo.
echo To start the server:
echo   1. Activate environment: venv\Scripts\activate
echo   2. Start server: uvicorn app.main:app --reload
echo.
echo Or simply run: run.bat
echo.
pause