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
      name: "link",
      title: "Destination",
      type: "link",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "label", linkType: "link.linkType", internalPath: "link.internalPath", href: "link.href" },
    prepare({ title, linkType, internalPath, href }) {
      const subtitle = linkType === 'external' ? href : internalPath
      return { title, subtitle }
    },
  },
});
