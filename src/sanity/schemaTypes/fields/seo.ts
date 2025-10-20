import { defineField } from "sanity";

export const seoFields = [
  defineField({
    name: "metaTitle",
    title: "Meta Title",
    type: "string",
    description: "Title for search results (~60 chars).",
    validation: (Rule) => Rule.max(60).warning("Keep under ~60 chars"),
  }),
  defineField({
    name: "metaDescription",
    title: "Meta Description",
    type: "text",
    rows: 3,
    description: "Description for search results (~155 chars).",
    validation: (Rule) => Rule.max(160).warning("Keep under ~160 chars"),
  }),
  defineField({
    name: "ogImage",
    title: "Open Graph Image",
    type: "image",
    options: { hotspot: true },
    description: "1200×630 recommended.",
  }),
];
