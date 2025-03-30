
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet';
import { Toaster } from 'sonner';
import { Shield, DollarSign, ThumbsUp, Clock, AlertTriangle, Medal } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ZeroAdvancePayment = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Zero Advance Payment Model | Socilet - Brand Your Dream</title>
        <meta name="description" content="Socilet's unique zero advance payment business model ensures you only pay after the work is completed to your satisfaction, protecting you from scams." />
      </Helmet>
      <Toaster position="top-right" richColors />
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-50 to-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <motion.div 
            className="absolute -right-40 -bottom-40 w-96 h-96 bg-primary-100 rounded-full opacity-30 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              transition: { duration: 8, repeat: Infinity }
            }}
          ></motion.div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                  No Advance Payment Required
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Our Zero Advance Payment Promise
                </h1>
                <p className="text-xl text-gray-600">
                  At Socilet, we believe in building trust through actions, not words. Pay only when you're completely satisfied with our work.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Button size="lg" className="gap-2">
                    <ThumbsUp size={18} />
                    Start Your Project
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    Learn More
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 relative z-10">
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                    Client Protected
                  </div>
                  <div className="flex mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Zero Advance Payment</h3>
                      <p className="text-gray-500">Protection against scams</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">Pay only after project completion</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">No hidden or extra charges</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">Quality work guaranteed or don't pay</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <p className="text-gray-700">Continuous support and updates</p>
                    </li>
                  </ul>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Traditional Model</div>
                      <div className="text-sm text-gray-500">Socilet Model</div>
                    </div>
                    <div className="mt-2 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-green-500 flex">
                        <div className="w-1/2 bg-red-500 relative">
                          <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-semibold">50% Advance</span>
                        </div>
                        <div className="w-1/2 bg-green-500 relative">
                          <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-semibold">0% Advance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/30 rounded-full blur-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Main Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-3xl font-bold mb-6">Why We Work With Zero Advance Payment</h2>
              
              <p>
                हम जीरो एडवांस पेमेंट और वर्क फर्स्ट पे लेटर वाले बिजनेस मॉडल पर इसलिए काम कर रहे हैं ताकि हम लोगों को स्कैम से बचा सकें। आज के समय कई डेवलपर ऐसे हैं जो एडवांस पेमेंट ले लेते हैं, उसके बाद रिस्पॉन्स करना बंद कर देते हैं या अधूरा काम करके देते हैं या टेम्पलेट का इस्तेमाल करके बनाते हैं। उसमें भी क्लाइंट की रिक्वायरमेंट के अनुसार चीजें नहीं होती हैं।
              </p>
              
              <p>
                जबकि जो यूजर होता है वो अच्छा खासा पैसा देने के लिए तैयार होता है और अच्छा खासा एडवांस पेमेंट भी देता है। पर उसके बाद भी जो डेवलपर होते हैं या जो फ्रीलांसर होते हैं, सही तरह से अपना काम ईमानदारी से नहीं करते। और जिस यूजर ने अपना हार्ड अर्न मनी दिया होता है, वो बहुत परेशान होता है पर उसकी कोई भी हेल्प नहीं कर पाता।
              </p>
              
              <p>
                सोसिलेट उन स्कैम और फ्रॉड को जो मार्केट में हो रहे हैं, उसे पूरी तरह खत्म करना चाहता है। इसलिए सोसिलेट जीरो एडवांस पेमेंट पर काम करता है और कोई भी हिडन या एक्स्ट्रा चार्ज भी नहीं लेता और अपटाइम सपोर्ट देता है और क्वालिटी वर्क भी।
              </p>
              
              <p>
                हम बोलते हैं कि अगर आपको काम पसंद न आए तो आप हमें 1 रुपये भी मत देना। सोसिलेट विश्वास रखता है क्वालिटी वर्क में और हम नहीं चाहते आपके हार्ड अर्न मनी वेस्ट हो, इसलिए किसी स्कैमर से नहीं, सोसिलेट से काम करवाएं।
              </p>
              
              <div className="my-12 border-l-4 border-primary-600 pl-6 bg-primary-50 p-4 rounded-r-lg">
                <h3 className="text-xl font-bold text-primary-800">Our Promise to You</h3>
                <p className="text-gray-700">
                  "We believe in our work so much that we don't ask for payment until you're completely satisfied. Your hard-earned money deserves quality work."
                </p>
              </div>
            
              <h2 className="text-3xl font-bold mb-6">How Our Zero Advance Payment Model Protects You</h2>
              
              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-start mb-4">
                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Traditional Model Problems</h3>
                      <p className="text-gray-600">What most agencies do</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="text-red-500 mr-2 mt-1">✕</div>
                      <p className="text-gray-700">Require 30-50% advance payment</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-red-500 mr-2 mt-1">✕</div>
                      <p className="text-gray-700">Use templates instead of custom work</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-red-500 mr-2 mt-1">✕</div>
                      <p className="text-gray-700">Stop responding after receiving payment</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-red-500 mr-2 mt-1">✕</div>
                      <p className="text-gray-700">Deliver incomplete or low-quality work</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-red-500 mr-2 mt-1">✕</div>
                      <p className="text-gray-700">No recourse for unsatisfied clients</p>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border border-primary-100">
                  <div className="flex items-start mb-4">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <Medal className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Socilet's Model Benefits</h3>
                      <p className="text-gray-600">How we protect your interests</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">✓</div>
                      <p className="text-gray-700">Zero advance payment required</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">✓</div>
                      <p className="text-gray-700">Custom development to your specifications</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">✓</div>
                      <p className="text-gray-700">Regular communication throughout the process</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">✓</div>
                      <p className="text-gray-700">Complete project delivery before payment</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-green-500 mr-2 mt-1">✓</div>
                      <p className="text-gray-700">Don't pay if you're not 100% satisfied</p>
                    </li>
                  </ul>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">How Our Process Works</h2>
              
              <div className="relative my-12">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-primary-100"></div>
                
                <div className="relative z-10 mb-12">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full border-4 border-white shadow-md">
                        <span className="text-primary-600 text-xl font-bold">1</span>
                      </div>
                    </div>
                    <div className="flex-grow ml-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-2">Project Discussion</h3>
                        <p className="text-gray-600">
                          We discuss your requirements in detail and create a comprehensive project plan. No payment is collected at this stage.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mb-12">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full border-4 border-white shadow-md">
                        <span className="text-primary-600 text-xl font-bold">2</span>
                      </div>
                    </div>
                    <div className="flex-grow ml-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-2">Development Phase</h3>
                        <p className="text-gray-600">
                          We develop the project according to your specifications, providing regular updates and demonstrations throughout the process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mb-12">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full border-4 border-white shadow-md">
                        <span className="text-primary-600 text-xl font-bold">3</span>
                      </div>
                    </div>
                    <div className="flex-grow ml-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-2">Project Delivery</h3>
                        <p className="text-gray-600">
                          The completed project is delivered for your review and approval. You can test all features thoroughly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full border-4 border-white shadow-md">
                        <span className="text-green-600 text-xl font-bold">4</span>
                      </div>
                    </div>
                    <div className="flex-grow ml-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-2">Payment Only After Satisfaction</h3>
                        <p className="text-gray-600">
                          Once you're completely satisfied with the delivered work, only then do you make the payment. If you're not satisfied, you don't pay.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-50 p-8 rounded-xl border border-primary-100 my-12">
                <h3 className="text-2xl font-bold mb-4 text-primary-800">Ready to Experience the Difference?</h3>
                <p className="text-gray-700 mb-6">
                  Don't risk your hard-earned money with developers who take advance payments and deliver subpar results. Choose Socilet's zero advance payment model for guaranteed quality work.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact">
                    <Button size="lg" className="gap-2">
                      Start Your Project Now
                    </Button>
                  </Link>
                  <Link to="/portfolio">
                    <Button variant="outline" size="lg" className="gap-2">
                      View Our Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ZeroAdvancePayment;
