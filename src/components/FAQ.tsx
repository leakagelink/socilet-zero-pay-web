
import React from 'react';
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
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

  return (
    <section id="faq" className="section-padding bg-white relative">
      <motion.div 
        className="absolute top-0 right-0 w-72 h-72 bg-primary-50 rounded-full filter blur-3xl opacity-20"
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
            <div className="bg-primary-100 p-3 rounded-full">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600">
            Find answers to commonly asked questions about our services and payment model.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
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
        </motion.div>

        <motion.div 
          className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 p-6 md:p-8 rounded-xl text-center max-w-3xl mx-auto border border-primary-100"
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
            href="#contact" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors duration-300"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
