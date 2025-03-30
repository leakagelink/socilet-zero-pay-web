
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Have a project in mind? Contact us to discuss how our unique zero advance 
              payment model can work for your project.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Our Location</h3>
                  <p className="text-gray-600">Ayodhya Nagar, K-Sector, Bhopal, Madhya Pradesh</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Call Us</h3>
                  <p className="text-gray-600">+91 93014 99921</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Us</h3>
                  <p className="text-gray-600">hello@socilet.com</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Our Zero Advance Policy</h3>
              <p className="text-gray-600">
                We believe in delivering quality work before asking for payment. No advance payments, 
                no hidden charges - pay only when you're completely satisfied with our work.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Your Name</label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-gray-700">Service Interested In</label>
                <select id="service" className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent">
                  <option value="">Select a Service</option>
                  <option value="website">Website Development</option>
                  <option value="app">App Development</option>
                  <option value="ai">AI Spokesperson</option>
                  <option value="business">Business Profile Listing</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Your Message</label>
                <Textarea id="message" placeholder="Tell us about your project" rows={4} />
              </div>
              
              <Button className="w-full bg-primary-600 hover:bg-primary-700">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
