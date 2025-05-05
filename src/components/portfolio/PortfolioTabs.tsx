
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import PortfolioGrid from './PortfolioGrid';
import { PortfolioItem } from '@/components/admin/portfolio/types';

interface PortfolioTabsProps {
  items: PortfolioItem[];
  getCategoryLabel: (category: string) => string;
}

const PortfolioTabs: React.FC<PortfolioTabsProps> = ({ items, getCategoryLabel }) => {
  // Filter items by technology
  const reactProjects = items.filter(item => item.isReactProject);
  const wordpressProjects = items.filter(item => item.isWordPressProject);
  const otherProjects = items.filter(item => !item.isReactProject && !item.isWordPressProject);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      <Tabs defaultValue="all" className="w-full mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger 
              value="all"
              className="px-6 py-2 data-[state=active]:bg-white rounded-md"
            >
              All Projects
            </TabsTrigger>
            <TabsTrigger 
              value="react" 
              className="px-6 py-2 data-[state=active]:bg-white rounded-md"
            >
              React
            </TabsTrigger>
            <TabsTrigger 
              value="wordpress" 
              className="px-6 py-2 data-[state=active]:bg-white rounded-md"
            >
              WordPress
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <PortfolioGrid items={items} getCategoryLabel={getCategoryLabel} />
        </TabsContent>
        
        <TabsContent value="react">
          {reactProjects.length > 0 ? (
            <PortfolioGrid items={reactProjects} getCategoryLabel={getCategoryLabel} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No React projects to display.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="wordpress">
          {wordpressProjects.length > 0 ? (
            <PortfolioGrid items={wordpressProjects} getCategoryLabel={getCategoryLabel} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No WordPress projects to display.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PortfolioTabs;
