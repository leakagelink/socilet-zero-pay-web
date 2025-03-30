
import React from 'react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Calendar, Star, Briefcase, GraduationCap } from "lucide-react";

const Founder = () => {
  return (
    <section id="founder" className="section-padding bg-gradient-to-r from-white to-primary-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-50 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary-50 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-2">Meet Our Founder</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Learn about the visionary behind Socilet's unique zero advance payment model
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-full w-80 h-80 absolute top-0 left-0 -z-10 opacity-10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl mb-8">
                {/* Replace with actual founder image */}
                <img 
                  src="https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?auto=format&fit=crop&q=80" 
                  alt="Dheeraj Tagde - Founder of Socilet" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              
              <motion.div 
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-6 py-2 rounded-full shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p className="font-bold">Dheeraj Tagde</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute -right-10 top-10 bg-white p-3 rounded-full shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Trophy className="w-8 h-8 text-yellow-500" />
            </motion.div>
            
            <motion.div 
              className="absolute -left-5 bottom-20 bg-white p-3 rounded-full shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Award className="w-8 h-8 text-primary-600" />
            </motion.div>
            
            <motion.div 
              className="absolute right-10 bottom-0 bg-white p-3 rounded-full shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Star className="w-8 h-8 text-yellow-500" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary-600 text-white px-3 py-1 text-sm">Founder & CEO</Badge>
              <Badge className="bg-secondary text-black px-3 py-1 text-sm">WordPress Expert</Badge>
              <Badge className="bg-green-600 text-white px-3 py-1 text-sm">AI Specialist</Badge>
            </div>
            
            <h3 className="text-3xl font-bold text-primary-800">Dheeraj Tagde</h3>
            <p className="text-lg text-gray-700">Digital Business Developer & Visionary</p>
            
            <p className="text-gray-600">
              Dheeraj Tagde founded Socilet in 2022 with a revolutionary vision to transform how digital services are delivered. 
              With over 7 years of experience in WordPress development and artificial intelligence, 
              Dheeraj pioneered the "Zero Advance Payment" business model that has disrupted the industry.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <motion.div 
                className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="bg-primary-100 p-2 rounded-full">
                  <Calendar className="w-5 h-5 text-primary-800" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-800">Founded in 2022</h4>
                  <p className="text-sm text-gray-600">Established Socilet with zero advance model</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="bg-primary-100 p-2 rounded-full">
                  <Briefcase className="w-5 h-5 text-primary-800" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-800">7+ Years Experience</h4>
                  <p className="text-sm text-gray-600">WordPress & AI development expertise</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="bg-primary-100 p-2 rounded-full">
                  <Star className="w-5 h-5 text-primary-800" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-800">900+ Projects</h4>
                  <p className="text-sm text-gray-600">Successfully delivered client work</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="bg-primary-100 p-2 rounded-full">
                  <GraduationCap className="w-5 h-5 text-primary-800" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-800">Digital Business Developer</h4>
                  <p className="text-sm text-gray-600">Expert in business transformation</p>
                </div>
              </motion.div>
            </div>
            
            <p className="text-primary-800 font-medium border-l-4 border-primary-600 pl-4 bg-primary-50 p-3 italic rounded-r-lg">
              "Our mission is to provide high-quality digital services with absolute transparency and client satisfaction. 
              We believe in our work so much that we don't ask for payment until it's complete."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
