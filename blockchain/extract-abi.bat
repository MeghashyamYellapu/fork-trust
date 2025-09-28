@echo off
echo Extracting Contract ABI...
echo.

REM Build the contract first
echo Building contract...
..\foundry\forge.exe build

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

REM Extract ABI from the compiled contract
if exist "out\SupplyChain.sol\SupplyChain.json" (
    echo Extracting ABI...
    powershell -Command "Get-Content 'out\SupplyChain.sol\SupplyChain.json' | ConvertFrom-Json | Select-Object -ExpandProperty abi | ConvertTo-Json -Depth 10 | Out-File -FilePath '..\src\utils\SupplyChain.abi.json' -Encoding UTF8"
    echo ABI extracted to: ..\src\utils\SupplyChain.abi.json
) else (
    echo Contract build output not found!
    echo Make sure the contract compiles successfully.
)

echo.
pause