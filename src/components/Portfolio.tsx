
import React, { useState } from 'react';
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'websites', label: 'Websites' },
    { id: 'apps', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Spokespersons' },
    { id: 'business', label: 'Business Listings' },
  ];

  // Mock portfolio items - in a real scenario, these would come from your backend
  const portfolioItems = [
    {
      id: 1,
      title: 'E-commerce Website',
      category: 'websites',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400',
      description: 'A full-featured e-commerce platform with payment integration and inventory management.'
    },
    {
      id: 2,
      title: 'Restaurant App',
      category: 'apps',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&h=400',
      description: 'Mobile application for a restaurant chain with online ordering and table reservation.'
    },
    {
      id: 3,
      title: 'Corporate AI Presenter',
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&h=400',
      description: 'Custom AI spokesperson for corporate presentations and marketing videos.'
    },
    {
      id: 4,
      title: 'Local Business Directory',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
      description: 'Comprehensive business listings across multiple platforms for local businesses.'
    },
    {
      id: 5,
      title: 'Educational Platform',
      category: 'websites',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&h=400',
      description: 'Online learning platform with course management and virtual classrooms.'
    },
    {
      id: 6,
      title: 'Fitness Tracking App',
      category: 'apps',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400',
      description: 'Mobile app for tracking workouts, nutrition, and fitness goals.'
    },
  ];

  // Filter portfolio items based on the active filter
  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
          <p className="text-gray-600">
            Explore our successful projects delivered with our unique zero advance payment model.
            We've completed over 900 projects across various industries.
          </p>
        </div>

        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="overflow-hidden h-48">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <a href="#" className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium">
                  View Project <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-primary-600 hover:bg-primary-700">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
