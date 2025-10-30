import React from "react";
import Navbar from "../components/Navbar.jsx";
import HeroSection from "@/components/HeroSection.jsx";
import Footer from "@/components/Footer.jsx";
import Features from "@/components/Features.jsx";
import AboutUs from "@/components/AboutUs.jsx";
import ContactUs from "@/components/ContactUs.jsx";
import TestimonialsSection from "@/components/TestimonialSection.jsx";


const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* ===== Navbar ===== */}
      <Navbar />

      {/* ===== Main Content Wrapper ===== */}
      <main className="flex-1 w-full overflow-hidden">
        {/* Hero Section */}
        <section className="w-full">
          <HeroSection />
        </section>

        {/* About Us */}
        <section
          id="about"
          className="w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-12 sm:py-16 lg:py-20"
        >
          <AboutUs />
        </section>

        {/* Features */}
        <section
          id="features"
          className="w-full bg-gray-50 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-12 sm:py-0 lg:py-0 mb-5"
        >
          <Features />
        </section>

        {/* How It Works (Blue Theme) */}
<section
  id="how-it-works"
  className="w-full bg-blue-50 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-16 flex justify-center"
>
  <div className="max-w-5xl text-center">
    <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-8">
      How It Works
    </h2>
    <img
      src="/howitworks.png"
      alt="Resume creation process"
      className="mx-auto w-full max-w-3xl rounded-lg shadow-md border border-blue-100"
    />
  </div>
</section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="w-full bg-gray-50 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-20 sm:py-0 lg:py-0 mb-5"
        >
          <TestimonialsSection />
          
        </section>

        {/* Contact Us */}
        <section
          id="contact"
          className="w-full bg-gray-50 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-0 sm:py-0 lg:py-0"
        >
          <ContactUs />
        </section>
      </main>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
};

export default LandingPage;
