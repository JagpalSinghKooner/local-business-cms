import { defineField, defineType } from "sanity";

export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "from",
      title: "From Path",
      type: "string",
      description: "The path to redirect from (e.g., /old-page)",
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value) return "From path is required";
        if (!value.startsWith("/")) return "Path must start with /";
        if (value.includes(" ")) return "Path cannot contain spaces";
        return true;
      }),
    }),
    defineField({
      name: "to",
      title: "To URL",
      type: "string",
      description: "The URL to redirect to (can be internal or external)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "statusCode",
      title: "Status Code",
      type: "number",
      options: {
        list: [
          { title: "301 - Permanent Redirect", value: 301 },
          { title: "302 - Temporary Redirect", value: 302 },
          { title: "307 - Temporary Redirect (Preserve Method)", value: 307 },
          { title: "308 - Permanent Redirect (Preserve Method)", value: 308 },
        ],
      },
      initialValue: 301,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Whether this redirect is currently active",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
      description: "Internal notes about this redirect",
    }),
  ],
  preview: {
    select: {
      from: "from",
      to: "to",
      statusCode: "statusCode",
      isActive: "isActive",
    },
    prepare({ from, to, statusCode, isActive }) {
      return {
        title: `${from} → ${to}`,
        subtitle: `${statusCode} ${isActive ? "Active" : "Inactive"}`,
      };
    },
  },
  orderings: [
    {
      title: "From Path A-Z",
      name: "fromAsc",
      by: [{ field: "from", direction: "asc" }],
    },
    {
      title: "Status Code",
      name: "statusCode",
      by: [{ field: "statusCode", direction: "asc" }],
    },
  ],
});
