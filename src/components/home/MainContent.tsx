
import React from 'react';
import Services from '../Services';
import Portfolio from '../Portfolio';
import Testimonials from '../Testimonials';
import Contact from '../Contact';
import Founder from '../Founder';
import Technologies from '../Technologies';
import FAQ from '../FAQ';
import BlogPreview from '../BlogPreview';
import SeoPlans from '../SeoPlans';
import SocialMediaPlans from '../SocialMediaPlans';
import GoogleAdPlans from '../GoogleAdPlans';
import ZeroAdvanceSection from './ZeroAdvanceSection';

const MainContent: React.FC = () => {
  return (
    <>
      <section id="services" aria-labelledby="services-heading">
        <Services />
      </section>
      
      <ZeroAdvanceSection />
      
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
    </>
  );
};

export default MainContent;
