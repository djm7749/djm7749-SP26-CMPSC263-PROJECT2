import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import Navbar from '@/components/Dashboard/Navbar'
import { useWallet } from "@/context/WalletContext"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants'

const ViewCollection = () => {
  const { walletAddress } = useWallet()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (walletAddress) {
      fetchUserCollection()
    }
  }, [walletAddress])

  const fetchUserCollection = async () => {
    try {
      setLoading(true)
      if (!window.ethereum) return alert("Please install MetaMask");

      // ETHERS V6: BrowserProvider replaces Web3Provider
      const provider = new ethers.BrowserProvider(window.ethereum); 
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // ETHERS V6: Returns BigInt. Use Number() instead of .toNumber()
      const totalResult = await contract.totalSupply();
      const total = Number(totalResult);
      
      let userCards = []

      // Loop through all minted cards to find ones owned by the user
      for (let i = 0; i < total; i++) {
        const owner = await contract.ownerOf(i)
        
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          const tokenURI = await contract.tokenURI(i)
          
          // Convert ipfs:// to a web-friendly gateway
          const gatewayUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
          
          const response = await fetch(gatewayUrl)
          const metadata = await response.json()
          
          // Find the rarity value inside the attributes array
          const rarityAttr = metadata.attributes?.find(attr => attr.trait_type === "Rarity");
          const cardRarity = rarityAttr ? rarityAttr.value : "Common";
          
          userCards.push({
            id: i,
            name: metadata.name,
            rarity: cardRarity,
            description: metadata.description,
            image: metadata.image?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
          })
        }
      }

      setCards(userCards)
      setLoading(false)
    } catch (error) {
      console.error("Collection search failed:", error)
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Title>* YOUR INVENTORY</Title>
        
        {loading ? (
          <StatusText>SCANNING THE BLOCKCHAIN...</StatusText>
        ) : cards.length === 0 ? (
          <StatusText>EMPTY... NO CARDS FOUND IN YOUR SOUL.</StatusText>
        ) : (
          <CardGrid>
            {cards.map((card) => (
              <RetroCard key={card.id}>
                <CardID>ID: #{card.id}</CardID>
                {card.image && <CardImage src={card.image} alt={card.name} />}
                <CardName>{card.name}</CardName>
                {/* STYLED COMPONENTS: Use $ prefix for custom props */}
                <RarityTag $rarity={card.rarity}>
                  [{card.rarity.toUpperCase()}]
                </RarityTag>
                <CardDesc>{card.description}</CardDesc>
              </RetroCard>
            ))}
          </CardGrid>
        )}
      </Container>
    </PageWrapper>
  )
}

// --- UNDERTALE THEMED STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background: #000;
  min-height: 100vh;
  color: #fff;
  font-family: 'Courier New', monospace;
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
`

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 50px;
  letter-spacing: 4px;
  text-transform: uppercase;
`

const StatusText = styled.p`
  color: #ffff00;
  font-size: 1.5rem;
  margin-top: 100px;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`

const RetroCard = styled.div`
  background: #000;
  border: 4px solid #fff;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.1s ease-in-out;

  &:hover {
    background: #fff;
    color: #000;
    transform: scale(1.05);
  }
`

const CardImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 15px;
  border: 2px solid #fff;
  
  ${RetroCard}:hover & {
    border-color: #000;
  }
`

const CardID = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
  align-self: flex-start;
`

const CardName = styled.h3`
  font-size: 1.4rem;
  margin: 15px 0;
  text-transform: uppercase;
`

const CardDesc = styled.p`
  font-size: 0.85rem;
  margin-top: 15px;
  line-height: 1.4;
  opacity: 0.8;
  
  ${RetroCard}:hover & {
    color: #000;
  }
`

const RarityTag = styled.div`
  font-weight: bold;
  font-size: 1rem;
  padding: 2px 8px;
  
  color: ${props => {
    const r = props.$rarity?.toLowerCase() || '';
    if (r === 'legendary') return '#ff00ff'; // Magenta
    if (r === 'epic') return '#00ffff';      // Cyan
    if (r === 'rare') return '#00ff88';      // Retro Green
    if (r === 'uncommon') return '#ffff00';  // Undertale Yellow
    return '#ffffff';                        // Common
  }};

  ${RetroCard}:hover & {
    background: #000;
  }
`

export default ViewCollection;