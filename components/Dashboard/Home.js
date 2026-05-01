import { ethers } from 'ethers';
import { useState } from 'react';

function LandingPage() {
  const [walletAddress, setWalletAddress] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  return (
    <div className="landing-container">
      <h1>MagicCards</h1>
      <button onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress.substring(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
}