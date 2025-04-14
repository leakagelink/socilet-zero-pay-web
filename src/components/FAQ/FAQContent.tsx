
import React from 'react';
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  CreditCard, 
  Globe, 
  Server, 
  Clock, 
  Code,
  MessageCircle
} from "lucide-react";

const FAQContent = () => {
  const generalFaqs = [
    {
      question: "What services do you offer?",
      answer: "We offer a range of digital services including website development, app development, AI spokesperson creation, and business profile listing. All our services come with our unique zero advance payment model."
    },
    {
      question: "How does your zero advance payment model work?",
      answer: "Our zero advance payment model means you only pay after your project is successfully delivered and you are completely satisfied with the results. There are no upfront costs or hidden fees."
    },
    {
      question: "What technologies do you use?",
      answer: "We use modern technologies such as React, Angular, Vue.js for frontend development, and Node.js, Python, PHP for backend development. For mobile app development, we work with React Native, Flutter, and native iOS/Android technologies."
    },
    {
      question: "How long does it take to complete a project?",
      answer: "Project timelines vary based on complexity and requirements. A simple website might take 2-4 weeks, while complex applications may require 2-6 months. We'll provide you with a detailed timeline during our consultation."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes, we offer ongoing support and maintenance packages to keep your digital products running smoothly. We can also provide training to your team to manage day-to-day operations."
    },
    {
      question: "How do I get started with your services?",
      answer: "Simply reach out to us through our contact form or give us a call. We'll schedule a free consultation to discuss your requirements and provide you with a project proposal and timeline."
    }
  ];

  const paymentFaqs = [
    {
      question: "What are the payment terms for WordPress projects?",
      answer: "For WordPress projects, you only pay 100% of the project cost after the project is completely finished and delivered. There are no interim payments required during the development process. You provide the domain, and we offer 1 year of free hosting."
    },
    {
      question: "What are the payment terms for React-based projects?",
      answer: "For React-based projects, we require a 45% advance payment once 30% of the project work is completed. The pricing is determined based on the specific requirements and complexity of your project."
    },
    {
      question: "Do I need to pay anything upfront?",
      answer: "For WordPress projects, no upfront payment is required. For React-based projects, payment is only required after 30% of the work is completed."
    },
    {
      question: "Who provides the domain and hosting?",
      answer: "For all projects, you are responsible for providing the domain. We provide 1 year of free hosting for WordPress projects. For other project types, hosting arrangements can be discussed during the consultation."
    },
    {
      question: "What happens if I'm not satisfied with the delivered project?",
      answer: "We work closely with our clients throughout the development process to ensure satisfaction. If you're not satisfied with any aspect of the delivered project, we will make necessary revisions until you are completely satisfied before final payment is due."
    },
    {
      question: "Are there any hidden costs or additional fees?",
      answer: "No, there are no hidden costs. All project requirements and associated costs are clearly outlined in our proposal before we begin work. Any additional features requested after the project begins may incur additional charges, but these will always be discussed and approved by you first."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including bank transfers, digital wallets, and credit/debit cards. The available payment options will be provided to you when payment is due."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="bg-primary-100 p-3 rounded-full mr-3">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold">General Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {generalFaqs.map((faq, index) => (
              <AccordionItem 
                key={`general-${index}`} 
                value={`general-${index}`}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="bg-primary-100 p-3 rounded-full mr-3">
              <CreditCard className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold">Payment & Delivery Terms</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {paymentFaqs.map((faq, index) => (
              <AccordionItem 
                key={`payment-${index}`} 
                value={`payment-${index}`}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>

      <motion.div 
        className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 p-6 md:p-8 rounded-xl text-center border border-primary-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-md">
            <MessageCircle className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
        <p className="text-gray-600 mb-5">
          If you couldn't find the answer to your question, feel free to contact us directly.
        </p>
        <a 
          href="/#contact" 
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors duration-300"
        >
          Contact Us
        </a>
      </motion.div>
    </div>
  );
};

export default FAQContent;
