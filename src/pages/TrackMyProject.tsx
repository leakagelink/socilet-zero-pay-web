
import React from 'react';
import { motion } from "framer-motion";
import { Wrench, Clock, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

const TrackMyProject = () => {
  const navigate = useNavigate();

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
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center">
                    <Wrench className="w-12 h-12 text-primary-600" />
                  </div>
                  <motion.div 
                    className="absolute -top-2 -right-2 bg-primary-600 rounded-full p-2"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <CalendarClock className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Under Maintenance</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
              
              <p className="text-gray-600 mb-8 text-lg">
                We're currently upgrading our project tracking system to provide you with an even better experience. 
                Please check back soon!
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Button 
                  onClick={() => navigate('/')}
                  variant="default"
                  className="bg-primary-600 hover:bg-primary-700"
                  size="lg"
                >
                  Return to Homepage
                </Button>
                <Button 
                  onClick={() => navigate('/contact')}
                  variant="outline"
                  size="lg"
                >
                  Contact Support
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-primary-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Estimated completion: Soon</span>
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

export default TrackMyProject;
