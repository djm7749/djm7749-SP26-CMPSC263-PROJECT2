export const CONTRACT_ADDRESS = '0x6BC588cDF84522e00695db9600b49D425141281A';

// Numeric chain ID for BNB Testnet — used for validation checks
export const CHAIN_ID = 97;
// Hex-encoded chain ID — required by MetaMask's wallet_switchEthereumChain API
export const CHAIN_ID_HEX = '0x61';

// Public RPC endpoint for BNB Testnet — used for read-only (no-wallet) blockchain calls
export const BNB_TESTNET_RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

// Network configuration object passed to MetaMask when adding BNB Testnet to the user's wallet
export const BNB_TESTNET_PARAMS = {
  chainId: CHAIN_ID_HEX,
  chainName: 'BNB Chain Testnet',
  nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
  rpcUrls: [BNB_TESTNET_RPC_URL],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
};

/**
 * ABI (Application Binary Interface) — describes the functions the smart contract exposes.
 * Each entry tells ethers the function name, parameter types, visibility, and return types.
 */
export const CONTRACT_ABI = [
    "function openPack() public",
    "function totalSupply() public view returns (uint256)",
    "function baseIPFSCID() public view returns (string)",
    "function tokenURI(uint256 tokenId) public view returns (string)",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function owner() public view returns (address)"
];
