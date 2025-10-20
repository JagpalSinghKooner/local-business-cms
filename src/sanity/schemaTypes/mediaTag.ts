import { defineType, defineField } from "sanity";

export default defineType({
  name: "mediaTag",
  title: "Media Tag",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
  ],
  preview: { select: { title: "title" } },
});
