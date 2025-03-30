
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
import WhatsAppButton from '../components/WhatsAppButton';
import { Toaster } from 'sonner';
import { Helmet } from 'react-helmet';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Socilet - Brand Your Dream | Web & App Development Services</title>
        <meta name="description" content="Socilet offers zero advance payment web & app development services. Get professional websites, mobile apps, and digital branding solutions." />
      </Helmet>
      <Toaster position="top-right" richColors />
      <Header />
      <main>
        <Hero />
        <section id="services" aria-labelledby="services-heading">
          <Services />
        </section>
        <section id="technologies" aria-labelledby="technologies-heading">
          <Technologies />
        </section>
        <section id="founder" aria-labelledby="founder-heading">
          <Founder />
        </section>
        <section id="portfolio" aria-labelledby="portfolio-heading">
          <Portfolio />
        </section>
        <section id="blog" aria-labelledby="blog-heading">
          <BlogPreview />
        </section>
        <section id="testimonials" aria-labelledby="testimonials-heading">
          <Testimonials />
        </section>
        <section id="faq" aria-labelledby="faq-heading">
          <FAQ />
        </section>
        <section id="contact" aria-labelledby="contact-heading">
          <Contact />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
