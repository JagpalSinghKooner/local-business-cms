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

export type FAQInput = {
  baseUrl: string;
  urlPath?: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

export type OfferInput = {
  baseUrl: string;
  urlPath?: string;
  name: string;
  description?: string;
  price?: string;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "LimitedAvailability";
  validFrom?: string;
  validThrough?: string;
  image?: string;
  businessName?: string;
  businessUrl?: string;
};

export type ServiceInput = {
  baseUrl: string;
  urlPath?: string;
  name: string;
  description?: string;
  provider?: {
    name: string;
    url?: string;
    telephone?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
  };
  areaServed?: string[];
  serviceType?: string;
  image?: string;
};

export type ProductInput = {
  baseUrl: string;
  urlPath?: string;
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  sku?: string;
  gtin?: string;
  price?: string;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "LimitedAvailability";
  condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
  category?: string;
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

export function buildFAQJsonLd(input: FAQInput) {
  const { baseUrl, urlPath = "/", questions } = input;
  
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function buildOfferJsonLd(input: OfferInput) {
  const {
    baseUrl, urlPath = "/", name, description, price, currency = "USD",
    availability = "InStock", validFrom, validThrough, image, businessName, businessUrl
  } = input;
  
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;

  const obj: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "@id": `${url}#offer`,
    url,
    name,
    availability: `https://schema.org/${availability}`,
  };

  if (description) obj.description = description;
  if (image) obj.image = image;
  if (price) {
    obj.price = price;
    obj.priceCurrency = currency;
  }
  if (validFrom) obj.validFrom = validFrom;
  if (validThrough) obj.validThrough = validThrough;
  if (businessName) {
    obj.seller = {
      "@type": "Organization",
      name: businessName,
      ...(businessUrl && { url: businessUrl }),
    };
  }

  return obj;
}

export function buildServiceJsonLd(input: ServiceInput) {
  const {
    baseUrl, urlPath = "/", name, description, provider, areaServed,
    serviceType, image
  } = input;
  
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;

  const obj: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name,
  };

  if (description) obj.description = description;
  if (image) obj.image = image;
  if (serviceType) obj.serviceType = serviceType;
  if (areaServed?.length) obj.areaServed = areaServed;
  
  if (provider) {
    const providerObj: Record<string, unknown> = {
      "@type": "Organization",
      name: provider.name,
    };
    
    if (provider.url) providerObj.url = provider.url;
    if (provider.telephone) providerObj.telephone = provider.telephone;
    if (provider.address && Object.values(provider.address).some(Boolean)) {
      providerObj.address = {
        "@type": "PostalAddress",
        ...provider.address,
      };
    }
    
    obj.provider = providerObj;
  }

  return obj;
}

export function buildProductJsonLd(input: ProductInput) {
  const {
    baseUrl, urlPath = "/", name, description, image, brand, sku, gtin,
    price, currency = "USD", availability = "InStock", condition = "NewCondition",
    category
  } = input;
  
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;

  const obj: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name,
    availability: `https://schema.org/${availability}`,
    condition: `https://schema.org/${condition}`,
  };

  if (description) obj.description = description;
  if (image) obj.image = image;
  if (brand) obj.brand = { "@type": "Brand", name: brand };
  if (sku) obj.sku = sku;
  if (gtin) obj.gtin = gtin;
  if (category) obj.category = category;
  
  if (price) {
    obj.offers = {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
    };
  }

  return obj;
}

/**
 * Build multiple JSON-LD schemas based on enabled types
 */
export function buildStructuredData(
  baseUrl: string,
  urlPath: string,
  enabledTypes: {
    localBusiness?: boolean;
    faq?: boolean;
    offer?: boolean;
    service?: boolean;
    product?: boolean;
  },
  data: {
    localBusiness?: LocalBusinessInput;
    faq?: FAQInput;
    offer?: OfferInput;
    service?: ServiceInput;
    product?: ProductInput;
  },
  customJsonLd?: string
): Array<Record<string, unknown>> {
  const schemas: Array<Record<string, unknown>> = [];

  if (enabledTypes.localBusiness && data.localBusiness) {
    schemas.push(buildLocalBusinessJsonLd(data.localBusiness));
  }

  if (enabledTypes.faq && data.faq) {
    schemas.push(buildFAQJsonLd(data.faq));
  }

  if (enabledTypes.offer && data.offer) {
    schemas.push(buildOfferJsonLd(data.offer));
  }

  if (enabledTypes.service && data.service) {
    schemas.push(buildServiceJsonLd(data.service));
  }

  if (enabledTypes.product && data.product) {
    schemas.push(buildProductJsonLd(data.product));
  }

  if (customJsonLd) {
    try {
      const customSchema = JSON.parse(customJsonLd);
      schemas.push(customSchema);
    } catch (error) {
      console.warn("Invalid custom JSON-LD:", error);
    }
  }

  return schemas;
}
