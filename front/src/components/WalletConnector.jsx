// 📄 src/components/WalletConnector.jsx
import React, { useState, useEffect } from 'react';

const WalletConnector = ({ onConnect }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      onConnect(accounts[0]);
    } else {
      alert('MetaMask를 설치해주세요.');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onConnect(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <button onClick={connectWallet}>
      {account ? `지갑 연결됨: ${account.slice(0, 6)}...` : '지갑 연결'}
    </button>
  );
};

export default WalletConnector;
