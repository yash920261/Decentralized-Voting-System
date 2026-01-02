from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from web3 import Web3
from typing import List, Optional
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Decentralized Voting System API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Web3 configuration
RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "0x5E95A1e4922Eeccc5B76cdFB0c59aad77fCd1d40")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

if not RPC_URL:
    raise ValueError("RPC_URL not found in environment variables")

w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Contract will be checked on first request
print(f"Web3 provider configured with RPC: {RPC_URL[:50]}...")

# Contract ABI
CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "string[]", "name": "candidateNames", "type": "string[]"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "candidates",
        "outputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "closeVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCandidates",
        "outputs": [
            {
                "components": [
                    {"internalType": "string", "name": "name", "type": "string"},
                    {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
                ],
                "internalType": "struct Voting.Candidate[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "hasVoted",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "candidateIndex", "type": "uint256"}],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "votingActive",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
]

# Initialize contract
contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=CONTRACT_ABI)

# Pydantic models
class Candidate(BaseModel):
    name: str
    voteCount: int

class VoteRequest(BaseModel):
    candidateIndex: int
    voterAddress: str
    privateKey: str

class VotingStatus(BaseModel):
    isActive: bool
    admin: str
    totalCandidates: int

class TransactionResponse(BaseModel):
    transactionHash: str
    status: str
    message: str

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Decentralized Voting System API",
        "version": "1.0.0",
        "contract_address": CONTRACT_ADDRESS,
        "network_connected": w3.is_connected()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "web3_connected": w3.is_connected(),
        "latest_block": w3.eth.block_number
    }

@app.get("/candidates", response_model=List[Candidate])
async def get_candidates():
    """Get all candidates with their vote counts"""
    try:
        candidates = contract.functions.getCandidates().call()
        return [
            {"name": candidate[0], "voteCount": candidate[1]}
            for candidate in candidates
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching candidates: {str(e)}")

@app.get("/voting-status", response_model=VotingStatus)
async def get_voting_status():
    """Get voting status information"""
    try:
        is_active = contract.functions.votingActive().call()
        admin = contract.functions.admin().call()
        candidates = contract.functions.getCandidates().call()
        
        return {
            "isActive": is_active,
            "admin": admin,
            "totalCandidates": len(candidates)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching voting status: {str(e)}")

@app.get("/has-voted/{address}")
async def check_has_voted(address: str):
    """Check if an address has already voted"""
    try:
        checksum_address = Web3.to_checksum_address(address)
        has_voted = contract.functions.hasVoted(checksum_address).call()
        return {"address": address, "hasVoted": has_voted}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid address: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking vote status: {str(e)}")

@app.post("/vote", response_model=TransactionResponse)
async def cast_vote(vote_request: VoteRequest):
    """Cast a vote for a candidate"""
    try:
        # Validate address
        voter_address = Web3.to_checksum_address(vote_request.voterAddress)
        
        # Check if already voted
        has_voted = contract.functions.hasVoted(voter_address).call()
        if has_voted:
            raise HTTPException(status_code=400, detail="Address has already voted")
        
        # Check if voting is active
        is_active = contract.functions.votingActive().call()
        if not is_active:
            raise HTTPException(status_code=400, detail="Voting is closed")
        
        # Get account from private key
        account = w3.eth.account.from_key(vote_request.privateKey)
        
        # Verify the address matches
        if account.address.lower() != voter_address.lower():
            raise HTTPException(status_code=400, detail="Private key does not match voter address")
        
        # Build transaction
        nonce = w3.eth.get_transaction_count(voter_address)
        
        transaction = contract.functions.vote(vote_request.candidateIndex).build_transaction({
            'from': voter_address,
            'nonce': nonce,
            'gas': 200000,
            'gasPrice': w3.eth.gas_price
        })
        
        # Sign transaction
        signed_txn = w3.eth.account.sign_transaction(transaction, vote_request.privateKey)
        
        # Send transaction
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        # Wait for transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        
        if tx_receipt['status'] == 1:
            return {
                "transactionHash": tx_hash.hex(),
                "status": "success",
                "message": f"Vote successfully cast for candidate {vote_request.candidateIndex}"
            }
        else:
            raise HTTPException(status_code=500, detail="Transaction failed")
            
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error casting vote: {str(e)}")

@app.post("/close-voting", response_model=TransactionResponse)
async def close_voting(admin_private_key: str):
    """Close voting (admin only)"""
    try:
        # Get account from private key
        account = w3.eth.account.from_key(admin_private_key)
        admin_address = account.address
        
        # Verify admin
        contract_admin = contract.functions.admin().call()
        if admin_address.lower() != contract_admin.lower():
            raise HTTPException(status_code=403, detail="Only admin can close voting")
        
        # Build transaction
        nonce = w3.eth.get_transaction_count(admin_address)
        
        transaction = contract.functions.closeVoting().build_transaction({
            'from': admin_address,
            'nonce': nonce,
            'gas': 100000,
            'gasPrice': w3.eth.gas_price
        })
        
        # Sign transaction
        signed_txn = w3.eth.account.sign_transaction(transaction, admin_private_key)
        
        # Send transaction
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        
        # Wait for transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        
        if tx_receipt['status'] == 1:
            return {
                "transactionHash": tx_hash.hex(),
                "status": "success",
                "message": "Voting successfully closed"
            }
        else:
            raise HTTPException(status_code=500, detail="Transaction failed")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error closing voting: {str(e)}")

@app.get("/results")
async def get_results():
    """Get voting results with winner"""
    try:
        candidates = contract.functions.getCandidates().call()
        is_active = contract.functions.votingActive().call()
        
        results = [
            {"name": candidate[0], "voteCount": candidate[1]}
            for candidate in candidates
        ]
        
        # Find winner
        winner = max(results, key=lambda x: x['voteCount']) if results else None
        total_votes = sum(c['voteCount'] for c in results)
        
        return {
            "isActive": is_active,
            "candidates": results,
            "winner": winner,
            "totalVotes": total_votes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching results: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
