
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-primary-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full">
              <Clock size={16} />
              <span className="text-sm font-medium">Work First, Pay Later</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gradient">Zero Advance Payment</span> 
              <br />Web Development
            </h1>
            
            <p className="text-lg text-gray-600 md:pr-10">
              India's first company to offer website development, app development, AI spokesperson, 
              and business listings with zero advance payment. Pay only after your project is complete.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-6 text-lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-6 text-lg">
                View Portfolio
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary-300 flex items-center justify-center text-white text-sm">JD</div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white text-sm">RK</div>
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white text-sm">AM</div>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">900+ Projects</span> completed successfully
              </p>
            </div>
          </div>
          
          <div className="relative animate-fade-right">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary rounded-full opacity-10"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary-300 rounded-full opacity-10"></div>
            <div className="relative bg-white p-6 rounded-xl shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400" 
                alt="Web Development" 
                className="rounded-lg w-full h-auto mb-6"
              />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <h3 className="font-bold text-2xl text-primary-800">900+</h3>
                  <p className="text-sm text-gray-600">Completed Projects</p>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <h3 className="font-bold text-2xl text-primary-800">100%</h3>
                  <p className="text-sm text-gray-600">Client Satisfaction</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-primary-100 p-3 rounded-lg">
                <div className="font-medium text-primary-800">Work First, Pay Later</div>
                <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs">UNIQUE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
