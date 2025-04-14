
import React, { useState, useEffect } from 'react';
import { WhatsappIcon, Mail, Phone, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

const SupportBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const phoneNumber = "919301499921"; // Phone number without the + sign
  const email = "hello@socilet.com";

  useEffect(() => {
    // Show support bar after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
    toast.success("Opening WhatsApp");
  };

  const handleEmailClick = () => {
    window.open(`mailto:${email}`, '_blank');
    toast.success("Opening email client");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactDialogOpen(false);
    toast.success("Message sent successfully! We'll get back to you soon.", {
      description: "Thank you for reaching out to Socilet.",
    });
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Expanded Support Options */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="flex flex-col items-end space-y-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <motion.div
                    className="flex items-center bg-white rounded-full shadow-lg py-2 px-4 cursor-pointer"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWhatsAppClick}
                  >
                    <WhatsappIcon className="h-5 w-5 mr-2 text-green-500" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center bg-white rounded-full shadow-lg py-2 px-4 cursor-pointer"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEmailClick}
                  >
                    <Mail className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">Email</span>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center bg-white rounded-full shadow-lg py-2 px-4 cursor-pointer"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    <Phone className="h-5 w-5 mr-2 text-purple-500" />
                    <span className="text-sm font-medium">Contact Now</span>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center bg-white rounded-full shadow-lg py-2 px-4 cursor-pointer"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = "#contact"}
                  >
                    <MessageCircle className="h-5 w-5 mr-2 text-orange-500" />
                    <span className="text-sm font-medium">Chat Now</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Main Button */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`rounded-full p-0 w-14 h-14 shadow-lg flex items-center justify-center ${
                  isExpanded ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-br from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
                }`}
                id="support-button"
              >
                {isExpanded ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <MessageCircle className="w-6 h-6 text-white" />
                )}
                <span className="sr-only">Support Options</span>
              </Button>
              
              {!isExpanded && (
                <motion.div 
                  className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 2,
                    duration: 1
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-800">Contact Us</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Your Name</label>
              <Input id="name" placeholder="Enter your name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input id="email" type="email" placeholder="Enter your email" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input id="phone" placeholder="Enter your phone number" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Your Message</label>
              <Textarea id="message" placeholder="Tell us about your project" rows={4} required />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-primary-600 to-primary-700">
                Send Message
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportBar;
