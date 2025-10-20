import { defineType, defineField } from "sanity";

export default defineType({
  name: "redirects",            // keep plural if you've already referenced it
  title: "Redirects",
  type: "document",
  fields: [
    defineField({
      name: "from",
      title: "From (legacy path)",
      type: "string",
      description: "Path only, starting with /. Example: /old-page (no domain, no query, no hash).",
      validation: (Rule) =>
        Rule.required().custom((v) => {
          if (typeof v !== "string" || !v.trim()) return "Required";
          if (!v.startsWith("/")) return 'Must start with "/"';
          if (v.includes("://")) return "Do not include the domain";
          if (v.includes("?") || v.includes("#")) return "Do not include query strings or hash";
          return true;
        }),
    }),
    defineField({
      name: "to",
      title: "To (destination)",
      type: "string",
      description: "New path (e.g. /new-page) or full URL (https://example.com/new-page).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "HTTP Status",
      type: "number",
      initialValue: 301,
      options: {
        list: [
          { title: "301 (Permanent)", value: 301 },
          { title: "302 (Found / Temporary)", value: 302 },
          { title: "307 (Temporary Redirect)", value: 307 },
          { title: "308 (Permanent Redirect)", value: 308 },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().integer().min(301).max(308),
    }),
  ],
  preview: {
    select: { title: "from", subtitle: "to" },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
});
