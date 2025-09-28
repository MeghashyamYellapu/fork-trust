#!/bin/bash

echo "Deploying SupplyChain Smart Contract..."
echo

# Check if anvil is running
echo "Checking if local blockchain is running..."
if ! curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 > /dev/null 2>&1; then
    echo "ERROR: Local blockchain not running!"
    echo "Please start anvil first by running: ./foundry/anvil"
    exit 1
fi

echo "Local blockchain is running!"
echo

# Deploy the contract
echo "Deploying contract..."
../foundry/forge script script/DeploySupplyChain.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

if [ $? -eq 0 ]; then
    echo
    echo "✅ Smart contract deployed successfully!"
    echo "Contract address should be displayed above."
    echo
    echo "Don't forget to update the contract address in:"
    echo "- src/utils/web3.ts"
    echo "- .env.local"
else
    echo
    echo "❌ Deployment failed!"
fi

echo