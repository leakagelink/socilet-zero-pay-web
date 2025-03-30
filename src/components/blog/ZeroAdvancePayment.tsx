
import React from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Share2, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from '@/components/BlogPreview';

interface BlogPostProps {
  post: BlogPost;
  onBack: () => void;
}

const ZeroAdvancePayment: React.FC<BlogPostProps> = ({ post, onBack }) => {
  return (
    <article className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-gray-100">
            <ArrowLeft size={16} className="mr-2" /> Back to all articles
          </Button>

          <div className="rounded-xl overflow-hidden mb-8 h-[400px]">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <CalendarIcon size={16} className="mr-2" />
              {post.date}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={16} className="mr-2" />
              {post.readTime}
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 size={16} className="mr-2" /> Share
              </Button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

          <div className="prose prose-lg max-w-none">
            <h2>Introducing Our Zero Advance Payment Model</h2>
            <p>
              In the traditional world of digital development, clients are often required to pay significant upfront costs before work begins on their projects. This model has persisted for decades, but at Socilet, we've chosen a different path—one that aligns our success with your satisfaction through our Zero Advance Payment model.
            </p>
            
            <h2>What Is Zero Advance Payment?</h2>
            <p>
              Our Zero Advance Payment model is exactly what it sounds like: you don't pay anything until we deliver the agreed-upon deliverables to your satisfaction. This approach fundamentally changes the client-developer relationship by:
            </p>
            <ul>
              <li><strong>Eliminating Financial Risk</strong> - You don't invest a single penny until you see and approve the final product</li>
              <li><strong>Ensuring Quality Deliverables</strong> - Since payment is contingent on your satisfaction, we're incentivized to deliver excellence</li>
              <li><strong>Building Trust</strong> - We demonstrate our confidence in our abilities by shouldering the initial investment</li>
              <li><strong>Aligning Incentives</strong> - Both parties are focused on the same goal: a high-quality final product</li>
            </ul>
            
            <h2>Benefits for Clients</h2>
            <h3>1. Reduced Financial Risk</h3>
            <p>
              The most obvious benefit is the elimination of financial risk. Traditional development projects require 30-50% payment upfront, exposing clients to potential losses if the project doesn't meet expectations. Our model shifts this risk entirely to us, allowing you to proceed with confidence.
            </p>
            
            <h3>2. Enhanced Quality Control</h3>
            <p>
              When developers know they'll only be paid after client approval, they're naturally motivated to deliver their best work. This creates a powerful quality control mechanism that benefits you as the client.
            </p>
            
            <h3>3. Better Communication and Collaboration</h3>
            <p>
              Our payment structure necessitates open, honest communication. We'll work closely with you throughout the process, ensuring your vision is fully understood and implemented. There's no incentive for us to rush through development or cut corners.
            </p>
            
            <h3>4. Flexibility and Adaptability</h3>
            <p>
              As your project evolves, you may discover new requirements or desire changes to the initial scope. Our model accommodates these shifts more gracefully than traditional contracts, where changes often trigger additional fees or complications.
            </p>
            
            <h2>Our Commitment to Success</h2>
            <p>
              You might wonder: "If I don't pay upfront, what guarantees that you'll deliver quality work?" The answer lies in our business model. We succeed when you succeed. By delivering exceptional work that meets or exceeds your expectations, we:
            </p>
            <ul>
              <li>Earn your payment for the current project</li>
              <li>Build a long-term relationship for future projects</li>
              <li>Generate valuable referrals and testimonials</li>
              <li>Enhance our portfolio and market reputation</li>
            </ul>
            
            <h2>Case Study: Zero Advance Success</h2>
            <p>
              A recent client came to us after a disappointing experience with another agency. They had paid 50% upfront for a mobile app but were unhappy with the quality and responsiveness of the development team. After switching to our services under the Zero Advance Payment model, the client reported:
            </p>
            <ul>
              <li>Higher quality deliverables</li>
              <li>More responsive development team</li>
              <li>Greater alignment with their business objectives</li>
              <li>Peaceful mind knowing they wouldn't pay until satisfied</li>
            </ul>
            
            <h2>How We Make It Work</h2>
            <p>
              Managing a Zero Advance Payment model requires operational efficiency and financial stability on our part. We've refined our processes to ensure we can deliver this client-friendly approach while maintaining a sustainable business:
            </p>
            <ul>
              <li><strong>Thorough Initial Assessments</strong> - We carefully evaluate each project to ensure it's a good fit for both parties</li>
              <li><strong>Clear Milestones and Deliverables</strong> - We define specific checkpoints throughout the development process</li>
              <li><strong>Efficient Resource Management</strong> - Our team structure allows us to allocate resources effectively across projects</li>
              <li><strong>Strong Financial Foundation</strong> - Our established business allows us to manage cash flow despite the delayed payment model</li>
            </ul>
            
            <h2>Ready to Experience the Difference?</h2>
            <p>
              If you're tired of the traditional development model with its upfront payments and misaligned incentives, we invite you to explore our Zero Advance Payment approach. Contact us today to discuss your project and discover how our client-first payment structure can deliver peace of mind and exceptional results for your next digital venture.
            </p>
            
            <p>
              Remember: with Socilet, you only pay when you're completely satisfied with what we've built. It's that simple.
            </p>
          </div>
        </motion.div>
      </div>
    </article>
  );
};

export default ZeroAdvancePayment;
