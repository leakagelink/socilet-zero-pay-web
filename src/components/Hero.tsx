
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle, ChevronDown } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

const Hero = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ 
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  // Animation variants for staggered children
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

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: ['-5%', '5%'],
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  const scrollToNextSection = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-br from-primary-50 via-white to-secondary/10 relative overflow-hidden">
      {/* 3D-like background elements */}
      <motion.div 
        className="absolute top-20 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-30"
        animate={floatingAnimation}
      ></motion.div>
      <motion.div 
        className="absolute bottom-0 left-10 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl opacity-30"
        animate={{
          y: ['7%', '-7%'],
          transition: {
            y: {
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }
          }
        }}
      ></motion.div>
      <motion.div 
        className="absolute top-40 left-20 w-60 h-60 bg-blue-100 rounded-full filter blur-3xl opacity-20"
        animate={{
          y: ['-10%', '10%'],
          transition: {
            y: {
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }
          }
        }}
      ></motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div 
            className="space-y-7"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.div 
              variants={item}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 px-4 py-2 rounded-full border border-primary-200 shadow-sm"
            >
              <Clock size={16} className="animate-pulse" />
              <span className="text-sm font-medium">India's First Zero Advance Payment Model</span>
            </motion.div>
            
            <motion.h1 
              variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500">Zero Advance Payment</span> 
              <br />Digital Services
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-lg text-gray-600 md:pr-10"
            >
              India's first company to offer website development, app development, 
              AI spokesperson, and business listings with zero advance payment. 
              Pay only after your project is complete.
            </motion.p>
            
            <motion.div 
              variants={item}
              className="flex flex-wrap gap-4"
            >
              <Button 
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-7 text-lg group transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                style={{
                  boxShadow: '0 10px 15px -3px rgba(30, 64, 175, 0.2)'
                }}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-7 text-lg transition-all duration-300 transform hover:scale-105"
              >
                View Portfolio
              </Button>
            </motion.div>
            
            <motion.div 
              variants={item}
              className="flex items-center space-x-4 pt-4"
            >
              <div className="flex -space-x-3">
                {['JD', 'RK', 'AM', 'SP'].map((initial, idx) => (
                  <motion.div 
                    key={initial} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm border-2 border-white shadow-md ${
                      idx % 2 === 0 ? 'bg-primary-600' : 'bg-secondary'
                    }`}
                    whileHover={{ y: -5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {initial}
                  </motion.div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-primary-800 block">900+ Projects</span>
                <span className="text-gray-600">Delivered successfully</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <motion.div 
              className="absolute -top-10 -left-10 w-40 h-40 bg-secondary rounded-full opacity-10"
              animate={{
                scale: [1, 1.1, 1],
                transition: { duration: 8, repeat: Infinity }
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-300 rounded-full opacity-10"
              animate={{
                scale: [1, 0.9, 1],
                transition: { duration: 7, repeat: Infinity }
              }}
            ></motion.div>
            
            <motion.div 
              className="relative bg-white p-6 rounded-xl shadow-xl border border-gray-100"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.8
              }}
              whileHover={{ 
                y: -10,
                boxShadow: "0px 20px 40px rgba(30, 64, 175, 0.2)",
                transition: { duration: 0.3 }
              }}
            >
              <div className="overflow-hidden rounded-lg mb-6">
                <motion.img 
                  src="/lovable-uploads/1b9d66b2-fe2e-4972-a39c-cbbc782ba6e2.png" 
                  alt="Socilet Zero Advance Payment - No upfront cost web and app development services in India"
                  title="Zero Advance Payment Digital Services - Work First, Pay Later"
                  loading="eager"
                  className="w-full h-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <motion.div 
                  className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <h3 className="font-bold text-2xl text-primary-800">900+</h3>
                  <p className="text-sm text-gray-600">Completed Projects</p>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <h3 className="font-bold text-2xl text-primary-800">100%</h3>
                  <p className="text-sm text-gray-600">Client Satisfaction</p>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-primary-600 mr-2" />
                  <div className="font-medium text-primary-800">Work First, Pay Later</div>
                </div>
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">UNIQUE</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <motion.div
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNextSection}
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Scroll Down</span>
            <ChevronDown className="w-5 h-5 text-primary-600" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
