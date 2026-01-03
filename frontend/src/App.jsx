import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import VotingCard from './components/VotingCard';
import Stats from './components/Stats';
import web3Service from './services/web3';
import { votingAPI } from './services/api';
import { FaSpinner, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';

function App() {
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState({ isActive: false, admin: '', totalCandidates: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [voting, setVoting] = useState(false);
  const [closingVoting, setClosingVoting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      setError(null);
      if (!web3Service.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this app.');
      }

      const address = await web3Service.connect();
      setAccount(address);
      showToast('Wallet connected successfully!');
      
      // Check if user has voted
      await checkVotingStatus(address);
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    }
  };

  // Check if user has voted
  const checkVotingStatus = async (address) => {
    try {
      const voted = await web3Service.hasVoted(address || account);
      setHasVoted(voted);
    } catch (err) {
      console.error('Error checking voting status:', err);
    }
  };

  // Load voting data
  const loadVotingData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      // Fetch from backend API
      const [candidatesData, statusData, resultsData] = await Promise.all([
        votingAPI.getCandidates(),
        votingAPI.getVotingStatus(),
        votingAPI.getResults(),
      ]);

      const totalVotes = resultsData.totalVotes;
      const candidatesWithPercentage = candidatesData.map(c => ({
        ...c,
        totalVotes,
      }));

      setCandidates(candidatesWithPercentage);
      setVotingStatus(statusData);
      
    } catch (err) {
      console.error('Error loading voting data:', err);
      if (showLoader) {
        setError('Failed to load voting data. Please refresh the page.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cast vote
  const handleVote = async (candidateIndex) => {
    if (!account) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    if (hasVoted) {
      showToast('You have already voted!', 'error');
      return;
    }

    try {
      setVoting(true);
      setError(null);

      // Vote using MetaMask
      const txHash = await web3Service.vote(candidateIndex);
      
      showToast(`Vote cast successfully! Transaction: ${txHash.substring(0, 10)}...`, 'success');
      
      // Update UI
      setHasVoted(true);
      await loadVotingData();
      
    } catch (err) {
      console.error('Error voting:', err);
      setError(err.message || 'Failed to cast vote');
      showToast(err.message || 'Failed to cast vote', 'error');
    } finally {
      setVoting(false);
    }
  };

  // Close voting (admin only)
  const handleCloseVoting = async () => {
    if (!account) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    if (account.toLowerCase() !== votingStatus.admin?.toLowerCase()) {
      showToast('Only admin can close voting', 'error');
      return;
    }

    try {
      setClosingVoting(true);
      setError(null);
      
      // In a real implementation, you would call the backend API
      // For now, we'll use the web3 service to call the contract directly
      const txHash = await web3Service.closeVoting();
      
      showToast(`Voting closed successfully! Transaction: ${txHash.substring(0, 10)}...`, 'success');
      
      // Update UI
      await loadVotingData();
      
    } catch (err) {
      console.error('Error closing voting:', err);
      setError(err.message || 'Failed to close voting');
      showToast(err.message || 'Failed to close voting', 'error');
    } finally {
      setClosingVoting(false);
    }
  };

  // Initialize app
  useEffect(() => {
    loadVotingData();

    // Setup MetaMask event listeners
    web3Service.onAccountsChanged((newAccount) => {
      setAccount(newAccount);
      if (newAccount) {
        checkVotingStatus(newAccount);
      }
    });

    web3Service.onChainChanged(() => {
      window.location.reload();
    });

    // Auto-refresh every 30 seconds (reduced from 10)
    const interval = setInterval(() => loadVotingData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const stats = {
    totalCandidates: candidates.length,
    totalVotes: candidates.reduce((sum, c) => sum + c.voteCount, 0),
    winner: candidates.length > 0 ? candidates.reduce((max, c) => c.voteCount > max.voteCount ? c : max, candidates[0]) : null,
    isActive: votingStatus.isActive,
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar account={account} onConnect={connectWallet} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <FaExclamationTriangle />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'white',
          }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Decentralized Voting System
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '1rem' }}>
            Secure, Transparent, and Immutable Blockchain Voting
          </p>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Manual Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadVotingData(false)}
              disabled={refreshing}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                cursor: refreshing ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
              }}
            >
              <motion.div
                animate={{ rotate: refreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
              >
                <FaSyncAlt />
              </motion.div>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </motion.button>
            
            {/* Close Voting Button - Only for Admin */}
            {account && votingStatus.admin && account.toLowerCase() === votingStatus.admin.toLowerCase() && votingStatus.isActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseVoting}
                disabled={closingVoting}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#ef4444',
                  border: '2px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  cursor: closingVoting ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                }}
              >
                <motion.div
                  animate={{ rotate: closingVoting ? 360 : 0 }}
                  transition={{ duration: 1, repeat: closingVoting ? Infinity : 0, ease: 'linear' }}
                >
                  <FaSpinner />
                </motion.div>
                {closingVoting ? 'Closing...' : 'Close Voting'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: '1rem',
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <FaSpinner style={{ fontSize: '3rem', color: 'white' }} />
            </motion.div>
            <p style={{ color: 'white', fontSize: '1.25rem' }}>Loading voting data...</p>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <Stats stats={stats} />

            {/* Voting Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {candidates.map((candidate, index) => (
                <VotingCard
                  key={index}
                  candidate={candidate}
                  index={index}
                  onVote={handleVote}
                  hasVoted={hasVoted}
                  isLoading={voting}
                  isActive={votingStatus.isActive}
                />
              ))}
            </div>

            {/* Instructions */}
            {!account && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="card"
                style={{
                  marginTop: '2rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                  Get Started
                </h3>
                <p style={{ color: 'var(--gray)' }}>
                  Connect your MetaMask wallet to participate in the voting process
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="toast"
            style={{
              borderLeft: `4px solid ${toast.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            }}
          >
            <p style={{
              fontWeight: '600',
              color: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
            }}>
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
