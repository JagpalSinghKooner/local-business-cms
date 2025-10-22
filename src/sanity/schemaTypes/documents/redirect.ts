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
      description: "The path to redirect from. Supports wildcards (*) and regex patterns.",
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value) return "From path is required";
        if (!value.startsWith("/") && !value.startsWith("^")) return "Path must start with / or ^ (for regex)";
        if (value.includes(" ")) return "Path cannot contain spaces";

        // Validate regex if starts with ^
        if (value.startsWith("^")) {
          try {
            new RegExp(value);
          } catch {
            return "Invalid regex pattern";
          }
        }

        return true;
      }),
    }),
    defineField({
      name: "to",
      title: "To URL",
      type: "string",
      description: "The URL to redirect to. Use $1, $2 for wildcard/regex capture groups.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "matchType",
      title: "Match Type",
      type: "string",
      options: {
        list: [
          { title: "Exact", value: "exact" },
          { title: "Wildcard (*)", value: "wildcard" },
          { title: "Regex", value: "regex" },
        ],
        layout: "radio",
      },
      initialValue: "exact",
      description: "How to match the from path",
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
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description: "Lower numbers are checked first (default: 100). Use for ordering redirect rules.",
      initialValue: 100,
      validation: (Rule) => Rule.min(0).max(999),
    }),
    defineField({
      name: "validationWarnings",
      title: "Validation Warnings",
      type: "array",
      of: [{ type: "string" }],
      hidden: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      from: "from",
      to: "to",
      matchType: "matchType",
      statusCode: "statusCode",
      isActive: "isActive",
      warnings: "validationWarnings",
    },
    prepare({ from, to, matchType, statusCode, isActive, warnings }) {
      const warningIcon = warnings && warnings.length > 0 ? " ⚠️" : "";
      return {
        title: `${from} → ${to}${warningIcon}`,
        subtitle: `${matchType} | ${statusCode} | ${isActive ? "Active" : "Inactive"}`,
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
