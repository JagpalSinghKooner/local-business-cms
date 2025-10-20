import { defineType, defineField } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: r => r.required() }),
    defineField({ name: "answer", type: "array", of: [{ type: "block" }], validation: r => r.required() }),
    defineField({ name: "services", title: "Related Services", type: "array", of: [{ type: "reference", to: [{ type: "service" }] }] }),
  ],
  preview: { select: { title: "question" } },
});
