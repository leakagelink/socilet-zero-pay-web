
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
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

  return (
    <section id="home" className="pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-br from-primary-50 via-white to-secondary/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-primary-100 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-secondary/20 rounded-full filter blur-3xl opacity-30"></div>
      
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
              className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full border border-primary-200 shadow-sm"
            >
              <Clock size={16} className="animate-pulse" />
              <span className="text-sm font-medium">India's First Zero Advance Payment Model</span>
            </motion.div>
            
            <motion.h1 
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-gradient bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500">Zero Advance Payment</span> 
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
              <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-6 text-lg group transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-6 text-lg transition-all duration-300 transform hover:scale-105">
                View Portfolio
              </Button>
            </motion.div>
            
            <motion.div 
              variants={item}
              className="flex items-center space-x-4 pt-4"
            >
              <div className="flex -space-x-3">
                {['JD', 'RK', 'AM', 'SP'].map((initial, idx) => (
                  <div 
                    key={initial} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm border-2 border-white shadow-md transition-transform hover:translate-y-[-5px] ${
                      idx % 2 === 0 ? 'bg-primary-600' : 'bg-secondary'
                    }`}
                    style={{
                      transition: 'transform 0.3s ease',
                      transitionDelay: `${idx * 0.1}s`
                    }}
                  >
                    {initial}
                  </div>
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
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary rounded-full opacity-10"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-300 rounded-full opacity-10"></div>
            
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
            >
              <div className="overflow-hidden rounded-lg mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400" 
                  alt="Web Development" 
                  className="w-full h-auto hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <motion.div 
                  className="bg-primary-50 p-4 rounded-lg text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <h3 className="font-bold text-2xl text-primary-800">900+</h3>
                  <p className="text-sm text-gray-600">Completed Projects</p>
                </motion.div>
                <motion.div 
                  className="bg-primary-50 p-4 rounded-lg text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <h3 className="font-bold text-2xl text-primary-800">100%</h3>
                  <p className="text-sm text-gray-600">Client Satisfaction</p>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-primary-600 mr-2" />
                  <div className="font-medium text-primary-800">Work First, Pay Later</div>
                </div>
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">UNIQUE</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
