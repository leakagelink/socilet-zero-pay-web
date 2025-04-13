
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const ViewAllProjectsButton: React.FC = () => {
  return (
    <motion.div 
      className="text-center mt-12"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Button 
        className="bg-primary-600 hover:bg-primary-700 group"
        size="lg"
      >
        <span>View All Projects</span>
        <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
      </Button>
    </motion.div>
  );
};

export default ViewAllProjectsButton;
