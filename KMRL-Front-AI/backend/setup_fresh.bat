@echo off
echo Setting up fresh KMRL DocHub Backend...

echo Removing old virtual environment...
if exist venv rmdir /s /q venv

echo Creating new virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Upgrading pip...
python -m pip install --upgrade pip

echo Installing dependencies...
pip install email-validator
pip install -r requirements.txt

echo Setup complete!
echo To start the server, run: run.bat
pause