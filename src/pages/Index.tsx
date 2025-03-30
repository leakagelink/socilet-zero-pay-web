
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Founder from '../components/Founder';
import Technologies from '../components/Technologies';
import FAQ from '../components/FAQ';
import BlogPreview from '../components/BlogPreview';
import { Toaster } from 'sonner';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <Header />
      <main>
        <Hero />
        <Services />
        <Technologies />
        <Founder />
        <Portfolio />
        <BlogPreview />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
