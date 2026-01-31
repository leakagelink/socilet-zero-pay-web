import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from "framer-motion";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, BookOpen, Search, CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { blogPosts, categories } from '@/data/blogData';

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Blog listing page structured data
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Socilet Blog",
    "description": "Insights, guides and industry knowledge about web development, app development, and zero advance payment services.",
    "url": "https://socilet.in/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Socilet",
      "logo": {
        "@type": "ImageObject",
        "url": "https://socilet.in/lovable-uploads/082da739-5b35-4399-be06-1bbc60823d09.png"
      }
    },
    "blogPost": blogPosts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://socilet.in/blog/${post.slug}`,
      "image": post.imageUrl,
      "datePublished": post.dateISO || post.date
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://socilet.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://socilet.in/blog"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Blog | Socilet - Web & App Development Insights</title>
        <meta name="title" content="Blog | Socilet - Web & App Development Insights" />
        <meta name="description" content="Expert insights on web development, app development, zero advance payment models, and digital marketing. Learn from industry professionals." />
        <link rel="canonical" href="https://socilet.in/blog" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://socilet.in/blog" />
        <meta property="og:title" content="Blog | Socilet - Web & App Development Insights" />
        <meta property="og:description" content="Expert insights on web development, app development, zero advance payment models, and digital marketing." />
        <meta property="og:image" content="https://socilet.in/lovable-uploads/082da739-5b35-4399-be06-1bbc60823d09.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://socilet.in/blog" />
        <meta name="twitter:title" content="Blog | Socilet" />
        <meta name="twitter:description" content="Expert insights on web development, app development, and zero advance payment models." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="web development blog, app development tips, zero advance payment, digital marketing insights, software development" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(blogListSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Header />
      <main className="flex-grow">
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
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 h-auto border-border"
                  aria-label="Search blog articles"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-border py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label="Filter by category"
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
                    <Link to={`/blog/${post.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer group">
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
                          <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h2>
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">No articles match your search</h3>
                <p className="mt-2 text-muted-foreground">Try adjusting your search or category filter</p>
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
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
