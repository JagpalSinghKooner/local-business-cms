type Address = {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
};

type Geo = { latitude?: number; longitude?: number };

export type LocalBusinessInput = {
  baseUrl: string;              // e.g., https://www.buddsplumbing.com
  urlPath?: string;             // page path (e.g., /locations/cape-may-nj)
  name: string;
  legalName?: string;
  telephone?: string;
  priceRange?: string;
  sameAs?: string[];            // social URLs
  image?: string | null;        // logo or page image
  address?: Address;
  geo?: Geo;
  openingHours?: Array<{
    dayOfWeek?: string[];       // ["Monday","Tuesday"]
    opens?: string;             // "08:00"
    closes?: string;            // "17:00"
  }>;
};

export function buildLocalBusinessJsonLd(input: LocalBusinessInput) {
  const {
    baseUrl, urlPath = "/", name, legalName, telephone, priceRange,
    sameAs = [], image, address, geo, openingHours = [],
  } = input;

  const url = `${baseUrl.replace(/\/+$/, "")}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;

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
