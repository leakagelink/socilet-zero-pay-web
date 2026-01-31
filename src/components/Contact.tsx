
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const subject = formData.service 
        ? `Inquiry: ${formData.service}` 
        : 'New Contact Form Submission';

      const { error } = await supabase
        .from('contact_messages')
        .insert({
          sender_name: formData.name,
          sender_email: formData.email,
          sender_phone: formData.phone || null,
          subject: subject,
          message: formData.message
        });

      if (error) throw error;

      toast.success("Message sent successfully! We'll get back to you soon.", {
        description: "Thank you for reaching out to Socilet.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    <section id="contact" className="section-padding bg-gradient-to-b from-muted/50 to-background relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-30"></div>
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
            <h2 className="text-4xl font-bold mb-6 text-foreground">Get In Touch</h2>
            <div className="w-20 h-1 bg-primary mb-6 rounded-full"></div>
            <p className="text-muted-foreground mb-8">
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
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center mr-4 mt-1 shadow-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Our Location</h3>
                  <p className="text-muted-foreground">Ayodhya Nagar, K-Sector, Bhopal, Madhya Pradesh</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start" 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center mr-4 mt-1 shadow-sm">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Call Us</h3>
                  <p className="text-muted-foreground">+91 93014 99921</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start" 
                variants={fadeInUp}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center mr-4 mt-1 shadow-sm">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Email Us</h3>
                  <p className="text-muted-foreground">hello@socilet.in</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-gradient-to-br from-card to-primary/5 rounded-xl shadow-sm border border-border"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(var(--primary), 0.2)" }}
            >
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-bold text-foreground">Our Zero Advance Policy</h3>
              </div>
              <p className="text-muted-foreground">
                We believe in delivering quality work before asking for payment. No advance payments, 
                no hidden charges - pay only when you're completely satisfied with our work.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="bg-card p-8 rounded-xl shadow-lg border border-border"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">Send Us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                  custom={1}
                >
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Your Name *</label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                  custom={2}
                >
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </motion.div>
              </div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeInUp}
                custom={3}
              >
                <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                <Input 
                  id="phone" 
                  placeholder="Enter your phone number" 
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="border-border focus:border-primary focus:ring-primary"
                />
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeInUp}
                custom={4}
              >
                <label htmlFor="service" className="text-sm font-medium text-foreground">Service Interested In</label>
                <select 
                  id="service" 
                  value={formData.service}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-border bg-background p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                >
                  <option value="">Select a Service</option>
                  <option value="Website Development">Website Development</option>
                  <option value="App Development">App Development</option>
                  <option value="AI Spokesperson">AI Spokesperson</option>
                  <option value="Business Profile Listing">Business Profile Listing</option>
                </select>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeInUp}
                custom={5}
              >
                <label htmlFor="message" className="text-sm font-medium text-foreground">Your Message *</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your project" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="border-border focus:border-primary focus:ring-primary"
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
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
