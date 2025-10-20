import { defineType, defineField } from "sanity";
import { seoFields } from "./fields/seo";

export default defineType({
  name: "offer",
  title: "Offer / Coupon",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required(), group: "content" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required(), group: "content" }),
    defineField({ name: "summary", type: "text", group: "content" }),
    defineField({ name: "validFrom", type: "date", group: "content" }),
    defineField({ name: "validTo", type: "date", group: "content" }),
    ...seoFields.map(f => ({ ...f, group: "seo" })),
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
});
