@echo off
echo ================================
echo Fork Trust Blockchain Setup
echo ================================
echo.

echo Step 1: Installing Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies!
    pause
    exit /b 1
)
echo ✅ Dependencies installed!
echo.

echo Step 2: Building Smart Contracts...
cd blockchain
call ..\foundry\forge.exe build
if %errorlevel% neq 0 (
    echo Failed to build contracts!
    pause
    exit /b 1
)
cd ..
echo ✅ Contracts built successfully!
echo.

echo Step 3: Starting Local Blockchain...
echo Starting Anvil in background...
start "Anvil Blockchain" /min cmd /c "cd blockchain && ..\foundry\anvil.exe --host 0.0.0.0 --port 8545"

echo Waiting for blockchain to start...
timeout /t 5 > nul

echo.
echo Step 4: Deploying Smart Contracts...
cd blockchain
call deploy.bat
if %errorlevel% neq 0 (
    echo Failed to deploy contracts!
    pause
    exit /b 1
)
cd ..

echo.
echo ================================
echo 🎉 Setup Complete!
echo ================================
echo.
echo Your Fork Trust application is ready!
echo.
echo Next steps:
echo 1. Configure MetaMask:
echo    - Network: Localhost 8545
echo    - RPC URL: http://localhost:8545
echo    - Chain ID: 31337
echo.
echo 2. Import test account:
echo    Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
echo.
echo 3. Start the frontend:
echo    npm run dev
echo.
echo 4. Open http://localhost:8081 in your browser
echo.
echo Press any key to start the frontend...
pause > nul

echo Starting frontend...
npm run dev