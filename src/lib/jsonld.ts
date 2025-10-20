// src/lib/jsonld.ts
export type LocalBusinessInput = {
  baseUrl: string;
  urlPath?: string;
  name: string;
  legalName?: string;
  telephone?: string;
  priceRange?: string;
  sameAs?: string[];
  image?: string | null;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: { latitude?: number; longitude?: number };
  openingHours?: Array<{
    dayOfWeek?: string[];
    opens?: string;
    closes?: string;
  }>;
};

export function buildLocalBusinessJsonLd(input: LocalBusinessInput) {
  const {
    baseUrl, urlPath = "/", name, legalName, telephone, priceRange,
    sameAs = [], image, address, geo, openingHours = [],
  } = input;

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;

  const obj: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    url,
    name,
  };

  if (legalName) obj.legalName = legalName;
  if (telephone) obj.telephone = telephone;
  if (priceRange) obj.priceRange = priceRange;
  if (image) obj.image = image;
  if (sameAs?.length) obj.sameAs = sameAs;

  if (address && Object.values(address).some(Boolean)) {
    obj.address = { "@type": "PostalAddress", ...address };
  }
  if (geo && (geo.latitude || geo.longitude)) {
    obj.geo = { "@type": "GeoCoordinates", ...geo };
  }
  if (openingHours?.length) {
    obj.openingHoursSpecification = openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    }));
  }

  return obj;
}
