# Smart Vending Machine

A blockchain-powered vending machine application that allows users to purchase and consume virtual products using Ethereum.

![Smart Vending Machine](/client/public/dapp-preview.png)
![Smart Vending Machine](/client/public/dapp-preview-purchases.png)

## Overview

This project implements a decentralized vending machine where users can:
- Connect their Ethereum wallet
- Browse available products
- Purchase items using ETH
- View their purchase history
- "Consume" purchased items

The smart contract is deployed on the Sepolia testnet, providing a gas-efficient and secure way to handle transactions.

## Contract Address

**Sepolia Network**: `0x59767a24be5462F16e8431bf51EC4c9811870bfE`

You can view the contract on [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x59767a24be5462F16e8431bf51EC4c9811870bfE)

## Technologies Used

### Frontend
- **React**: UI framework
- **Web3.js**: Ethereum JavaScript API
- **CSS**: Custom styling
- **MetaMask**: Wallet connection

### Backend/Blockchain
- **Solidity**: Smart contract language
- **Remix IDE**: Smart contract development
- **Sepolia Testnet**: Ethereum test network
- **IPFS**: Decentralized storage for product images

## Features

- **Wallet Integration**: Seamless connection with MetaMask
- **Product Catalog**: Browse available items with images and prices
- **Purchase System**: Buy products with ETH
- **Transaction History**: View all purchases
- **Consumption Tracking**: Mark items as consumed
- **Balance Management**: Add funds to your account

## Getting Started

### Prerequisites
- Node.js and npm
- MetaMask browser extension
- Some Sepolia ETH (available from faucets)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/vending-machine.git
cd vending-machine
```

2. Install dependencies
```bash
cd client
bun install
```

3. Start the development server
```bash
bun run dev
```

4. Connect your MetaMask wallet to the Sepolia testnet

## Smart Contract

The vending machine smart contract handles:
- Product management
- User balances
- Purchase transactions
- Consumption tracking

Key functions include:
- `purchaseProduct(uint256 code)`
- `addFunds()`
- `consumePurchase(uint256 index)`
- `getBalance()`

## Licence
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Acknowledgments

- Ethereum community
- Sepolia testnet team
- IPFS for decentralized storage
- MetaMask for wallet integration