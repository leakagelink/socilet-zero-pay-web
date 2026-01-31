import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { CalendarIcon, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { blogPosts, BlogPostData } from '@/data/blogData';

// Re-export for backward compatibility
export type BlogPost = BlogPostData;

const BlogPreview: React.FC = () => {
  // Get first 3 posts for preview
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="section-padding bg-muted/30 relative">
      <motion.div 
        className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl opacity-30"
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
            <div className="bg-primary/10 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">Our Blog</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground">
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
              <Link to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="pt-6 flex-grow">
                    <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center">
                        <CalendarIcon size={14} className="mr-1" />
                        <time dateTime={post.dateISO}>{post.date}</time>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    <Button variant="ghost" className="text-primary p-0 hover:bg-transparent hover:text-primary/80">
                      Read More <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link to="/blog">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 h-auto">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
