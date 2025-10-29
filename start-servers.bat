@echo off
echo Starting Document Sharing Application...
echo.
echo Backend will run on: http://localhost:8080
echo Frontend will run on: http://localhost:8081
echo.

start "Backend Server" cmd /k "cd springapp && mvn spring-boot:run"
timeout /t 5 /nobreak > nul
start "Frontend Server" cmd /k "cd reactapp && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:8081
echo.
pause