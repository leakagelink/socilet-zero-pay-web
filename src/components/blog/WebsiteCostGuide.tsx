import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Share2, CalendarIcon, Clock, CheckCircle, DollarSign, AlertTriangle, Building2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from '@/components/BlogPreview';
import { Helmet } from 'react-helmet';

interface BlogPostProps {
  post: BlogPost;
  onBack: () => void;
}

const WebsiteCostGuide: React.FC<BlogPostProps> = ({ post, onBack }) => {
  const faqs = [
    {
      question: "What's the minimum budget for a business website?",
      answer: "For a basic 5-page business website, expect $300-500 with Socilet (zero advance), or $0-50/month with DIY builders. Professional custom websites start at $1,500 from freelancers and $6,000 from agencies."
    },
    {
      question: "Should I pay upfront for website development?",
      answer: "No! Choose zero advance payment providers like Socilet where you pay only after seeing the completed website. This eliminates risk of scams and ensures quality before payment."
    },
    {
      question: "What ongoing costs should I expect?",
      answer: "Annual costs typically include: Domain ($10-50/year), Hosting ($50-300/year), SSL (often free), Email ($0-100/year), and optional maintenance ($50-200/month)."
    },
    {
      question: "How do I avoid getting scammed?",
      answer: "Choose zero advance payment providers, check portfolio and reviews, get written contracts, and never pay 100% upfront. With zero advance, you can't lose money to scams."
    },
    {
      question: "Is cheap website development worth it?",
      answer: "It depends on the provider. Zero advance payment ensures you only pay for quality work. Cheap doesn't mean low quality if you choose the right provider - Socilet delivers premium quality at affordable prices."
    }
  ];

  const hiddenCosts = [
    { item: "Domain Name", cost: "$10-50/year", note: "Required for custom URL" },
    { item: "Web Hosting", cost: "$50-300/year", note: "Where your site lives" },
    { item: "SSL Certificate", cost: "$0-100/year", note: "Often free with hosting" },
    { item: "Email Hosting", cost: "$0-100/year", note: "Professional email addresses" },
    { item: "Maintenance", cost: "$50-200/month", note: "Optional but recommended" },
    { item: "Content Updates", cost: "$50-100/hour", note: "If you need help with changes" },
    { item: "Plugins/Themes", cost: "$50-500 one-time", note: "Premium features" },
    { item: "SEO Services", cost: "$200-1,000/month", note: "To rank on Google" }
  ];

  return (
    <article className="py-12 px-4">
      <Helmet>
        <title>Small Business Website Cost 2026 | Complete Guide | Socilet</title>
        <meta name="description" content="How much does a small business website cost in 2026? Compare DIY, freelancer, agency, and zero advance options. Prices from $300-$25,000+." />
        <meta name="keywords" content="small business website cost 2026, affordable website development, website pricing guide, cheap website design for small business" />
        <link rel="canonical" href="https://socilet.in/blog/website-cost-guide" />
      </Helmet>

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
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <div className="flex items-center text-muted-foreground text-sm">
              <CalendarIcon size={16} className="mr-2" />
              {post.date}
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock size={16} className="mr-2" />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

          <div className="prose prose-lg max-w-none">
            {/* Quick Answer */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl my-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="text-green-500" />
                Quick Answer: Website Costs at a Glance (2026)
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-semibold">DIY Builders (Wix, Squarespace)</p>
                  <p className="text-2xl font-bold text-gray-600">$0-50/month</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-semibold">Freelance Designer</p>
                  <p className="text-2xl font-bold text-gray-600">$1,500-4,000</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-semibold">Web Design Agency</p>
                  <p className="text-2xl font-bold text-gray-600">$6,000-25,000+</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="font-semibold text-green-700">Zero Advance (Socilet)</p>
                  <p className="text-2xl font-bold text-green-600">$300-2,000</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Sources: GruffyGoat, Forbes, WebWave research 2025-2026
              </p>
            </div>

            {/* Introduction */}
            <p className="text-xl text-muted-foreground mb-8">
              "How much does a website cost?" is one of the most common questions small business owners ask. 
              The answer ranges from $0 to $100,000+ depending on your choices. This guide breaks down 
              every option so you can make an informed decision for your budget.
            </p>

            {/* Factors Affecting Cost */}
            <h2 className="text-2xl font-bold mt-10 mb-4">Factors That Affect Website Cost</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">1. Website Type</h3>
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Type</th>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-left">Cost Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Brochure Site</td>
                    <td className="border border-gray-300 p-2">5-10 pages, basic info</td>
                    <td className="border border-gray-300 p-2">$300-2,000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">E-commerce (Small)</td>
                    <td className="border border-gray-300 p-2">Up to 100 products</td>
                    <td className="border border-gray-300 p-2">$1,000-5,000</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Custom Web App</td>
                    <td className="border border-gray-300 p-2">Complex functionality</td>
                    <td className="border border-gray-300 p-2">$5,000-50,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">2. Design Complexity</h3>
            <ul className="space-y-2 my-4">
              <li><strong>Template-based:</strong> $200-500 - Uses pre-made designs</li>
              <li><strong>Custom design:</strong> $1,000-5,000+ - Unique to your brand</li>
              <li><strong>Premium UI/UX:</strong> $5,000-15,000 - Extensive user research and design</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3. Features & Functionality</h3>
            <ul className="space-y-2 my-4">
              <li>Contact forms: $50-200</li>
              <li>Payment integration: $200-500</li>
              <li>User accounts/login: $500-1,500</li>
              <li>Booking/scheduling system: $300-800</li>
              <li>Blog functionality: $200-400</li>
            </ul>

            {/* Option 1: DIY */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <User className="text-blue-500" />
              Option 1: DIY Website Builders
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl my-6">
              <p className="text-lg font-semibold mb-2">Platforms: Wix, Squarespace, WordPress.com</p>
              <p className="text-3xl font-bold text-blue-600 mb-4">$0-50/month</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Pros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Cheapest option</li>
                    <li>• Quick to set up</li>
                    <li>• No coding needed</li>
                    <li>• Includes hosting</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">✗ Cons</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Limited customization</li>
                    <li>• "Template" look</li>
                    <li>• Hidden costs add up</li>
                    <li>• SEO limitations</li>
                    <li>• Time-consuming to learn</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm"><strong>Best For:</strong> Very small budgets, simple sites, tech-savvy owners willing to spend time</p>
              </div>
            </div>

            {/* Option 2: Freelancer */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <User className="text-purple-500" />
              Option 2: Hire a Freelance Developer
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl my-6">
              <p className="text-3xl font-bold text-purple-600 mb-4">$1,500-4,000 one-time</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Pros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Custom design</li>
                    <li>• Personal attention</li>
                    <li>• Flexible pricing</li>
                    <li>• Direct communication</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">✗ Cons</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Upfront payment risk</li>
                    <li>• Quality varies widely</li>
                    <li>• Limited support after</li>
                    <li>• Availability issues</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm"><strong>Best For:</strong> Medium budgets, specific design needs, owners who can manage freelancers</p>
              </div>
            </div>

            {/* Option 3: Agency */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Building2 className="text-orange-500" />
              Option 3: Web Design Agency
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl my-6">
              <p className="text-3xl font-bold text-orange-600 mb-4">$6,000-25,000+</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Pros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Professional team</li>
                    <li>• Comprehensive service</li>
                    <li>• Ongoing support</li>
                    <li>• Highest quality</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">✗ Cons</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Very expensive</li>
                    <li>• Long timelines (6-12 weeks)</li>
                    <li>• Overkill for small business</li>
                    <li>• Large upfront deposits</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm"><strong>Best For:</strong> Large budgets, complex requirements, enterprise-level needs</p>
              </div>
            </div>

            {/* Option 4: Zero Advance */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Users className="text-green-500" />
              Option 4: Zero Advance Payment Company (Socilet)
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl my-6 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">RECOMMENDED</span>
                <span className="text-green-700 font-semibold">Best Value</span>
              </div>
              
              <p className="text-3xl font-bold text-green-600 mb-4">$300-2,000 (Pay After Delivery)</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Pros</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Zero financial risk</strong></li>
                    <li>• Affordable pricing</li>
                    <li>• Quality guaranteed</li>
                    <li>• Full service included</li>
                    <li>• 900+ projects delivered</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-600 mb-2">⚠ Considerations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Limited to certain project sizes</li>
                    <li>• India-based (but serves globally)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-sm"><strong>Best For:</strong> Small businesses, first-time websites, budget-conscious owners, anyone who's been scammed before</p>
              </div>
            </div>

            {/* Hidden Costs */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              Hidden Costs to Watch For
            </h2>
            <p className="mb-4">
              Development cost is just the beginning. Factor in these ongoing expenses:
            </p>
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Item</th>
                    <th className="border border-gray-300 p-2 text-left">Cost</th>
                    <th className="border border-gray-300 p-2 text-left">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {hiddenCosts.map((cost, index) => (
                    <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-300 p-2">{cost.item}</td>
                      <td className="border border-gray-300 p-2">{cost.cost}</td>
                      <td className="border border-gray-300 p-2 text-muted-foreground">{cost.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg my-4">
              <p className="font-semibold">💡 Total First-Year Ownership Cost:</p>
              <p className="text-muted-foreground">Add $500-2,000 to your development cost for ongoing expenses</p>
            </div>

            {/* Comparison Table */}
            <h2 className="text-2xl font-bold mt-10 mb-4">All Options Compared</h2>
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Option</th>
                    <th className="border border-gray-300 p-2 text-center">Initial Cost</th>
                    <th className="border border-gray-300 p-2 text-center">Monthly</th>
                    <th className="border border-gray-300 p-2 text-center">Risk</th>
                    <th className="border border-gray-300 p-2 text-center">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">DIY</td>
                    <td className="border border-gray-300 p-2 text-center">$0-500</td>
                    <td className="border border-gray-300 p-2 text-center">$20-50</td>
                    <td className="border border-gray-300 p-2 text-center text-green-600">None</td>
                    <td className="border border-gray-300 p-2 text-center text-yellow-600">Low-Med</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-2">Freelancer</td>
                    <td className="border border-gray-300 p-2 text-center">$1,500-4,000</td>
                    <td className="border border-gray-300 p-2 text-center">$0-50</td>
                    <td className="border border-gray-300 p-2 text-center text-red-600">High</td>
                    <td className="border border-gray-300 p-2 text-center text-yellow-600">Med-High</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Agency</td>
                    <td className="border border-gray-300 p-2 text-center">$6,000-25,000</td>
                    <td className="border border-gray-300 p-2 text-center">$100-500</td>
                    <td className="border border-gray-300 p-2 text-center text-yellow-600">Medium</td>
                    <td className="border border-gray-300 p-2 text-center text-green-600">High</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 p-2 font-semibold">Socilet</td>
                    <td className="border border-gray-300 p-2 text-center text-green-600 font-semibold">$300-2,000</td>
                    <td className="border border-gray-300 p-2 text-center">$0-50</td>
                    <td className="border border-gray-300 p-2 text-center text-green-600 font-semibold">Zero</td>
                    <td className="border border-gray-300 p-2 text-center text-green-600">Med-High</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Budget Recommendations */}
            <h2 className="text-2xl font-bold mt-10 mb-4">What Should Your Budget Be?</h2>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              {[
                { type: "Local Service Business", budget: "$500-1,500" },
                { type: "E-commerce Starter", budget: "$1,500-3,000" },
                { type: "Professional Services", budget: "$1,000-3,000" },
                { type: "Restaurant/Café", budget: "$500-1,500" },
                { type: "Portfolio/Creative", budget: "$500-2,000" },
                { type: "Startup MVP", budget: "$2,000-5,000" }
              ].map((item, index) => (
                <div key={index} className="p-4 border rounded-lg flex justify-between items-center">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-green-600 font-bold">{item.budget}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <h2 className="text-2xl font-bold mt-10 mb-4">Timeline Expectations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="p-4 border rounded-lg text-center">
                <p className="font-semibold">DIY</p>
                <p className="text-2xl font-bold text-blue-600">1-4 weeks</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="font-semibold">Freelancer</p>
                <p className="text-2xl font-bold text-purple-600">2-6 weeks</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="font-semibold">Agency</p>
                <p className="text-2xl font-bold text-orange-600">6-12 weeks</p>
              </div>
              <div className="p-4 border rounded-lg text-center bg-green-50">
                <p className="font-semibold">Socilet</p>
                <p className="text-2xl font-bold text-green-600">1-3 weeks</p>
              </div>
            </div>

            {/* Hinglish Experience */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">💰 7 Years, Every Budget</h3>
              <p className="text-gray-700 mb-0 italic">
                "Meri 7 saal ki journey mein maine har budget ke clients ke saath kaam kiya hai - ₹5,000 ke 
                small business website se lekar ₹5 lakh ke enterprise projects tak. Ek baat confirm hai - 
                zero advance payment model sabse safe hai clients ke liye. Aaj tak ek bhi client ne payment 
                issue face nahi kiya because unhe pehle kaam milta hai, phir payment."
              </p>
              <p className="text-gray-600 text-sm mt-2">— Dheeraj Tagde, Founder, Socilet</p>
            </div>

            {/* Getting Started */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl my-8">
              <h2 className="text-2xl font-bold mb-4">Getting Started with Socilet</h2>
              <div className="grid gap-3">
                {[
                  "Submit project requirements (WhatsApp or email)",
                  "Receive free proposal with timeline and pricing",
                  "Development begins (no payment required)",
                  "Review and approve your website",
                  "Pay only when 100% satisfied"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0 text-sm">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                📧 hello@socilet.com | 📱 +91 93014 99921
              </p>
            </div>

            {/* FAQs */}
            <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4 my-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Q: {faq.question}</h3>
                  <p className="text-muted-foreground">A: {faq.answer}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-xl my-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Build Your Business Website?</h2>
              <p className="mb-6 opacity-90">
                Get a professional website starting at just $300 with zero advance payment. 
                Risk-free, quality-guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => window.open('https://wa.me/919301499921?text=Hi! I want to discuss website development for my business.', '_blank')}
                >
                  Get Free Quote - WhatsApp
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => window.location.href = 'mailto:hello@socilet.com'}
                >
                  Email: hello@socilet.com
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />
    </article>
  );
};

export default WebsiteCostGuide;
