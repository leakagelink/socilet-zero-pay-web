
import React from 'react';
import { motion } from "framer-motion";
import { Target, Layers, Crown, Search, BarChart2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';

const GoogleAdPlans = () => {
  const isMobile = useIsMobile();

  const plans = [
    {
      name: "Starter Plan",
      icon: <Target className="h-10 w-10 text-primary-600" />,
      description: "Get Started with Google Ads PPC",
      price: 10000,
      features: [
        "2 Ad Groups",
        "15 Keywords",
        "Negative Keywords",
        "Ad Extensions",
        "Audience Targeting",
        "Bidding Strategy",
        "4 Text Ads"
      ],
      deliveryDays: 5,
      color: "from-blue-500 to-cyan-400",
      popular: false,
    },
    {
      name: "Standard Plan",
      icon: <Layers className="h-10 w-10 text-primary-600" />,
      description: "Comprehensive Google Ads Setup",
      price: 17000,
      features: [
        "4 Ad Groups",
        "35 Keywords",
        "Negative Keywords",
        "Ad Extensions",
        "Audience Targeting",
        "Bidding Strategy",
        "8 Text Ads",
        "1 Free Optimization in 7 Days"
      ],
      deliveryDays: 5,
      color: "from-primary-600 to-primary-400",
      popular: true,
    },
    {
      name: "Premium Plan",
      icon: <Crown className="h-10 w-10 text-primary-600" />,
      description: "Advanced Google Ads Management",
      price: 25000,
      features: [
        "8 Ad Groups",
        "60 Keywords",
        "Negative Keywords",
        "Ad Extensions",
        "Audience Targeting",
        "Bidding Strategy",
        "16 Text Ads",
        "2 Optimizations in 7 & 14 Days"
      ],
      deliveryDays: 5,
      color: "from-purple-600 to-indigo-500",
      popular: false,
    }
  ];

  return (
    <section id="google-ad-plans" className="section-padding py-20 bg-gradient-to-b from-gray-50 to-white relative">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-50 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 left-40 w-80 h-80 bg-primary-50 rounded-full filter blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-2">Google Ads PPC Campaigns</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Professional Google AdWords PPC campaign setup and management to drive targeted traffic to your website
            and maximize your return on ad spend.
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
                  "Professional Google Ads Account Setup",
                  "Competitor Research & Analysis",
                  "Strategic Keyword Research & Selection",
                  "Negative Keyword Implementation",
                  "Campaign Structure & Organization",
                  "Ad Extension Setup for Better Visibility",
                  "Custom Audience Targeting & Demographics",
                  "Smart Bidding Strategy Implementation",
                  "Compelling Ad Copy Creation",
                  "Post-Launch Optimization & Reporting"
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
                We begin with a thorough understanding of your business goals, target audience, and competition. 
                After account setup and campaign configuration, we continuously monitor performance 
                and provide optimizations to maximize your ad spend efficiency.
              </p>
              
              <h4 className="font-medium text-lg mt-6 mb-3 text-primary-700">Benefits of Our PPC Services:</h4>
              <ul className="space-y-2">
                {[
                  "Increased Website Traffic & Lead Generation",
                  "Higher Quality Leads with Targeted Campaigns",
                  "Improved Ad Relevance & Quality Scores",
                  "Lower Cost Per Click & Higher ROI",
                  "Full Transparency with Detailed Reporting"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
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
                <span className="text-primary-600">#</span>
                Plan Comparison
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[180px]">Feature</TableHead>
                  <TableHead>Starter Plan</TableHead>
                  <TableHead>Standard Plan</TableHead>
                  <TableHead>Premium Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Ad Groups</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>8</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Keywords</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>35</TableCell>
                  <TableCell>60</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Text Ads</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>16</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Optimizations</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>1 (after 7 days)</TableCell>
                  <TableCell>2 (after 7 & 14 days)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Delivery Time</TableCell>
                  <TableCell>5 days</TableCell>
                  <TableCell>5 days</TableCell>
                  <TableCell>5 days</TableCell>
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
                <BarChart2 className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Need a custom PPC strategy?</h3>
                <p className="text-gray-600">
                  Contact us for a tailored Google Ads solution specific to your business needs and target audience.
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

export default GoogleAdPlans;
