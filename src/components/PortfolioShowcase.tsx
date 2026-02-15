
import React, { useState } from 'react';
import { ExternalLink, Globe, TrendingUp, Bot, Rocket, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

type Category = 'all' | 'business' | 'trading' | 'ai-tools' | 'landing' | 'blogging';

interface Project {
  name: string;
  url: string;
  category: Category;
}

const projects: Project[] = [
  // Business & Portfolio Websites
  { name: 'IncorpWale', url: 'https://incorpwale.com', category: 'business' },
  { name: 'Karnataka Ginger', url: 'https://karnatakagingerintr.in/', category: 'business' },
  { name: 'Chic Fusion Makeovers', url: 'https://chicfusionmakeovers.in/', category: 'business' },
  { name: 'Gayatri Kashyap', url: 'https://gayatrikashyap.in/', category: 'business' },
  { name: 'Dheeraj Tagde', url: 'https://dheerajtagde.in', category: 'business' },
  { name: 'InboxBeam', url: 'https://inboxbeam.in', category: 'business' },
  // Trading Platforms
  { name: 'CoinGoldFX', url: 'https://coingoldfx.in', category: 'trading' },
  { name: 'VaultIQ', url: 'https://vaultiq.in', category: 'trading' },
  // AI & Automation Tools
  { name: 'AI Automation Tools', url: 'https://aiautomationtools.in', category: 'ai-tools' },
  { name: 'AI Mehendi', url: 'https://aimehendi.in', category: 'ai-tools' },
  { name: 'Blog Automation Pro', url: 'https://blogautomationpro.in', category: 'ai-tools' },
  { name: 'WP AI Fixer Buddy', url: 'https://wordpressaifixerbuddy.online/', category: 'ai-tools' },
  { name: 'DocuCreator Pro', url: 'https://docucreatorpro.online', category: 'ai-tools' },
  { name: 'Gold Loan Tool', url: 'https://goldloantool.online/', category: 'ai-tools' },
  { name: 'ByteVigil', url: 'https://bytevigil.one/', category: 'ai-tools' },
  { name: 'IdeaValidate', url: 'https://ideavalidate.online/', category: 'ai-tools' },
  { name: 'PluginPal', url: 'https://pluginpal.xyz/', category: 'ai-tools' },
  { name: 'Solar Savings Calculator', url: 'https://solarsavingscalculator.site/', category: 'ai-tools' },
  { name: 'Image Utility', url: 'https://imageutility.in', category: 'ai-tools' },
  { name: 'Code Formatter Pro', url: 'https://codeformatter.pro/', category: 'ai-tools' },
  // Landing Pages
  { name: 'Blog Automation Pro', url: 'https://blogautomationpro.in', category: 'landing' },
  { name: 'NicodeGenius', url: 'https://nicodegenius.com', category: 'landing' },
  { name: 'AI Student Access', url: 'https://aistudentaccessprogram.in/', category: 'landing' },
  { name: 'App Launch Studio', url: 'https://applaunchstudio.online/', category: 'landing' },
  { name: 'Build My Biz Online', url: 'https://buildmybizonline.in/', category: 'landing' },
  { name: '100 Business Ideas', url: 'https://100businessideas.in/', category: 'landing' },
  { name: 'Crypto Arb Mastery', url: 'https://cryptoarbmastery.in/', category: 'landing' },
  // Blogging
  { name: 'AI Se Seekho', url: 'https://aiseseekho.in', category: 'blogging' },
  { name: 'OnlineSevaHelp', url: 'https://onlinesevahelp.in', category: 'blogging' },
];

const categories: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All Projects', icon: <Globe className="w-4 h-4" /> },
  { key: 'business', label: 'Business & Portfolio', icon: <Globe className="w-4 h-4" /> },
  { key: 'trading', label: 'Trading Platforms', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'ai-tools', label: 'AI & Automation', icon: <Bot className="w-4 h-4" /> },
  { key: 'landing', label: 'Landing Pages', icon: <Rocket className="w-4 h-4" /> },
  { key: 'blogging', label: 'Blogging', icon: <BookOpen className="w-4 h-4" /> },
];

const PortfolioShowcase: React.FC = () => {
  const [active, setActive] = useState<Category>('all');

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Work Portfolio
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {filtered.length}+ projects delivered across multiple industries
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat.key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background text-muted-foreground hover:bg-accent border border-border'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map((project, index) => (
            <motion.a
              key={`${project.url}-${project.category}-${index}`}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="group relative flex items-center gap-3 p-4 rounded-xl bg-background border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {project.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {project.url.replace(/https?:\/\//, '').replace(/\/$/, '')}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioShowcase;
