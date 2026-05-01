import styled from 'styled-components'
import Link from 'next/link'
import { useWallet } from "@/context/WalletContext";

export default function Navbar() {
  // Pull everything from the Context. No need to define functions here!
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();

  // Helper to format the display address
  const shortAddress = walletAddress 
    ? `* ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
    : 'CONNECT WALLET';

  return (
    <Nav>
      <Left>
        <Logo>MagicCards</Logo>
        {!walletAddress ? (
            <p>Please connect to wallet</p>
          ) : (
            <Link href="/dashboard" passHref legacyBehavior>
          <RetroNavLink>Dashboard</RetroNavLink>
        </Link>
          )}
      </Left>
      <Right>
        {!walletAddress ? (
          <WalletBtn onClick={connectWallet}>
            {shortAddress}
          </WalletBtn>
        ) : (
          <WalletBtn onClick={disconnectWallet}>
            LOGOUT: {shortAddress}
          </WalletBtn>
        )}
      </Right>
    </Nav>
  )
}

// --- STYLED COMPONENTS (Keep these as they are) ---

const Nav = styled.nav`
  width: 100%;
  height: 70px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 4px solid #fff;
  z-index: 100;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`

const Right = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled.div`
  font-size: 1.8rem;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  letter-spacing: 2px;
`

const RetroNavLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  padding: 5px 10px;
  border: 2px solid transparent;

  &:hover {
    color: #ffff00;
    border: 2px solid #ffff00;
  }
`

const WalletBtn = styled.button`
  background: #000;
  color: #fff;
  border: 3px solid #fff;
  padding: 8px 16px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  text-transform: uppercase;

  &:hover {
    background: #fff;
    color: #000;
  }
`