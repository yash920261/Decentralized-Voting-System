@echo off
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI server...
python app.py
