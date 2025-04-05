
import React from 'react';
import { motion } from 'framer-motion';

type StatsCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  className?: string;
};

const StatsCard = ({ title, value, icon, description, className }: StatsCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`p-4 rounded-lg border ${className || ""}`}
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="p-2 rounded-full bg-white">{icon}</div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </motion.div>
);

export default StatsCard;
