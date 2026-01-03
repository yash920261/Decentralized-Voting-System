import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service
export const votingAPI = {
  // Get API health
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get all candidates
  getCandidates: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Get voting status
  getVotingStatus: async () => {
    const response = await api.get('/voting-status');
    return response.data;
  },

  // Check if address has voted
  hasVoted: async (address) => {
    const response = await api.get(`/has-voted/${address}`);
    return response.data;
  },

  // Get results
  getResults: async () => {
    const response = await api.get('/results');
    return response.data;
  },

  // Cast vote
  vote: async (candidateIndex, voterAddress, privateKey) => {
    const response = await api.post('/vote', {
      candidateIndex,
      voterAddress,
      privateKey,
    });
    return response.data;
  },

  // Close voting (admin only)
  closeVoting: async (adminPrivateKey) => {
    const response = await api.post('/close-voting', {
      admin_private_key: adminPrivateKey,
    });
    return response.data;
  },
};

export default api;
