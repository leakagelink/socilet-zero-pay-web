/**
 * Centralized JSON-LD schema builders for Socilet.
 *
 * Use these helpers from React pages (via <SEO> children) to keep structured
 * data consistent across the site. The Organization, WebSite and global
 * BreadcrumbList schemas live in `index.html` so crawlers/LLMs see them on
 * every prerendered route — these builders are for page-specific schemas.
 *
 * Reference IDs (so other schemas can `@id`-link to them):
 *   - Organization:   https://socilet.in/#organization
 *   - LocalBusiness:  https://socilet.in/#localbusiness
 *   - WebSite:        https://socilet.in/#website
 */

const SITE_URL = 'https://socilet.in';
const ORG_ID = `${SITE_URL}/#organization`;
const LOCAL_ID = `${SITE_URL}/#localbusiness`;
const LOGO_URL = `${SITE_URL}/socilet-logo.png`;

export const ORG_REF = { '@id': ORG_ID } as const;
export const LOCAL_REF = { '@id': LOCAL_ID } as const;

// ---------------------------------------------------------------------------
// LocalBusiness — used in index.html. Exported here so we can also reuse the
// shape from edge functions or sitemap generators if needed.
// ---------------------------------------------------------------------------
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': LOCAL_ID,
  name: 'Socilet',
  alternateName: 'Socilet Digital Services',
  url: SITE_URL,
  logo: LOGO_URL,
  image: `${SITE_URL}/og-image.png`,
  description:
    "India's first zero advance payment digital services company offering web development, mobile apps, AI spokesperson videos and Google My Business setup. Pay only after delivery.",
  telephone: '+91-93011-39140',
  email: 'contact@socilet.in',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ayodhya Nagar',
    addressLocality: 'Bhopal',
    addressRegion: 'Madhya Pradesh',
    postalCode: '462041',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.2599,
    longitude: 77.4126,
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'Canada' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'Australia' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  paymentAccepted: ['UPI', 'Bank Transfer', 'PayPal', 'Credit Card'],
  currenciesAccepted: 'INR, USD, CAD, GBP, AUD',
  parentOrganization: ORG_REF,
  sameAs: [
    'https://facebook.com/socilet',
    'https://twitter.com/socilet',
    'https://instagram.com/socilet',
    'https://linkedin.com/company/socilet',
  ],
} as const;

// ---------------------------------------------------------------------------
// BlogPosting — richer than Article; preferred by Google for blog rich results.
// ---------------------------------------------------------------------------
export interface BlogPostingInput {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  category?: string;
  keywords?: string;
  wordCount?: number;
  authorName?: string;
}

export const buildBlogPosting = (p: BlogPostingInput) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: p.title.slice(0, 110), // Google caps headline at ~110 chars
  description: p.description,
  image: {
    '@type': 'ImageObject',
    url: p.imageUrl,
    width: 1200,
    height: 630,
  },
  datePublished: p.datePublished,
  dateModified: p.dateModified || p.datePublished,
  inLanguage: 'en-IN',
  isAccessibleForFree: true,
  author: {
    '@type': 'Organization',
    name: p.authorName || 'Socilet',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Socilet',
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': p.url,
  },
  url: p.url,
  ...(p.category && { articleSection: p.category }),
  ...(p.keywords && { keywords: p.keywords }),
  ...(p.wordCount && { wordCount: p.wordCount }),
});

// ---------------------------------------------------------------------------
// FAQPage — for cases where we need to declare FAQs without rendering them
// via the <PageFAQ> component (e.g. homepage hero FAQ).
// ---------------------------------------------------------------------------
export interface FaqItem {
  question: string;
  answer: string;
}

export const buildFaqPage = (faqs: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

// ---------------------------------------------------------------------------
// BreadcrumbList helper
// ---------------------------------------------------------------------------
export const buildBreadcrumb = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});
