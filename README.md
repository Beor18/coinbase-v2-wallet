# Coinbase Wallet API Demo

A comprehensive demonstration of the Coinbase Wallet API v2, showcasing how to create blockchain accounts, fund them with test tokens, and transfer funds easily across Ethereum and Solana networks.

## About This Project

This project serves as a practical implementation and demonstration of the Coinbase Developer Platform (CDP) SDK, allowing developers to interact with blockchain networks through a simple and intuitive interface. It provides a working example of how to integrate blockchain functionality into web applications.

## Features

- **Multi-blockchain Support**: Interact with both EVM-compatible chains (Ethereum, Base) and Solana
- **Account Management**: Create and manage regular and smart accounts
- **Test Network Integration**: Connect to testnets (Sepolia, Base Sepolia, Solana Devnet)
- **Faucet Integration**: Request test tokens directly from network faucets
- **Transaction Management**: Send and receive transactions with real-time status updates
- **Transaction History**: View and track all transactions with explorer links
- **Responsive UI**: User-friendly interface that works across devices

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Blockchain**: Coinbase CDP SDK, viem (for EVM), @solana/web3.js
- **API**: Server-side API routes for secure blockchain interactions

## Getting Started

### Prerequisites

- Node.js v18 or higher
- Coinbase Developer Platform credentials:
  - CDP_API_KEY_ID
  - CDP_API_KEY_SECRET
  - CDP_WALLET_SECRET

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/coinbase-wallet-api-demo.git
   cd coinbase-wallet-api-demo
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file with your CDP credentials:
   \`\`\`
   CDP_API_KEY_ID=your-api-key-id
   CDP_API_KEY_SECRET=your-api-key-secret
   CDP_WALLET_SECRET=your-wallet-secret
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### EVM (Ethereum) Accounts

1. Select the network (Base Sepolia or Ethereum Sepolia)
2. Create a regular account
3. Request test ETH from the faucet
4. Send transactions to other addresses
5. View transaction history and details

### Solana Accounts

1. Select the network (Devnet or Testnet)
2. Create a Solana account
3. Request test SOL from the faucet
4. Send transactions to other Solana addresses
5. View transaction history with explorer links

## Benefits to the Blockchain Ecosystem

This project contributes to the blockchain ecosystem in several important ways:

### 1. Lowering the Barrier to Entry

By providing a clear, working example of blockchain integration, this demo helps developers new to Web3 understand how to build blockchain applications without getting lost in complex documentation.

### 2. Promoting Best Practices

The codebase demonstrates secure and efficient patterns for blockchain interactions, including:
- Server-side API routes for sensitive operations
- Proper error handling and transaction confirmation
- User-friendly status updates and notifications

### 3. Accelerating Development

Developers can use this project as a starting point or reference for their own applications, significantly reducing development time and avoiding common pitfalls.

### 4. Cross-Chain Education

By supporting both EVM chains and Solana, the demo helps developers understand the differences and similarities between blockchain ecosystems, promoting cross-chain literacy.

### 5. Testing and Experimentation

The testnet integration allows for risk-free experimentation with blockchain technology, encouraging innovation without the financial risks of mainnet development.

## Future Enhancements

- Add support for more blockchains
- Implement message signing functionality
- Create an interactive tutorial
- Add smart contract interaction
- Implement biometric authentication
- Add NFT support
- Create a business dashboard
- Improve error handling
- Add support for multiple networks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This is a demonstration project and should not be used in production without proper security review and testing.
