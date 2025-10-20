import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "author", type: "string", validation: r => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "rating", type: "number", validation: r => r.min(1).max(5) }),
    defineField({ name: "quote", type: "text", validation: r => r.required() }),
  ],
  preview: { select: { title: "author", subtitle: "location" } },
});
