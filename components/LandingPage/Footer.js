import styled from 'styled-components'

export default function Footer() {
  return (
    <FooterContainer>
      <Container>
        <p>* © 2026 MAGICCARDs. SP26-CMPSC263. ALL RIGHTS RESERVED.</p>
        <StatusText>SYSTEM STATUS: DECENTRALIZED</StatusText>
      </Container>
    </FooterContainer>
  )
}

// --- RETRO-THEMED STYLED COMPONENTS ---

const FooterContainer = styled.footer`
  width: 100%;
  padding: 30px 0;
  background: #000000;
  color: #ffffff;
  border-top: 4px double #ffffff; /* Classic retro double-line border */
  margin-top: auto; /* Pushes the footer to the bottom of a flex container */
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  p {
    font-size: 0.9rem;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }
`

const StatusText = styled.span`
  color: #ffff00; /* Undertale interaction yellow */
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  text-transform: uppercase;
`