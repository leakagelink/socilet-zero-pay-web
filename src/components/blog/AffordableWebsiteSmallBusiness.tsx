import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, Clock, User, CheckCircle, DollarSign, Building2, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from 'react-helmet';

interface BlogContentProps {
  post: {
    title: string;
    date: string;
    dateISO?: string;
    category: string;
    imageUrl: string;
    readTime: string;
    excerpt: string;
    slug: string;
  };
  onBack: () => void;
}

const AffordableWebsiteSmallBusiness: React.FC<BlogContentProps> = ({ post, onBack }) => {
  const canonicalUrl = `https://socilet.in/blog/${post.slug}`;

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does a small business website cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Small business website costs range from free (DIY builders) to $25,000+ (custom agency). Affordable professional options start at $299-$1,500 through offshore developers, with zero advance payment options available."
        }
      },
      {
        "@type": "Question",
        "name": "Is it worth paying for a professional website for a small business?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. 75% of consumers judge business credibility by website design. A professional website generates 2-3x more leads than DIY alternatives and pays for itself through increased customer trust and conversions."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get a website built with zero advance payment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Companies like Socilet offer zero advance payment models where you only pay after seeing the completed website. This eliminates financial risk and ensures quality delivery."
        }
      },
      {
        "@type": "Question",
        "name": "What should be included in an affordable website package?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Essential inclusions: responsive design, 5-10 pages, contact forms, basic SEO, social media integration, Google Analytics, SSL certificate, and mobile optimization. Most affordable packages include these basics."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to build a small business website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Timeline varies: DIY builders (1-7 days), affordable professional (2-4 weeks), mid-range agency (4-8 weeks), custom enterprise (8-16 weeks). Most small business sites are ready in 2-3 weeks."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <article className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>

          {/* Article Header */}
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Budget-Friendly
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By <strong className="text-foreground">Dheeraj Tagde</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.dateISO}>{post.date}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Author Box */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Dheeraj Tagde</h3>
                  <p className="text-sm text-muted-foreground">Founder, Socilet | 7+ Years Experience | 900+ Websites Delivered</p>
                  <p className="text-sm mt-1">Helping small businesses establish their online presence affordably.</p>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Featured Image */}
          <motion.div 
            className="rounded-2xl overflow-hidden mb-10 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          {/* Article Content */}
          <motion.div 
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Introduction */}
            <p className="lead text-xl">
              Every small business needs a website in 2026—but not every small business has a big budget. 
              The good news? You don't need to spend thousands of dollars to get a professional, effective 
              website. In this guide, I'll show you exactly how to get an <strong>affordable website that 
              actually grows your business</strong>.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
              <p className="font-medium text-blue-800">
                <strong>📊 Key Insight:</strong> 84% of consumers believe a business with a website is 
                more credible than one with only a social media page. Yet 27% of small businesses still 
                don't have a website.
              </p>
            </div>

            {/* Why Every Business Needs a Website */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <Building2 className="w-7 h-7 text-primary" />
              Why Every Small Business Needs a Website
            </h2>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <Card className="p-5">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Customer Expectation
                </h4>
                <p className="text-sm text-muted-foreground">97% of consumers search online for local businesses. No website = invisible to most potential customers.</p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Credibility Factor
                </h4>
                <p className="text-sm text-muted-foreground">75% of consumers judge business credibility by website design. A professional site builds instant trust.</p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  24/7 Availability
                </h4>
                <p className="text-sm text-muted-foreground">Your website works while you sleep—capturing leads, answering questions, and showcasing your services.</p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Competitor Advantage
                </h4>
                <p className="text-sm text-muted-foreground">If competitors have websites and you don't, you're losing customers to them every single day.</p>
              </Card>
            </div>

            {/* How Much Should You Spend */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-primary" />
              How Much Should Small Business Spend on a Website?
            </h2>

            <p>
              The "right" budget depends on your goals, industry, and growth stage. Here's a realistic breakdown:
            </p>

            <div className="overflow-x-auto my-8">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="p-4 text-left font-bold">Business Stage</th>
                    <th className="p-4 text-left font-bold">Recommended Budget</th>
                    <th className="p-4 text-left font-bold">Best Option</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Just Starting (validation phase)</td>
                    <td className="p-4">$0-$200</td>
                    <td className="p-4">DIY builders or single landing page</td>
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-4">Established but budget-tight</td>
                    <td className="p-4 text-green-600 font-semibold">$299-$800</td>
                    <td className="p-4">Offshore professional (India)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Growing, needs credibility</td>
                    <td className="p-4">$800-$3,000</td>
                    <td className="p-4">Custom WordPress/professional</td>
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="p-4">Scaling, needs features</td>
                    <td className="p-4">$3,000-$15,000</td>
                    <td className="p-4">Agency with e-commerce/custom</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
              <p className="font-medium text-green-800">
                <strong>💡 Smart Tip:</strong> Start with an affordable professional website ($299-$800 range) 
                and upgrade as your business grows. You can always add features later—but you can't get 
                back customers lost to no online presence.
              </p>
            </div>

            {/* Affordable Options */}
            <h2 className="text-2xl font-bold mt-10 mb-6">🛠️ Affordable Website Development Options</h2>

            <h3 className="text-xl font-bold mt-8 mb-4">Option 1: DIY Website Builders (Wix, Squarespace)</h3>
            <Card className="p-6 my-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-600 mb-2">✅ Pros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Lowest upfront cost ($0-$200/year)</li>
                    <li>• Full control over content</li>
                    <li>• No technical skills needed</li>
                    <li>• Quick to launch</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-600 mb-2">❌ Cons</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Template-based, looks generic</li>
                    <li>• Limited customization</li>
                    <li>• Your time = hidden cost</li>
                    <li>• Ongoing subscription fees</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground"><strong>Best for:</strong> Solo entrepreneurs validating business idea, very tight budgets</p>
            </Card>

            <h3 className="text-xl font-bold mt-8 mb-4">Option 2: WordPress Development</h3>
            <Card className="p-6 my-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-600 mb-2">✅ Pros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Highly flexible and scalable</li>
                    <li>• Thousands of themes/plugins</li>
                    <li>• Great for SEO</li>
                    <li>• Own your content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-600 mb-2">❌ Cons</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Needs hosting ($50-$200/year)</li>
                    <li>• Requires maintenance</li>
                    <li>• Learning curve for DIY</li>
                    <li>• Plugin conflicts possible</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground"><strong>Best for:</strong> Businesses wanting blog, growth potential, and content control</p>
            </Card>

            <h3 className="text-xl font-bold mt-8 mb-4">Option 3: Professional Development (Offshore)</h3>
            <Card className="p-6 my-4 border-primary border-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-600 mb-2">✅ Pros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Professional quality at 60-70% lower cost</li>
                    <li>• Custom design, not templates</li>
                    <li>• Zero advance payment options</li>
                    <li>• Dedicated support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-red-600 mb-2">❌ Cons</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Time zone differences</li>
                    <li>• Need to vet developers carefully</li>
                    <li>• Communication nuances</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm"><strong>Best for:</strong> Businesses wanting professional quality without high local agency costs</p>
            </Card>

            {/* What's Included */}
            <h2 className="text-2xl font-bold mt-10 mb-6">📦 What's Included in Affordable Website Package</h2>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <Card className="p-5">
                <h4 className="font-bold mb-3">Core Features</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Custom/semi-custom design</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 5-10 pages</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Mobile responsive</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Contact forms</li>
                </ul>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-3">SEO & Marketing</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Basic on-page SEO</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Google Analytics integration</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Social media links</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Fast loading speed</li>
                </ul>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-3">Technical</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> SSL certificate</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Browser compatibility</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Security basics</li>
                </ul>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-3">Support</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Training/handover</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 30-day bug fixes</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Basic documentation</li>
                </ul>
              </Card>
            </div>

            {/* Hidden Costs */}
            <h2 className="text-2xl font-bold mt-10 mb-6">💸 Hidden Costs to Budget For</h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6">
              <h3 className="font-bold mb-3">Beyond the development fee, plan for:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-yellow-700">📁</span>
                  <span><strong>Domain name:</strong> $10-$20/year (or free first year with some hosts)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-yellow-700">☁️</span>
                  <span><strong>Hosting:</strong> $50-$200/year depending on traffic and features</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-yellow-700">🔒</span>
                  <span><strong>SSL certificate:</strong> Often free with hosting, or $0-$100/year</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-yellow-700">🔧</span>
                  <span><strong>Maintenance:</strong> $50-$200/month for updates, backups, security</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-yellow-700">✏️</span>
                  <span><strong>Content updates:</strong> Your time or $50-$100/hour for changes</span>
                </li>
              </ul>
            </div>

            {/* Tips to Reduce Cost */}
            <h2 className="text-2xl font-bold mt-10 mb-6">💡 Tips to Reduce Website Development Cost</h2>

            <div className="space-y-4 my-8">
              <Card className="p-5 border-l-4 border-green-500">
                <h4 className="font-bold mb-2">1. Have Clear Requirements</h4>
                <p className="text-sm text-muted-foreground">Before contacting developers, write down exactly what you need. Unclear requirements = scope creep = higher costs.</p>
              </Card>
              <Card className="p-5 border-l-4 border-green-500">
                <h4 className="font-bold mb-2">2. Prepare Your Content</h4>
                <p className="text-sm text-muted-foreground">Have your text, images, and branding ready. Developer waiting for content = delays = higher costs.</p>
              </Card>
              <Card className="p-5 border-l-4 border-green-500">
                <h4 className="font-bold mb-2">3. Provide Reference Websites</h4>
                <p className="text-sm text-muted-foreground">Show developers sites you like. This reduces design iterations and miscommunication.</p>
              </Card>
              <Card className="p-5 border-l-4 border-green-500">
                <h4 className="font-bold mb-2">4. Consider Phased Approach</h4>
                <p className="text-sm text-muted-foreground">Start with MVP (minimum viable product) and add features later as budget allows.</p>
              </Card>
              <Card className="p-5 border-l-4 border-green-500">
                <h4 className="font-bold mb-2">5. Choose Offshore Development</h4>
                <p className="text-sm text-muted-foreground">Indian developers offer the same quality at 60-70% lower cost than US/UK agencies.</p>
              </Card>
            </div>

            {/* Hinglish Experience Section */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 my-8">
              <h3 className="text-xl font-bold mb-4">💼 Small Business Websites: Mera Experience</h3>
              <p className="mb-4">
                <em>
                  "900+ websites deliver karne ke baad main yeh confidently keh sakta hoon ki ek affordable 
                  website bhi professional aur effective ho sakti hai. Expensive hona zaroori nahi hai—
                  sahi developer dhundhna zaroori hai.
                </em>
              </p>
              <p className="mb-4">
                <em>
                  Socilet mein humne <strong>Zero Advance Payment</strong> model isliye adopt kiya kyunki 
                  small businesses ke liye cash flow important hai. Pehle website dekho, satisfied ho toh 
                  payment karo. Simple. Aur affordable pricing ke saath professional quality—yahi humara 
                  promise hai."
                </em>
              </p>
              <p className="font-semibold">— Dheeraj Tagde, Founder, Socilet</p>
            </div>

            {/* FAQs */}
            <h2 className="text-2xl font-bold mt-10 mb-6">❓ Frequently Asked Questions</h2>

            <div className="space-y-4 my-8">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">How much does a small business website cost?</h3>
                <p className="text-muted-foreground">Ranges from free (DIY) to $25,000+ (custom agency). Affordable professional options start at $299-$1,500 through offshore developers.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">Is a professional website worth it for small business?</h3>
                <p className="text-muted-foreground">Yes. 75% of consumers judge credibility by design. Professional sites generate 2-3x more leads than DIY alternatives.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">Can I get a website with zero advance payment?</h3>
                <p className="text-muted-foreground">Yes. Companies like Socilet offer zero advance payment—you only pay after seeing the completed website.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">How long does it take to build a small business website?</h3>
                <p className="text-muted-foreground">DIY (1-7 days), affordable professional (2-4 weeks), mid-range agency (4-8 weeks). Most are ready in 2-3 weeks.</p>
              </Card>
            </div>

            {/* Conclusion */}
            <h2 className="text-2xl font-bold mt-10 mb-6">🎯 Conclusion</h2>

            <p>
              An affordable website for your small business isn't just possible—it's essential. You don't 
              need to choose between quality and budget. With the right approach (clear requirements, 
              prepared content, and offshore development), you can get a professional website that grows 
              your business without breaking the bank.
            </p>

            <p>
              At Socilet, we specialize in affordable, professional websites for small businesses with our 
              <strong> zero advance payment model</strong>. You see the completed website first and only 
              pay when you're 100% satisfied.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-8 my-10 text-center">
              <h3 className="text-2xl font-bold mb-4">Get Your Affordable Professional Website</h3>
              <p className="mb-6 text-white/90">
                Starting from $299. Zero advance payment. Pay only after you're satisfied.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/#contact">
                  <Button size="lg" variant="secondary" className="font-bold">
                    Get Free Quote
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </div>

            {/* Internal Links */}
            <div className="border-t pt-8 mt-10">
              <h3 className="font-bold text-lg mb-4">Related Articles:</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog/zero-advance-payment-website-development-guide" className="text-primary hover:underline">
                    → Zero Advance Payment Website Development Guide
                  </Link>
                </li>
                <li>
                  <Link to="/blog/wordpress-developer-india-cost-guide" className="text-primary hover:underline">
                    → WordPress Developer India Cost Guide
                  </Link>
                </li>
                <li>
                  <Link to="/blog/google-my-business-setup-service-india" className="text-primary hover:underline">
                    → Google My Business Setup Service Guide
                  </Link>
                </li>
                <li>
                  <Link to="/website-development" className="text-primary hover:underline">
                    → Our Website Development Services
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  );
};

export default AffordableWebsiteSmallBusiness;
