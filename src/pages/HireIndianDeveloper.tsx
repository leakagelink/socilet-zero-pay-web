import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Shield, 
  DollarSign, 
  Clock, 
  Users, 
  Globe, 
  Star,
  ArrowRight,
  MessageCircle,
  Award,
  Zap
} from 'lucide-react';

const HireIndianDeveloper = () => {
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      title: "Save 70% on Development Costs",
      description: "Get premium quality at a fraction of US/Canada rates. Same skills, lower overhead."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Zero Risk - Pay After Completion",
      description: "No upfront payment required. We work first, you pay only when satisfied."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Flexible Timezone Coverage",
      description: "12-hour timezone difference means work continues while you sleep."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "900+ Projects Delivered",
      description: "Trusted by businesses in USA, Canada, UK, and Australia since 2017."
    }
  ];

  const services = [
    {
      title: "Website Development",
      description: "Custom React, WordPress, and full-stack web development",
      price: "Starting $499",
      usPrice: "$2,000+",
      features: ["React/Next.js", "WordPress", "E-commerce", "SEO Optimized"]
    },
    {
      title: "Mobile App Development",
      description: "Native & cross-platform iOS and Android apps",
      price: "Starting $999",
      usPrice: "$5,000+",
      features: ["React Native", "Flutter", "iOS/Android", "App Store Launch"]
    },
    {
      title: "AI Spokesperson Videos",
      description: "Custom AI avatar videos for marketing & training",
      price: "Starting $199",
      usPrice: "$800+",
      features: ["Custom Avatar", "Multiple Languages", "HD Quality", "Fast Delivery"]
    }
  ];

  const testimonials = [
    {
      name: "Michael Thompson",
      location: "Texas, USA",
      text: "I was skeptical about the 'no advance payment' model, but Socilet delivered an amazing e-commerce site. Saved over $3,000 compared to local quotes!",
      rating: 5
    },
    {
      name: "Sarah Mitchell",
      location: "Toronto, Canada",
      text: "Working with Dheeraj's team was seamless. The timezone actually worked in our favor - we'd give feedback and wake up to updates!",
      rating: 5
    },
    {
      name: "James Wilson",
      location: "California, USA",
      text: "Best decision for our startup. Quality work, transparent communication, and the pay-after model gave us confidence.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Is it safe to hire developers from India without upfront payment?",
      answer: "Absolutely! Our zero-advance model protects you completely. We deliver the work first, you review it, and only pay when 100% satisfied. We've completed 900+ projects this way."
    },
    {
      question: "How do you handle timezone differences?",
      answer: "Our 10.5-12 hour difference with US/Canada actually benefits you! We work while you sleep. Plus, we're available for calls during your morning hours (our evening)."
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer: "You don't pay! Our model is simple - we work, you review, you pay only if satisfied. We offer unlimited revisions until you approve the final product."
    },
    {
      question: "How much can I save compared to US/Canada rates?",
      answer: "Typically 60-70%. A $5,000 US project costs around $1,500-2,000 with us - same quality, same technologies, just lower overhead costs."
    },
    {
      question: "What technologies do you work with?",
      answer: "React, Next.js, Node.js, Python, WordPress, Shopify, React Native, Flutter, and more. Our team stays updated with the latest tech stack."
    }
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/917024466980?text=Hi! I\'m interested in hiring Indian developer services for my US/Canada business.', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet>
        <title>Hire Indian Developer No Upfront Payment | US & Canada | Socilet</title>
        <meta name="description" content="Hire Indian web developer with zero advance payment. Save 70% vs US rates. 900+ projects delivered. Safe, reliable outsourcing for US & Canada businesses." />
        <meta name="keywords" content="hire Indian developer USA, outsource web development India, no upfront payment developer, Indian freelance developer, budget website development for US startups" />
        <link rel="canonical" href="https://socilet.in/hire-indian-developer" />
        
        {/* Hreflang for this page */}
        <link rel="alternate" hrefLang="en-us" href="https://socilet.in/hire-indian-developer" />
        <link rel="alternate" hrefLang="en-ca" href="https://socilet.in/hire-indian-developer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Hire Indian Developer No Upfront Payment | US & Canada" />
        <meta property="og:description" content="Save 70% on development costs. Zero risk - pay only after completion. Trusted by 900+ US & Canada clients." />
        <meta property="og:url" content="https://socilet.in/hire-indian-developer" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
                🇺🇸 USA & 🇨🇦 Canada Trusted
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Hire Indian Developer
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  No Upfront Payment
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
                Save <strong>70%</strong> on development costs. Work first, pay later. 
                <strong> 900+ projects</strong> delivered to US & Canada clients.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Get Free Quote on WhatsApp
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Services & Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Zero Advance Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Pay After Delivery</span>
                </div>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-white mb-2">70%</div>
                    <div className="text-blue-200">Average Cost Savings</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-blue-200">US Developer Rate</span>
                      <span className="text-white font-semibold line-through opacity-60">$80-150/hr</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                      <span className="text-green-300">Socilet Rate</span>
                      <span className="text-green-400 font-bold text-xl">$20-40/hr</span>
                    </div>
                  </div>
                  <p className="text-center text-blue-200 text-sm mt-4">
                    Same quality. Same technologies. Lower cost.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              <span className="font-medium">7+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              <span className="font-medium">900+ Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-green-500" />
              <span className="font-medium">US, Canada, UK, Australia</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-purple-500" />
              <span className="font-medium">Fast Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why US & Canada Companies Choose Socilet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join 900+ businesses who saved thousands while getting premium quality work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services & Pricing */}
      <section id="services" className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Services & Pricing Comparison
            </h2>
            <p className="text-xl text-gray-600">
              See how much you save compared to US/Canada rates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">US/Canada Price:</span>
                      <span className="text-gray-400 line-through">{service.usPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Our Price:</span>
                      <span className="text-green-600 font-bold text-xl">{service.price}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleWhatsApp}
                  >
                    Get Free Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What US & Canada Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions from US & Canada clients
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Save 70% on Your Next Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No upfront payment. No risk. Just quality work delivered.
          </p>
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Start Your Project Today - WhatsApp
          </Button>
          <p className="mt-4 text-blue-200 text-sm">
            Average response time: 2 hours | Available: Mon-Sat, 9 AM - 9 PM IST
          </p>
        </div>
      </section>

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

      <Footer />
    </div>
  );
};

export default HireIndianDeveloper;
