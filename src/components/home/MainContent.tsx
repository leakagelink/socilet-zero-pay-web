
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
import TeamShowcase from '../TeamShowcase';
import PortfolioShowcase from '../PortfolioShowcase';

const MainContent: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <section id="services" aria-labelledby="services-heading" className="w-full overflow-hidden">
        <Services />
      </section>
      
      <ZeroAdvanceSection />
      
      <section id="team" aria-labelledby="team-heading" className="w-full overflow-hidden">
        <TeamShowcase />
      </section>
      
      <section id="technologies" aria-labelledby="technologies-heading" className="w-full overflow-hidden">
        <Technologies />
      </section>
      <section id="founder" aria-labelledby="founder-heading" className="w-full overflow-hidden">
        <Founder />
      </section>
      <section id="portfolio" aria-labelledby="portfolio-heading" className="w-full overflow-hidden">
        <PortfolioShowcase />
      </section>
      <section id="seo-plans" aria-labelledby="seo-plans-heading" className="w-full overflow-hidden">
        <SeoPlans />
      </section>
      <section id="social-media-plans" aria-labelledby="social-media-plans-heading" className="w-full overflow-hidden">
        <SocialMediaPlans />
      </section>
      <section id="google-ad-plans" aria-labelledby="google-ad-plans-heading" className="w-full overflow-hidden">
        <GoogleAdPlans />
      </section>
      <section id="blog" aria-labelledby="blog-heading" className="w-full overflow-hidden">
        <BlogPreview />
      </section>
      <section id="testimonials" aria-labelledby="testimonials-heading" className="w-full overflow-hidden">
        <Testimonials />
      </section>
      <section id="faq" aria-labelledby="faq-heading" className="w-full overflow-hidden">
        <FAQ />
      </section>
      <section id="contact" aria-labelledby="contact-heading" className="w-full overflow-hidden">
        <Contact />
      </section>
    </div>
  );
};

export default MainContent;
