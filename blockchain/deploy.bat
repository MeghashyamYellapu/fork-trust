@echo off
echo Deploying SupplyChain Smart Contract...
echo.

REM Check if anvil is running
echo Checking if local blockchain is running...
curl -s -X POST -H "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}" http://localhost:8545 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Local blockchain not running!
    echo Please start anvil first by running: .\foundry\anvil.exe
    pause
    exit /b 1
)

echo Local blockchain is running!
echo.

REM Deploy the contract
echo Deploying contract...
..\foundry\forge.exe script script/DeploySupplyChain.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

if %errorlevel% equ 0 (
    echo.
    echo ✅ Smart contract deployed successfully!
    echo Contract address should be displayed above.
    echo.
    echo Don't forget to update the contract address in:
    echo - src/utils/web3.ts
    echo - .env.local
) else (
    echo.
    echo ❌ Deployment failed!
)

echo.
pause