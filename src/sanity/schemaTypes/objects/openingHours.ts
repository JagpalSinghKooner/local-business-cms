import { defineType, defineField } from "sanity";

export default defineType({
  name: "openingHoursSpec",
  title: "Opening Hours Spec",
  type: "object",
  fields: [
    defineField({
      name: "dayOfWeek",
      title: "Day(s) of Week",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
        ],
      },
    }),
    defineField({ name: "opens", title: "Opens (HH:MM)", type: "string" }),
    defineField({ name: "closes", title: "Closes (HH:MM)", type: "string" }),
  ],
});
