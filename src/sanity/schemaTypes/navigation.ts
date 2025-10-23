import { defineType, defineField } from "sanity";

/**
 * Navigation Configuration (Site-Specific)
 *
 * Multi-tenant note: With the Multiple Datasets architecture, each site
 * automatically has its own navigation document. No additional configuration needed.
 *
 * Each dataset maintains a single navigation document with header, footer, and utility links.
 */
export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  description: "Configure site navigation menus. Each site (dataset) has its own navigation configuration.",
  fields: [
    defineField({
      name: "header",
      title: "Header Links",
      type: "array",
      of: [{ type: "navLink" }],
      description: "Main navigation links displayed in the header. Services and Locations are added automatically."
    }),
    defineField({
      name: "footer",
      title: "Footer Links",
      type: "array",
      of: [{ type: "navLink" }],
      description: "Links displayed in the footer navigation."
    }),
    defineField({
      name: "utility",
      title: "Utility Links",
      type: "array",
      of: [{ type: "navLink" }],
      description: "Utility links (e.g., Privacy Policy, Terms of Service) typically displayed in footer or header utility bar."
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Navigation",
      subtitle: "Site Navigation Configuration"
    })
  },
});
