
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { BlogPost } from '@/components/BlogPreview';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, BookOpen, Search, CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";

// Import blog post content files
import ZeroAdvancePayment from '../components/blog/ZeroAdvancePayment';
import AppDevelopmentGuide from '../components/blog/AppDevelopmentGuide';
import PayAfterDelivery from '../components/blog/PayAfterDelivery';
import WebsiteDevelopmentSEO from '../components/blog/WebsiteDevelopmentSEO';
import ZeroAdvancePaymentGuide from '../components/blog/ZeroAdvancePaymentGuide';
import HireIndianDeveloperGuide from '../components/blog/HireIndianDeveloperGuide';
import AISpokespersonGuide from '../components/blog/AISpokespersonGuide';
import AppPaymentModelsGuide from '../components/blog/AppPaymentModelsGuide';
import WebsiteCostGuide from '../components/blog/WebsiteCostGuide';

const blogPosts: BlogPost[] = [
  // NEW SEO ARTICLES (2026)
  {
    id: 10,
    title: "Zero Advance Payment Website Development: Complete Guide 2026",
    excerpt: "Get your website developed with zero advance payment. Pay only after delivery. Learn how this revolutionary model protects you from scams.",
    slug: "zero-advance-payment-guide-2026",
    date: "January 25, 2026",
    category: "Business Model",
    imageUrl: "https://images.unsplash.com/photo-1553484771-047a44eee27a",
    readTime: "12 min read"
  },
  {
    id: 11,
    title: "Hire Indian Developer No Upfront Payment: US & Canada Guide 2026",
    excerpt: "Save 70% on development costs by hiring Indian developers with zero advance payment. Complete guide for US & Canada businesses.",
    slug: "hire-indian-developer-guide-2026",
    date: "January 24, 2026",
    category: "Outsourcing",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    readTime: "14 min read"
  },
  {
    id: 12,
    title: "AI Spokesperson Video Service: Transform Your Marketing 2026",
    excerpt: "Create professional AI spokesperson videos at 10x lower cost than traditional video production. Fast 48-hour delivery.",
    slug: "ai-spokesperson-guide-2026",
    date: "January 23, 2026",
    category: "AI Technology",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a",
    readTime: "11 min read"
  },
  {
    id: 13,
    title: "App Development Payment Models: Find the Safest Option 2026",
    excerpt: "Compare Fixed, Hourly, Milestone, and Zero Advance payment models. Learn which option protects you best.",
    slug: "app-payment-models-guide-2026",
    date: "January 22, 2026",
    category: "App Development",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    readTime: "13 min read"
  },
  {
    id: 14,
    title: "Small Business Website Cost 2026: Complete Pricing Breakdown",
    excerpt: "How much does a website really cost? Compare DIY, freelancer, agency, and zero advance options from $0 to $25,000+.",
    slug: "website-cost-guide-2026",
    date: "January 21, 2026",
    category: "Pricing Guide",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    readTime: "15 min read"
  },
  // ORIGINAL ARTICLES
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
  },
  {
    id: 4,
    title: "SEO Best Practices for Website Development in 2024",
    excerpt: "Learn how to optimize your website for search engines from the ground up, ensuring maximum visibility and traffic.",
    slug: "website-development-seo-best-practices",
    date: "September 28, 2024",
    category: "SEO & Web Development",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    readTime: "7 min read"
  }
];

const categories = [
  "All Categories",
  "Business Model", 
  "App Development", 
  "Business Trends", 
  "SEO & Web Development",
  "Outsourcing",
  "AI Technology",
  "Pricing Guide"
];

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo(0, 0);
  };

  const renderPostContent = () => {
    if (!selectedPost) return null;

    switch(selectedPost.slug) {
      case 'zero-advance-payment-benefits':
        return <ZeroAdvancePayment post={selectedPost} onBack={() => setSelectedPost(null)} />;
      case 'complete-guide-app-development-2024':
        return <AppDevelopmentGuide post={selectedPost} onBack={() => setSelectedPost(null)} />;
      case 'pay-after-delivery-transforming-software-development':
        return <PayAfterDelivery post={selectedPost} onBack={() => setSelectedPost(null)} />;
      case 'website-development-seo-best-practices':
        return <WebsiteDevelopmentSEO post={selectedPost} onBack={() => setSelectedPost(null)} />;
      // NEW SEO ARTICLES 2026
      case 'zero-advance-payment-guide-2026':
        return <ZeroAdvancePaymentGuide post={selectedPost} onBack={() => setSelectedPost(null)} />;
      case 'hire-indian-developer-guide-2026':
        return <HireIndianDeveloperGuide post={selectedPost} onBack={() => setSelectedPost(null)} />;
      case 'ai-spokesperson-guide-2026':
        return <AISpokespersonGuide post={selectedPost} onBack={() => setSelectedPost(null)} />;
      case 'app-payment-models-guide-2026':
        return <AppPaymentModelsGuide post={selectedPost} onBack={() => setSelectedPost(null)} />;
      case 'website-cost-guide-2026':
        return <WebsiteCostGuide post={selectedPost} onBack={() => setSelectedPost(null)} />;
      default:
        return <div>Post content not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {selectedPost ? (
          renderPostContent()
        ) : (
          <>
            <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
              <div className="container mx-auto max-w-6xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-12"
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Insights, guides and industry knowledge to help you navigate the digital landscape and succeed with your projects.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 mb-12"
                >
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-6 h-auto border-gray-200"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-md border border-gray-200 py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>
            </section>

            <section className="py-12 px-4">
              <div className="container mx-auto max-w-6xl">
                {filteredPosts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer" onClick={() => handlePostClick(post)}>
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
                            <Button variant="ghost" className="text-primary-600 p-0 hover:bg-transparent hover:text-primary-800">
                              Read More <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-600">No articles match your search</h3>
                    <p className="mt-2 text-gray-500">Try adjusting your search or category filter</p>
                    <Button 
                      onClick={() => {setSearchTerm(''); setSelectedCategory('All Categories');}}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
