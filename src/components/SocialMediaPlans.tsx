
import React from 'react';
import { motion } from "framer-motion";
import { Calendar, Clock, Medal, Instagram, Facebook, Linkedin, Twitter, Youtube, Hashtag, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';

const SocialMediaPlans = () => {
  const isMobile = useIsMobile();

  const plans = [
    {
      name: "Weekly Management",
      icon: <Calendar className="h-10 w-10 text-primary-600" />,
      description: "7 Days Social Media Management",
      price: 3700,
      features: [
        "7 Image Posts/Week",
        "Profile Optimization",
        "Bio & Story Highlights",
        "Hashtag Research",
      ],
      deliveryDays: 7,
      color: "from-blue-500 to-cyan-400",
      popular: false,
    },
    {
      name: "Bi-Weekly Management",
      icon: <Clock className="h-10 w-10 text-primary-600" />,
      description: "15 Days Social Media Management",
      price: 7500,
      features: [
        "15 Image Posts",
        "Carousel Posts",
        "Content Scheduling",
        "Profile Optimization",
        "Hashtag Research"
      ],
      deliveryDays: 14,
      color: "from-primary-600 to-primary-400",
      popular: true,
    },
    {
      name: "Monthly Management",
      icon: <Medal className="h-10 w-10 text-primary-600" />,
      description: "30 Days Social Media Management",
      price: 9999,
      features: [
        "30 Image Posts",
        "4 Carousel Posts",
        "Video Content",
        "Content Scheduling",
        "Hashtag Research",
        "Community Building"
      ],
      deliveryDays: 30,
      color: "from-purple-600 to-indigo-500",
      popular: false,
    }
  ];

  const platforms = [
    { name: "Instagram", icon: <Instagram className="h-5 w-5" /> },
    { name: "Facebook", icon: <Facebook className="h-5 w-5" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" /> },
    { name: "YouTube", icon: <Youtube className="h-5 w-5" /> },
    { name: "TikTok", icon: <span className="text-xl">🎵</span> },
    { name: "Pinterest", icon: <span className="text-xl">📌</span> }
  ];

  return (
    <section id="social-media-plans" className="section-padding py-20 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-blue-50 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-40 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-2">Social Media Management</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Professional marketing services for your brand's social media presence. We specialize in content management, 
            profile optimization, hashtag research, community building, and competitor analysis.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-16"
        >
          <h3 className="text-2xl font-semibold mb-4">What We Offer</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-lg mb-3 text-primary-700">Our Services Include:</h4>
              <ul className="space-y-2">
                {[
                  "Profile Optimization with Bio, Cover and Story Highlights",
                  "Custom Content Creation (Images, Carousels, Videos)",
                  "Brand Strategy Implementation for Organic Growth",
                  "Daily Posts and Stories with Optimized Hashtags",
                  "Content Calendar Creation & Scheduling",
                  "Story Highlights and Reel Covers Design",
                  "Multi-Platform Content Management"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-3 text-primary-700">How We Work:</h4>
              <p className="text-gray-600 mb-4">
                After collecting all necessary details, we begin content creation within 24-48 hours. 
                We show you the content for approval before starting the scheduling process.
              </p>
              
              <h4 className="font-medium text-lg mt-6 mb-3 text-primary-700">Platforms We Cover:</h4>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform, index) => (
                  <div key={index} className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <span className="mr-1.5">{platform.icon}</span>
                    <span className="text-sm">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full border ${plan.popular ? 'border-primary-400 shadow-lg shadow-primary-100' : 'border-gray-200'} rounded-xl overflow-hidden relative`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary-600 text-white text-xs px-3 py-1 rounded-bl-lg font-semibold shadow-sm">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <CardHeader className={`bg-gradient-to-r ${plan.color} pb-8`}>
                  <div className="bg-white/20 p-3 rounded-full w-16 h-16 flex items-center justify-center backdrop-blur-sm mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-white/90">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <p className="text-3xl font-bold">₹{plan.price.toLocaleString()}</p>
                    <p className="text-gray-500 text-sm">{plan.deliveryDays} days delivery</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <div className="text-primary-600 mr-2 mt-1">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={plan.popular ? "default" : "outline"}
                    className={`w-full ${plan.popular ? '' : 'border-primary-600 text-primary-600 hover:bg-primary-50'}`}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {!isMobile && (
          <motion.div 
            className="mt-16 max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Hashtag className="h-5 w-5 text-primary-600" />
                Plan Comparison
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[180px]">Feature</TableHead>
                  <TableHead>Weekly</TableHead>
                  <TableHead>Bi-Weekly</TableHead>
                  <TableHead>Monthly</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Duration</TableCell>
                  <TableCell>7 days</TableCell>
                  <TableCell>15 days</TableCell>
                  <TableCell>30 days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Image Posts</TableCell>
                  <TableCell>7</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Carousel Posts</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>✓</TableCell>
                  <TableCell>4</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Video Content</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-primary-600">✓</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hashtag Research</TableCell>
                  <TableCell>Basic</TableCell>
                  <TableCell>Advanced</TableCell>
                  <TableCell>Premium</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </motion.div>
        )}
        
        <motion.div 
          className="bg-gradient-to-r from-gray-50 to-primary-50 p-8 rounded-xl mt-16 border border-primary-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Instagram className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Need a custom social media strategy?</h3>
                <p className="text-gray-600">
                  Contact us for a tailored social media management plan specific to your business needs and goals.
                </p>
              </div>
            </div>
            <Button size="lg" className="whitespace-nowrap">
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaPlans;
