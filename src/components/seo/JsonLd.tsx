"use client";

import Script from "next/script";

export default function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  return (
    <Script
      id="jsonld-localbusiness"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
