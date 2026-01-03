import { BrowserProvider, Contract } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID;

// Contract ABI
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'string[]', name: 'candidateNames', type: 'string[]' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'candidates',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'voteCount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'closeVoting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCandidates',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'uint256', name: 'voteCount', type: 'uint256' },
        ],
        internalType: 'struct Voting.Candidate[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'hasVoted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'candidateIndex', type: 'uint256' }],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingActive',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
];

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connect() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.account = accounts[0];

      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== `0x${parseInt(CHAIN_ID).toString(16)}`) {
        await this.switchNetwork();
      }

      // Initialize provider and contract
      this.provider = new BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

      return this.account;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  // Switch to correct network
  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(CHAIN_ID).toString(16)}` }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }

  // Get candidates from contract
  async getCandidates() {
    if (!this.contract) await this.connect();
    const candidates = await this.contract.getCandidates();
    return candidates.map((c) => ({
      name: c[0],
      voteCount: Number(c[1]),
    }));
  }

  // Check if address has voted
  async hasVoted(address) {
    if (!this.contract) await this.connect();
    return await this.contract.hasVoted(address);
  }

  // Vote for candidate
  async vote(candidateIndex) {
    if (!this.contract) await this.connect();
    const tx = await this.contract.vote(candidateIndex);
    await tx.wait();
    return tx.hash;
  }

  // Get voting status
  async getVotingStatus() {
    if (!this.contract) await this.connect();
    const isActive = await this.contract.votingActive();
    const admin = await this.contract.admin();
    return { isActive, admin };
  }

  // Close voting (admin only)
  async closeVoting() {
    if (!this.contract) await this.connect();
    const tx = await this.contract.closeVoting();
    await tx.wait();
    return tx.hash;
  }

  // Listen to account changes
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        this.account = accounts[0];
        callback(accounts[0]);
      });
    }
  }

  // Listen to network changes
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }
}

export default new Web3Service();
