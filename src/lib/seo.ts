// src/lib/seo.ts
import type { Metadata } from "next";

function truncate(s?: string, n = 155) {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

export type BuildSeoArgs = {
  baseUrl: string;
  path?: string; // page path starting with /
  title?: string;
  description?: string;
  image?: string | null;
  canonical?: string | null;
  siteName?: string;
  defaultTitle?: string;
};

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
}: BuildSeoArgs): Metadata {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const desc = truncate(description) || ''

  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${normalizedBase}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : `${normalizedBase}${normalizedPath}`

  const resolvedTitle = title || defaultTitle || siteName || 'Local Business'
  const resolvedSiteName = siteName || resolvedTitle

  return {
    title: resolvedTitle,
    description: desc,
    openGraph: {
      title: resolvedTitle,
      description: desc,
      url: canonicalUrl,
      siteName: resolvedSiteName,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    alternates: { canonical: canonicalUrl },
    metadataBase: new URL(normalizedBase),
  }
}
