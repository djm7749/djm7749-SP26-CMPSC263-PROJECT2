import styled from 'styled-components'

// --- RETRO-THEMED STYLED COMPONENTS ---

const FeaturesSection = styled.section`
  padding: 80px 0;
  background: #000000; /* Pure black void */
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`

const Feature = styled.div`
  padding: 40px;
  background: #000;
  border: 4px solid #fff; /* Sharp retro white borders */
  transition: all 0.1s ease-in-out;

  &:hover {
    background: #fff;
    color: #000;
    transform: scale(1.02);
    
    /* Invert text color on hover for that retro selection feel */
    h3, p { color: #000; }
  }
`

const FeatureTitle = styled.h3`
  color: #ffff00; /* Undertale yellow for core features */
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:before { content: "* "; } /* Character prompt */
`

const FeatureText = styled.p`
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  text-transform: uppercase; /* Mirrors retro RPG dialogue boxes */
`

export default function Features() {
  const features = [
    {
      title: "True Ownership",
      description: "EVERY CARD IS AN NFT ON THE BSC TESTNET. YOU OWN YOUR DECK PERMANENTLY ON-CHAIN."
    },
    {
      title: "Fair Scarcity",
      description: "CARD RARITY IS FIXED BY SMART CONTRACTS. NO DEVELOPER CAN DUPLICATE YOUR LEGENDARIES."
    },
    {
      title: "Decentralized",
      description: "NO CENTRAL SERVERS. THE GAME LIVES ON THE BLOCKCHAIN, ENSURING TOTAL TRANSPARENCY."
    }
  ]

  return (
    <FeaturesSection>
      <Container>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <Feature key={index}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureText>{feature.description}</FeatureText>
            </Feature>
          ))}
        </FeaturesGrid>
      </Container>
    </FeaturesSection>
  )
}