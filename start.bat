@echo off
echo =======================================
echo   Starting Taxync Fullstack Application
echo =======================================
start "Taxync Backend" cmd /k "%~dp0run_backend.bat"
start "Taxync Frontend" cmd /k "%~dp0run_frontend.bat"
echo Both servers are launching!
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
pause
