import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, Clock, CheckCircle, Smartphone, DollarSign, Globe, Code, Layers, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostData } from '@/data/blogData';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

interface BlogPostProps {
  post: BlogPostData;
  onBack: () => void;
}

const MobileAppDevelopmentCostGuide: React.FC<BlogPostProps> = ({ post, onBack }) => {
  const faqs = [
    {
      question: "What is the average cost of mobile app development in India?",
      answer: "Simple apps cost ₹2-5 lakh ($2,500-$6,500), medium complexity apps cost ₹5-15 lakh ($6,500-$20,000), and complex enterprise apps cost ₹15-50 lakh ($20,000-$65,000)."
    },
    {
      question: "Is React Native cheaper than native app development?",
      answer: "Yes, React Native is typically 30-40% cheaper because you develop once for both iOS and Android. Native development requires separate codebases, doubling development costs."
    },
    {
      question: "How long does it take to develop a mobile app in India?",
      answer: "Simple apps: 4-8 weeks. Medium apps: 8-16 weeks. Complex apps: 16-32 weeks. Timeline depends on features, integrations, and testing requirements."
    },
    {
      question: "What are the hidden costs of app development?",
      answer: "Common hidden costs include: App Store fees ($99/year iOS, $25 one-time Android), server hosting ($50-500/month), third-party APIs, ongoing maintenance (15-20% of development cost annually), and marketing."
    },
    {
      question: "Do you offer zero advance payment for app development?",
      answer: "Yes! Socilet offers complete app development with zero advance payment for projects under ₹4,00,000 ($5,000). You pay only after reviewing and approving the final product."
    },
    {
      question: "What platforms do you develop apps for?",
      answer: "We develop for iOS (iPhone/iPad), Android, and cross-platform (React Native, Flutter). We also create Progressive Web Apps (PWAs) for browser-based mobile experiences."
    }
  ];

  const faqSchema = {
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
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,
    "datePublished": post.dateISO,
    "dateModified": post.dateISO,
    "author": {
      "@type": "Person",
      "name": "Dheeraj Tagde",
      "url": "https://socilet.in",
      "jobTitle": "Founder & CEO",
      "description": "7+ years experience in mobile app development"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Socilet",
      "logo": {
        "@type": "ImageObject",
        "url": "https://socilet.in/lovable-uploads/082da739-5b35-4399-be06-1bbc60823d09.png"
      }
    }
  };

  return (
    <article className="py-12 px-4">
      <Helmet>
        <title>Mobile App Development Cost in India 2026: Complete Pricing Guide</title>
        <meta name="description" content="Detailed breakdown of mobile app development costs in India. Android, iOS & cross-platform pricing. Save 60% vs US developers. Get free quote." />
        <meta name="keywords" content="mobile app development cost India 2026, app development pricing India, affordable app development, cross platform app cost" />
        <link rel="canonical" href="https://socilet.in/blog/mobile-app-development-cost-india-2026" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-muted">
            <ArrowLeft size={16} className="mr-2" /> Back to all articles
          </Button>

          <div className="rounded-xl overflow-hidden mb-8 h-[400px]">
            <img 
              src={post.imageUrl} 
              alt="Mobile App Development Cost in India 2026"
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

          {/* Author Box */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-8">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              DT
            </div>
            <div>
              <p className="font-semibold">Dheeraj Tagde</p>
              <p className="text-sm text-muted-foreground">Founder & CEO, Socilet | 7+ Years App Development Experience</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <p className="text-xl text-muted-foreground mb-8">
              India has become the <strong>world's top destination for mobile app development</strong>, with over 5 million developers 
              offering quality work at 60-70% lower costs than US or European developers. But how much does an app really cost in 2026? 
              This comprehensive guide breaks down every factor affecting app development pricing in India.
            </p>

            {/* Factors Affecting Cost */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Layers className="text-blue-500" />
              Factors Affecting App Development Cost
            </h2>

            <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
              <Smartphone className="text-indigo-500" /> App Complexity
            </h3>
            <div className="grid gap-4 my-4">
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">Simple Apps</h4>
                  <span className="font-bold text-lg">₹2-5 lakh ($2,500-$6,500)</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Basic functionality, 5-10 screens, standard UI, minimal backend. Examples: Calculators, to-do lists, basic portfolios.</p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400">Medium Complexity Apps</h4>
                  <span className="font-bold text-lg">₹5-15 lakh ($6,500-$20,000)</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">User authentication, database integration, payment gateways, push notifications, 15-25 screens. Examples: E-commerce, social networking.</p>
              </div>
              <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400">Complex Enterprise Apps</h4>
                  <span className="font-bold text-lg">₹15-50 lakh ($20,000-$65,000)</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Real-time features, AI/ML integration, complex animations, multi-platform, 30+ screens. Examples: Healthcare, fintech, on-demand services.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2">
              <Code className="text-purple-500" /> Platform Choice
            </h3>
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Platform</th>
                    <th className="border border-border p-3 text-left">Cost Range</th>
                    <th className="border border-border p-3 text-left">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-semibold">Android Only</td>
                    <td className="border border-border p-3">₹2-20 lakh</td>
                    <td className="border border-border p-3 text-sm">Indian market, budget-conscious startups</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">iOS Only</td>
                    <td className="border border-border p-3">₹2.5-25 lakh</td>
                    <td className="border border-border p-3 text-sm">Premium markets, US/European users</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">React Native (Both)</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400 font-semibold">₹3-18 lakh</td>
                    <td className="border border-border p-3 text-sm">Startups, MVPs, budget-friendly cross-platform</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Flutter (Both)</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400 font-semibold">₹3.5-20 lakh</td>
                    <td className="border border-border p-3 text-sm">Beautiful UIs, performance-focused</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">Native Both Platforms</td>
                    <td className="border border-border p-3">₹5-50 lakh</td>
                    <td className="border border-border p-3 text-sm">Enterprise, games, complex animations</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cost by App Type */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <DollarSign className="text-green-500" />
              App Development Cost by Type
            </h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">App Type</th>
                    <th className="border border-border p-3 text-left">India Cost</th>
                    <th className="border border-border p-3 text-left">US Cost</th>
                    <th className="border border-border p-3 text-left">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-semibold">E-commerce App</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400">₹5-12 lakh</td>
                    <td className="border border-border p-3 text-muted-foreground">$25,000-60,000</td>
                    <td className="border border-border p-3 font-bold">70%</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Social Media App</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400">₹8-25 lakh</td>
                    <td className="border border-border p-3 text-muted-foreground">$40,000-120,000</td>
                    <td className="border border-border p-3 font-bold">75%</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">On-Demand Service (Uber clone)</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400">₹10-30 lakh</td>
                    <td className="border border-border p-3 text-muted-foreground">$50,000-150,000</td>
                    <td className="border border-border p-3 font-bold">70%</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Healthcare App</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400">₹12-35 lakh</td>
                    <td className="border border-border p-3 text-muted-foreground">$60,000-175,000</td>
                    <td className="border border-border p-3 font-bold">65%</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">Fintech App</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400">₹15-40 lakh</td>
                    <td className="border border-border p-3 text-muted-foreground">$75,000-200,000</td>
                    <td className="border border-border p-3 font-bold">65%</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border p-3 font-semibold">Educational App (LMS)</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400">₹6-18 lakh</td>
                    <td className="border border-border p-3 text-muted-foreground">$30,000-90,000</td>
                    <td className="border border-border p-3 font-bold">70%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Country Comparison */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Globe className="text-indigo-500" />
              India vs USA vs Philippines: Cost Comparison
            </h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Country</th>
                    <th className="border border-border p-3 text-left">Hourly Rate</th>
                    <th className="border border-border p-3 text-left">Simple App Cost</th>
                    <th className="border border-border p-3 text-left">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-green-50 dark:bg-green-950">
                    <td className="border border-border p-3 font-semibold">🇮🇳 India</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400 font-semibold">$25-50/hr</td>
                    <td className="border border-border p-3 text-green-600 dark:text-green-400 font-semibold">$2,500-$6,500</td>
                    <td className="border border-border p-3">⭐⭐⭐⭐⭐ Excellent</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">🇵🇭 Philippines</td>
                    <td className="border border-border p-3">$20-40/hr</td>
                    <td className="border border-border p-3">$2,000-$5,000</td>
                    <td className="border border-border p-3">⭐⭐⭐⭐ Good</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">🇺🇦 Ukraine</td>
                    <td className="border border-border p-3">$40-80/hr</td>
                    <td className="border border-border p-3">$5,000-$12,000</td>
                    <td className="border border-border p-3">⭐⭐⭐⭐⭐ Excellent</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-semibold">🇺🇸 USA</td>
                    <td className="border border-border p-3 text-red-600 dark:text-red-400">$100-200/hr</td>
                    <td className="border border-border p-3 text-red-600 dark:text-red-400">$15,000-$50,000</td>
                    <td className="border border-border p-3">⭐⭐⭐⭐⭐ Excellent</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">Why India is the Best Choice</h3>
              <p className="text-muted-foreground mb-0">
                India offers the perfect balance of <strong>quality, cost, and talent pool</strong>. With 5M+ developers, 
                excellent English proficiency, and proven track records with Fortune 500 companies, India delivers 
                enterprise-grade apps at a fraction of Western prices.
              </p>
            </div>

            {/* Cross-Platform vs Native */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Zap className="text-yellow-500" />
              Cross-Platform vs Native App Development
            </h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">React Native / Flutter</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ 30-40% lower cost</li>
                  <li>✓ Single codebase for iOS + Android</li>
                  <li>✓ Faster development time</li>
                  <li>✓ Easier maintenance</li>
                  <li>✗ Slightly less performance</li>
                  <li>✗ Limited access to native features</li>
                </ul>
                <p className="text-sm font-semibold mt-3">Best for: Startups, MVPs, business apps</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Native (Swift/Kotlin)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Best performance</li>
                  <li>✓ Full platform features</li>
                  <li>✓ Better for complex animations</li>
                  <li>✓ Ideal for games</li>
                  <li>✗ 2x development cost</li>
                  <li>✗ Separate teams needed</li>
                </ul>
                <p className="text-sm font-semibold mt-3">Best for: Games, AR/VR, enterprise</p>
              </div>
            </div>

            {/* Hidden Costs */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Shield className="text-red-500" />
              Hidden Costs to Consider
            </h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
                <h4 className="font-semibold text-red-600 dark:text-red-400">App Store Fees</h4>
                <p className="text-sm text-muted-foreground">Apple: $99/year. Google: $25 one-time. Both take 15-30% of in-app purchases.</p>
              </div>
              <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Server/Hosting</h4>
                <p className="text-sm text-muted-foreground">$50-500/month depending on users. AWS, Google Cloud, or Firebase costs.</p>
              </div>
              <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Third-Party Services</h4>
                <p className="text-sm text-muted-foreground">Payment gateways, maps APIs, push notifications – can add $100-500/month.</p>
              </div>
              <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Maintenance</h4>
                <p className="text-sm text-muted-foreground">15-20% of development cost annually for updates, bug fixes, OS compatibility.</p>
              </div>
            </div>

            {/* Why Choose Socilet */}
            <h2 className="text-2xl font-bold mt-10 mb-4">Why Choose Socilet for App Development</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Zero Advance Payment
                </h4>
                <p className="text-sm text-muted-foreground mt-2">Pay only after you review and approve the final app. No upfront risk.</p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> 7+ Years Experience
                </h4>
                <p className="text-sm text-muted-foreground mt-2">Experienced team with 200+ app projects delivered successfully.</p>
              </div>
              <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Free Post-Delivery Support
                </h4>
                <p className="text-sm text-muted-foreground mt-2">30 days of free support, bug fixes, and guidance after app delivery.</p>
              </div>
              <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Transparent Pricing
                </h4>
                <p className="text-sm text-muted-foreground mt-2">No hidden costs. Complete breakdown provided before project starts.</p>
              </div>
            </div>

            {/* Hinglish Experience */}
            <div className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">🇮🇳 Experience (Hinglish)</h3>
              <p className="text-muted-foreground mb-0 italic">
                "App development mein sabse badi problem hoti hai accurate pricing. Bahut saare clients ko pehle kam quote diya jaata hai 
                aur baad mein hidden costs add hote rehte hain. Humne Socilet mein transparent pricing rakha hai – 
                sab kuch pehle se clear. Aur zero advance model se clients ko koi risk nahi hota. 
                200+ apps deliver kar chuke hain is tarike se."
              </p>
              <p className="text-muted-foreground text-sm mt-2 font-semibold">— Dheeraj Tagde, Founder & CEO, Socilet</p>
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
              <h2 className="text-2xl font-bold mb-4">Get Your Free App Development Quote</h2>
              <p className="mb-6 opacity-90">
                Share your app idea and get a detailed cost estimate within 24 hours. 
                Zero advance payment – pay only after you're satisfied.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/app-development">
                  <Button size="lg" variant="secondary" className="font-semibold">
                    View App Development Services
                  </Button>
                </Link>
                <a href="https://wa.me/919301499921" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    WhatsApp: +91 93014 99921
                  </Button>
                </a>
              </div>
            </div>

            {/* Internal Links */}
            <div className="bg-muted/50 p-6 rounded-lg my-8">
              <h3 className="font-bold text-lg mb-4">Related Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/app-development" className="text-primary hover:underline">→ Mobile App Development Services</Link></li>
                <li><Link to="/website-development" className="text-primary hover:underline">→ Website Development</Link></li>
                <li><Link to="/#portfolio" className="text-primary hover:underline">→ View Our Portfolio</Link></li>
                <li><Link to="/blog/hire-indian-developer-no-upfront-payment-guide" className="text-primary hover:underline">→ Hire Indian Developer Guide</Link></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
};

export default MobileAppDevelopmentCostGuide;
