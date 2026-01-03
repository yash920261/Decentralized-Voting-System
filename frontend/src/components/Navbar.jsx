import { motion } from 'framer-motion';
import { FaWallet, FaVoteYea } from 'react-icons/fa';

const Navbar = ({ account, onConnect }) => {
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--primary)',
        }}
      >
        <FaVoteYea />
        <span>Decentralized Voting</span>
      </motion.div>

      {account ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
          }}
        >
          <FaWallet />
          {formatAddress(account)}
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          }}
        >
          <FaWallet />
          Connect Wallet
        </motion.button>
      )}
    </motion.nav>
  );
};

export default Navbar;
