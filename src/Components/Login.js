import React, { useState } from 'react';
import '../Css/Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isWalletConnected, WALLET_ADDRESS, isWalletDisconnected } from '../redux/actionTypes';
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isConnected = useSelector((state) => state.auth.isWalletConnected);
  const walletAddress = useSelector((state) => state.auth.WALLET_ADDRESS);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== '0x61') {
          alert('Please switch to BSC Testnet');
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
          });
        }

        // Update the Redux store with wallet address and connection status
        dispatch({ type: WALLET_ADDRESS, payload: accounts[0] });
        dispatch({ type: isWalletConnected, payload: true });

      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = async () => {
    dispatch({ type: isWalletDisconnected });

    try {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      });
      console.log('Permissions revoked');
    } catch (error) {
      console.error('Error revoking permissions:', error);
    }
    navigate('/login');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Please enter Username first";
    if (!password) newErrors.password = "Please enter Password to proceed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      alert("Please connect wallet");
      return;
    }

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3000/users', {
        username: username,
        password: password,
        walletAddress: walletAddress
      });

      if (response.data.success) { // Check if the response indicates success
        console.log('Response:', response.data.msg);

        // Store the JWT token in localStorage
        let dataToset = response.data.data
       localStorage.setItem('token', dataToset);
      // return
        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        // Handle invalid login or registration errors
        alert(response.data.msg);
      }
    } catch (error) {
      console.error("Error in API call:", error);
      alert('Incorrect Username and Password');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Stake your funds here</h1>
      <div className="input-container">
        <div className="button-container">
          <button className="wallet-button" onClick={isConnected ? disconnectWallet : connectWallet}>
            {isConnected ? `Disconnect Wallet: ${walletAddress}` : 'Connect Wallet'}
          </button>
        </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          // onKeyDown={handleKeyDown}
          className="login-input"
        />
        {errors.username && <small className="text-danger">{errors.username}</small>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="login-input"
        />
        {errors.password && <small className="text-danger">{errors.password}</small>}
      </div>
      <div className="button-container">
        <button className="wallet-button" onClick={handleSubmit} >Login / Register</button>
      </div>
    </div>
  );
};

export default Login;
