
import React, { useState } from 'react';
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'websites', label: 'Websites' },
    { id: 'apps', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Spokespersons' },
    { id: 'business', label: 'Business Listings' },
  ];

  // Mock portfolio items
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
    {
      id: 7,
      title: 'Bharat Startup Solution',
      category: 'websites',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400',
      description: 'MSMEs & Startups solution funding website built with React. Completed on March 30, 2025.',
      url: 'https://bharatstartupsolution.com/'
    },
  ];

  // Filter portfolio items based on the active filter
  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section id="portfolio" className="section-padding bg-gradient-to-b from-gray-50 to-white relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-2">Our Portfolio</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Explore our successful projects delivered with our unique zero advance payment model.
            We've completed over 900 projects across various industries.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center mb-12 gap-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filters.map(filter => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              variant={activeFilter === filter.id ? "default" : "outline"}
              className={`px-4 py-2 rounded-full transition-all ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {filteredItems.map((portfolioItem) => (
            <motion.div 
              key={portfolioItem.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500"
              variants={item}
              whileHover={{ y: -10 }}
            >
              <div className="overflow-hidden h-48 relative">
                <img 
                  src={portfolioItem.image} 
                  alt={portfolioItem.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                  <span className="text-white font-medium text-sm bg-primary-600 px-3 py-1 rounded-full">
                    {filters.find(f => f.id === portfolioItem.category)?.label || portfolioItem.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">{portfolioItem.title}</h3>
                <p className="text-gray-600 mb-4">{portfolioItem.description}</p>
                {portfolioItem.url ? (
                  <a 
                    href={portfolioItem.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium group/link"
                  >
                    <span>Visit Website</span> 
                    <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                ) : (
                  <a 
                    href="#" 
                    className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium group/link"
                  >
                    <span>View Project</span> 
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            className="bg-primary-600 hover:bg-primary-700 group"
            size="lg"
          >
            <span>View All Projects</span>
            <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
