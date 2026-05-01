import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronDown, HelpCircle, Languages } from 'lucide-react';

export type PageFaq = {
  question: string;
  answer: string;
  /** Optional Hindi translation. When provided, a language toggle is rendered. */
  questionHi?: string;
  answerHi?: string;
};

interface PageFAQProps {
  title: string;
  subtitle?: string;
  /** Optional Hindi heading shown when Hindi is selected */
  titleHi?: string;
  subtitleHi?: string;
  faqs: PageFaq[];
  defaultOpenCount?: number;
  className?: string;
}

type Lang = 'en' | 'hi';

const PageFAQ: React.FC<PageFAQProps> = ({
  title,
  subtitle,
  titleHi,
  subtitleHi,
  faqs,
  defaultOpenCount = 3,
  className = 'bg-gray-50',
}) => {
  const hasHindi = faqs.some((f) => f.questionHi && f.answerHi);
  const [lang, setLang] = useState<Lang>('en');

  if (!faqs?.length) return null;

  // Build JSON-LD with both languages when available — best for SEO + LLMs
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: hasHindi ? ['en-IN', 'hi-IN'] : ['en-IN'],
    mainEntity: faqs.flatMap((f) => {
      const en = {
        '@type': 'Question',
        inLanguage: 'en-IN',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', inLanguage: 'en-IN', text: f.answer },
      };
      if (f.questionHi && f.answerHi) {
        return [
          en,
          {
            '@type': 'Question',
            inLanguage: 'hi-IN',
            name: f.questionHi,
            acceptedAnswer: { '@type': 'Answer', inLanguage: 'hi-IN', text: f.answerHi },
          },
        ];
      }
      return [en];
    }),
  };

  const displayedTitle = lang === 'hi' && titleHi ? titleHi : title;
  const displayedSubtitle = lang === 'hi' && subtitleHi ? subtitleHi : subtitle;

  return (
    <section aria-labelledby="page-faq-heading" className={`py-16 ${className}`}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h2
            id="page-faq-heading"
            className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"
          >
            {displayedTitle}
          </h2>
          {displayedSubtitle && <p className="text-gray-600">{displayedSubtitle}</p>}
        </div>

        {hasHindi && (
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
                  lang === 'en' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
              <button
                role="tab"
                aria-selected={lang === 'hi'}
                onClick={() => setLang('hi')}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                  lang === 'hi' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-3" lang={lang === 'hi' ? 'hi' : 'en'}>
          {faqs.map((faq, index) => {
            const q = lang === 'hi' && faq.questionHi ? faq.questionHi : faq.question;
            const a = lang === 'hi' && faq.answerHi ? faq.answerHi : faq.answer;
            return (
              <details
                key={`${lang}-${index}`}
                open={index < defaultOpenCount}
                className="group border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-base md:text-lg text-gray-900">
                  <span>{q}</span>
                  <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed">
                  <p>{a}</p>
                </div>
              </details>
            );
          })}

          {/* Hidden mirror of the other language for crawlers/LLMs */}
          {hasHindi && (
            <div className="sr-only" aria-hidden="true">
              {faqs.map((faq, i) => {
                const other =
                  lang === 'en'
                    ? { q: faq.questionHi, a: faq.answerHi }
                    : { q: faq.question, a: faq.answer };
                if (!other.q || !other.a) return null;
                return (
                  <div key={`mirror-${i}`} lang={lang === 'en' ? 'hi' : 'en'}>
                    <h3>{other.q}</h3>
                    <p>{other.a}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageFAQ;
