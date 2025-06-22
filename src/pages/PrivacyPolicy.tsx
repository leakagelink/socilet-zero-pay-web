
import React from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Socilet</title>
        <meta name="description" content="Read our comprehensive privacy policy at Socilet - India's first zero advance payment digital services company." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 py-12">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us. This comprehensive policy outlines how we collect, use, protect, and share your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
          
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2>1. Information We Collect</h2>
            
            <h3>1.1 Personal Information</h3>
            <p>
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Fill out contact forms or request quotes</li>
              <li>Create an account or profile</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in surveys or feedback</li>
              <li>Communicate with us via email, phone, or chat</li>
              <li>Apply for our affiliate program</li>
              <li>Use our project tracking services</li>
            </ul>
            <p>
              This information may include: name, email address, phone number, company name, project requirements, 
              payment information, and any other information you choose to provide.
            </p>

            <h3>1.2 Automatically Collected Information</h3>
            <p>
              When you visit our website, we automatically collect certain information about your device and usage:
            </p>
            <ul>
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Device identifiers</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3>1.3 Third-Party Information</h3>
            <p>
              We may receive information about you from third-party services such as Google Analytics, 
              Facebook Pixel, social media platforms, and payment processors.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul>
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our digital services</li>
              <li><strong>Communication:</strong> To respond to inquiries, send updates, and provide customer support</li>
              <li><strong>Marketing:</strong> To send promotional materials, newsletters, and targeted advertisements (with your consent)</li>
              <li><strong>Analytics:</strong> To analyze website usage, user behavior, and improve user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              <li><strong>Payment Processing:</strong> To process payments and prevent fraud</li>
              <li><strong>Personalization:</strong> To customize your experience and show relevant content</li>
            </ul>

            <h2>3. Legal Basis for Processing (GDPR)</h2>
            <p>
              We process your personal data based on the following legal grounds:
            </p>
            <ul>
              <li><strong>Consent:</strong> You have given clear consent for processing your personal data</li>
              <li><strong>Contract:</strong> Processing is necessary for contract performance</li>
              <li><strong>Legal Obligation:</strong> Processing is required by law</li>
              <li><strong>Legitimate Interest:</strong> Processing is necessary for our legitimate business interests</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            
            <h3>4.1 We May Share Information With:</h3>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business</li>
              <li><strong>Payment Processors:</strong> To process payments securely</li>
              <li><strong>Analytics Partners:</strong> Google Analytics, Facebook Pixel for website analytics</li>
              <li><strong>Marketing Partners:</strong> For targeted advertising and email marketing</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>

            <h3>4.2 We Do Not:</h3>
            <ul>
              <li>Sell your personal information to third parties</li>
              <li>Share your information for purposes other than those disclosed</li>
              <li>Rent or lease your personal information</li>
            </ul>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Provide targeted advertising</li>
              <li>Improve website functionality</li>
              <li>Measure advertising effectiveness</li>
            </ul>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul>
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
              <li>Employee training on data protection</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to:
            </p>
            <ul>
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p>
              Generally, we retain personal data for 3-7 years after your last interaction with us, unless a longer retention period is required by law.
            </p>

            <h2>8. Your Rights and Choices</h2>
            
            <h3>8.1 Under GDPR, You Have the Right To:</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>

            <h3>8.2 Marketing Communications:</h3>
            <p>
              You can opt-out of marketing communications by:
            </p>
            <ul>
              <li>Clicking the unsubscribe link in emails</li>
              <li>Contacting us directly</li>
              <li>Updating your preferences in your account</li>
            </ul>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place, including:
            </p>
            <ul>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Standard contractual clauses</li>
              <li>Binding corporate rules</li>
              <li>Certification schemes</li>
            </ul>

            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 16 years of age. We do not knowingly collect 
              personal information from children under 16. If you are a parent or guardian and believe your 
              child has provided personal information, please contact us to have it removed.
            </p>

            <h2>11. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy 
              practices of these external sites. We encourage you to read their privacy policies.
            </p>

            <h2>12. Facebook Advertising Compliance</h2>
            <p>
              We use Facebook advertising services and comply with Facebook's advertising policies:
            </p>
            <ul>
              <li>We use Facebook Pixel to track conversions and optimize ads</li>
              <li>We may create custom audiences based on your interactions</li>
              <li>You can control Facebook ad preferences in your Facebook settings</li>
              <li>We respect Facebook's advertising guidelines and community standards</li>
            </ul>

            <h2>13. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of material changes by:
            </p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications (if applicable)</li>
              <li>Displaying prominent notices on our website</li>
            </ul>
            <p>
              Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              If you have questions about this privacy policy or want to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-100 p-6 rounded-lg my-6">
              <p><strong>Socilet - Digital Services</strong></p>
              <p><strong>Email:</strong> privacy@socilet.com</p>
              <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
              <p><strong>Address:</strong> [Your Business Address]</p>
              <p><strong>Data Protection Officer:</strong> dpo@socilet.com</p>
            </div>

            <h2>15. Supervisory Authority</h2>
            <p>
              If you are located in the European Union, you have the right to lodge a complaint with your 
              local data protection supervisory authority if you believe we have violated your privacy rights.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
              <p className="text-blue-800 font-semibold">
                This privacy policy is designed to comply with GDPR, CCPA, and Facebook advertising policies. 
                By using our services, you acknowledge that you have read and understood this policy.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default PrivacyPolicy;
