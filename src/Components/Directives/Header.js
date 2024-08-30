import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isWalletDisconnected } from '../../redux/actionTypes';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const walletAddress = useSelector((state) => state.auth.WALLET_ADDRESS);

  useEffect(() => { 
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication token from localStorage
    // alert("ho rha hain");
    localStorage.removeItem('token');

    // Dispatch wallet disconnection action
    dispatch({ type: isWalletDisconnected });

    // Navigate to the login page
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Staking Dashboard</h1>
      <div style={styles.walletInfo}>
        {walletAddress ? (
          <span style={styles.walletText}>Connected: {walletAddress}</span>
        ) : (
          <span style={styles.walletText}>Not Connected</span>
        )}
      </div>
      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(90deg, #2c3e50 0%, #1e90ff 100%)', // Blue gradient background
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ecf0f1',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
  },
  title: {
    margin: 0,
    fontSize: '28px', // Slightly larger font size for the title
    fontWeight: 'bold',
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  walletText: {
    fontSize: '16px',
    color: '#ecf0f1',
    marginRight: '20px',
  },
  logoutButton: {
    padding: '10px 20px',
    background: 'linear-gradient(90deg, #27ae60 0%, #2ecc71 100%)', // Green gradient for button
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease', // Smooth transition for hover effect
  },
  logoutButtonHover: {
    background: 'linear-gradient(90deg, #1e8449 0%, #27ae60 100%)', // Darker green on hover
  },
};

export default Header;
