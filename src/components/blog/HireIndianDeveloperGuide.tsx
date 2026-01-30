import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Share2, CalendarIcon, Clock, CheckCircle, Shield, DollarSign, Globe, Users, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from '@/components/BlogPreview';
import { Helmet } from 'react-helmet';

interface BlogPostProps {
  post: BlogPost;
  onBack: () => void;
}

const HireIndianDeveloperGuide: React.FC<BlogPostProps> = ({ post, onBack }) => {
  const faqs = [
    {
      question: "How do I pay from US/Canada?",
      answer: "We accept PayPal, Wise, and international bank transfers in USD and CAD. Invoice is sent after project completion, and you can pay using your preferred method."
    },
    {
      question: "What timezone do you work in?",
      answer: "We work IST (Indian Standard Time), which is 10.5-12 hours ahead of US timezones. This actually benefits you - we work while you sleep, and you wake up to progress!"
    },
    {
      question: "Do you sign contracts/NDAs?",
      answer: "Absolutely! We provide formal contracts and are happy to sign NDAs to protect your intellectual property. Your ideas are safe with us."
    },
    {
      question: "What if there are revisions needed?",
      answer: "Unlimited revisions are included until you're satisfied. Since you don't pay until happy, we're motivated to get it right the first time."
    },
    {
      question: "How fast can you start my project?",
      answer: "Most projects can begin within 24-48 hours of approval. We maintain a lean team structure that allows quick project kickoffs."
    }
  ];

  const caseStudies = [
    {
      client: "US Startup",
      location: "Texas, USA",
      project: "E-commerce Website",
      savings: "$3,000",
      timeline: "3 weeks",
      quote: "Best decision for our startup. Quality work, transparent communication."
    },
    {
      client: "Canadian SMB",
      location: "Toronto, Canada",
      project: "Mobile App",
      savings: "$5,000",
      timeline: "6 weeks",
      quote: "The timezone actually worked in our favor - we'd give feedback and wake up to updates!"
    },
    {
      client: "US Entrepreneur",
      location: "California, USA",
      project: "AI Spokesperson",
      savings: "$1,500",
      timeline: "1 week",
      quote: "Saved over $1,500 compared to local quotes. Incredible quality!"
    }
  ];

  return (
    <article className="py-12 px-4">
      <Helmet>
        <title>Hire Indian Developer No Upfront Payment | US & Canada | Socilet</title>
        <meta name="description" content="Hire skilled Indian developers with zero upfront payment. 60% cost savings for US & Canada businesses. Pay only after work is complete." />
        <meta name="keywords" content="hire Indian developer USA, outsource web development India, no upfront payment developer, Indian freelance developer, budget website development for US startups" />
        <link rel="canonical" href="https://socilet.in/blog/hire-indian-developer-guide" />
        <link rel="alternate" hrefLang="en-us" href="https://socilet.in/blog/hire-indian-developer-guide" />
        <link rel="alternate" hrefLang="en-ca" href="https://socilet.in/blog/hire-indian-developer-guide" />
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
            {/* Introduction */}
            <p className="text-xl text-muted-foreground mb-8">
              Looking to hire a skilled developer without breaking the bank? India offers some of the world's best 
              tech talent at a fraction of US/Canada rates. But the biggest concern for Western businesses has always 
              been: <strong>"What if I pay and get nothing in return?"</strong> That's exactly what zero advance payment solves.
            </p>

            {/* Why Outsource to India */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Globe className="text-blue-500" />
              Why Outsource Web Development to India?
            </h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-bold text-green-700 text-2xl">60-70%</h4>
                <p className="text-sm text-gray-600">Cost savings compared to US/Canada rates</p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-bold text-blue-700 text-2xl">5.8M+</h4>
                <p className="text-sm text-gray-600">Software developers in India</p>
              </div>
              <div className="p-4 border rounded-lg bg-purple-50">
                <h4 className="font-bold text-purple-700 text-2xl">1.5M</h4>
                <p className="text-sm text-gray-600">STEM graduates annually</p>
              </div>
              <div className="p-4 border rounded-lg bg-amber-50">
                <h4 className="font-bold text-amber-700 text-2xl">12hrs</h4>
                <p className="text-sm text-gray-600">Timezone difference = work continues 24/7</p>
              </div>
            </div>

            <p>
              According to research by TeamNow and Wisemonk, India remains the world's top destination for IT outsourcing. 
              The reasons are compelling:
            </p>
            <ul className="space-y-2 my-4">
              <li><strong>Cost-Effective:</strong> A $5,000 US project costs $1,500-2,000 with skilled Indian developers</li>
              <li><strong>English Proficiency:</strong> India has the world's second-largest English-speaking population</li>
              <li><strong>Technical Excellence:</strong> Indian developers work with global tech giants like Google, Microsoft, Amazon</li>
              <li><strong>24/7 Development:</strong> Work continues while US/Canada sleeps</li>
            </ul>

            {/* The Risk Problem */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Shield className="text-red-500" />
              The Risk of Traditional Offshore Outsourcing
            </h2>
            <p>
              Despite the benefits, many US/Canada businesses have had bad experiences with offshore outsourcing. 
              Common horror stories include:
            </p>
            <ul className="space-y-2 my-4 list-disc pl-6">
              <li>Developers disappearing after receiving advance payment</li>
              <li>Poor quality deliverables that don't match promises</li>
              <li>Communication breakdowns and missed deadlines</li>
              <li>Projects left incomplete with no recourse</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">⚠️ The Advance Payment Trap</h3>
              <p className="text-gray-700 mb-0">
                Traditional outsourcing requires 30-50% upfront payment. Once money changes hands internationally, 
                getting refunds is nearly impossible. This is why many Western businesses remain skeptical of offshore development.
              </p>
            </div>

            {/* The Solution */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Zero Advance Payment: The Safe Outsourcing Solution
            </h2>
            <p>
              At Socilet, we've eliminated the biggest barrier to offshore development: <strong>financial risk</strong>. 
              With our zero advance payment model:
            </p>
            <div className="grid gap-4 my-6">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="text-green-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">You retain full control</h4>
                  <p className="text-muted-foreground text-sm">No payment means no risk. If we don't deliver, you don't pay.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="text-green-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Quality verification before payment</h4>
                  <p className="text-muted-foreground text-sm">Test everything, request changes, approve before paying.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="text-green-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">No hidden charges</h4>
                  <p className="text-muted-foreground text-sm">What we quote is what you pay. Period.</p>
                </div>
              </div>
            </div>

            {/* How to Hire */}
            <h2 className="text-2xl font-bold mt-10 mb-4">How to Hire Indian Developer with No Upfront Cost</h2>
            <div className="grid gap-4 my-6">
              {[
                { step: 1, title: "Define Your Requirements", desc: "Write down what you need - features, design preferences, timeline expectations." },
                { step: 2, title: "Contact Socilet", desc: "Reach out via WhatsApp (+91 93014 99921) or email (hello@socilet.com) with your brief." },
                { step: 3, title: "Receive Proposal", desc: "Get detailed proposal with timeline, pricing in USD/CAD, and scope of work." },
                { step: 4, title: "Development Begins", desc: "After approval, work starts immediately. No payment required." },
                { step: 5, title: "Regular Updates", desc: "Receive progress updates via video calls, screen shares, and demos." },
                { step: 6, title: "Review & Approve", desc: "Test the final product thoroughly. Request any changes needed." },
                { step: 7, title: "Pay When Satisfied", desc: "Only after 100% approval, make payment via PayPal/Wire Transfer." }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Services & Pricing */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <DollarSign className="text-green-500" />
              What Services Can You Outsource?
            </h2>
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">Service</th>
                    <th className="border border-gray-300 p-3 text-left">US/Canada Price</th>
                    <th className="border border-gray-300 p-3 text-left">Socilet Price</th>
                    <th className="border border-gray-300 p-3 text-left">You Save</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">Custom Website</td>
                    <td className="border border-gray-300 p-3 text-gray-500 line-through">$3,000-5,000</td>
                    <td className="border border-gray-300 p-3 text-green-600 font-semibold">$500-1,500</td>
                    <td className="border border-gray-300 p-3 text-green-600">~70%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">Mobile App</td>
                    <td className="border border-gray-300 p-3 text-gray-500 line-through">$10,000-25,000</td>
                    <td className="border border-gray-300 p-3 text-green-600 font-semibold">$2,000-5,000</td>
                    <td className="border border-gray-300 p-3 text-green-600">~80%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">E-commerce Store</td>
                    <td className="border border-gray-300 p-3 text-gray-500 line-through">$5,000-10,000</td>
                    <td className="border border-gray-300 p-3 text-green-600 font-semibold">$1,000-2,500</td>
                    <td className="border border-gray-300 p-3 text-green-600">~75%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">AI Spokesperson</td>
                    <td className="border border-gray-300 p-3 text-gray-500 line-through">$800-2,000</td>
                    <td className="border border-gray-300 p-3 text-green-600 font-semibold">$100-300</td>
                    <td className="border border-gray-300 p-3 text-green-600">~85%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Case Studies */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <Star className="text-yellow-500" />
              Case Studies: US/Canada Clients Who Saved with Socilet
            </h2>
            <div className="grid gap-6 my-6">
              {caseStudies.map((study, index) => (
                <div key={index} className="border rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{study.client}</h3>
                      <p className="text-muted-foreground text-sm">{study.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-bold text-xl">Saved {study.savings}</p>
                      <p className="text-muted-foreground text-sm">Delivered in {study.timeline}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2"><strong>Project:</strong> {study.project}</p>
                  <p className="italic text-gray-700">"{study.quote}"</p>
                </div>
              ))}
            </div>

            {/* Hinglish Experience */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8 rounded-r-lg">
              <h3 className="font-bold text-lg mb-2">🌍 Our Experience with International Clients</h3>
              <p className="text-gray-700 mb-0 italic">
                "Humne 50+ US/Canada clients ke saath kaam kiya hai jo pehle offshore outsourcing se darr gaye the. 
                Unme se kayi pehle scam ho chuke the. Jab humne zero advance model offer kiya, unhe yakeen nahi hua - 
                'Really? No payment upfront?' Aaj wahi clients humari biggest referral source hain."
              </p>
              <p className="text-gray-600 text-sm mt-2">— Dheeraj Tagde, Founder, Socilet</p>
            </div>

            {/* Communication */}
            <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
              <MessageCircle className="text-blue-500" />
              Communication and Project Management
            </h2>
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">🕐 Timezone Overlap</h4>
                <p className="text-sm text-muted-foreground">Available for calls 9 AM - 11 AM EST (your morning, our evening)</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">📹 Video Demos</h4>
                <p className="text-sm text-muted-foreground">Regular Zoom/Google Meet sessions to show progress</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">💬 Instant Messaging</h4>
                <p className="text-sm text-muted-foreground">WhatsApp, Slack, or your preferred platform</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">🗣️ English Fluency</h4>
                <p className="text-sm text-muted-foreground">Clear, professional communication guaranteed</p>
              </div>
            </div>

            {/* Payment Methods */}
            <h2 className="text-2xl font-bold mt-10 mb-4">Payment Methods and Currency</h2>
            <ul className="space-y-2 my-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <span>Accept USD, CAD, GBP, AUD via PayPal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <span>International wire transfers accepted</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <span>Wise (TransferWise) for lower fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <span>Invoice after project completion only</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <span>No hidden fees or currency conversion surprises</span>
              </li>
            </ul>

            {/* FAQs */}
            <h2 className="text-2xl font-bold mt-10 mb-4">FAQs for US/Canada Clients</h2>
            <div className="space-y-4 my-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Q: {faq.question}</h3>
                  <p className="text-muted-foreground">A: {faq.answer}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl my-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Save 70% on Your Development Costs?</h2>
              <p className="mb-6 opacity-90">
                Join 50+ US & Canada businesses who've successfully worked with Socilet. 
                Zero risk, maximum savings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => window.open('https://wa.me/919301499921?text=Hi! I\'m from US/Canada and interested in your zero advance payment services.', '_blank')}
                >
                  WhatsApp: +91 93014 99921
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

export default HireIndianDeveloperGuide;
