import { defineType, defineField } from "sanity";

export default defineType({
  name: "navLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "href",
      title: "Href",
      type: "string",
      description: "Internal path (e.g. /services) or full URL (https://…)",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
