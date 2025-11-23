@echo off
echo ====================================
echo FocusFlow AI - Quick Install
echo ====================================
echo.

echo [1/3] Checking environment...
if not exist .env.local (
    echo ERROR: .env.local not found!
    echo Please run setup-env.bat first
    pause
    exit /b 1
)
echo Environment file found ✓
echo.

echo [2/3] Installing dependencies...
echo This may take 2-3 minutes...
echo.
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed!
    echo.
    echo SOLUTION: Try these steps:
    echo 1. Close PowerShell and open Command Prompt
    echo 2. Run this script again from Command Prompt
    echo 3. Or manually run: npm install
    echo.
    pause
    exit /b 1
)
echo.
echo Dependencies installed successfully ✓
echo.

echo [3/3] Starting development server...
echo.
echo ====================================
echo Your app will open at:
echo http://localhost:3000
echo ====================================
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
