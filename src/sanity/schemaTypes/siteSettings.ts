import { defineType, defineField } from "sanity";
import { seoFields } from "./fields/seo";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General" },
    { name: "branding", title: "Branding" },
    { name: "local", title: "Local Business" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", type: "string", group: "general", validation: r => r.required() }),
    defineField({ name: "tagline", type: "string", group: "general" }),
    defineField({ name: "logo", type: "image", group: "branding", options: { hotspot: true } }),

    // LocalBusiness defaults (used site-wide or as base for locations)
    defineField({ name: "legalName", title: "Legal Name", type: "string", group: "local" }),
    defineField({ name: "telephone", title: "Primary Phone", type: "string", group: "local" }),
    defineField({ name: "priceRange", title: "Price Range", type: "string", description: "$ to $$$$", group: "local" }),
    defineField({ name: "sameAs", title: "SameAs (Social URLs)", type: "array", of: [{ type: "url" }], group: "local" }),
    defineField({
      name: "address",
      title: "Headquarters Address",
      type: "postalAddress",
      group: "local",
    }),
    defineField({
      name: "geo",
      title: "Geo",
      type: "object",
      group: "local",
      fields: [
        { name: "latitude", type: "number" },
        { name: "longitude", type: "number" },
      ],
    }),
    defineField({
      name: "openingHours",
      title: "Default Opening Hours",
      type: "array",
      of: [{ type: "openingHoursSpec" }],
      group: "local",
    }),

    ...seoFields.map(f => ({ ...f, group: "seo" })),
  ],
  preview: { select: { title: "name", subtitle: "tagline", media: "logo" } },
});
