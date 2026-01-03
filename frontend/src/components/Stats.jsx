import { motion } from 'framer-motion';
import { FaUsers, FaVoteYea, FaCrown, FaCheckCircle } from 'react-icons/fa';

const Stats = ({ stats }) => {
  const statCards = [
    {
      icon: <FaUsers />,
      title: 'Total Candidates',
      value: stats.totalCandidates || 0,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      icon: <FaVoteYea />,
      title: 'Total Votes',
      value: stats.totalVotes || 0,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      icon: <FaCrown />,
      title: 'Leading Candidate',
      value: stats.winner?.name || 'N/A',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: <FaCheckCircle />,
      title: 'Voting Status',
      value: stats.isActive ? 'Active' : 'Closed',
      color: stats.isActive ? '#10b981' : '#ef4444',
      bgColor: stats.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    }}>
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card"
          style={{
            background: 'white',
            borderLeft: `4px solid ${stat.color}`,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                color: stat.color,
              }}
            >
              {stat.icon}
            </motion.div>
            <div>
              <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {stat.title}
              </p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;
