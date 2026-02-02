import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, Clock, User, CheckCircle, MapPin, Star, Phone, Globe, TrendingUp, Search } from "lucide-react";
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

const GMBSetupServiceGuide: React.FC<BlogContentProps> = ({ post, onBack }) => {
  const canonicalUrl = `https://socilet.in/blog/${post.slug}`;

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Google My Business and why do I need it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Google My Business (now Google Business Profile) is a free tool that lets you manage how your business appears on Google Search and Maps. It's essential for local visibility—46% of all Google searches have local intent."
        }
      },
      {
        "@type": "Question",
        "name": "How much does GMB setup service cost in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Professional GMB setup in India ranges from ₹2,999 for basic setup to ₹9,999 for premium optimization. Monthly management services range from ₹1,999-5,999/month."
        }
      },
      {
        "@type": "Question",
        "name": "How long does Google My Business verification take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Postcard verification takes 5-14 days. Phone or email verification (if available) is instant. Video verification may take 1-5 business days for review."
        }
      },
      {
        "@type": "Question",
        "name": "Can I do GMB setup myself or should I hire a professional?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can set up basic GMB yourself, but professional optimization ensures maximum visibility. Experts know the right categories, keywords, and optimization techniques that significantly impact your local rankings."
        }
      },
      {
        "@type": "Question",
        "name": "How does GMB help my business get more customers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An optimized GMB profile increases visibility in local searches, displays your business in Google Maps, shows reviews and ratings, enables direct calls and messages, and provides business insights—leading to more leads and customers."
        }
      }
    ]
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Socilet",
    "description": "Professional Google My Business setup and optimization service in India",
    "url": "https://socilet.in",
    "telephone": "+91-XXXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹"
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
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
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                Google Business
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
                  <p className="text-sm text-muted-foreground">Founder, Socilet | 7+ Years Experience | 500+ GMB Profiles Optimized</p>
                  <p className="text-sm mt-1">Helping Indian businesses increase local visibility and customer reach through GMB.</p>
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
              In today's digital-first world, if your business isn't showing up on Google, you're practically 
              invisible to potential customers. <strong>Google My Business (GMB)</strong>—now called 
              <strong> Google Business Profile</strong>—is the most powerful free tool to boost your local 
              visibility. And getting it professionally set up can make all the difference.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
              <p className="font-medium text-blue-800">
                <strong>📊 Key Statistic:</strong> 46% of all Google searches have local intent, and 88% of 
                consumers who do a local search on their smartphone visit a related store within a week.
              </p>
            </div>

            {/* What is GMB */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <Search className="w-7 h-7 text-primary" />
              What is Google My Business?
            </h2>

            <p>
              Google My Business is a free tool that lets you manage how your business appears on Google 
              Search and Google Maps. When someone searches for your business name or services in your area, 
              your GMB profile appears with:
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <Card className="p-5 flex items-start gap-3">
                <MapPin className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Location & Directions</h4>
                  <p className="text-sm text-muted-foreground">Your address with direct Google Maps navigation</p>
                </div>
              </Card>
              <Card className="p-5 flex items-start gap-3">
                <Phone className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Click-to-Call</h4>
                  <p className="text-sm text-muted-foreground">Direct phone button for instant customer contact</p>
                </div>
              </Card>
              <Card className="p-5 flex items-start gap-3">
                <Star className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Reviews & Ratings</h4>
                  <p className="text-sm text-muted-foreground">Customer reviews that build trust instantly</p>
                </div>
              </Card>
              <Card className="p-5 flex items-start gap-3">
                <Globe className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold">Website & Booking</h4>
                  <p className="text-sm text-muted-foreground">Direct links to your website and booking system</p>
                </div>
              </Card>
            </div>

            {/* Benefits Section */}
            <h2 className="text-2xl font-bold mt-10 mb-6 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-primary" />
              Benefits of an Optimized GMB Profile
            </h2>

            <div className="space-y-4 my-8">
              <Card className="p-5 border-l-4 border-green-500">
                <h3 className="font-bold text-lg mb-2">📈 Increased Visibility</h3>
                <p className="text-muted-foreground">Appear in local search results and Google Maps when customers search for your services. Get discovered by people actively looking for what you offer.</p>
              </Card>

              <Card className="p-5 border-l-4 border-blue-500">
                <h3 className="font-bold text-lg mb-2">💰 Free Advertising</h3>
                <p className="text-muted-foreground">Unlike paid ads, GMB is completely free. A well-optimized profile can drive more traffic than expensive ad campaigns.</p>
              </Card>

              <Card className="p-5 border-l-4 border-yellow-500">
                <h3 className="font-bold text-lg mb-2">⭐ Customer Reviews</h3>
                <p className="text-muted-foreground">Collect and display customer reviews that build trust. 93% of consumers say online reviews influence their purchase decisions.</p>
              </Card>

              <Card className="p-5 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg mb-2">📞 Direct Calls & Messages</h3>
                <p className="text-muted-foreground">Customers can call or message you directly from your GMB profile—no need to visit your website first.</p>
              </Card>

              <Card className="p-5 border-l-4 border-orange-500">
                <h3 className="font-bold text-lg mb-2">📊 Business Insights</h3>
                <p className="text-muted-foreground">See how customers find you, what actions they take, and how you compare to competitors in your area.</p>
              </Card>
            </div>

            {/* Setup Process */}
            <h2 className="text-2xl font-bold mt-10 mb-6">🔧 Complete GMB Setup Process</h2>

            <div className="space-y-6 my-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-bold text-lg">Account Creation</h3>
                  <p className="text-muted-foreground">Create or claim your business profile on Google. We ensure all initial settings are correct for optimal visibility.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-bold text-lg">Business Verification</h3>
                  <p className="text-muted-foreground">Complete Google's verification process—postcard, phone, email, or video verification based on your business type.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-bold text-lg">Profile Optimization</h3>
                  <p className="text-muted-foreground">Complete every section: business name, categories, description, services, products, and attributes for maximum visibility.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-bold text-lg">Photo & Video Upload</h3>
                  <p className="text-muted-foreground">Add high-quality photos of your business, products, team, and location. Businesses with photos get 42% more direction requests.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="font-bold text-lg">Hours & Contact Info</h3>
                  <p className="text-muted-foreground">Set accurate business hours including special hours for holidays. Add phone, website, and messaging options.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">6</div>
                <div>
                  <h3 className="font-bold text-lg">Q&A Setup</h3>
                  <p className="text-muted-foreground">Pre-populate common questions and answers to help customers and improve your profile's helpfulness.</p>
                </div>
              </div>
            </div>

            {/* Optimization Best Practices */}
            <h2 className="text-2xl font-bold mt-10 mb-6">✨ GMB Optimization Best Practices</h2>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <Card className="p-5">
                <h4 className="font-bold mb-2">📝 Keyword-Rich Description</h4>
                <p className="text-sm text-muted-foreground">Write a compelling 750-character description with relevant keywords naturally incorporated.</p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-2">📢 Regular Posts & Updates</h4>
                <p className="text-sm text-muted-foreground">Post weekly updates, offers, events, and news to keep your profile active and engaging.</p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-2">⭐ Review Management</h4>
                <p className="text-sm text-muted-foreground">Respond to all reviews—positive and negative—professionally and promptly.</p>
              </Card>
              <Card className="p-5">
                <h4 className="font-bold mb-2">📸 Photo Optimization</h4>
                <p className="text-sm text-muted-foreground">Add geo-tagged, properly named photos. Update photos regularly to show current business status.</p>
              </Card>
            </div>

            {/* Common Mistakes */}
            <h2 className="text-2xl font-bold mt-10 mb-6">⚠️ Common GMB Mistakes to Avoid</h2>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span><strong>Wrong category selection:</strong> Choosing incorrect primary/secondary categories hurts visibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span><strong>Incomplete profiles:</strong> Missing information means missing opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span><strong>Ignoring reviews:</strong> Unanswered reviews signal poor customer service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span><strong>Inconsistent NAP:</strong> Name, Address, Phone must match across all platforms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span><strong>Fake reviews:</strong> Google can detect and penalize fake review practices</span>
                </li>
              </ul>
            </div>

            {/* Pricing Section */}
            <h2 className="text-2xl font-bold mt-10 mb-6">💰 Our GMB Setup Service Packages</h2>

            <div className="grid md:grid-cols-3 gap-4 my-8">
              <Card className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Basic Setup</h3>
                <p className="text-3xl font-bold text-primary mb-4">₹2,999</p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Profile creation</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Verification assistance</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Basic optimization</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 5 photos upload</li>
                </ul>
              </Card>

              <Card className="p-6 text-center border-primary border-2 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full">Popular</span>
                <h3 className="text-lg font-bold mb-2">Standard</h3>
                <p className="text-3xl font-bold text-primary mb-4">₹5,999</p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Everything in Basic</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Full optimization</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 15 photos upload</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Q&A setup</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 5 initial posts</li>
                </ul>
              </Card>

              <Card className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Premium</h3>
                <p className="text-3xl font-bold text-primary mb-4">₹9,999</p>
                <ul className="text-sm space-y-2 text-left">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Everything in Standard</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Citation building</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Competitor analysis</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Review strategy</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 1 month support</li>
                </ul>
              </Card>
            </div>

            {/* Hinglish Experience Section */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 my-8">
              <h3 className="text-xl font-bold mb-4">💼 Mera GMB Optimization Experience</h3>
              <p className="mb-4">
                <em>
                  "500+ businesses ke GMB profiles optimize karne ke baad main yeh confidently keh sakta 
                  hoon ki ek well-optimized GMB profile paid ads se bhi zyada effective ho sakti hai local 
                  customers attract karne mein.
                </em>
              </p>
              <p className="mb-4">
                <em>
                  Bahut saare small business owners GMB ko sirf 'address listing' samajhte hain, lekin yeh 
                  ek complete marketing tool hai. Sahi categories, keywords, photos aur regular updates ke 
                  saath aapka business Google pe dominate kar sakta hai. Aur sabse best part? Yeh completely 
                  FREE hai!"
                </em>
              </p>
              <p className="font-semibold">— Dheeraj Tagde, Founder, Socilet</p>
            </div>

            {/* FAQs */}
            <h2 className="text-2xl font-bold mt-10 mb-6">❓ Frequently Asked Questions</h2>

            <div className="space-y-4 my-8">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">What is Google My Business and why do I need it?</h3>
                <p className="text-muted-foreground">GMB is a free tool to manage your business appearance on Google Search and Maps. It's essential for local visibility—46% of all Google searches have local intent.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">How much does GMB setup service cost in India?</h3>
                <p className="text-muted-foreground">Professional GMB setup ranges from ₹2,999 (basic) to ₹9,999 (premium). Monthly management is ₹1,999-5,999/month.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">How long does verification take?</h3>
                <p className="text-muted-foreground">Postcard verification takes 5-14 days. Phone/email verification (if available) is instant. Video verification takes 1-5 business days.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">Can I do GMB setup myself?</h3>
                <p className="text-muted-foreground">Yes, but professional optimization ensures maximum visibility through proper categories, keywords, and optimization techniques.</p>
              </Card>
            </div>

            {/* Conclusion */}
            <h2 className="text-2xl font-bold mt-10 mb-6">🎯 Conclusion</h2>

            <p>
              Google My Business is one of the most powerful—and completely free—tools for local businesses. 
              An optimized GMB profile can significantly increase your visibility, drive more customers, and 
              boost your revenue without any ad spend.
            </p>

            <p>
              Whether you're just starting out or looking to improve your existing presence, professional 
              GMB setup and optimization can make a significant difference. At Socilet, we've helped 500+ 
              businesses maximize their local visibility through strategic GMB optimization.
            </p>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-8 my-10 text-center">
              <h3 className="text-2xl font-bold mb-4">Get Your GMB Profile Optimized Today</h3>
              <p className="mb-6 text-white/90">
                Increase your local visibility and get more customers. Starting at just ₹2,999.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/#contact">
                  <Button size="lg" variant="secondary" className="font-bold">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/#services">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Internal Links */}
            <div className="border-t pt-8 mt-10">
              <h3 className="font-bold text-lg mb-4">Related Articles:</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog/affordable-website-development-small-business" className="text-primary hover:underline">
                    → Affordable Website Development for Small Business
                  </Link>
                </li>
                <li>
                  <Link to="/blog/zero-advance-payment-website-development-guide" className="text-primary hover:underline">
                    → Zero Advance Payment Website Development Guide
                  </Link>
                </li>
                <li>
                  <Link to="/#services" className="text-primary hover:underline">
                    → Our Digital Marketing Services
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

export default GMBSetupServiceGuide;
