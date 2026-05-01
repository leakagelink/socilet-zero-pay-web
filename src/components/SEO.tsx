import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  /** Path only (e.g. "/website-development") or full URL */
  canonical?: string;
  /** Absolute URL to the social share image (1200x630 recommended) */
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  keywords?: string;
  /** Extra raw children injected inside <Helmet> (e.g. JSON-LD scripts) */
  children?: React.ReactNode;
  /** Article-specific OG metadata */
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  /** Set true to discourage indexing (e.g. auth, admin pages) */
  noindex?: boolean;
}

const SITE_URL = 'https://socilet.in';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const SITE_NAME = 'Socilet';
const TWITTER_HANDLE = '@socilet';

const toAbsoluteUrl = (value?: string) => {
  if (!value) return SITE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  image,
  imageAlt,
  type = 'website',
  keywords,
  children,
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
}) => {
  const url = toAbsoluteUrl(canonical);
  const ogImage = toAbsoluteUrl(image || DEFAULT_IMAGE);
  const altText = imageAlt || title;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={altText} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_IN" />
      <meta property="og:locale:alternate" content="en_CA" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={altText} />

      {children}
    </Helmet>
  );
};

export default SEO;
