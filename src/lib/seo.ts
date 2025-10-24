// src/lib/seo.ts
import type { Metadata } from "next";

function truncate(s?: string, n = 155) {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

/**
 * Extract plain text from Portable Text blocks
 * Used for generating meta descriptions from CMS content
 */
function extractTextFromPortableText(blocks?: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .filter(block => block._type === 'block')
    .map(block => {
      if (!block.children || !Array.isArray(block.children)) return "";
      return block.children
        .filter((child: any) => child._type === 'span' && typeof child.text === 'string')
        .map((child: any) => child.text)
        .join('');
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
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
  else directives.push("index");

  if (robots.follow === false) directives.push("nofollow");
  else directives.push("follow");

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

  const canonicalUrl: string = seo?.canonicalUrl || canonical
    ? (seo?.canonicalUrl || canonical)?.startsWith('http')
      ? (seo?.canonicalUrl || canonical)!
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
  const alternates: Record<string, string | Record<string, string>> = { canonical: canonicalUrl };
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
 * Arguments for building serviceLocation SEO metadata
 */
export type BuildServiceLocationSeoArgs = {
  baseUrl: string;
  serviceLocation: {
    slug: string;
    service: {
      title: string;
      heroImage?: { asset?: { url?: string } } | null;
    };
    location: {
      city: string;
    };
    intro?: any[]; // Portable Text blocks
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      canonicalUrl?: string;
      ogImage?: { asset?: { url?: string } };
      ogTitle?: string;
      ogDescription?: string;
      noIndex?: boolean;
      noFollow?: boolean;
    };
  };
  siteName: string;
  defaultOgImage?: string;
};

/**
 * Build SEO metadata for serviceLocation pages
 *
 * Generates optimized metadata for service+location combination pages with:
 * - Auto-generated titles: "{Service} in {City} | {Site Name}"
 * - Smart description extraction from intro content
 * - Cascading image selection (SEO override > service image > default)
 * - Proper canonical URL handling
 *
 * @example
 * ```ts
 * const metadata = buildSeoForServiceLocation({
 *   baseUrl: "https://example.com",
 *   serviceLocation: {
 *     slug: "plumbing-toronto",
 *     service: { title: "Plumbing Services" },
 *     location: { city: "Toronto" },
 *     intro: portableTextBlocks,
 *   },
 *   siteName: "Budd's Plumbing",
 * });
 * ```
 */
export function buildSeoForServiceLocation(args: BuildServiceLocationSeoArgs): Metadata {
  const { baseUrl, serviceLocation, siteName, defaultOgImage } = args;

  // Generate auto title: "Service in City | Site Name"
  const autoTitle = `${serviceLocation.service.title} in ${serviceLocation.location.city} | ${siteName}`;
  const title = serviceLocation.seo?.metaTitle || autoTitle;

  // Extract description from intro Portable Text or fallback to service title
  let description = serviceLocation.seo?.metaDescription;
  if (!description && serviceLocation.intro) {
    const extractedText = extractTextFromPortableText(serviceLocation.intro);
    description = truncate(extractedText, 155) || serviceLocation.service.title;
  }
  if (!description) {
    description = serviceLocation.service.title;
  }

  // Image priority: SEO override > service hero image > default
  let image: string | null = null;
  if (serviceLocation.seo?.ogImage?.asset?.url) {
    image = serviceLocation.seo.ogImage.asset.url;
  } else if (serviceLocation.service.heroImage?.asset?.url) {
    image = serviceLocation.service.heroImage.asset.url;
  } else if (defaultOgImage) {
    image = defaultOgImage;
  }

  // Canonical URL: custom or default to /services/{slug}
  const canonical = serviceLocation.seo?.canonicalUrl || `/services/${serviceLocation.slug}`;

  // Build robots directives
  const metaRobots: MetaRobots = {};
  if (serviceLocation.seo?.noIndex === true) {
    metaRobots.index = false;
  }
  if (serviceLocation.seo?.noFollow === true) {
    metaRobots.follow = false;
  }

  // Build social media overrides
  const socialMedia: SocialMedia = {};
  if (serviceLocation.seo?.ogTitle) {
    socialMedia.ogTitle = serviceLocation.seo.ogTitle;
  }
  if (serviceLocation.seo?.ogDescription) {
    socialMedia.ogDescription = serviceLocation.seo.ogDescription;
  }
  if (image) {
    socialMedia.ogImage = image;
  }

  // Map to BuildSeoArgs and use existing buildSeo function
  return buildSeo({
    baseUrl,
    path: `/services/${serviceLocation.slug}`,
    title,
    description,
    image,
    canonical,
    siteName,
    seo: {
      metaRobots: Object.keys(metaRobots).length > 0 ? metaRobots : undefined,
      socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
    },
  });
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
