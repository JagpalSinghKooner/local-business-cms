import { defineType, defineField } from "sanity";

export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "local", title: "Local Business" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "city", type: "string", group: "content", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "city" }, group: "content", validation: r => r.required() }),
    defineField({ name: "intro", type: "array", of: [{ type: "block" }], group: "content" }),

    defineField({
      name: "services",
      title: "Related Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      group: "content",
    }),

    // Local overrides
    defineField({ name: "telephone", title: "Local Phone", type: "string", group: "local" }),
    defineField({ name: "address", title: "Address", type: "postalAddress", group: "local" }),
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
      title: "Opening Hours",
      type: "array",
      of: [{ type: "openingHoursSpec" }],
      group: "local",
    }),

    defineField({ name: "seo", type: "seoUnified", group: "seo" }),
  ],
  preview: { select: { title: "city", subtitle: "slug.current" } },
});
