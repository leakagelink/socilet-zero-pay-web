import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CreditCard, Users, HelpCircle, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageFAQ, { type PageFaq } from '@/components/PageFAQ';

const paymentRelatedFaqs: PageFaq[] = [
  {
    question: "Do I need to pay any advance for WordPress projects?",
    answer:
      "No. For WordPress projects, you don't pay any advance. You only pay 100% after the project is completely delivered and you're satisfied with the work. This is the core of our zero advance payment model.",
    questionHi: "क्या WordPress प्रोजेक्ट्स के लिए कोई एडवांस देना पड़ता है?",
    answerHi:
      "नहीं। WordPress प्रोजेक्ट्स के लिए कोई एडवांस नहीं देना पड़ता। आप 100% पेमेंट तभी करते हैं जब प्रोजेक्ट पूरी तरह डिलीवर हो जाए और आप उससे संतुष्ट हों। यही हमारे ज़ीरो एडवांस पेमेंट मॉडल का मूल है।",
  },
  {
    question: "What payment structure do you follow for React-based projects?",
    answer:
      "For React and custom development projects, we ask for a 45% milestone payment when 30% of the work is completed. The remaining balance is due upon successful project completion. Final pricing depends on requirements and complexity.",
    questionHi: "React आधारित प्रोजेक्ट्स के लिए पेमेंट स्ट्रक्चर क्या है?",
    answerHi:
      "React और कस्टम डेवलपमेंट प्रोजेक्ट्स में 30% काम पूरा होने पर 45% मील-स्टोन पेमेंट ली जाती है। बाकी राशि प्रोजेक्ट पूरा होने पर देय होती है। फ़ाइनल प्राइसिंग आवश्यकताओं और जटिलता पर निर्भर करती है।",
  },
  {
    question: "Do I need to provide my own domain?",
    answer:
      "Yes. Clients provide their own domain so they retain full ownership of their web presence. We can help you purchase one if needed.",
    questionHi: "क्या मुझे अपना डोमेन खुद देना होगा?",
    answerHi:
      "हाँ। डोमेन क्लाइंट खुद लेते हैं ताकि उनकी वेब उपस्थिति पूरी तरह उनकी मालकियत में रहे। ज़रूरत हो तो डोमेन ख़रीदने में हम सहायता करते हैं।",
  },
  {
    question: "Do you provide hosting services?",
    answer:
      "We include 1 year of free hosting with every WordPress project. For React and custom apps, hosting options are discussed during the proposal — we can deploy to your account or recommend cost-effective providers.",
    questionHi: "क्या आप होस्टिंग सर्विस देते हैं?",
    answerHi:
      "हर WordPress प्रोजेक्ट के साथ 1 साल की फ्री होस्टिंग शामिल है। React और कस्टम ऐप्स के लिए होस्टिंग प्रपोज़ल में डिस्कस होती है — हम आपके अकाउंट पर डिप्लॉय कर सकते हैं या किफ़ायती प्रोवाइडर सजेस्ट करते हैं।",
  },
  {
    question: "When do I make the final payment?",
    answer:
      "For WordPress projects, the full 100% is paid only after project completion and your written approval. For React projects, the remaining balance (after the 45% milestone) is due on completion.",
    questionHi: "फ़ाइनल पेमेंट कब करनी होती है?",
    answerHi:
      "WordPress प्रोजेक्ट्स में 100% पेमेंट प्रोजेक्ट पूरा होने और आपके लिखित अप्रूवल के बाद ली जाती है। React प्रोजेक्ट्स में 45% मील-स्टोन के बाद बाकी राशि प्रोजेक्ट पूरा होने पर देय होती है।",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No. Every charge is itemised in the project proposal before work begins. There are no setup fees, no hidden taxes beyond statutory GST, and no surprise invoices.",
    questionHi: "क्या कोई हिडन चार्ज होते हैं?",
    answerHi:
      "नहीं। हर चार्ज प्रोजेक्ट शुरू होने से पहले प्रपोज़ल में स्पष्ट लिखा होता है। न कोई सेटअप फ़ी, न कोई छुपा टैक्स (केवल वैधानिक GST), न कोई सरप्राइज़ इनवॉइस।",
  },
];

const affiliateProgramFaqs: PageFaq[] = [
  {
    question: "How does Socilet's affiliate program work?",
    answer:
      "You receive a unique referral link from your affiliate dashboard. Share it with anyone who needs digital services — when they sign up and the project is completed, you earn a commission automatically tracked in your account.",
    questionHi: "Socilet का एफ़िलिएट प्रोग्राम कैसे काम करता है?",
    answerHi:
      "आपको एफ़िलिएट डैशबोर्ड से एक यूनीक रेफ़रल लिंक मिलती है। उसे किसी भी व्यक्ति के साथ शेयर करें जिसे डिजिटल सर्विसेज़ चाहिए — जब वो साइन-अप करके प्रोजेक्ट पूरा कराते हैं, तो आपके अकाउंट में कमीशन ऑटोमैटिकली ट्रैक हो जाता है।",
  },
  {
    question: "When do I receive my affiliate commission?",
    answer:
      "Commissions are released 21 days after the referred project is marked completed. This buffer ensures the client is fully satisfied and protects both sides from refunds or disputes.",
    questionHi: "एफ़िलिएट कमीशन कब मिलता है?",
    answerHi:
      "रेफ़र किया गया प्रोजेक्ट पूरा होने के 21 दिन बाद कमीशन रिलीज़ होता है। यह बफ़र पीरियड क्लाइंट संतुष्टि सुनिश्चित करता है और रिफंड या डिस्प्यूट से दोनों पक्षों की सुरक्षा करता है।",
  },
  {
    question: "Is there a minimum payout threshold?",
    answer:
      "Yes — the minimum withdrawable balance is ₹500. Once you reach it, you can request a payout to your bank account or UPI ID directly from the affiliate dashboard.",
    questionHi: "क्या कोई मिनिमम पेआउट लिमिट है?",
    answerHi:
      "हाँ — न्यूनतम विदड्रॉ करने योग्य राशि ₹500 है। यह राशि पूरी होते ही आप एफ़िलिएट डैशबोर्ड से सीधे अपने बैंक अकाउंट या UPI ID पर पेआउट रिक्वेस्ट कर सकते हैं।",
  },
  {
    question: "How much commission do I earn per referral?",
    answer:
      "You earn 10% of the total project value for every successfully completed referral. Commissions are calculated on the final invoice amount, excluding GST.",
    questionHi: "हर रेफ़रल पर कितना कमीशन मिलता है?",
    answerHi:
      "हर सफलतापूर्वक पूरे हुए रेफ़रल पर आप कुल प्रोजेक्ट वैल्यू का 10% कमीशन कमाते हैं। कमीशन फ़ाइनल इनवॉइस अमाउंट पर (GST को छोड़कर) कैलकुलेट होता है।",
  },
];

const generalFaqs: PageFaq[] = [
  {
    question: "What digital services does Socilet offer?",
    answer:
      "We offer website development, mobile app development, AI spokesperson video creation, SEO services, Google Ads management, social media marketing, and business profile (Google My Business) listing — all available under the zero advance payment model.",
    questionHi: "Socilet कौन-कौन सी डिजिटल सर्विसेज़ देती है?",
    answerHi:
      "हम वेबसाइट डेवलपमेंट, मोबाइल ऐप डेवलपमेंट, AI स्पोक्सपर्सन वीडियो, SEO, Google Ads मैनेजमेंट, सोशल मीडिया मार्केटिंग और Google Business Profile (GMB) लिस्टिंग सर्विसेज़ देते हैं — सभी ज़ीरो एडवांस पेमेंट मॉडल पर उपलब्ध हैं।",
  },
  {
    question: "What technologies do you use?",
    answer:
      "Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Supabase, Python, PHP/Laravel, WordPress. Mobile: React Native, Flutter, native iOS/Android. Hosting: Vercel, AWS, DigitalOcean, Cloudflare.",
    questionHi: "आप कौन-कौन सी टेक्नोलॉजीज़ इस्तेमाल करते हैं?",
    answerHi:
      "Frontend: React, Next.js, TypeScript, Tailwind CSS। Backend: Node.js, Supabase, Python, PHP/Laravel, WordPress। मोबाइल: React Native, Flutter, Native iOS/Android। होस्टिंग: Vercel, AWS, DigitalOcean, Cloudflare।",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "Standard business websites take 2–4 weeks. E-commerce stores take 4–8 weeks. Mobile apps typically take 2–6 months depending on scope. AI spokesperson videos are delivered in 3–7 days.",
    questionHi: "एक प्रोजेक्ट पूरा होने में कितना समय लगता है?",
    answerHi:
      "स्टैंडर्ड बिज़नेस वेबसाइट 2–4 हफ़्तों में बनती है। ई-कॉमर्स स्टोर 4–8 हफ़्तों में। मोबाइल ऐप्स 2–6 महीनों में (स्कोप पर निर्भर)। AI स्पोक्सपर्सन वीडियो 3–7 दिनों में डिलीवर होते हैं।",
  },
  {
    question: "Do you provide ongoing support after delivery?",
    answer:
      "Yes — every project includes 1 month of free post-launch support for bug fixes. After that we offer affordable monthly maintenance packages covering hosting, security, content updates and feature additions.",
    questionHi: "क्या डिलीवरी के बाद सपोर्ट मिलती है?",
    answerHi:
      "हाँ — हर प्रोजेक्ट के साथ 1 महीने का फ्री पोस्ट-लॉन्च बग-फ़िक्स सपोर्ट मिलता है। उसके बाद किफ़ायती मासिक मेंटेनेंस पैकेज उपलब्ध हैं जिनमें होस्टिंग, सिक्योरिटी, कंटेंट अपडेट्स और नए फ़ीचर्स शामिल हैं।",
  },
  {
    question: "Where is Socilet located?",
    answer:
      "Socilet is based in Ayodhya Nagar, Bhopal, Madhya Pradesh, India (PIN 462041). We serve clients across India and internationally in the USA, Canada, UK, Australia and the UAE.",
    questionHi: "Socilet का ऑफ़िस कहाँ है?",
    answerHi:
      "Socilet का ऑफ़िस अयोध्या नगर, भोपाल, मध्य प्रदेश (पिन 462041) में है। हम पूरे भारत के साथ-साथ USA, Canada, UK, Australia और UAE के क्लाइंट्स को भी सर्विस देते हैं।",
  },
  {
    question: "How do I get started?",
    answer:
      "Reach out via the contact form on socilet.in, WhatsApp +91 93011 39140, or email contact@socilet.in. We'll schedule a free consultation and share a detailed proposal within 24–48 hours.",
    questionHi: "Socilet के साथ शुरुआत कैसे करें?",
    answerHi:
      "socilet.in के कॉन्टैक्ट फ़ॉर्म से संपर्क करें, WhatsApp +91 93011 39140 पर मैसेज करें, या contact@socilet.in पर ईमेल करें। हम फ्री कंसल्टेशन शेड्यूल करेंगे और 24–48 घंटों में डिटेल्ड प्रपोज़ल भेजेंगे।",
  },
];

const FaqPage: React.FC = () => {
  // Page-level breadcrumb only — each PageFAQ section emits its own FAQPage JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://socilet.in' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://socilet.in/faq' },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>FAQ in English & Hindi — Pricing, Zero Advance, Affiliate | Socilet</title>
        <meta
          name="description"
          content="Bilingual FAQs (English + हिन्दी) about Socilet's zero advance payment model, WordPress & React pricing, project timelines, hosting, support and the 10% affiliate commission program."
        />
        <link rel="canonical" href="https://socilet.in/faq" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-8 bg-gradient-to-b from-gray-50 to-white">
        <section className="container mx-auto px-4 py-12">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions{' '}
              <span lang="hi" className="block text-2xl md:text-3xl mt-2 text-primary-600">
                अक्सर पूछे जाने वाले सवाल
              </span>
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full" />
            <p className="text-gray-600 text-lg">
              Available in English &amp; हिन्दी — switch language inside each section.
            </p>
          </motion.div>
        </section>
      </main>

      <PageFAQ
        title="Payment & Billing"
        titleHi="पेमेंट और बिलिंग"
        subtitle="How our zero advance and milestone payments work."
        subtitleHi="ज़ीरो एडवांस और मील-स्टोन पेमेंट कैसे काम करते हैं।"
        faqs={paymentRelatedFaqs}
        className="bg-white"
      />

      <PageFAQ
        title="Affiliate Program"
        titleHi="एफ़िलिएट प्रोग्राम"
        subtitle="Earn 10% commission on every successful referral."
        subtitleHi="हर सफल रेफ़रल पर 10% कमीशन कमाएँ।"
        faqs={affiliateProgramFaqs}
        className="bg-gray-50"
      />

      <PageFAQ
        title="General Questions"
        titleHi="सामान्य प्रश्न"
        subtitle="Services, technologies, timelines and getting started."
        subtitleHi="सर्विसेज़, टेक्नोलॉजी, टाइमलाइन और शुरुआत कैसे करें।"
        faqs={generalFaqs}
        className="bg-white"
      />

      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 md:p-8 rounded-xl text-center border border-primary-100">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Still have questions?</h3>
            <p className="text-gray-600 mb-2">
              Reach out and our team will respond within a few business hours.
            </p>
            <p lang="hi" className="text-gray-600 mb-5">
              अभी भी सवाल हैं? हमें संपर्क करें — हम कुछ घंटों में रिप्लाई करते हैं।
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors duration-300"
            >
              Contact Us / संपर्क करें
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default FaqPage;
