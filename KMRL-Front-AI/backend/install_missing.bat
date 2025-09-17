@echo off
call venv\Scripts\activate.bat
pip install email-validator
pip install pydantic[email]
echo Missing dependencies installed!
pause