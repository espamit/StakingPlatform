import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isWalletConnected, WALLET_ADDRESS, isWalletDisconnected } from '../redux/actionTypes';

const ConnectWallet = () => {
  const dispatch = useDispatch();

  const isConnected = useSelector((state) => state.auth.isWalletConnected);
  const walletAddress = useSelector((state) => state.auth.WALLET_ADDRESS);

  console.log("isConnected", isConnected);
  console.log("walletAddress", walletAddress);

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
    // Reset application state to simulate disconnection
    dispatch({ type: isWalletDisconnected });

    // Attempt to revoke permissions
    try {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      });
      console.log('Permissions revoked');
    } catch (error) {
      console.error('Error revoking permissions:', error);
    }

    // Optionally, you might also want to clear any cached state or do additional cleanup here
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Wallet is connected: {walletAddress}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
