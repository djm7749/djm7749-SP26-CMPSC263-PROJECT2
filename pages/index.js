import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Footer from "@/components/LandingPage/Footer"
import Hero from "@/components/LandingPage/Hero"
import Features from "@/components/LandingPage/Features"

export default function Home() {
  return (
    <>
        <Navbar/>
        <Hero/>
        <Features/>
        <Footer/>
    </>
  )
}
