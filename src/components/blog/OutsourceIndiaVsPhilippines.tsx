import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, Clock, User, CheckCircle, Globe, DollarSign, Users, MessageCircle, Award } from "lucide-react";
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

const OutsourceIndiaVsPhilippines: React.FC<BlogContentProps> = ({ post, onBack }) => {
  const canonicalUrl = `https://socilet.in/blog/${post.slug}`;

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is India or Philippines better for web development outsourcing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "India is better for complex technical projects, large-scale development, and cost-sensitive projects. Philippines is better for customer service integration, US-aligned culture preference, and voice-heavy requirements."
        }
      },
      {
        "@type": "Question",
        "name": "What is the cost difference between India and Philippines developers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Indian developers typically charge $15-40/hour while Filipino developers charge $20-50/hour. For project-based work, India is generally 15-25% more affordable due to larger talent pool and competition."
        }
      },
      {
        "@type": "Question",
        "name": "Which country has better English proficiency for outsourcing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Philippines has a slight edge in spoken English with neutral American accents. India excels in written English and technical documentation. Both countries have high English proficiency rates."
        }
      },
      {
        "@type": "Question",
        "name": "What time zone works better for US companies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Philippines (GMT+8) has 12-15 hours difference from US, while India (GMT+5:30) has 9.5-12.5 hours. Both offer overnight development capabilities, but India's earlier morning overlap can be advantageous for East Coast companies."
        }
      },
      {
        "@type": "Question",
        "name": "How do I avoid scams when outsourcing to either country?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose companies offering zero advance payment models like Socilet, verify portfolios, check client reviews, request video calls, and start with small test projects before committing to larger engagements."
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
                2026 Updated
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
                  <p className="text-sm text-muted-foreground">Founder, Socilet | 7+ Years Experience | 900+ Projects Delivered</p>
                  <p className="text-sm mt-1">Expert in global outsourcing strategies with clients across USA, Canada, UK, and India.</p>
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
              When US, Canadian, and UK businesses decide to outsource web development, two countries consistently 
              dominate the conversation: <strong>India</strong> and <strong>Philippines</strong>. Together, these 
              nations handle over 60% of global IT outsourcing, but which one is right for your project?
            </p>

            <p>
              In this comprehensive 2026 comparison, I'll break down everything you need to know—from costs and 
              talent pools to communication styles and time zone overlaps. Having worked with clients from both 
              markets for over 7 years and delivered 900+ projects, I've seen firsthand how these differences 
              play out in real-world scenarios.
            </p>

            {/* Overview Section */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <Globe className="w-7 h-7 text-primary" />
              Overview of Both Markets
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">🇮🇳 India's IT Industry</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600" /> 5.4 Million+ software developers</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600" /> $227 Billion IT exports (2025)</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600" /> Top hubs: Bangalore, Hyderabad, Pune</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600" /> World's largest IT workforce</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600" /> Strong STEM education system</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-3">🇵🇭 Philippines' IT Industry</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> 1.5 Million+ IT-BPO workers</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> $32 Billion BPO industry</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Top hub: Metro Manila, Cebu</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Strong customer service culture</li>
                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> American-influenced education</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Cost Comparison */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-primary" />
              Cost Comparison: India vs Philippines
            </h2>

            <p>
              Cost is often the primary driver for outsourcing decisions. Here's a detailed breakdown of what 
              you can expect to pay in each country:
            </p>

            <div className="overflow-x-auto my-8">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="p-4 text-left font-bold">Developer Level</th>
                    <th className="p-4 text-left font-bold">India (USD/hr)</th>
                    <th className="p-4 text-left font-bold">Philippines (USD/hr)</th>
                    <th className="p-4 text-left font-bold">USA (USD/hr)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Junior Developer</td>
                    <td className="p-4 text-green-600 font-semibold">$10-20</td>
                    <td className="p-4">$15-25</td>
                    <td className="p-4 text-red-500">$50-80</td>
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-4">Mid-Level Developer</td>
                    <td className="p-4 text-green-600 font-semibold">$20-35</td>
                    <td className="p-4">$25-40</td>
                    <td className="p-4 text-red-500">$80-120</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Senior Developer</td>
                    <td className="p-4 text-green-600 font-semibold">$35-50</td>
                    <td className="p-4">$40-60</td>
                    <td className="p-4 text-red-500">$120-180</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td className="p-4 font-bold">Full Website Project</td>
                    <td className="p-4 text-green-600 font-bold">$2,000-15,000</td>
                    <td className="p-4 font-semibold">$3,000-20,000</td>
                    <td className="p-4 text-red-500 font-bold">$15,000-80,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
              <p className="font-medium text-yellow-800">
                <strong>💡 Pro Tip:</strong> At Socilet, we offer zero advance payment—you only pay after 
                seeing and approving the completed work. This eliminates the financial risk entirely, 
                regardless of which country you choose.
              </p>
            </div>

            {/* Talent Pool Section */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <Users className="w-7 h-7 text-primary" />
              Talent Pool & Technical Skills
            </h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div>
                <h3 className="text-xl font-bold mb-4">India's Technical Strengths</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span><strong>Full-stack development:</strong> React, Node.js, Python, Java</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span><strong>Enterprise solutions:</strong> SAP, Salesforce, Oracle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span><strong>AI/ML expertise:</strong> TensorFlow, PyTorch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span><strong>Mobile development:</strong> React Native, Flutter</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Philippines' Technical Strengths</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span><strong>WordPress/CMS:</strong> Strong WordPress community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span><strong>Design-focused:</strong> UI/UX, graphic design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span><strong>E-commerce:</strong> Shopify, WooCommerce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span><strong>Virtual assistance:</strong> Tech + admin hybrid roles</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Communication Section */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <MessageCircle className="w-7 h-7 text-primary" />
              Communication & English Proficiency
            </h2>

            <p>
              Clear communication is crucial for successful outsourcing. Here's how both countries compare:
            </p>

            <div className="overflow-x-auto my-8">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="p-4 text-left font-bold">Aspect</th>
                    <th className="p-4 text-left font-bold">India</th>
                    <th className="p-4 text-left font-bold">Philippines</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">English Proficiency</td>
                    <td className="p-4">High (official language)</td>
                    <td className="p-4 text-green-600 font-semibold">Very High (American accent)</td>
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-4 font-medium">Written Communication</td>
                    <td className="p-4 text-green-600 font-semibold">Excellent documentation</td>
                    <td className="p-4">Good</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Cultural Alignment (US)</td>
                    <td className="p-4">Moderate</td>
                    <td className="p-4 text-green-600 font-semibold">High (American influence)</td>
                  </tr>
                  <tr className="border-b bg-muted/20">
                    <td className="p-4 font-medium">Technical Communication</td>
                    <td className="p-4 text-green-600 font-semibold">Excellent</td>
                    <td className="p-4">Good</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Time Zone Section */}
            <h2 className="text-2xl font-bold mt-10 mb-6">⏰ Time Zone Overlap Analysis</h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-3">India (IST: GMT+5:30)</h3>
                <ul className="space-y-2 text-sm">
                  <li>• US East Coast: 9.5-10.5 hours ahead</li>
                  <li>• US West Coast: 12.5-13.5 hours ahead</li>
                  <li>• UK: 5.5 hours ahead</li>
                  <li>• <strong>Best overlap:</strong> Early morning India = Evening US</li>
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-3">Philippines (PHT: GMT+8)</h3>
                <ul className="space-y-2 text-sm">
                  <li>• US East Coast: 12-13 hours ahead</li>
                  <li>• US West Coast: 15-16 hours ahead</li>
                  <li>• UK: 8 hours ahead</li>
                  <li>• <strong>Best overlap:</strong> Night shift Philippines = US business hours</li>
                </ul>
              </Card>
            </div>

            {/* When to Choose Section */}
            <h2 className="text-2xl font-bold mt-10 mb-6">🎯 When to Choose India</h2>

            <Card className="bg-blue-50/50 border-blue-200 p-6 my-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span><strong>Complex technical projects</strong> requiring advanced programming</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span><strong>Large-scale enterprise development</strong> with multiple integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span><strong>Cost-sensitive projects</strong> where budget is the primary concern</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span><strong>AI/ML and data science</strong> projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span><strong>Long-term partnerships</strong> with dedicated development teams</span>
                </li>
              </ul>
            </Card>

            <h2 className="text-2xl font-bold mt-10 mb-6">🎯 When to Choose Philippines</h2>

            <Card className="bg-green-50/50 border-green-200 p-6 my-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span><strong>Customer service integration</strong> with tech components</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span><strong>US-aligned culture preference</strong> for seamless communication</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span><strong>Voice-heavy requirements</strong> like call center + tech hybrid</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span><strong>Smaller projects</strong> with quick turnaround</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span><strong>Design-focused work</strong> like UI/UX and creative projects</span>
                </li>
              </ul>
            </Card>

            {/* Personal Experience Section - Hinglish */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 my-8">
              <h3 className="text-xl font-bold mb-4">💼 Mera 7+ Saal Ka Experience</h3>
              <p className="mb-4">
                <em>
                  "7 saal se US, Canada aur UK ke clients ke saath kaam karte hue maine dekha hai ki 
                  dono countries mein talented developers hain. Difference hai approach mein—India mein 
                  complex technical projects ke liye better talent milta hai, jabki Philippines mein 
                  communication aur customer service ka blend excellent hai.
                </em>
              </p>
              <p className="mb-4">
                <em>
                  Socilet mein humne ek unique model adopt kiya hai—<strong>Zero Advance Payment</strong>. 
                  Isse client ko koi financial risk nahi hota, chahe wo India se kaam karwaye ya kahin aur se. 
                  900+ projects deliver karne ke baad main confidently keh sakta hoon ki trust-based model 
                  hi long-term success ki key hai."
                </em>
              </p>
              <p className="font-semibold">— Dheeraj Tagde, Founder, Socilet</p>
            </div>

            {/* FAQs */}
            <h2 className="text-2xl font-bold mt-10 mb-6">❓ Frequently Asked Questions</h2>

            <div className="space-y-4 my-8">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">Is India or Philippines better for web development outsourcing?</h3>
                <p className="text-muted-foreground">India is better for complex technical projects, large-scale development, and cost-sensitive projects. Philippines is better for customer service integration, US-aligned culture preference, and voice-heavy requirements.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">What is the cost difference between India and Philippines developers?</h3>
                <p className="text-muted-foreground">Indian developers typically charge $15-40/hour while Filipino developers charge $20-50/hour. For project-based work, India is generally 15-25% more affordable.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">Which country has better English proficiency?</h3>
                <p className="text-muted-foreground">Philippines has a slight edge in spoken English with neutral American accents. India excels in written English and technical documentation.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">How do I avoid scams when outsourcing?</h3>
                <p className="text-muted-foreground">Choose companies offering zero advance payment models like Socilet, verify portfolios, check client reviews, and start with small test projects.</p>
              </Card>
            </div>

            {/* Conclusion */}
            <h2 className="text-2xl font-bold mt-10 mb-6">🏆 Conclusion: Our Recommendation</h2>

            <p>
              Both India and Philippines offer excellent outsourcing opportunities. For <strong>complex technical 
              projects and maximum cost savings</strong>, India remains the top choice. For <strong>communication-heavy 
              projects with US cultural alignment</strong>, Philippines excels.
            </p>

            <p>
              At Socilet, we've built our reputation on the Indian IT industry's strengths while addressing 
              the common concern of advance payment risks. Our <strong>zero advance payment model</strong> ensures 
              you only pay after seeing and approving the completed work.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-8 my-10 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Outsource With Zero Risk?</h3>
              <p className="mb-6 text-white/90">
                Get your project developed by experienced Indian developers with zero advance payment. 
                Pay only after you're 100% satisfied.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/#contact">
                  <Button size="lg" variant="secondary" className="font-bold">
                    Get Free Quote
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    View Our Portfolio
                  </Button>
                </Link>
              </div>
            </div>

            {/* Internal Links */}
            <div className="border-t pt-8 mt-10">
              <h3 className="font-bold text-lg mb-4">Related Articles:</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog/hire-indian-developer-no-upfront-payment-guide" className="text-primary hover:underline">
                    → Hire Indian Developer No Upfront Payment: Complete Guide
                  </Link>
                </li>
                <li>
                  <Link to="/blog/hire-developer-without-getting-scammed" className="text-primary hover:underline">
                    → How to Hire Developer Without Getting Scammed
                  </Link>
                </li>
                <li>
                  <Link to="/blog/wordpress-developer-india-cost-guide" className="text-primary hover:underline">
                    → WordPress Developer India Cost Guide
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

export default OutsourceIndiaVsPhilippines;
