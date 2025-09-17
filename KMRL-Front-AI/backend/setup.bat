@echo off
echo Setting up KMRL DocHub Backend...

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo Setup complete!
echo To activate the environment, run: venv\Scripts\activate.bat
echo To start the server, run: uvicorn app.main:app --reload
pause