
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'sonner';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.", {
      description: "Thank you for reaching out to Socilet.",
      duration: 5000,
    });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };
  
  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-gray-50 to-white relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-10 w-72 h-72 bg-primary-50 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="grid md:grid-cols-2 gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold mb-6 text-primary-800">Get In Touch</h2>
            <div className="w-20 h-1 bg-primary-600 mb-6 rounded-full"></div>
            <p className="text-gray-600 mb-8">
              Have a project in mind? Contact us to discuss how our unique zero advance 
              payment model can work for your project.
            </p>
            
            <motion.div 
              className="space-y-6 mb-8"
              variants={stagger}
            >
              <motion.div 
                className="flex items-start" 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-4 mt-1 shadow-sm">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-800">Our Location</h3>
                  <p className="text-gray-600">Ayodhya Nagar, K-Sector, Bhopal, Madhya Pradesh</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start" 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-4 mt-1 shadow-sm">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-800">Call Us</h3>
                  <p className="text-gray-600">+91 93014 99921</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start" 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-4 mt-1 shadow-sm">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-800">Email Us</h3>
                  <p className="text-gray-600">hello@socilet.com</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-gradient-to-br from-white to-primary-50 rounded-xl shadow-sm border border-primary-100"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
            >
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                <h3 className="text-xl font-bold text-primary-800">Our Zero Advance Policy</h3>
              </div>
              <p className="text-gray-600">
                We believe in delivering quality work before asking for payment. No advance payments, 
                no hidden charges - pay only when you're completely satisfied with our work.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold mb-6 text-primary-800">Send Us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                  custom={1}
                >
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Your Name</label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                  custom={2}
                >
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                </motion.div>
              </div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeInUp}
                custom={3}
              >
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input 
                  id="phone" 
                  placeholder="Enter your phone number" 
                  className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeInUp}
                custom={4}
              >
                <label htmlFor="service" className="text-sm font-medium text-gray-700">Service Interested In</label>
                <select 
                  id="service" 
                  className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                >
                  <option value="">Select a Service</option>
                  <option value="website">Website Development</option>
                  <option value="app">App Development</option>
                  <option value="ai">AI Spokesperson</option>
                  <option value="business">Business Profile Listing</option>
                </select>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeInUp}
                custom={5}
              >
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Your Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your project" 
                  rows={4} 
                  className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
