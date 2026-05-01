import React, { useEffect } from 'react' // Added useEffect
import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router' // Added useRouter for redirection
import Navbar from '@/components/Dashboard/Navbar'
import { useWallet } from "@/context/WalletContext";

const Dashboard = () => {
  const { walletAddress } = useWallet()
  const router = useRouter()

  // --- REDIRECTION LOGIC ---
  useEffect(() => {
    // If there is no wallet address, redirect to landing page
    if (!walletAddress) {
      router.push('/')
    }
  }, [walletAddress, router])

  // Prevent flickering: if not connected, don't render the dashboard content
  if (!walletAddress) {
    return (
        <Section>
            <StatusMessage>* RE-ROUTING TO HOME...</StatusMessage>
        </Section>
    );
  }

  return (
    <Section> 
        <Navbar/>
        <Container>
            <Header>
                <h1>MagicCards Dashboard</h1>
                <p>
                    STATUS: {
                      walletAddress
                        ? `CONNECTED [${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}]`
                        : 'DISCONNECTED'
                    }
                </p>
            </Header>

            <Grid>
                <RetroCard>
                    <h2>🎁 Open Pack</h2>
                    <p>MINT A NEW NFT CARD TO YOUR WALLET ON THE BSC TESTNET.</p>
                    <Link href="/open-pack" passHref legacyBehavior>
                        <PixelLink>GO</PixelLink>
                    </Link>
                </RetroCard>

                <RetroCard>
                    <h2>🃏 Collection</h2>
                    <p>VIEW YOUR INDIE-VIBE CARDS STORED PERMANENTLY ON-CHAIN.</p>
                    <Link href="/viewcollection" passHref legacyBehavior>
                        <PixelLink>VIEW</PixelLink>
                    </Link>
                </RetroCard>

                <RetroCard>
                    <h2>📊 Stats</h2>
                    <p>ANALYZE RARITY BREAKDOWN AND TOTAL GAME SCARCITY.</p>
                    <Link href="/stats" passHref legacyBehavior>
                        <PixelLink>STATS</PixelLink>
                    </Link>
                </RetroCard>
            </Grid>
        </Container>
    </Section>
  )
}

// --- UNDERTALE-THEMED STYLED COMPONENTS ---

const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000000;
  color: #ffffff;
  font-family: 'Courier New', Courier, monospace;
`

const StatusMessage = styled.div`
  margin-top: 20%;
  font-size: 24px;
  color: #ffff00;
  text-transform: uppercase;
`

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 60px 20px;
`

const Header = styled.div`
  margin-bottom: 40px;
  text-align: center;
  border-bottom: 4px double #ffffff;
  padding-bottom: 20px;

  h1 {
    font-size: 38px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  p {
    font-size: 14px;
    color: #ffff00;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const RetroCard = styled.div`
  background: #000000;
  padding: 30px;
  border: 4px solid #ffffff;
  transition: all 0.1s ease-in-out;

  &:hover {
    background: #ffffff;
    color: #000000;
    transform: scale(1.05);
    a { color: #000000; }
  }

  h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  p {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 20px;
  }
`

const PixelLink = styled.a`
  display: inline-block;
  color: inherit;
  text-decoration: none;
  font-weight: bold;
  border: 2px solid;
  padding: 5px 15px;
  
  &:before { content: "* "; }

  &:hover {
    text-decoration: underline;
  }
`

export default Dashboard