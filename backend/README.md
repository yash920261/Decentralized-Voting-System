# Decentralized Voting System - Backend API

FastAPI backend for interacting with the Ethereum-based voting smart contract.

## Features

- 🗳️ Cast votes on the blockchain
- 📊 Get real-time voting results
- ✅ Check voter status
- 🔒 Admin controls for closing voting
- 🌐 RESTful API with automatic documentation

## Tech Stack

- **FastAPI** - Modern Python web framework
- **web3.py** - Ethereum blockchain interaction
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the `.env.example` file to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
RPC_URL=
CONTRACT_ADDRESS=
PRIVATE_KEY=your_private_key_here
```

### 3. Run the Server

```bash
python app.py
```

Or use uvicorn directly:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Public Endpoints

#### `GET /`
Root endpoint with API information

#### `GET /health`
Health check endpoint

#### `GET /candidates`
Get all candidates with vote counts

**Response:**
```json
[
  {
    "name": "Alice",
    "voteCount": 5
  },
  {
    "name": "Bob",
    "voteCount": 3
  }
]
```

#### `GET /voting-status`
Get voting status information

**Response:**
```json
{
  "isActive": true,
  "admin": "0x...",
  "totalCandidates": 3
}
```

#### `GET /has-voted/{address}`
Check if an address has voted

**Response:**
```json
{
  "address": "0x...",
  "hasVoted": false
}
```

#### `GET /results`
Get voting results with winner

**Response:**
```json
{
  "isActive": false,
  "candidates": [...],
  "winner": {
    "name": "Alice",
    "voteCount": 10
  },
  "totalVotes": 20
}
```

### Transaction Endpoints

#### `POST /vote`
Cast a vote for a candidate

**Request:**
```json
{
  "candidateIndex": 0,
  "voterAddress": "0x...",
  "privateKey": "0x..."
}
```

**Response:**
```json
{
  "transactionHash": "0x...",
  "status": "success",
  "message": "Vote successfully cast for candidate 0"
}
```

#### `POST /close-voting`
Close voting (admin only)

**Request:**
```json
{
  "admin_private_key": "0x..."
}
```

## Interactive API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `403` - Forbidden (not admin)
- `500` - Internal Server Error

## Security Notes

⚠️ **IMPORTANT**:
- Never expose private keys in production
- Use environment variables for sensitive data
- In production, configure CORS to allow only your frontend domain
- Consider using a key management service for production deployments

## Development

### Project Structure

```
backend/
├── app.py              # Main FastAPI application
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
└── README.md          # This file
```

## License

MIT
