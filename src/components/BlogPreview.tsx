
import React from 'react';
import { motion } from "framer-motion";
import { CalendarIcon, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

const BlogPreview: React.FC = () => {
  const navigate = useNavigate();
  
  const featuredPosts: BlogPost[] = [
    {
      id: 1,
      title: "Zero Advance Payment: How Our Business Model Benefits Clients",
      excerpt: "Discover how our unique zero advance payment model reduces risk and ensures quality deliverables for all your digital projects.",
      slug: "zero-advance-payment-benefits",
      date: "October 15, 2024",
      category: "Business Model",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Complete Guide to Modern App Development in 2024",
      excerpt: "Learn about the latest technologies, methodologies and best practices for creating successful mobile applications.",
      slug: "complete-guide-app-development-2024",
      date: "October 10, 2024",
      category: "App Development",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Why Pay After Delivery Models Are Transforming Software Development",
      excerpt: "Explore how the work first, pay later approach is changing client relationships and improving project outcomes.",
      slug: "pay-after-delivery-transforming-software-development",
      date: "October 5, 2024",
      category: "Business Trends",
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      readTime: "6 min read"
    }
  ];

  const handleViewBlog = () => {
    navigate('/blog');
  };

  return (
    <section id="blog" className="section-padding bg-gray-50 relative">
      <motion.div 
        className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full filter blur-3xl opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          transition: { duration: 8, repeat: Infinity }
        }}
      ></motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">Our Blog</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Insights, guides, and industry knowledge to help you navigate the digital landscape.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featuredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="pt-6 flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                  <Button variant="ghost" className="text-primary-600 p-0 hover:bg-transparent hover:text-primary-800" onClick={handleViewBlog}>
                    Read More <ArrowRight size={16} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleViewBlog}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-6 h-auto"
          >
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
