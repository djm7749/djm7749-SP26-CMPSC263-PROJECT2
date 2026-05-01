import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const router = useRouter();

  // 1. Core Connection Logic with Network Switching
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Switch to BSC Testnet (0x61 = 97)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }], 
        });
      } catch (switchError) {
        // If chain isn't added to MetaMask, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x61',
              chainName: 'BNB Chain Testnet',
              nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com'],
            }],
          });
        }
      }

      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // 2. Disconnect Logic
  const disconnectWallet = () => {
    setWalletAddress(null);
    router.push('/'); // Send back to landing page on logout
  };

  // 3. Persistent Check
  const checkConnection = async () => {
    if (!window.ethereum) return;

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
    }
  };

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          disconnectWallet();
        }
      });
    }
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);