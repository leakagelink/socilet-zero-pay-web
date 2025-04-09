
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ExternalLink, Code, FileText, Globe, Sun, Terminal, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolCard = ({ 
  title, 
  description, 
  url, 
  icon: Icon,
  color = "primary"
}) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={`bg-${color}-50 p-6`}>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        <h3 className="text-xl font-bold mt-4 text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600 text-sm">{description}</p>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
        >
          Try it now
          <span className="ml-1 text-xs">→</span>
        </a>
      </div>
    </motion.div>
  );
};

const Tools = () => {
  const tools = [
    {
      title: "Format Your Code",
      description: "A simple, elegant tool to format HTML, CSS, JavaScript and Python code",
      url: "https://codeformatter.pro/",
      icon: Code,
    },
    {
      title: "AI-Powered Legal Document Generator",
      description: "Create professional legal agreements, contracts, and affidavits in minutes with our AI-powered document generator. Simple, accurate, and legally sound.",
      url: "https://docucreatorpro.online/",
      icon: FileText,
    },
    {
      title: "Build WordPress Plugins with AI",
      description: "Create powerful WordPress plugins without writing a single line of code. Our AI-powered platform makes plugin development accessible to everyone.",
      url: "https://pluginpal.xyz/",
      icon: Terminal,
    },
    {
      title: "AI Content for Small Businesses",
      description: "Generate social media captions, business bios, and festival content in multiple Indian languages with our AI-powered tools tailored for local businesses.",
      url: "https://desiaicontent.online/",
      icon: Globe,
    },
    {
      title: "Solar Savings Calculator",
      description: "Calculate your return on investment for solar panel installation",
      url: "https://solarsavingscalculator.site/",
      icon: Sun,
    },
    {
      title: "WordPress AI Fixer Buddy",
      description: "Instantly fix WordPress errors with AI-powered solutions",
      url: "https://www.wordpressaifixerbuddy.online/",
      icon: Terminal,
    },
    {
      title: "Gold Loan Calculator India",
      description: "Instantly calculate your eligible gold loan amount and EMI based on current market rates.",
      url: "https://goldloantool.online/",
      icon: Coins,
    }
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Our Tools - Socilet</title>
        <meta name="description" content="Explore our collection of free tools for developers, businesses, and individuals. Format code, generate legal documents, build WordPress plugins, and more." />
      </Helmet>
      <Header />
      <main>
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-primary-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Tools
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Explore our collection of free and useful tools designed to help you with various tasks. 
                From code formatting to document generation, we've got you covered.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool, index) => (
                <ToolCard
                  key={index}
                  title={tool.title}
                  description={tool.description}
                  url={tool.url}
                  icon={tool.icon}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
