import { defineType, defineField } from "sanity";

export default defineType({
  name: "tokens",
  title: "Brand Tokens",
  type: "document",
  fields: [
    defineField({ name: "primary", title: "Primary Color", type: "string", description: "e.g. #0ea5e9" }),
    defineField({ name: "secondary", title: "Secondary Color", type: "string" }),
    defineField({ name: "fontFamily", title: "Font Family", type: "string", description: "UI display font name" }),
    defineField({ name: "radius", title: "Border Radius", type: "string", description: "e.g. 12px" }),
    defineField({ name: "containerWidth", title: "Container Max Width", type: "string", description: "e.g. 1200px" }),
  ],
  preview: { prepare: () => ({ title: "Brand Tokens" }) },
});
