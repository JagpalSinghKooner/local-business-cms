// src/lib/seo.ts
import type { Metadata } from "next";

function truncate(s?: string, n = 155) {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

export type BuildSeoArgs = {
  baseUrl: string;
  path?: string;       // page path starting with / (we'll normalize)
  title?: string;
  description?: string;
  image?: string | null;
};

/**
 * Named export — import with:  import { buildSeo } from "@/lib/seo";
 */
export function buildSeo({
  baseUrl,
  path = "/",
  title,
  description,
  image,
}: BuildSeoArgs): Metadata {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${normalizedBase}${normalizedPath}`;
  const desc = truncate(description) || "";

  return {
    title: title || "Budds Plumbing",
    description: desc,
    openGraph: {
      title: title || "Budds Plumbing",
      description: desc,
      url,
      siteName: "Budds Plumbing",
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      type: "website",
    },
    alternates: { canonical: url },
    metadataBase: new URL(normalizedBase),
  };
}
