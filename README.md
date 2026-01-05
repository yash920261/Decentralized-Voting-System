# Decentralized Voting System

A complete decentralized voting application built with blockchain technology, featuring a Solidity smart contract, Python FastAPI backend, and React frontend with real-time updates and MetaMask integration.

## 🌟 Features

- ✅ **Secure Blockchain Voting** - All votes recorded on Ethereum blockchain
- ✅ **Real-time Results** - Live updates with auto-refresh and manual refresh
- ✅ **MetaMask Integration** - Secure wallet connection for voting
- ✅ **Admin Controls** - Close voting functionality for administrators
- ✅ **Responsive UI** - Beautiful animations with Framer Motion
- ✅ **Full Stack Architecture** - Backend API for data aggregation
- ✅ **Sepolia Testnet** - Live deployment on Ethereum test network

## 🛠️ Tech Stack

### Backend
- **Python** - Core language
- **FastAPI** - Modern web framework
- **web3.py** - Ethereum blockchain interaction
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animations
- **ethers.js** - Ethereum wallet integration
- **react-icons** - Icon library

### Blockchain
- **Solidity** - Smart contract language
- **Hardhat** - Development framework
- **Ethereum** - Blockchain platform
- **MetaMask** - Wallet integration

## 📁 Project Structure

```
decentralized_voting_system/
├── contracts/
│   └── Voting.sol              # Smart contract
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── config.py              # Configuration
│   ├── services/
│   │   ├── api.js             # API service
│   │   └── web3.js            # Web3 service
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Wallet connection UI
│   │   │   ├── VotingCard.jsx # Candidate voting UI
│   │   │   └── Stats.jsx      # Statistics dashboard
│   │   ├── services/
│   │   │   └── web3.js        # Web3 integration
│   │   └── App.jsx            # Main application
│   └── package.json           # JavaScript dependencies
├── scripts/
│   ├── deploy.ts              # Contract deployment
│   └── closeVoting.ts         # Voting closure script
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MetaMask wallet
- Sepolia ETH (for gas fees)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd decentralized_voting_system
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the backend directory:

```env
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
PRIVATE_KEY=YOUR_PRIVATE_KEY
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 5. Configure Frontend Environment
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_CHAIN_ID=11155111
VITE_CHAIN_NAME=Sepolia
```

### 6. Deploy Smart Contract
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

### 7. Start the Backend
```bash
cd backend
python app.py
```

### 8. Start the Frontend
```bash
cd frontend
npm run dev
```

## 🔧 API Endpoints

### GET Endpoints
- `GET /` - API information
- `GET /health` - Health check
- `GET /candidates` - Get all candidates with vote counts
- `GET /voting-status` - Get voting status information
- `GET /has-voted/{address}` - Check if address has voted
- `GET /results` - Get voting results with winner

### POST Endpoints
- `POST /vote` - Cast a vote for a candidate
- `POST /close-voting` - Close voting (admin only)

## 🎯 Voting Process

1. **Connect Wallet** - Click "Connect Wallet" to connect MetaMask
2. **Select Candidate** - Choose a candidate from the list
3. **Cast Vote** - Click "Vote for this Candidate" and confirm in MetaMask
4. **View Results** - Real-time results update automatically

## 🔒 Security Features

- **Double Vote Prevention** - Blockchain-level check using `hasVoted` mapping
- **Admin Controls** - Only contract admin can close voting
- **Wallet Verification** - MetaMask integration for secure transactions
- **Environment Security** - Sensitive files properly excluded from git
- **Input Validation** - Comprehensive validation at all layers

## 📊 Real-time Updates

- **Auto-refresh** - Data updates every 30 seconds in the background
- **Manual Refresh** - "Refresh Data" button for immediate updates
- **Live Stats** - Real-time statistics dashboard
- **Progress Animations** - Animated vote count progress bars

## 🎨 UI Features

- **Beautiful Animations** - Framer Motion powered transitions
- **Responsive Design** - Works on all device sizes
- **Interactive Elements** - Hover and tap animations
- **Loading States** - Visual feedback during operations
- **Toast Notifications** - Success/error messages

## 🚀 Deployment

### Frontend Deployment
- Deployed on Vercel with proper routing configuration
- Environment variables configured in Vercel dashboard
- Auto-build from GitHub repository

### Backend Deployment
- Deploy to Render, Railway, or similar Python hosting platforms
- Environment variables securely configured
- Connected to live blockchain network

## 📄 Contract Functions

- `vote(uint candidateIndex)` - Cast a vote for a candidate
- `closeVoting()` - Close voting (admin only)
- `getCandidates()` - Get all candidates with vote counts
- `hasVoted(address)` - Check if address has voted
- `votingActive()` - Check if voting is active
- `admin()` - Get contract admin address

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License

## 🐛 Troubleshooting

- **MetaMask not connecting**: Ensure you're on the correct network (Sepolia)
- **Backend not connecting**: Verify your RPC_URL and contract address
- **Frontend not loading**: Check that backend API is running and accessible
- **Voting fails**: Ensure you have sufficient gas and haven't voted already

## 📞 Support

For support, please open an issue in the GitHub repository.
