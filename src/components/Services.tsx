
import React, { useState } from 'react';
import { Code, Smartphone, Video, Globe, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const services = [
    {
      icon: <Code className="w-12 h-12 text-primary-600" />,
      title: 'Website Development',
      description: 'Custom website development with responsive design and modern UI/UX practices.',
      features: ['Custom Design', 'Responsive Layout', 'SEO Optimized', 'Fast Loading']
    },
    {
      icon: <Smartphone className="w-12 h-12 text-primary-600" />,
      title: 'App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      features: ['Native & Cross-platform', 'User-friendly UI', 'Performance Optimized', 'Ongoing Support']
    },
    {
      icon: <Video className="w-12 h-12 text-primary-600" />,
      title: 'AI Spokesperson',
      description: 'Create virtual presenters and spokespersons powered by AI for your marketing needs.',
      features: ['Customizable Avatar', 'Natural Speech', 'Multiple Languages', 'Easy Integration']
    },
    {
      icon: <Globe className="w-12 h-12 text-primary-600" />,
      title: 'Business Profile Listing',
      description: 'Get your business listed across major platforms to increase visibility and reach.',
      features: ['Google My Business', 'Local Directories', 'Social Platforms', 'Industry Specific']
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="section-padding bg-gradient-to-b from-white to-gray-50 relative">
      {/* Background decorative elements with 3D-like animation */}
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 bg-primary-100 rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          transition: { duration: 8, repeat: Infinity }
        }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 0.9, 1],
          transition: { duration: 7, repeat: Infinity }
        }}
      ></motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-2">Our Services</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            We offer a range of digital services with our unique zero advance payment model. 
            Pay only after your project is successfully delivered.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index}
              variants={item}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-500 relative"
              whileHover={{ 
                y: -15,
                boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-primary-600/10 to-primary-600/20 opacity-0 transition-opacity duration-500 z-0" 
                style={{ opacity: hoveredIndex === index ? 1 : 0 }}
              ></div>
              
              <div className="p-6 relative z-10">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    variant="ghost" 
                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-0 flex items-center font-medium group"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </div>
              
              {/* Gradient border effect on hover */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700" 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformOrigin: "left" }}
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 p-8 bg-gradient-to-r from-primary-50 to-white rounded-xl border border-primary-100 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0px 25px 50px -12px rgba(30, 64, 175, 0.25)" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2 text-primary-800">Zero Advance Payment Model</h3>
              <p className="text-gray-600 max-w-xl">
                We believe in our work quality. That's why we only charge after project completion and your satisfaction.
              </p>
            </div>
            <motion.div 
              className="bg-white p-5 rounded-xl shadow-xl border border-primary-100 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="absolute -top-3 -right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                animate={{
                  scale: [1, 1.2, 1],
                  transition: { duration: 2, repeat: Infinity }
                }}
              >
                !
              </motion.div>
              <p className="text-lg font-bold text-primary-800 flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                No advance payment required!
              </p>
              <p className="text-sm text-gray-500">
                No hidden charges, pay only when satisfied.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
