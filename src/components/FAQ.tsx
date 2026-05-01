import React, { useState } from 'react';
import { motion } from "framer-motion";
import { MessageCircle, HelpCircle, ChevronDown, Languages } from "lucide-react";

type Lang = 'en' | 'hi';
type FaqItem = { en: { q: string; a: string }; hi: { q: string; a: string } };

const faqs: FaqItem[] = [
  {
    en: {
      q: "What digital services does Socilet offer?",
      a: "Socilet offers website development, mobile app development (React Native, Flutter, native iOS/Android), AI spokesperson video creation, business profile listing (Google My Business setup), SEO services, social media marketing, and Google Ads management. All services are available under our zero advance payment model for eligible projects.",
    },
    hi: {
      q: "Socilet कौन-कौन सी डिजिटल सर्विसेज़ देती है?",
      a: "Socilet वेबसाइट डेवलपमेंट, मोबाइल ऐप डेवलपमेंट (React Native, Flutter, Android/iOS), AI स्पोक्सपर्सन वीडियो, Google My Business सेटअप, SEO, सोशल मीडिया मार्केटिंग और Google Ads मैनेजमेंट सर्विसेज़ देती है। सभी एलिजिबल प्रोजेक्ट्स पर ज़ीरो एडवांस पेमेंट मॉडल लागू है।",
    },
  },
  {
    en: {
      q: "How does Socilet's zero advance payment model work?",
      a: "With our zero advance payment model, WordPress website clients pay 100% only after the project is completely delivered and approved. For React-based custom projects, we ask for a 45% milestone payment after 30% of the work is completed. There are no hidden fees, and you only pay when you are satisfied with the deliverable.",
    },
    hi: {
      q: "ज़ीरो एडवांस पेमेंट मॉडल कैसे काम करता है?",
      a: "WordPress वेबसाइट के लिए आप 100% पेमेंट तभी करते हैं जब प्रोजेक्ट पूरा होकर डिलीवर हो जाए और आप उससे संतुष्ट हों। React आधारित कस्टम प्रोजेक्ट्स में 30% काम पूरा होने पर सिर्फ़ 45% मील-स्टोन पेमेंट लगती है। कोई हिडन चार्ज नहीं — पेमेंट तभी जब आप संतुष्ट हों।",
    },
  },
  {
    en: {
      q: "Where is Socilet located and which areas do you serve?",
      a: "Socilet is based in Ayodhya Nagar, Bhopal, Madhya Pradesh, India (PIN 462041). We serve clients across Bhopal, Indore, Jabalpur and the rest of India, plus international clients in the USA, Canada, UK, Australia and the UAE.",
    },
    hi: {
      q: "Socilet का ऑफ़िस कहाँ है और आप किन शहरों में सर्विस देते हैं?",
      a: "Socilet का ऑफ़िस अयोध्या नगर, भोपाल, मध्य प्रदेश (पिन 462041) में है। हम भोपाल, इंदौर, जबलपुर सहित पूरे भारत के क्लाइंट्स को सर्विस देते हैं, साथ ही USA, Canada, UK, Australia और UAE के इंटरनेशनल क्लाइंट्स को भी।",
    },
  },
  {
    en: {
      q: "What technologies do you use for development?",
      a: "For frontend we use React, Next.js, Vue.js and Angular. For backend we use Node.js, Python (FastAPI/Django) and PHP (Laravel/WordPress). For mobile apps we work with React Native, Flutter and native iOS/Android. We also offer AI integrations using Gemini and OpenAI models.",
    },
    hi: {
      q: "आप कौन-कौन सी टेक्नोलॉजीज़ इस्तेमाल करते हैं?",
      a: "Frontend में React, Next.js, Vue.js और Angular का उपयोग करते हैं। Backend में Node.js, Python (FastAPI/Django) और PHP (Laravel/WordPress)। मोबाइल ऐप्स के लिए React Native, Flutter और Native iOS/Android। साथ ही Gemini और OpenAI मॉडल्स के साथ AI इंटीग्रेशन भी देते हैं।",
    },
  },
  {
    en: {
      q: "How long does it take to complete a typical project?",
      a: "A standard business website takes 2–4 weeks. E-commerce stores take 4–8 weeks. Mobile apps typically take 2–6 months depending on complexity. AI spokesperson videos are delivered within 3–7 days. Every project starts with a detailed timeline shared during the free consultation.",
    },
    hi: {
      q: "एक प्रोजेक्ट पूरा होने में कितना समय लगता है?",
      a: "स्टैंडर्ड बिज़नेस वेबसाइट 2–4 हफ़्तों में बनती है। ई-कॉमर्स स्टोर 4–8 हफ़्तों में। मोबाइल ऐप्स 2–6 महीनों में (जटिलता पर निर्भर)। AI स्पोक्सपर्सन वीडियो 3–7 दिनों में डिलीवर होते हैं। हर प्रोजेक्ट से पहले डिटेल्ड टाइमलाइन शेयर की जाती है।",
    },
  },
  {
    en: {
      q: "Do you provide ongoing support and maintenance after delivery?",
      a: "Yes. Every project includes 30 days of free post-launch bug-fix support. After that we offer affordable monthly maintenance packages that cover hosting management, security updates, content updates, performance monitoring and feature additions.",
    },
    hi: {
      q: "क्या डिलीवरी के बाद सपोर्ट और मेंटेनेंस मिलती है?",
      a: "हाँ। हर प्रोजेक्ट के साथ 30 दिनों का फ्री बग-फ़िक्स सपोर्ट मिलता है। उसके बाद किफ़ायती मासिक मेंटेनेंस पैकेज उपलब्ध हैं जिनमें होस्टिंग मैनेजमेंट, सिक्योरिटी अपडेट्स, कंटेंट अपडेट्स, परफ़ॉर्मेंस मॉनिटरिंग और नए फ़ीचर्स कवर होते हैं।",
    },
  },
  {
    en: {
      q: "Who provides the domain and hosting for the project?",
      a: "Clients provide their own domain. For WordPress projects we include 1 year of free hosting. For React-based and custom projects, hosting is discussed during the proposal — we can either deploy on your hosting account or recommend cost-effective providers.",
    },
    hi: {
      q: "डोमेन और होस्टिंग कौन देता है?",
      a: "डोमेन क्लाइंट को ख़ुद लेना होता है। WordPress प्रोजेक्ट्स में 1 साल की फ्री होस्टिंग शामिल है। React और कस्टम प्रोजेक्ट्स के लिए होस्टिंग प्रपोज़ल में डिस्कस होती है — हम आपके अकाउंट पर डिप्लॉय कर सकते हैं या किफ़ायती प्रोवाइडर सजेस्ट करते हैं।",
    },
  },
  {
    en: {
      q: "How much does a website or app cost in India?",
      a: "A basic business website starts at ₹15,000. E-commerce websites start at ₹35,000. Custom React web apps typically range from ₹50,000 to ₹3,00,000. Mobile apps start at ₹60,000 and go up based on features. All pricing is in INR with transparent, fixed quotations.",
    },
    hi: {
      q: "वेबसाइट या ऐप बनवाने का कितना खर्च आता है?",
      a: "बेसिक बिज़नेस वेबसाइट ₹15,000 से शुरू। ई-कॉमर्स वेबसाइट ₹35,000 से। कस्टम React वेब ऐप्स ₹50,000 से ₹3,00,000 तक। मोबाइल ऐप्स ₹60,000 से शुरू (फ़ीचर्स के अनुसार)। सभी प्राइसिंग INR में और फ़िक्स्ड क्वोटेशन के साथ — कोई छुपा चार्ज नहीं।",
    },
  },
  {
    en: {
      q: "What happens if I am not satisfied with the delivered work?",
      a: "We work in iterative milestones with continuous client feedback. If you're not satisfied with any deliverable, we revise it free of charge until you approve. Final payment is only collected after written approval, which is the core promise of our zero advance model.",
    },
    hi: {
      q: "अगर डिलीवरी से संतुष्ट नहीं हुए तो क्या होगा?",
      a: "हम मील-स्टोन-वाइज़ काम करते हैं और हर स्टेज पर आपका फ़ीडबैक लेते हैं। अगर किसी डिलीवरेबल से आप संतुष्ट नहीं हैं तो हम बिना अतिरिक्त चार्ज के रिविज़न करते हैं जब तक आप अप्रूव न करें। फ़ाइनल पेमेंट केवल लिखित अप्रूवल के बाद ली जाती है — यही हमारे ज़ीरो एडवांस मॉडल की गारंटी है।",
    },
  },
  {
    en: {
      q: "How do I get started with Socilet?",
      a: "Contact us via the form on socilet.in, WhatsApp us at +91 93011 39140, or email contact@socilet.in. We respond within a few business hours, schedule a free consultation, and share a detailed proposal with timeline and pricing within 24–48 hours.",
    },
    hi: {
      q: "Socilet के साथ शुरुआत कैसे करें?",
      a: "socilet.in पर मौजूद कॉन्टैक्ट फ़ॉर्म भरें, WhatsApp +91 93011 39140 पर मैसेज करें, या contact@socilet.in पर ईमेल करें। हम कुछ बिज़नेस घंटों में रिप्लाई करते हैं, फ्री कंसल्टेशन शेड्यूल करते हैं और 24–48 घंटों में टाइमलाइन व प्राइसिंग के साथ डिटेल्ड प्रपोज़ल भेजते हैं।",
    },
  },
];

const FAQ = () => {
  const [lang, setLang] = useState<Lang>('en');

  // JSON-LD includes BOTH languages so search/LLM crawlers see Hindi + English Q&A
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: ["en-IN", "hi-IN"],
    mainEntity: faqs.flatMap((f) => [
      {
        "@type": "Question",
        inLanguage: "en-IN",
        name: f.en.q,
        acceptedAnswer: { "@type": "Answer", inLanguage: "en-IN", text: f.en.a },
      },
      {
        "@type": "Question",
        inLanguage: "hi-IN",
        name: f.hi.q,
        acceptedAnswer: { "@type": "Answer", inLanguage: "hi-IN", text: f.hi.a },
      },
    ]),
  };

  const t = (key: 'heading' | 'sub' | 'still' | 'cta' | 'helper' | 'inlineCta') => {
    const dict = {
      en: {
        heading: 'Frequently Asked Questions',
        sub: 'Clear answers about our services, pricing, timelines, and zero advance payment model.',
        still: 'Still have questions?',
        cta: 'Contact Us',
        helper: "Couldn't find what you were looking for? Reach out and we'll respond within a few hours.",
        inlineCta: 'Get a Free Consultation',
      },
      hi: {
        heading: 'अक्सर पूछे जाने वाले सवाल',
        sub: 'हमारी सर्विसेज़, प्राइसिंग, टाइमलाइन और ज़ीरो एडवांस पेमेंट मॉडल के बारे में स्पष्ट जवाब।',
        still: 'अभी भी कोई सवाल है?',
        cta: 'संपर्क करें',
        helper: 'अगर आपको जवाब नहीं मिला तो हमें संपर्क करें — हम कुछ घंटों में रिप्लाई करते हैं।',
        inlineCta: 'फ्री कंसल्टेशन बुक करें',
      },
    };
    return dict[lang][key];
  };

  return (
    <section id="faq" className="section-padding bg-white relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <motion.div
        className="absolute top-0 right-0 w-72 h-72 bg-primary-50 rounded-full filter blur-3xl opacity-20"
        animate={{ scale: [1, 1.1, 1], transition: { duration: 8, repeat: Infinity } }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-8"
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
          <h2 id="faq-heading" className="text-4xl font-bold mb-2">
            {t('heading')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full" />
          <p className="text-gray-600">{t('sub')}</p>
        </motion.div>

        {/* Language toggle */}
        <div className="flex justify-center mb-8">
          <div
            role="tablist"
            aria-label="FAQ language"
            className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-full border border-gray-200"
          >
            <Languages className="w-4 h-4 text-gray-500 ml-2 mr-1" />
            <button
              role="tab"
              aria-selected={lang === 'en'}
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                lang === 'en'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              English
            </button>
            <button
              role="tab"
              aria-selected={lang === 'hi'}
              onClick={() => setLang('hi')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                lang === 'hi'
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <motion.div
          className="max-w-3xl mx-auto space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          lang={lang === 'hi' ? 'hi' : 'en'}
        >
          {faqs.map((faq, index) => {
            const item = faq[lang];
            return (
              <details
                key={`${lang}-${index}`}
                open={index < 3}
                className="group border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-lg text-gray-900">
                  <span>{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed">
                  <p>{item.a}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/919301499921?text=${encodeURIComponent(
                        (lang === 'hi'
                          ? `नमस्ते Socilet, मेरा सवाल है: "${item.q}" — कृपया मुझे फ्री कंसल्टेशन दें।`
                          : `Hi Socilet, I have a question about: "${item.q}" — please share a free consultation.`)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600 transition-colors duration-300 shadow-sm"
                      aria-label={`${lang === 'hi' ? 'WhatsApp पर पूछें' : 'Ask on WhatsApp'} — ${item.q}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {lang === 'hi' ? 'WhatsApp पर पूछें' : 'Ask on WhatsApp'}
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700 transition-colors duration-300 shadow-sm"
                    >
                      {t('inlineCta')}
                    </a>
                  </div>
                </div>
              </details>
            );
          })}

          {/* Hidden mirror of the other language so crawlers / LLMs see both Q&A sets in raw HTML */}
          <div className="sr-only" aria-hidden="true">
            {faqs.map((faq, i) => {
              const other = lang === 'en' ? faq.hi : faq.en;
              return (
                <div key={`mirror-${i}`} lang={lang === 'en' ? 'hi' : 'en'}>
                  <h3>{other.q}</h3>
                  <p>{other.a}</p>
                </div>
              );
            })}
          </div>
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
          <h3 className="text-xl font-bold mb-3">{t('still')}</h3>
          <p className="text-gray-600 mb-5">{t('helper')}</p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors duration-300"
          >
            {t('cta')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
