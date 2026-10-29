@echo off
REM Hide command output

cd /d "%~dp0"
REM Go to the folder where this script is located

npm start
REM Start the Node.js app

pause
REM Wait for user to press a key before closing