import React, { useState, useEffect } from 'react';
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
import SocialMediaPlans from '../components/SocialMediaPlans';
import GoogleAdPlans from '../components/GoogleAdPlans';
import VersionChecker from '../components/VersionChecker';
import { Toaster } from 'sonner';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Check, Info, Code, FileText, Terminal, Wrench } from 'lucide-react';
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
  
  useEffect(() => {
    if (!localStorage.getItem('site-version')) {
      localStorage.setItem('site-version', new Date().getTime().toString());
    }
    
    const forceCacheRefresh = new URLSearchParams(window.location.search).get('refresh-cache');
    if (forceCacheRefresh === 'true') {
      const latestVersion = localStorage.getItem('site-version');
      if (latestVersion) {
        localStorage.setItem('current-site-version', latestVersion);
      }
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      console.log('Cache refresh requested, clearing caches...');
    }
  }, []);
  
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Socilet - Brand Your Dream | Web & App Development Services</title>
        <meta name="description" content="Socilet offers zero advance payment web & app development services. Get professional websites, mobile apps, and digital branding solutions." />
      </Helmet>
      <Toaster position="top-right" richColors />
      <VersionChecker />
      <Header />
      <main>
        <Hero />
        <section id="services" aria-labelledby="services-heading">
          <Services />
        </section>
        
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
        
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Free Tools</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our collection of free tools designed to help developers, businesses, and individuals.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Code Formatter</h3>
                <p className="text-gray-600 text-sm mb-4">Format HTML, CSS, JavaScript and Python code with a simple, elegant tool.</p>
                <a 
                  href="https://codeformatter.pro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium text-sm inline-flex items-center hover:underline"
                >
                  Try it now <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Legal Document Generator</h3>
                <p className="text-gray-600 text-sm mb-4">Create professional legal agreements with our AI-powered generator.</p>
                <a 
                  href="https://docucreatorpro.online/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 font-medium text-sm inline-flex items-center hover:underline"
                >
                  Try it now <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Terminal className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">WordPress Plugin Builder</h3>
                <p className="text-gray-600 text-sm mb-4">Create powerful WordPress plugins without writing code using AI.</p>
                <a 
                  href="https://pluginpal.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 font-medium text-sm inline-flex items-center hover:underline"
                >
                  Try it now <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">More Tools</h3>
                <p className="text-gray-600 text-sm mb-4">Explore our full collection of tools for businesses and developers.</p>
                <Link 
                  to="/tools"
                  className="text-orange-600 font-medium text-sm inline-flex items-center hover:underline"
                >
                  View all tools <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </motion.div>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/tools">
                <Button variant="outline" className="group">
                  Explore all tools
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
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
        
        <section id="social-media-plans" aria-labelledby="social-media-plans-heading">
          <SocialMediaPlans />
        </section>
        
        <section id="google-ad-plans" aria-labelledby="google-ad-plans-heading">
          <GoogleAdPlans />
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
