import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import Navbar from '@/components/Dashboard/Navbar'
import { useWallet } from "@/context/WalletContext"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants'

const Stats = () => {
  const { walletAddress } = useWallet()
  const [globalStats, setGlobalStats] = useState({ totalMinted: 0 })
  const [userStats, setUserStats] = useState({ 
    common: 0, 
    uncommon: 0, 
    rare: 0, 
    epic: 0, 
    legendary: 0, 
    total: 0 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (walletAddress) {
      calculateStats()
    }
  }, [walletAddress])

  const calculateStats = async () => {
    try {
      setLoading(true)
      if (!window.ethereum) return;

      // ETHERS V6: Use BrowserProvider
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

      // 1. Get Global Supply from Contract
      const totalSupplyBigInt = await contract.totalSupply()
      // ETHERS V6: Convert BigInt to Number
      const totalGlobal = Number(totalSupplyBigInt)
      setGlobalStats({ totalMinted: totalGlobal })

      // 2. Scan Blockchain for User's cards and Rarity
      let counts = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, total: 0 }
      
      for (let i = 0; i < totalGlobal; i++) {
        const owner = await contract.ownerOf(i)
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          const tokenURI = await contract.tokenURI(i)
          const gatewayUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
          
          const response = await fetch(gatewayUrl)
          const metadata = await response.json()
          
          // Parse the rarity from the attributes array
          const rarityAttr = metadata.attributes?.find(attr => attr.trait_type === "Rarity");
          const cardRarity = rarityAttr ? rarityAttr.value.toLowerCase() : "common";
          
          if (counts.hasOwnProperty(cardRarity)) {
            counts[cardRarity]++;
          } else {
            counts.common++;
          }
          counts.total++
        }
      }

      setUserStats(counts)
      setLoading(false)
    } catch (error) {
      console.error("Error calculating system stats:", error)
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Title>* SYSTEM DATA</Title>

        {loading ? (
          <StatusText>INTERROGATING THE BLOCKCHAIN...</StatusText>
        ) : (
          <StatsGrid>
            {/* Global Card Counter */}
            <StatCard>
              <Label>TOTAL MINTED (GLOBAL)</Label>
              <Value $color="#ffff00">{globalStats.totalMinted}</Value>
              <SubLabel>MAX CAPACITY: 20</SubLabel>
            </StatCard>

            {/* User Total */}
            <StatCard>
              <Label>YOUR COLLECTION SIZE</Label>
              <Value>{userStats.total}</Value>
              <SubLabel>VERIFIED ON-CHAIN</SubLabel>
            </StatCard>

            {/* Rarity Breakdown */}
            <BreakdownCard>
              <h3>* RARITY DISTRIBUTION</h3>
              <Row $color="#ffffff">
                <span>COMMON:</span>
                <span>{userStats.common}</span>
              </Row>
              <Row $color="#ffff00">
                <span>UNCOMMON:</span>
                <span>{userStats.uncommon}</span>
              </Row>
              <Row $color="#00ff88">
                <span>RARE:</span>
                <span>{userStats.rare}</span>
              </Row>
              <Row $color="#00ffff">
                <span>EPIC:</span>
                <span>{userStats.epic}</span>
              </Row>
              <Row $color="#ff00ff">
                <span>LEGENDARY:</span>
                <span>{userStats.legendary}</span>
              </Row>
            </BreakdownCard>
          </StatsGrid>
        )}
      </Container>
    </PageWrapper>
  )
}

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background: #000;
  min-height: 100vh;
  color: #fff;
  font-family: 'Courier New', monospace;
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
`

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 50px;
  letter-spacing: 3px;
  text-transform: uppercase;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  border: 4px solid #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #000;
`

const BreakdownCard = styled.div`
  border: 4px solid #fff;
  padding: 40px;
  text-align: left;
  grid-column: span 2;

  h3 { 
    margin-bottom: 30px; 
    color: #ffff00; 
    font-size: 1.8rem;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`

const Label = styled.div`
  font-size: 1rem;
  margin-bottom: 10px;
  letter-spacing: 1px;
`

const SubLabel = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 10px;
`

const Value = styled.div`
  font-size: 5rem;
  font-weight: bold;
  color: ${props => props.$color || '#fff'};
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: ${props => props.$color || '#fff'};
  border-bottom: 2px dashed #333;
  padding-bottom: 10px;
`

const StatusText = styled.p`
  color: #ffff00;
  font-size: 1.5rem;
  margin-top: 100px;
`

export default Stats;