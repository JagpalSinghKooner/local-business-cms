// src/lib/seo.ts
import type { Metadata } from "next";

function truncate(s?: string, n = 155) {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

export type MetaRobots = {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
};

export type SocialMedia = {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
};

export type StructuredData = {
  enableLocalBusiness?: boolean;
  enableFAQ?: boolean;
  enableOffer?: boolean;
  enableService?: boolean;
  enableProduct?: boolean;
  customJsonLd?: string;
};

export type HreflangItem = {
  language: string;
  url: string;
};

export type CustomScript = {
  name: string;
  script: string;
  position: "head" | "body-start" | "body-end";
};

export type ImageOptimization = {
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
};

export type Pagination = {
  prevUrl?: string;
  nextUrl?: string;
};

export type SeoData = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  metaRobots?: MetaRobots;
  socialMedia?: SocialMedia;
  structuredData?: StructuredData;
  hreflang?: HreflangItem[];
  customHeadScripts?: CustomScript[];
  fallbackDescription?: "meta" | "content" | "site";
  imageOptimization?: ImageOptimization;
  pagination?: Pagination;
};

export type BuildSeoArgs = {
  baseUrl: string;
  path?: string; // page path starting with /
  title?: string;
  description?: string;
  image?: string | null;
  canonical?: string | null;
  siteName?: string;
  defaultTitle?: string;
  seo?: SeoData;
  content?: string; // page content for fallback description
};

/**
 * Build robots meta tag string from robots object
 */
function buildRobotsString(robots?: MetaRobots): string {
  if (!robots) return "index, follow";
  
  const directives: string[] = [];
  
  if (robots.index === false) directives.push("noindex");
  else if (robots.index !== false) directives.push("index");
  
  if (robots.follow === false) directives.push("nofollow");
  else if (robots.follow !== false) directives.push("follow");
  
  if (robots.noarchive) directives.push("noarchive");
  if (robots.nosnippet) directives.push("nosnippet");
  
  return directives.join(", ");
}

/**
 * Get fallback description based on fallback strategy
 */
function getFallbackDescription(
  metaDescription?: string,
  content?: string,
  siteDescription?: string,
  fallbackStrategy?: "meta" | "content" | "site"
): string {
  if (metaDescription) return metaDescription;
  
  switch (fallbackStrategy) {
    case "content":
      return content ? truncate(content, 155) : "";
    case "site":
      return siteDescription || "";
    default:
      return "";
  }
}

/**
 * Named export — import with:  import { buildSeo } from "@/lib/seo";
 */
export function buildSeo({
  baseUrl,
  path = '/',
  title,
  description,
  image,
  canonical,
  siteName,
  defaultTitle,
  seo,
  content,
}: BuildSeoArgs): Metadata {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // Use SEO data if available, otherwise fall back to basic fields
  const metaTitle = seo?.metaTitle || title;
  const metaDescription = getFallbackDescription(
    seo?.metaDescription || description,
    content,
    undefined, // site description would come from site settings
    seo?.fallbackDescription
  );
  
  const canonicalUrl = seo?.canonicalUrl || canonical
    ? (seo?.canonicalUrl || canonical)?.startsWith('http')
      ? (seo?.canonicalUrl || canonical)
      : `${normalizedBase}${(seo?.canonicalUrl || canonical)?.startsWith('/') ? (seo?.canonicalUrl || canonical) : `/${seo?.canonicalUrl || canonical}`}`
    : `${normalizedBase}${normalizedPath}`

  const resolvedTitle = metaTitle || defaultTitle || siteName || 'Local Business'
  const resolvedSiteName = siteName || resolvedTitle

  // Social media overrides
  const ogTitle = seo?.socialMedia?.ogTitle || resolvedTitle;
  const ogDescription = seo?.socialMedia?.ogDescription || metaDescription;
  const ogImage = seo?.socialMedia?.ogImage || image;
  
  const twitterTitle = seo?.socialMedia?.twitterTitle || ogTitle;
  const twitterDescription = seo?.socialMedia?.twitterDescription || ogDescription;
  const twitterImage = seo?.socialMedia?.twitterImage || ogImage;
  const twitterCard = seo?.socialMedia?.twitterCard || "summary_large_image";

  // Build hreflang alternates
  const alternates: Record<string, string> = { canonical: canonicalUrl };
  if (seo?.hreflang?.length) {
    alternates.languages = Object.fromEntries(
      seo.hreflang.map(item => [item.language, item.url])
    );
  }

  // Add pagination links
  if (seo?.pagination?.prevUrl) {
    alternates.prev = seo.pagination.prevUrl;
  }
  if (seo?.pagination?.nextUrl) {
    alternates.next = seo.pagination.nextUrl;
  }

  const metadata: Metadata = {
    title: resolvedTitle,
    description: metaDescription,
    robots: buildRobotsString(seo?.metaRobots),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: resolvedSiteName,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : [],
    },
    alternates,
    metadataBase: new URL(normalizedBase),
  };

  return metadata;
}

/**
 * Build custom scripts for injection into page
 */
export function buildCustomScripts(scripts?: CustomScript[]): Array<{ name: string; script: string; position: string }> {
  if (!scripts?.length) return [];
  
  return scripts.map(script => ({
    name: script.name,
    script: script.script,
    position: script.position,
  }));
}
