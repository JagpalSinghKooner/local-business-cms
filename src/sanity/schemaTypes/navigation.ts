import { defineType, defineField } from "sanity";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "header", title: "Header Links", type: "array", of: [{ type: "navLink" }] }),
    defineField({ name: "footer", title: "Footer Links", type: "array", of: [{ type: "navLink" }] }),
    defineField({ name: "utility", title: "Utility Links", type: "array", of: [{ type: "navLink" }] }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});
