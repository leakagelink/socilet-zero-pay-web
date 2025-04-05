
import React from 'react';
import { motion } from "framer-motion";
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginForm from '../components/auth/LoginForm';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  // Extract redirectTo from URL query params if present
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirectTo') || '/affiliate';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoginForm redirectTo={redirectTo} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
