import { defineField, defineType } from "sanity";

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
    name: "canonicalUrl",
    title: "Canonical URL",
    type: "url",
    description: "Override the canonical URL for this page. Leave empty to use the page URL.",
  }),
  defineField({
    name: "metaRobots",
    title: "Meta Robots",
    type: "object",
    fields: [
      defineField({
        name: "index",
        title: "Index",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "follow",
        title: "Follow",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "noarchive",
        title: "No Archive",
        type: "boolean",
        initialValue: false,
      }),
      defineField({
        name: "nosnippet",
        title: "No Snippet",
        type: "boolean",
        initialValue: false,
      }),
    ],
    options: {
      columns: 2,
    },
  }),
  defineField({
    name: "socialMedia",
    title: "Social Media",
    type: "object",
    fields: [
      defineField({
        name: "ogTitle",
        title: "Open Graph Title",
        type: "string",
        description: "Override title for social media sharing",
      }),
      defineField({
        name: "ogDescription",
        title: "Open Graph Description",
        type: "text",
        rows: 2,
        description: "Override description for social media sharing",
      }),
      defineField({
        name: "ogImage",
        title: "Open Graph Image",
        type: "image",
        options: { hotspot: true },
        description: "1200×630 recommended for social media sharing",
      }),
      defineField({
        name: "twitterTitle",
        title: "Twitter Title",
        type: "string",
        description: "Override title for Twitter sharing",
      }),
      defineField({
        name: "twitterDescription",
        title: "Twitter Description",
        type: "text",
        rows: 2,
        description: "Override description for Twitter sharing",
      }),
      defineField({
        name: "twitterImage",
        title: "Twitter Image",
        type: "image",
        options: { hotspot: true },
        description: "1200×630 recommended for Twitter sharing",
      }),
      defineField({
        name: "twitterCard",
        title: "Twitter Card Type",
        type: "string",
        options: {
          list: [
            { title: "Summary", value: "summary" },
            { title: "Summary Large Image", value: "summary_large_image" },
            { title: "App", value: "app" },
            { title: "Player", value: "player" },
          ],
        },
        initialValue: "summary_large_image",
      }),
    ],
  }),
  defineField({
    name: "structuredData",
    title: "Structured Data",
    type: "object",
    fields: [
      defineField({
        name: "enableLocalBusiness",
        title: "Enable Local Business Schema",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "enableFAQ",
        title: "Enable FAQ Schema",
        type: "boolean",
        initialValue: false,
      }),
      defineField({
        name: "enableOffer",
        title: "Enable Offer Schema",
        type: "boolean",
        initialValue: false,
      }),
      defineField({
        name: "enableService",
        title: "Enable Service Schema",
        type: "boolean",
        initialValue: false,
      }),
      defineField({
        name: "enableProduct",
        title: "Enable Product Schema",
        type: "boolean",
        initialValue: false,
      }),
      defineField({
        name: "customJsonLd",
        title: "Custom JSON-LD",
        type: "text",
        rows: 4,
        description: "Custom JSON-LD structured data (JSON format)",
        validation: (Rule) => Rule.custom((value) => {
          if (!value) return true;
          try {
            JSON.parse(value);
            return true;
          } catch {
            return "Must be valid JSON";
          }
        }),
      }),
    ],
  }),
  defineField({
    name: "hreflang",
    title: "Hreflang",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          defineField({
            name: "language",
            title: "Language",
            type: "string",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "url",
            title: "URL",
            type: "url",
            validation: (Rule) => Rule.required(),
          }),
        ],
      },
    ],
    description: "Language and URL pairs for international SEO",
  }),
  defineField({
    name: "customHeadScripts",
    title: "Custom Head Scripts",
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          defineField({
            name: "name",
            title: "Script Name",
            type: "string",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "script",
            title: "Script Content",
            type: "text",
            rows: 4,
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "position",
            title: "Position",
            type: "string",
            options: {
              list: [
                { title: "Head", value: "head" },
                { title: "Body Start", value: "body-start" },
                { title: "Body End", value: "body-end" },
              ],
            },
            initialValue: "head",
          }),
        ],
      },
    ],
    description: "Custom scripts to inject into the page head or body",
  }),
  defineField({
    name: "fallbackDescription",
    title: "Fallback Description Source",
    type: "string",
    options: {
      list: [
        { title: "Meta Description", value: "meta" },
        { title: "Page Content", value: "content" },
        { title: "Site Description", value: "site" },
      ],
    },
    initialValue: "meta",
    description: "Fallback source for description when meta description is empty",
  }),
  defineField({
    name: "imageOptimization",
    title: "Image Optimization",
    type: "object",
    fields: [
      defineField({
        name: "width",
        title: "Image Width",
        type: "number",
        description: "Default width for images on this page",
      }),
      defineField({
        name: "height",
        title: "Image Height",
        type: "number",
        description: "Default height for images on this page",
      }),
      defineField({
        name: "priority",
        title: "Priority Loading",
        type: "boolean",
        initialValue: false,
        description: "Load images with high priority",
      }),
      defineField({
        name: "loading",
        title: "Loading Strategy",
        type: "string",
        options: {
          list: [
            { title: "Lazy", value: "lazy" },
            { title: "Eager", value: "eager" },
          ],
        },
        initialValue: "lazy",
      }),
    ],
  }),
  defineField({
    name: "pagination",
    title: "Pagination",
    type: "object",
    fields: [
      defineField({
        name: "prevUrl",
        title: "Previous Page URL",
        type: "url",
        description: "URL for the previous page in a series",
      }),
      defineField({
        name: "nextUrl",
        title: "Next Page URL",
        type: "url",
        description: "URL for the next page in a series",
      }),
    ],
    description: "Pagination links for series of pages",
  }),
];
