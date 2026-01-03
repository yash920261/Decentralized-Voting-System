import { motion } from 'framer-motion';
import { FaCheckCircle, FaUser } from 'react-icons/fa';

const VotingCard = ({ candidate, index, onVote, hasVoted, isLoading, isActive }) => {
  const percentage = candidate.totalVotes > 0 
    ? Math.round((candidate.voteCount / candidate.totalVotes) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="card"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Progress Bar Background */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
              }}
            >
              <FaUser />
            </motion.div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--dark)' }}>
                {candidate.name}
              </h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                Candidate #{index + 1}
              </p>
            </div>
          </div>
          
          {hasVoted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <FaCheckCircle style={{ color: 'var(--success)', fontSize: '1.5rem' }} />
            </motion.div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600', color: 'var(--dark)' }}>Votes</span>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
              {candidate.voteCount} ({percentage}%)
            </span>
          </div>
          
          <div style={{
            height: '8px',
            background: 'var(--border)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                borderRadius: '9999px',
              }}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onVote(index)}
          disabled={hasVoted || isLoading || !isActive}
          className="btn btn-primary"
          style={{
            width: '100%',
            background: hasVoted 
              ? 'var(--gray)' 
              : 'linear-gradient(135deg, var(--primary), var(--secondary))',
            justifyContent: 'center',
          }}
        >
          {hasVoted ? 'Already Voted' : isLoading ? 'Voting...' : 'Vote for this Candidate'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VotingCard;
