#!/bin/bash

echo "Starting local blockchain with Anvil..."
echo
echo "This will start a local Ethereum node on localhost:8545"
echo "Press Ctrl+C to stop the blockchain"
echo

# Start anvil with some pre-funded accounts
../foundry/anvil --host 0.0.0.0 --port 8545