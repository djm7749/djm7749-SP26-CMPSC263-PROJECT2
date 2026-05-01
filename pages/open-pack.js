import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { ethers } from 'ethers'
import Navbar from '@/components/Dashboard/Navbar'
import { useWallet } from "@/context/WalletContext"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants'

const OpenPack = () => {
    const { walletAddress } = useWallet()
    const [isMinting, setIsMinting] = useState(false)
    const [revealedCard, setRevealedCard] = useState(null)
    const [status, setStatus] = useState('READY TO SUMMON?')

    const handleOpenPack = async () => {
    if (!window.ethereum) return alert("Install MetaMask")
    
    try {
        setIsMinting(true)
        setStatus('TALKING TO THE BLOCKCHAIN...')
        setRevealedCard(null)

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const tx = await contract.openPack();
        setStatus('WAITING FOR CONFIRMATION...')
        
        const receipt = await tx.wait(); 
        console.log("Transaction confirmed!");

        if (receipt.logs && receipt.logs.length > 0) {
            // 1. Get the Token ID from logs
            const tokenId = receipt.logs[0].topics[3] 
                ? BigInt(receipt.logs[0].topics[3]).toString() 
                : "0";

            setStatus('FETCHING CARD DATA...');

            // 2. Get the Folder CID from the contract
            const baseCID = await contract.baseIPFSCID();
            
            // 3. Fetch JSON from IPFS (using a public gateway)
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${baseCID}/${tokenId}.json`);
            const metadata = await response.json();

            // 4. Update the UI with the actual card data
            setRevealedCard({
                id: tokenId,
                name: metadata.name,
                rarity: metadata.attributes?.find(a => a.trait_type === 'Rarity')?.value || 'Common',
            });

            setStatus('PACK OPENED!');
        }

        setIsMinting(false);
        
    } catch (error) {
        console.error(error);
        setStatus('TRANSACTION FAILED. TRY AGAIN?');
        setIsMinting(false);
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <StatusText>* {status}</StatusText>
        
        <PackDisplay>
          {isMinting ? (
            <ShakingPack>🎁</ShakingPack>
          ) : revealedCard ? (
            <RevealedCard>
              <h3>{revealedCard.name}</h3>
              <p>RARITY: {revealedCard.rarity}</p>
              <p>ID: #{revealedCard.id}</p>
            </RevealedCard>
          ) : (
            <StaticPack>🎁</StaticPack>
          )}
        </PackDisplay>

        {!isMinting && (
          <RetroButton onClick={handleOpenPack}>
            {revealedCard ? 'OPEN ANOTHER' : 'OPEN PACK (0.0 BNB + GAS)'}
          </RetroButton>
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
  align-items: center;
`

const Container = styled.div`
  margin-top: 50px;
  text-align: center;
`

const StatusText = styled.h2`
  color: #ffff00;
  margin-bottom: 40px;
  font-size: 1.5rem;
`

const shake = keyframes`
  0% { transform: translate(1px, 1px) rotate(0deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  40% { transform: translate(3px, 2px) rotate(-1deg); }
  100% { transform: translate(1px, -1px) rotate(0deg); }
`

const PackDisplay = styled.div`
  font-size: 100px;
  margin-bottom: 40px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ShakingPack = styled.div`
  animation: ${shake} 0.2s infinite;
`

const StaticPack = styled.div``

const RevealedCard = styled.div`
  border: 4px solid #fff;
  padding: 20px;
  width: 200px;
  background: #000;
  
  h3 { font-size: 1.2rem; color: #ffff00; margin-bottom: 10px; }
  p { font-size: 0.8rem; margin: 5px 0; }
`

const RetroButton = styled.button`
  background: #000;
  color: #fff;
  border: 4px solid #fff;
  padding: 15px 30px;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    background: #fff;
    color: #000;
  }
`

export default OpenPack