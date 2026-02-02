import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from "framer-motion";
import { ArrowLeft, Share2, CalendarIcon, Clock, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts, BlogPostData } from '@/data/blogData';

// Import all blog content components
import ZeroAdvancePaymentContent from '@/components/blog/ZeroAdvancePayment';
import AppDevelopmentGuideContent from '@/components/blog/AppDevelopmentGuide';
import PayAfterDeliveryContent from '@/components/blog/PayAfterDelivery';
import WebsiteDevelopmentSEOContent from '@/components/blog/WebsiteDevelopmentSEO';
import ZeroAdvancePaymentGuideContent from '@/components/blog/ZeroAdvancePaymentGuide';
import HireIndianDeveloperGuideContent from '@/components/blog/HireIndianDeveloperGuide';
import AISpokespersonGuideContent from '@/components/blog/AISpokespersonGuide';
import AppPaymentModelsGuideContent from '@/components/blog/AppPaymentModelsGuide';
import WebsiteCostGuideContent from '@/components/blog/WebsiteCostGuide';
// New SEO Articles 2026
import ZeroAdvanceWebsiteGuideContent from '@/components/blog/ZeroAdvanceWebsiteGuide';
import HireIndianDeveloperNoUpfrontGuideContent from '@/components/blog/HireIndianDeveloperNoUpfrontGuide';
import AISpokespersonVideoGuideContent from '@/components/blog/AISpokespersonVideoGuide';
import MobileAppDevelopmentCostGuideContent from '@/components/blog/MobileAppDevelopmentCostGuide';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://socilet.in/blog/${post.slug}`;
  
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(canonicalUrl);
    const title = encodeURIComponent(post.title);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(canonicalUrl);
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const renderBlogContent = () => {
    const contentProps = { post, onBack: () => navigate('/blog') };
    
    switch (post.slug) {
      case 'zero-advance-payment-benefits':
        return <ZeroAdvancePaymentContent {...contentProps} />;
      case 'complete-guide-app-development-2024':
        return <AppDevelopmentGuideContent {...contentProps} />;
      case 'pay-after-delivery-transforming-software-development':
        return <PayAfterDeliveryContent {...contentProps} />;
      case 'website-development-seo-best-practices':
        return <WebsiteDevelopmentSEOContent {...contentProps} />;
      case 'zero-advance-payment-guide-2026':
        return <ZeroAdvancePaymentGuideContent {...contentProps} />;
      case 'hire-indian-developer-guide-2026':
        return <HireIndianDeveloperGuideContent {...contentProps} />;
      case 'ai-spokesperson-guide-2026':
        return <AISpokespersonGuideContent {...contentProps} />;
      case 'app-payment-models-guide-2026':
        return <AppPaymentModelsGuideContent {...contentProps} />;
      case 'website-cost-guide-2026':
        return <WebsiteCostGuideContent {...contentProps} />;
      // New SEO Articles 2026
      case 'zero-advance-payment-website-development-guide':
        return <ZeroAdvanceWebsiteGuideContent {...contentProps} />;
      case 'hire-indian-developer-no-upfront-payment-guide':
        return <HireIndianDeveloperNoUpfrontGuideContent {...contentProps} />;
      case 'ai-spokesperson-video-service-guide':
        return <AISpokespersonVideoGuideContent {...contentProps} />;
      case 'mobile-app-development-cost-india-2026':
        return <MobileAppDevelopmentCostGuideContent {...contentProps} />;
      default:
        return <div className="text-center py-12">Content not available</div>;
    }
  };

  // Structured Data for Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,
    "datePublished": post.dateISO || post.date,
    "dateModified": post.dateISO || post.date,
    "author": {
      "@type": "Organization",
      "name": "Socilet",
      "url": "https://socilet.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Socilet",
      "logo": {
        "@type": "ImageObject",
        "url": "https://socilet.in/lovable-uploads/082da739-5b35-4399-be06-1bbc60823d09.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  // BreadcrumbList Schema
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{post.title} | Socilet Blog</title>
        <meta name="title" content={`${post.title} | Socilet Blog`} />
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:site_name" content="Socilet" />
        <meta property="article:published_time" content={post.dateISO || post.date} />
        <meta property="article:section" content={post.category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.imageUrl} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Socilet" />
        <meta name="keywords" content={post.keywords || `${post.category}, web development, app development, zero advance payment`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb Navigation */}
        <nav className="bg-muted/30 py-3 px-4 border-b" aria-label="Breadcrumb">
          <div className="container mx-auto max-w-4xl">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]">
                {post.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Social Share Floating Bar (Desktop) */}
        <div className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-40">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shadow-md hover:bg-blue-600 hover:text-white hover:border-blue-600"
            onClick={() => handleShare('facebook')}
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shadow-md hover:bg-sky-500 hover:text-white hover:border-sky-500"
            onClick={() => handleShare('twitter')}
            aria-label="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full shadow-md hover:bg-blue-700 hover:text-white hover:border-blue-700"
            onClick={() => handleShare('linkedin')}
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>

        {renderBlogContent()}

        {/* Related Posts Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts
                .filter(p => p.slug !== post.slug && p.category === post.category)
                .slice(0, 3)
                .map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium">{relatedPost.category}</span>
                      <h3 className="font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
