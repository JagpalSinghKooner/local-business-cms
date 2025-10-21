"use client";

import Script from "next/script";

export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  if (!data) return null;
  
  // Handle both single schema and array of schemas
  const schemas = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`jsonld-${index}`}
          id={`jsonld-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
