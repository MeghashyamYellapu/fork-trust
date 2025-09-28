#!/bin/bash

echo "================================"
echo "Fork Trust Blockchain Setup"
echo "================================"
echo

echo "Step 1: Installing Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies!"
    exit 1
fi
echo "✅ Dependencies installed!"
echo

echo "Step 2: Building Smart Contracts..."
cd blockchain
../foundry/forge build
if [ $? -ne 0 ]; then
    echo "Failed to build contracts!"
    exit 1
fi
cd ..
echo "✅ Contracts built successfully!"
echo

echo "Step 3: Starting Local Blockchain..."
echo "Starting Anvil in background..."
cd blockchain
../foundry/anvil --host 0.0.0.0 --port 8545 &
ANVIL_PID=$!
cd ..

echo "Waiting for blockchain to start..."
sleep 5

echo
echo "Step 4: Deploying Smart Contracts..."
cd blockchain
./deploy.sh
if [ $? -ne 0 ]; then
    echo "Failed to deploy contracts!"
    kill $ANVIL_PID 2>/dev/null
    exit 1
fi
cd ..

echo
echo "================================"
echo "🎉 Setup Complete!"
echo "================================"
echo
echo "Your Fork Trust application is ready!"
echo
echo "Next steps:"
echo "1. Configure MetaMask:"
echo "   - Network: Localhost 8545"
echo "   - RPC URL: http://localhost:8545"
echo "   - Chain ID: 31337"
echo
echo "2. Import test account:"
echo "   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo
echo "3. Start the frontend:"
echo "   npm run dev"
echo
echo "4. Open http://localhost:8081 in your browser"
echo
echo "Press Enter to start the frontend..."
read

echo "Starting frontend..."
npm run dev