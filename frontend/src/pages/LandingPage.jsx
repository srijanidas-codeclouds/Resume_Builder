import React from 'react'
import Navbar from '../components/Navbar.jsx'
import HeroSection from '@/components/HeroSection.jsx'
import Footer from '@/components/Footer.jsx'
import Features from '@/components/Features.jsx'
import AboutUs from '@/components/AboutUs.jsx'
import ContactUs from '@/components/ContactUs.jsx'

const LandingPage = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <AboutUs />
        <Features />
        <div>
            <hr className='border-1 border-white'/>
        </div>
        <ContactUs />
        <Footer />
    </div>
  )
}

export default LandingPage