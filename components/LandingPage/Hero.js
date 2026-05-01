import styled from 'styled-components'
import Link from 'next/link'
import { useWallet } from "@/context/WalletContext"; // Import the context hook

export default function Hero() {
  // Pull the address and connect function from the global state
  const { walletAddress, connectWallet } = useWallet();

  return (
    <HeroSection>
      <Container>
        <Title>Own Your Cards. Play Your Way.</Title>
        <Subtitle>
          A DECENTRALIZED WORLD WHERE TRADING CARDS LIVE PERMANENTLY ON THE BLOCKCHAIN. NO DEVS. NO FRAUD. TRUE OWNERSHIP.
        </Subtitle>
        <CTAButtons>
          {/* If not connected, show Connect button. If connected, show a Go to Dashboard button */}
          {!walletAddress ? (
            <RetroButton $primary onClick={connectWallet}>
              CONNECT WALLET
            </RetroButton>
          ) : (
            <Link href="/dashboard" passHref legacyBehavior>
              <RetroLink primary style={{ background: '#fff', color: '#000' }}>
                GO TO DASHBOARD
              </RetroLink>
            </Link>
          )}
        </CTAButtons>
      </Container>
    </HeroSection>
  )
}

// --- UNDERTALE-THEMED STYLED COMPONENTS ---

const HeroSection = styled.section`
  padding: 100px 0;
  text-align: center;
  background: #000000;
  color: #ffffff;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 25px;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 4px;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #ffff00;
  margin-bottom: 50px;
  font-family: 'Courier New', monospace;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  &:before { content: "* "; }
`

const CTAButtons = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const RetroButton = styled.button`
  padding: 15px 45px;
  font-size: 1.2rem;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  border: 4px solid #ffffff;
  background: ${props => props.primary ? '#ffffff' : 'transparent'};
  color: ${props => props.primary ? '#000000' : '#ffffff'};
  transition: all 0.1s ease-in-out;
  text-transform: uppercase;
  font-weight: bold;

  &:hover {
    background: ${props => props.primary ? 'transparent' : '#ffffff'};
    color: ${props => props.primary ? '#ffffff' : '#000000'};
    transform: scale(1.05);
  }
`

const RetroLink = styled.a`
  padding: 15px 45px;
  font-size: 1.2rem;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  border: 4px solid #ffffff;
  background: transparent;
  color: #ffffff;
  text-decoration: none;
  display: inline-block;
  transition: all 0.1s ease-in-out;
  text-transform: uppercase;
  font-weight: bold;

  &:hover {
    background: #ffffff;
    color: #000000;
    transform: scale(1.05);
  }
`