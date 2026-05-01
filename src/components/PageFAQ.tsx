import React from 'react';
import { Helmet } from 'react-helmet';
import { ChevronDown, HelpCircle } from 'lucide-react';

export type PageFaq = { question: string; answer: string };

interface PageFAQProps {
  /** Section heading (e.g. "Website Development FAQs") */
  title: string;
  /** Optional intro line shown under the heading */
  subtitle?: string;
  /** FAQs to render — also serialised into FAQPage JSON-LD */
  faqs: PageFaq[];
  /** How many items to render open by default for snippet/LLM visibility */
  defaultOpenCount?: number;
  /** Background tailwind classes for the section */
  className?: string;
}

/**
 * Reusable FAQ section for service / pricing pages.
 * Uses native <details> so answers are visible in the DOM (not behind JS),
 * adds Schema.org microdata, and injects FAQPage JSON-LD via react-helmet.
 */
const PageFAQ: React.FC<PageFAQProps> = ({
  title,
  subtitle,
  faqs,
  defaultOpenCount = 3,
  className = 'bg-gray-50',
}) => {
  if (!faqs?.length) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section
      aria-labelledby="page-faq-heading"
      className={`py-16 ${className}`}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex justify-center mb-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h2
            id="page-faq-heading"
            className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"
          >
            {title}
          </h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              open={index < defaultOpenCount}
              className="group border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow [&_summary::-webkit-details-marker]:hidden"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-base md:text-lg text-gray-900">
                <span itemProp="name">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div
                className="px-5 pb-5 text-gray-700 leading-relaxed"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p itemProp="text">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PageFAQ;
