
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
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
        
        {/* Zero Advance Payment CTA */}
        <section className="bg-gradient-to-r from-primary-900 to-primary-800 py-16 text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between gap-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                  <h2 className="text-2xl font-bold">Zero Advance Payment Business Model</h2>
                </div>
                <p className="text-primary-100 mb-6">
                  Socilet works on a zero advance payment model to protect clients from scams. Many developers take advance payments and then deliver incomplete or template-based work. We ensure quality work before payment, and if you're not satisfied, you don't pay us a single rupee.
                </p>
                <Link to="/zero-advance-payment">
                  <Button variant="secondary" className="group">
                    Learn more about our zero advance payment model
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-xl max-w-md">
                <img 
                  src="/lovable-uploads/769a1794-a1ba-4de7-8ea2-f23cd2700c77.png" 
                  alt="Socilet Team - Zero Advance Payment Model" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
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
