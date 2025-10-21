import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanity } from "@/sanity/client";

type PageRecord = {
  slug?: string;
  updatedAt?: string;
};

type LocationSummary = {
  slug?: string;
  updatedAt?: string;
};

type ServiceSummaryWithLocations = {
  slug?: string;
  updatedAt?: string;
  locations?: LocationSummary[];
};

const now = new Date();

const sitemapQuery = groq`{
  "pages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(_updatedAt, _createdAt)
  },
  "services": *[_type == "service" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(_updatedAt, _createdAt),
    "locations": locations[]->{
      "slug": slug.current,
      "updatedAt": coalesce(_updatedAt, _createdAt)
    }
  },
  "locations": *[_type == "location" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": coalesce(_updatedAt, _createdAt)
  }
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.buddsplumbing.com").replace(/\/+$/, "");

  const { pages = [], services = [], locations = [] } = await sanity.fetch<{
    pages?: PageRecord[];
    services?: ServiceSummaryWithLocations[];
    locations?: LocationSummary[];
  }>(sitemapQuery, {}, { perspective: "published" });

  const urls: MetadataRoute.Sitemap = [
    { url: `${base}`,           lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/services`,  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/locations`, lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];

  for (const page of pages) {
    if (!page?.slug || page.slug === "home") continue;
    urls.push({
      url: `${base}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const service of services) {
    if (!service?.slug) continue;
    const lastModified = service.updatedAt ? new Date(service.updatedAt) : now;
    urls.push({
      url: `${base}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });

    if (Array.isArray(service.locations)) {
      for (const location of service.locations) {
        if (!location?.slug) continue;
        const locationUpdated = location.updatedAt ? new Date(location.updatedAt) : lastModified;
        urls.push({
          url: `${base}/services/${service.slug}-${location.slug}`,
          lastModified: locationUpdated > lastModified ? locationUpdated : lastModified,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  for (const location of locations) {
    if (!location?.slug) continue;
    urls.push({
      url: `${base}/locations/${location.slug}`,
      lastModified: location.updatedAt ? new Date(location.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return urls;
}
