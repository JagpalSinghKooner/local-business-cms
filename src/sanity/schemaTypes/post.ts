import { defineType, defineField } from "sanity";
import { seoFields } from "./fields/seo";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required(), group: "content" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required(), group: "content" }),
    defineField({ name: "author", type: "string", group: "content" }),
    defineField({ name: "date", type: "datetime", group: "content" }),
    defineField({ name: "categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }], group: "content" }),
    defineField({ name: "hero", type: "image", options: { hotspot: true }, group: "content" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }], group: "content" }),
    ...seoFields.map(f => ({ ...f, group: "seo" })),
  ],
  preview: { select: { title: "title", subtitle: "slug.current", media: "hero" } },
});
