#!/bin/bash

echo "Extracting Contract ABI..."
echo

# Build the contract first
echo "Building contract..."
../foundry/forge build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Extract ABI from the compiled contract
if [ -f "out/SupplyChain.sol/SupplyChain.json" ]; then
    echo "Extracting ABI..."
    cat out/SupplyChain.sol/SupplyChain.json | jq '.abi' > ../src/utils/SupplyChain.abi.json
    echo "ABI extracted to: ../src/utils/SupplyChain.abi.json"
else
    echo "Contract build output not found!"
    echo "Make sure the contract compiles successfully."
fi

echo