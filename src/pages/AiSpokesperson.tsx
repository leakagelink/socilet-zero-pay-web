
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Video, MoveRight } from 'lucide-react';
import Contact from '../components/Contact';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AiSpokesperson = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>AI Spokesperson Services | Socilet</title>
        <meta name="description" content="Create virtual presenters and spokespersons powered by AI for your marketing needs." />
      </Helmet>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                  AI-Powered <span className="text-primary-600">Virtual Spokespersons</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Create realistic virtual presenters and spokespersons powered by advanced AI for your marketing, training, and communication needs.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full px-6"
                  >
                    <Link to="/#contact">Get Started</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-primary-600 text-primary-700 hover:bg-primary-50 rounded-full px-6"
                  >
                    <Link to="/zero-advance-payment">Learn About Zero Advance</Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white p-4 rounded-xl shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="AI Spokesperson" 
                    className="rounded-lg w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">AI Spokesperson Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI spokespersons provide realistic, engaging presentations for your brand with advanced features.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Customizable Avatar",
                  description: "Choose from a variety of realistic avatars or create custom ones to match your brand.",
                  icon: <Video className="w-12 h-12 text-primary-600" />
                },
                {
                  title: "Natural Speech",
                  description: "Lifelike voice synthesis with proper intonation, emphasis, and emotional expression.",
                  icon: <Video className="w-12 h-12 text-primary-600" />
                },
                {
                  title: "Multiple Languages",
                  description: "Support for dozens of languages to reach your global audience effectively.",
                  icon: <Video className="w-12 h-12 text-primary-600" />
                },
                {
                  title: "Easy Integration",
                  description: "Seamlessly integrate with your website, presentations, or marketing materials.",
                  icon: <Video className="w-12 h-12 text-primary-600" />
                },
                {
                  title: "Script Customization",
                  description: "Create custom scripts that your AI spokesperson will deliver perfectly every time.",
                  icon: <Video className="w-12 h-12 text-primary-600" />
                },
                {
                  title: "Analytics & Insights",
                  description: "Track viewer engagement and performance metrics for continuous improvement.",
                  icon: <Video className="w-12 h-12 text-primary-600" />
                },
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="bg-primary-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">How Businesses Use AI Spokespersons</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the various ways companies are leveraging AI spokespersons to enhance their communications.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Product Presentations",
                  description: "Create engaging product demos and presentations that can be updated easily."
                },
                {
                  title: "Corporate Training",
                  description: "Develop interactive training materials with a consistent presenter."
                },
                {
                  title: "Customer Support",
                  description: "Provide visual customer support explanations with a friendly face."
                },
                {
                  title: "Marketing Videos",
                  description: "Produce marketing content quickly without the need for studio time."
                },
                {
                  title: "Multilingual Outreach",
                  description: "Reach international audiences in their native languages efficiently."
                },
                {
                  title: "Website Guides",
                  description: "Add interactive guides to your website to improve user experience."
                },
              ].map((useCase, index) => (
                <motion.div 
                  key={index}
                  className="flex gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-primary-100 text-primary-700 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                    <p className="text-gray-600">{useCase.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Zero Advance Payment Section */}
        <section className="py-20 bg-primary-800 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="lg:w-3/5">
                <h2 className="text-3xl font-bold mb-6">Zero Advance Payment Model</h2>
                <p className="mb-4">
                  At Socilet, we work on a unique zero advance payment model. We believe in delivering quality work before asking for any payment.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mt-1 mr-2" />
                    <span>Pay only after your AI spokesperson is fully developed and you're satisfied</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mt-1 mr-2" />
                    <span>No hidden charges or extra fees at any stage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mt-1 mr-2" />
                    <span>Complete transparency throughout the development process</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-400 mt-1 mr-2" />
                    <span>If you're not satisfied, you don't pay us a single rupee</span>
                  </li>
                </ul>
                <Link to="/zero-advance-payment">
                  <Button className="bg-white text-primary-800 hover:bg-gray-100 rounded-full group">
                    Learn more about our model
                    <MoveRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="lg:w-2/5">
                <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20">
                  <h3 className="text-2xl font-semibold mb-4">Why Choose Our Zero Advance Model</h3>
                  <p className="mb-6">
                    Many developers take advance payments and then deliver incomplete work or use templates that don't match requirements. We want to eliminate these scams from the market.
                  </p>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="italic">
                      "If you don't like our work, don't pay us even 1 rupee. We believe in quality work and we don't want your hard-earned money to be wasted."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AiSpokesperson;
