
import React from 'react';
import { motion } from "framer-motion";
import { Shield, Award, Rocket, Link, TrendingUp, BarChart, Search, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';

const SeoPlans = () => {
  const isMobile = useIsMobile();

  const plans = [
    {
      name: "BoostStarter",
      icon: <TrendingUp className="h-10 w-10 text-primary-600" />,
      description: "250+ Diversified SEO Backlinks Pack",
      price: 8384,
      features: [
        "100 Tier 1 Backlinks",
        "150 Tier 2 Backlinks",
        "Drip-Feed Strategy",
        "E-E-A-T High Authority Links",
      ],
      deliveryDays: 7,
      color: "from-blue-500 to-cyan-400",
      popular: false,
    },
    {
      name: "RankRise",
      icon: <BarChart className="h-10 w-10 text-primary-600" />,
      description: "500+ Diversified SEO Backlinks Pack",
      price: 14900,
      features: [
        "200 Tier 1 Backlinks",
        "300 Tier 2 Backlinks",
        "Drip-Feed Strategy",
        "E-E-A-T High Authority Links",
        "Priority Processing"
      ],
      deliveryDays: 14,
      color: "from-primary-600 to-primary-400",
      popular: true,
    },
    {
      name: "DominanceMax",
      icon: <Rocket className="h-10 w-10 text-primary-600" />,
      description: "750+ Diversified SEO Backlinks Pack",
      price: 34945,
      features: [
        "300 Tier 1 Backlinks",
        "450 Tier 2 Backlinks",
        "Drip-Feed Strategy",
        "E-E-A-T High Authority Links",
        "Priority Processing",
        "Monthly Report"
      ],
      deliveryDays: 21,
      color: "from-purple-600 to-indigo-500",
      popular: false,
    }
  ];

  return (
    <section id="seo-plans" className="section-padding py-20 bg-gradient-to-b from-gray-50 to-white relative">
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
          <h2 className="text-4xl font-bold mb-2">SEO Backlink Packages</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Boost your website's search engine rankings with our powerful SEO backlink packages.
            Each plan is designed to improve your site's authority and visibility.
          </p>
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
                          <Check className="h-4 w-4" />
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
                <Link className="h-5 w-5 text-primary-600" />
                Detailed Comparison
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[180px]">Feature</TableHead>
                  <TableHead>BoostStarter</TableHead>
                  <TableHead>RankRise</TableHead>
                  <TableHead>DominanceMax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Links</TableCell>
                  <TableCell>250+</TableCell>
                  <TableCell>500+</TableCell>
                  <TableCell>750+</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tier 1 Links</TableCell>
                  <TableCell>100</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>300</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tier 2 Links</TableCell>
                  <TableCell>150</TableCell>
                  <TableCell>300</TableCell>
                  <TableCell>450</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Delivery Time</TableCell>
                  <TableCell>7 days</TableCell>
                  <TableCell>14 days</TableCell>
                  <TableCell>21 days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monthly Report</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-primary-600">✓</TableCell>
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
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Need a custom SEO strategy?</h3>
                <p className="text-gray-600">
                  Contact us for a tailored SEO solution specific to your business needs and goals.
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

export default SeoPlans;
