
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">socilet</h3>
            <p className="text-gray-400 mb-4">Brand Your Dream</p>
            <p className="text-gray-400 mb-6">
              India's first zero advance payment digital services company. 
              We believe in delivering quality before asking for payment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><Link to="/website-development" className="text-gray-400 hover:text-white transition-colors">Website Development</Link></li>
              <li><Link to="/app-development" className="text-gray-400 hover:text-white transition-colors">App Development</Link></li>
              <li><Link to="/ai-spokesperson" className="text-gray-400 hover:text-white transition-colors">AI Spokesperson</Link></li>
              <li><Link to="/business-profile" className="text-gray-400 hover:text-white transition-colors">Business Profile Listing</Link></li>
              <li><Link to="/zero-advance-payment" className="text-gray-400 hover:text-white transition-colors">Digital Marketing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link to="/#contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">Subscribe to receive updates about our services and offers.</p>
            <div className="flex space-x-2 mb-4">
              <Input placeholder="Your Email" className="bg-gray-800 border-gray-700" />
              <Button className="bg-primary-600 hover:bg-primary-700 px-3">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-gray-400 text-sm">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Socilet. All rights reserved.
            </p>
            <div className="text-gray-400 text-sm">
              <Link to="/terms-of-service" className="hover:text-white mr-4">Terms of Service</Link>
              <Link to="/privacy-policy" className="hover:text-white mr-4">Privacy Policy</Link>
              <Link to="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
