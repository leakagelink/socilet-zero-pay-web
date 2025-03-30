
import React from 'react';
import { motion } from "framer-motion";
import { Rocket, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

const Affiliate = () => {
  const navigate = useNavigate();
  
  // Calculate launch date (example: 30 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);
  const formattedDate = launchDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 relative overflow-hidden">
              <motion.div 
                className="absolute -top-16 -right-16 w-32 h-32 bg-primary-50 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-50 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              />
              
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center">
                    <Rocket className="w-12 h-12 text-primary-600" />
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Coming Soon</h1>
                <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
                
                <p className="text-gray-600 mb-8 text-lg">
                  Our Affiliate Program is launching soon! Join our network of partners and earn rewards 
                  by promoting our zero advance payment services.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-center gap-2 text-primary-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Expected Launch: {formattedDate}</span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <Button 
                    onClick={() => navigate('/contact')}
                    className="bg-primary-600 hover:bg-primary-700"
                    size="lg"
                  >
                    Get Notified
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    size="lg"
                  >
                    Return to Homepage
                  </Button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>Want early access? Contact our team!</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Affiliate;
