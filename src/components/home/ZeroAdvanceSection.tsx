
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Check } from "lucide-react";
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const ZeroAdvanceSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="bg-gradient-to-r from-primary-900 to-primary-800 py-16 text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="min-w-6 h-6 text-secondary" />
              <h2 className="text-xl sm:text-2xl font-bold">Zero Advance Payment Business Model</h2>
            </div>
            <p className="text-primary-100 mb-6 text-sm sm:text-base">
              {isMobile ? (
                <>
                  We protect clients from scams with our zero advance payment model. 
                  We deliver quality work before payment - if you're not satisfied, 
                  you don't pay a single rupee.
                </>
              ) : (
                <>
                  Socilet works on a zero advance payment model to protect clients from scams. 
                  Many developers take advance payments and then deliver incomplete or 
                  template-based work. We ensure quality work before payment, and if 
                  you're not satisfied, you don't pay us a single rupee.
                </>
              )}
            </p>
            <Link to="/zero-advance-payment" className="block w-full sm:w-auto">
              <Button variant="secondary" className="group w-full sm:w-auto text-xs sm:text-sm">
                <span className="truncate">Learn more about our zero advance payment model</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 w-full md:w-auto">
            <ul className="space-y-3 text-white text-sm sm:text-base">
              <li className="flex items-start">
                <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                <p>Pay only after complete project delivery</p>
              </li>
              <li className="flex items-start">
                <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                <p>No hidden or extra charges</p>
              </li>
              <li className="flex items-start">
                <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                <p>Continuous support throughout development</p>
              </li>
              <li className="flex items-start">
                <div className="text-green-400 mr-2 mt-1 flex-shrink-0">✓</div>
                <p>Don't pay if you're not 100% satisfied</p>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ZeroAdvanceSection;
