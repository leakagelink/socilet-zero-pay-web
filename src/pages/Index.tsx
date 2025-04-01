
import React, { useState } from 'react';
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
import SeoPlans from '../components/SeoPlans';
import { Toaster } from 'sonner';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const isMobile = useIsMobile();
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  
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
                  <Shield className="min-w-6 h-6 text-secondary" />
                  <h2 className="text-xl sm:text-2xl font-bold">Zero Advance Payment Business Model</h2>
                </div>
                <p className="text-primary-100 mb-6 text-sm sm:text-base">
                  {isMobile ? (
                    <>
                      We protect clients from scams with our zero advance payment model. 
                      We deliver quality work before payment - if you're not satisfied, 
                      you don't pay a single rupee.
                    </>
                  ) : (
                    <>
                      Socilet works on a zero advance payment model to protect clients from scams. 
                      Many developers take advance payments and then deliver incomplete or 
                      template-based work. We ensure quality work before payment, and if 
                      you're not satisfied, you don't pay us a single rupee.
                    </>
                  )}
                </p>
                <Link to="/zero-advance-payment" className="block w-full sm:w-auto">
                  <Button variant="secondary" className="group w-full sm:w-auto text-xs sm:text-sm">
                    <span className="truncate">Learn more about our zero advance payment model</span>
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 w-full md:w-auto">
                <ul className="space-y-3 text-white text-sm sm:text-base">
                  <li className="flex items-start">
                    <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                    <p>Pay only after complete project delivery</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                    <p>No hidden or extra charges</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                    <p>Continuous support throughout development</p>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                    <p>Don't pay if you're not 100% satisfied</p>
                  </li>
                </ul>
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
        <section id="seo-plans" aria-labelledby="seo-plans-heading">
          <SeoPlans />
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

        {/* Google Site Verification Dialog */}
        <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info size={18} className="text-primary-600" />
                Site Verification
              </DialogTitle>
              <DialogDescription>
                Verify your website ownership with Google Search Console to improve SEO and monitor your site's performance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Follow these steps to verify your site:</p>
                <ol className="text-sm space-y-2 ml-4 list-decimal">
                  <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">Google Search Console</a></li>
                  <li>Add your property (website URL)</li>
                  <li>Select "HTML tag" verification method</li>
                  <li>Copy the meta tag provided by Google</li>
                  <li>Add it to the head section of your website</li>
                </ol>
              </div>
              <div className="bg-primary-50 p-3 rounded-md">
                <p className="text-xs text-primary-700">For detailed instructions, visit our admin panel and use the Google Verification tool.</p>
              </div>
            </div>
            <DialogFooter>
              <Link to="/admin">
                <Button type="button">
                  Go to Admin Panel
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
