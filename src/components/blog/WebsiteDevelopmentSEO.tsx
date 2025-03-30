
import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Share2, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from '@/components/BlogPreview';

interface BlogPostProps {
  post: BlogPost;
  onBack: () => void;
}

const WebsiteDevelopmentSEO: React.FC<BlogPostProps> = ({ post, onBack }) => {
  return (
    <article className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-gray-100">
            <ArrowLeft size={16} className="mr-2" /> Back to all articles
          </Button>

          <div className="rounded-xl overflow-hidden mb-8 h-[400px]">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <CalendarIcon size={16} className="mr-2" />
              {post.date}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={16} className="mr-2" />
              {post.readTime}
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 size={16} className="mr-2" /> Share
              </Button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

          <div className="prose prose-lg max-w-none">
            <h2>Why SEO Should Be at the Heart of Website Development</h2>
            <p>
              In today's digital landscape, a beautiful website that no one can find is like a store in the middle of a desert—impressive but ineffective. That's why at Socilet, we believe SEO considerations should be baked into every stage of website development, not added as an afterthought.
            </p>
            
            <p>
              This comprehensive guide will walk you through how to integrate SEO best practices into your website development process from the ground up, ensuring your site not only looks great but ranks well and drives meaningful traffic.
            </p>
            
            <h2>SEO-First Technical Architecture</h2>
            <h3>1. Choosing the Right Platform and CMS</h3>
            <p>
              Your choice of website platform and content management system (CMS) significantly impacts your SEO potential:
            </p>
            <ul>
              <li><strong>SEO-friendly options:</strong> WordPress, Webflow, and modern headless CMS solutions typically offer strong SEO capabilities</li>
              <li><strong>Key considerations:</strong> URL structure control, customizable metadata, schema markup support, and mobile optimization</li>
              <li><strong>Avoid:</strong> Platforms with proprietary URL structures that you can't customize or that generate messy URLs with parameters</li>
            </ul>
            
            <h3>2. Site Structure and Information Architecture</h3>
            <p>
              How you organize your website content affects both user experience and search engine crawling:
            </p>
            <ul>
              <li><strong>Implement a logical hierarchy:</strong> Use a clear structure with main categories and related subcategories</li>
              <li><strong>Limit navigation depth:</strong> Keep important content within 3-4 clicks from the homepage</li>
              <li><strong>Create hub pages:</strong> Develop comprehensive resource pages that link to related content</li>
              <li><strong>Use breadcrumbs:</strong> Help users and search engines understand site structure</li>
            </ul>
            
            <h3>3. Technical SEO Foundations</h3>
            <p>
              Certain technical elements should be implemented during initial development:
            </p>
            <ul>
              <li><strong>HTTPS implementation:</strong> Secure websites are favored by search engines</li>
              <li><strong>XML sitemap:</strong> Help search engines discover and understand your content</li>
              <li><strong>Robots.txt:</strong> Control how search engines crawl your site</li>
              <li><strong>Canonical tags:</strong> Prevent duplicate content issues</li>
              <li><strong>Structured data:</strong> Implement schema markup for enhanced search results</li>
            </ul>
            
            <h2>Performance Optimization: A Critical SEO Factor</h2>
            <p>
              Site speed has become a crucial ranking factor as Google emphasizes user experience:
            </p>
            
            <h3>1. Core Web Vitals Optimization</h3>
            <p>
              Focus on these key performance metrics during development:
            </p>
            <ul>
              <li><strong>Largest Contentful Paint (LCP):</strong> Aim for under 2.5 seconds</li>
              <li><strong>First Input Delay (FID):</strong> Target less than 100 milliseconds</li>
              <li><strong>Cumulative Layout Shift (CLS):</strong> Maintain a score under 0.1</li>
            </ul>
            
            <h3>2. Image Optimization Best Practices</h3>
            <ul>
              <li>Implement responsive images using srcset attributes</li>
              <li>Use next-generation formats like WebP with fallbacks</li>
              <li>Implement lazy loading for images below the fold</li>
              <li>Properly size images rather than scaling with CSS</li>
              <li>Add descriptive alt text for all images (also helps with accessibility)</li>
            </ul>
            
            <h3>3. Code Optimization</h3>
            <ul>
              <li>Minify CSS, JavaScript, and HTML</li>
              <li>Utilize critical CSS loading techniques</li>
              <li>Reduce third-party script impact</li>
              <li>Implement efficient caching strategies</li>
              <li>Use content delivery networks (CDNs) for global audiences</li>
            </ul>
            
            <h2>Mobile-First Development and Design</h2>
            <p>
              With Google's mobile-first indexing, optimizing for mobile devices is non-negotiable:
            </p>
            <ul>
              <li><strong>Responsive design:</strong> Create layouts that adapt seamlessly to any screen size</li>
              <li><strong>Touch-friendly navigation:</strong> Ensure buttons and links are easily clickable on mobile</li>
              <li><strong>Viewport configuration:</strong> Set proper meta viewport tags</li>
              <li><strong>Avoid interstitials:</strong> Don't use pop-ups that cover main content on mobile</li>
              <li><strong>Test across devices:</strong> Verify functionality on various mobile devices and screen sizes</li>
            </ul>
            
            <h2>Content Structure and On-Page SEO Elements</h2>
            <h3>1. SEO-Friendly URL Structure</h3>
            <p>
              URLs should be:
            </p>
            <ul>
              <li>Short and descriptive</li>
              <li>Keyword-inclusive when relevant</li>
              <li>Using hyphens to separate words</li>
              <li>Free of unnecessary parameters or numbers</li>
              <li>Organized in a logical directory structure</li>
            </ul>
            
            <h3>2. Proper Heading Hierarchy</h3>
            <p>
              Implement semantic heading structure:
            </p>
            <ul>
              <li>Use only one H1 per page, typically matching the main topic</li>
              <li>Structure H2s and H3s in a logical hierarchy</li>
              <li>Include relevant keywords in headings naturally</li>
              <li>Make headings descriptive of the content that follows</li>
            </ul>
            
            <h3>3. Metadata Optimization</h3>
            <p>
              Create templates and systems for:
            </p>
            <ul>
              <li>Title tags (unique, 50-60 characters, with primary keywords near the beginning)</li>
              <li>Meta descriptions (compelling, 120-160 characters, with a clear call to action)</li>
              <li>Open Graph and Twitter Card metadata for social sharing</li>
            </ul>
            
            <h2>Internal Linking Architecture</h2>
            <p>
              Strategic internal linking helps search engines understand your most important content:
            </p>
            <ul>
              <li><strong>Content hub model:</strong> Create pillar pages that link to related content</li>
              <li><strong>Contextual linking:</strong> Link naturally within content to related pages</li>
              <li><strong>Descriptive anchor text:</strong> Use relevant keywords in link text (avoiding generic "click here" phrases)</li>
              <li><strong>Link important pages:</strong> Ensure key pages receive more internal links</li>
              <li><strong>Keep navigation clean:</strong> Focus main navigation on the most critical pages</li>
            </ul>
            
            <h2>E-Commerce Specific SEO Considerations</h2>
            <p>
              For online stores, additional SEO elements are critical:
            </p>
            <ul>
              <li><strong>Product schema markup:</strong> Implement structured data for rich results</li>
              <li><strong>Faceted navigation:</strong> Properly handle filtering options to avoid duplicate content</li>
              <li><strong>Reviews integration:</strong> Incorporate customer reviews with appropriate schema</li>
              <li><strong>Inventory management:</strong> Properly handle out-of-stock items (don't delete pages)</li>
              <li><strong>Related products:</strong> Link between complementary items to encourage crawling</li>
            </ul>
            
            <h2>Content Management System Configuration</h2>
            <p>
              Set up your CMS with these SEO configurations:
            </p>
            <ul>
              <li><strong>Customizable metadata:</strong> Ensure easy editing of titles, descriptions, and other SEO elements</li>
              <li><strong>Automatic XML sitemap:</strong> Configure dynamic sitemap generation</li>
              <li><strong>Redirect management:</strong> Implement a system for handling 301 redirects</li>
              <li><strong>Clean URL structure:</strong> Remove unnecessary parameters or file extensions</li>
              <li><strong>Content scheduling:</strong> Plan regular content updates</li>
            </ul>
            
            <h2>Integrating Analytics and Measurement</h2>
            <p>
              Build measurement into your website from day one:
            </p>
            <ul>
              <li><strong>Google Analytics 4 setup:</strong> Configure with appropriate event tracking</li>
              <li><strong>Google Search Console:</strong> Verify and set up property</li>
              <li><strong>Core Web Vitals monitoring:</strong> Implement tools to track performance metrics</li>
              <li><strong>Conversion tracking:</strong> Set up goal tracking for important actions</li>
              <li><strong>Heat mapping tools:</strong> Consider tools like Hotjar for user behavior insights</li>
            </ul>
            
            <h2>Local SEO Enhancements</h2>
            <p>
              For businesses serving specific geographic areas:
            </p>
            <ul>
              <li><strong>Local business schema:</strong> Implement structured data with address, hours, etc.</li>
              <li><strong>Location pages:</strong> Create optimized pages for each service area</li>
              <li><strong>Google Business Profile integration:</strong> Link website to Google Business listing</li>
              <li><strong>Local content strategy:</strong> Develop area-specific content</li>
            </ul>
            
            <h2>Post-Launch SEO Considerations</h2>
            <p>
              Plan for these activities after website launch:
            </p>
            <ul>
              <li><strong>Regular content updates:</strong> Schedule ongoing content creation</li>
              <li><strong>Performance monitoring:</strong> Track Core Web Vitals and other metrics</li>
              <li><strong>Backlink building:</strong> Develop a strategy for earning quality backlinks</li>
              <li><strong>Regular technical audits:</strong> Schedule quarterly reviews of technical SEO elements</li>
              <li><strong>Competitive analysis:</strong> Monitor competitor activities and strategies</li>
            </ul>
            
            <h2>The Socilet SEO-First Development Approach</h2>
            <p>
              At Socilet, we don't treat SEO as an afterthought. Our development process integrates these best practices from the beginning, ensuring your website launches with a strong foundation for search visibility.
            </p>
            
            <p>
              Our zero advance payment model applies here too—you'll only pay when we deliver a website that meets both your design requirements and SEO standards. We're confident in our ability to create websites that not only look professional but also perform excellently in search results.
            </p>
            
            <h2>Ready to Start Your SEO-Optimized Website Project?</h2>
            <p>
              If you're planning a new website or considering a redesign, contact Socilet today. Our team of developers and SEO specialists will work together to create a website that works as hard as you do—attracting visitors, engaging users, and converting customers through a perfect blend of design excellence and search optimization.
            </p>
            
            <p>
              Remember, in today's competitive digital landscape, a website that isn't optimized for search is missing a crucial ingredient for success. Let us help you build a website that's designed to be found.
            </p>
          </div>
        </motion.div>
      </div>
    </article>
  );
};

export default WebsiteDevelopmentSEO;
