import { defineType, defineField } from "sanity";
import { seoFields } from "./fields/seo";

export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required(), group: "content" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required(), group: "content" }),
    defineField({ name: "location", type: "string", group: "content" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }], group: "content" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }], group: "content" }),
    ...seoFields.map(f => ({ ...f, group: "seo" })),
  ],
  preview: { select: { title: "title", subtitle: "location", media: "gallery.0" } },
});
