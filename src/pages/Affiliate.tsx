
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  UserPlus, LogIn, ArrowRight, RefreshCw, 
  DollarSign, Users, Copy, CheckCircle 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from "../components/WhatsAppButton";
import SupportBar from "../components/SupportBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AffiliateDashboard from '../components/affiliate/AffiliateDashboard';
import { toast } from 'sonner';

// Form validation schemas
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const Affiliate = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  
  // For demo/prototype purpose, store affiliate data in localStorage
  React.useEffect(() => {
    const storedLoginStatus = localStorage.getItem('affiliateLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    // In a real implementation, this would call an API to register the user
    console.log("Register values:", values);
    
    // For demo, save to localStorage
    localStorage.setItem('affiliateUser', JSON.stringify({
      name: values.name,
      email: values.email,
      phone: values.phone,
      referralId: `REF${Math.floor(Math.random() * 10000)}`,
      joinDate: new Date().toISOString(),
    }));
    
    toast.success("Registration successful! Please log in.");
    setActiveTab("login");
  };

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    // In a real implementation, this would verify credentials with backend
    console.log("Login values:", values);
    
    // For demo, just check if email exists in localStorage
    const storedUser = localStorage.getItem('affiliateUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === values.email) {
        // In real implementation, would check password hash
        localStorage.setItem('affiliateLoggedIn', 'true');
        setIsLoggedIn(true);
        toast.success("Login successful!");
      } else {
        toast.error("Invalid email or password");
      }
    } else {
      toast.error("User not found. Please register first.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('affiliateLoggedIn');
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  if (isLoggedIn) {
    return <AffiliateDashboard onLogout={handleLogout} />;
  }

  return (
    <>
      <Helmet>
        <title>Affiliate Program | Socilet</title>
        <meta name="description" content="Join Socilet's affiliate program and earn commissions by referring clients for our zero advance payment services." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <section className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Become a Socilet Affiliate</h1>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Earn attractive commissions by referring clients to our zero advance payment digital services. 
                Start earning with every successful project completion!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-center flex flex-col items-center">
                    <Users className="h-12 w-12 text-primary-600 mb-2" />
                    <span>Refer Clients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Share your unique referral link with potential clients and get them onboarded.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-center flex flex-col items-center">
                    <RefreshCw className="h-12 w-12 text-primary-600 mb-2" />
                    <span>Track Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Monitor your referrals and their project status in real-time through your dashboard.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-center flex flex-col items-center">
                    <DollarSign className="h-12 w-12 text-primary-600 mb-2" />
                    <span>Earn Commission</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Get paid 21 days after project completion. Earnings transferred directly to your account.</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="register" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </TabsTrigger>
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Create Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a secure password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" size="lg">
                        Register as Affiliate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" size="lg">
                        Login to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>

            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Register for our affiliate program to get your unique referral link</li>
                <li>Share your referral link with potential clients</li>
                <li>When they submit a project through your link, it gets tracked to your account</li>
                <li>Track the progress of your referred projects in real-time</li>
                <li>Once a project is completed, a 21-day waiting period begins</li>
                <li>After the waiting period, your commission is added to your withdrawable balance</li>
                <li>Request a payout when your balance reaches the minimum threshold (₹500)</li>
              </ol>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default Affiliate;
