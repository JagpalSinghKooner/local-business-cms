import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanity } from "@/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.buddsplumbing.com").replace(/\/+$/, "");
  const now = new Date();

  const q = groq`{
    "services":  *[_type=="service"  && defined(slug.current)]{ "slug": slug.current },
    "locations": *[_type=="location" && defined(slug.current)]{ "slug": slug.current }
  }`;

  const { services = [], locations = [] } = await sanity.fetch(q, {}, { perspective: "published" });

  const urls: MetadataRoute.Sitemap = [
    { url: `${base}`,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/services`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/locations`,     lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];

  // /services/[service]
  for (const s of services) {
    urls.push({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // /locations/[city]
  for (const l of locations) {
    urls.push({
      url: `${base}/locations/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // /[service]-[city]
  for (const s of services) {
    for (const l of locations) {
      urls.push({
        url: `${base}/${s.slug}-${l.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return urls;
}
