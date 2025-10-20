import { defineType, defineField } from "sanity";

export default defineType({
  name: "serviceCategory",
  title: "Service Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
