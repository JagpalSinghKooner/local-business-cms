// src/lib/jsonld.ts

/**
 * Extract plain text from Portable Text blocks
 * Used for generating structured data descriptions from CMS content
 */
function extractTextFromPortableText(blocks?: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .filter(block => block._type === 'block')
    .map(block => {
      if (!block.children || !Array.isArray(block.children)) return "";
      return block.children
        .filter((child: any) => child._type === 'span' && typeof child.text === 'string')
        .map((child: any) => child.text)
        .join('');
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncate text to a specified length with ellipsis
 */
function truncate(s?: string, n = 155): string {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

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
 * Input for building serviceLocation JSON-LD structured data
 */
export type ServiceLocationJsonLdInput = {
  baseUrl: string;
  serviceLocation: {
    slug: string;
    service: {
      title: string;
      description?: any[]; // Portable Text
      category?: { title?: string };
    };
    location: {
      city: string;
      state?: string;
      zip?: string;
      coordinates?: { lat?: number; lng?: number };
    };
    intro?: any[]; // Portable Text
    sections?: any[]; // For detecting FAQ/Offer sections
  };
  businessName: string;
  businessPhone?: string;
  businessUrl?: string;
};

/**
 * Build JSON-LD structured data for serviceLocation pages
 *
 * Generates multiple schema types optimized for local service pages:
 * - Service schema (always included)
 * - LocalBusiness schema (if coordinates available)
 * - FAQPage schema (if FAQ section exists)
 * - Offer schema (if offers section exists)
 *
 * @example
 * ```ts
 * const schemas = buildServiceLocationJsonLd({
 *   baseUrl: "https://example.com",
 *   serviceLocation: {
 *     slug: "plumbing-toronto",
 *     service: { title: "Plumbing Services", category: { title: "Residential" } },
 *     location: { city: "Toronto", state: "ON", coordinates: { lat: 43.6532, lng: -79.3832 } },
 *     intro: portableTextBlocks,
 *     sections: [{ _type: 'sectionFaq', questions: [...] }],
 *   },
 *   businessName: "Budd's Plumbing",
 *   businessPhone: "+1-416-555-0123",
 *   businessUrl: "https://example.com",
 * });
 * // Returns array of schema objects
 * ```
 */
export function buildServiceLocationJsonLd(input: ServiceLocationJsonLdInput): Record<string, unknown>[] {
  const { baseUrl, serviceLocation, businessName, businessPhone, businessUrl } = input;
  const schemas: Record<string, unknown>[] = [];

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const urlPath = `/services/${serviceLocation.slug}`;
  const url = `${normalizedBase}${urlPath}`;

  // Extract description from intro Portable Text
  let description = "";
  if (serviceLocation.intro) {
    const extractedText = extractTextFromPortableText(serviceLocation.intro);
    description = truncate(extractedText, 155);
  }
  // Fallback to service description if no intro
  if (!description && serviceLocation.service.description) {
    const extractedText = extractTextFromPortableText(serviceLocation.service.description);
    description = truncate(extractedText, 155);
  }

  // 1. Service Schema (always include)
  const serviceSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name: `${serviceLocation.service.title} in ${serviceLocation.location.city}`,
  };

  if (description) {
    serviceSchema.description = description;
  }

  // Add areaServed
  const areaServed: string[] = [serviceLocation.location.city];
  if (serviceLocation.location.state) {
    areaServed.push(serviceLocation.location.state);
  }
  serviceSchema.areaServed = areaServed;

  // Add provider (business)
  const provider: Record<string, unknown> = {
    "@type": "Organization",
    name: businessName,
  };
  if (businessUrl) provider.url = businessUrl;
  if (businessPhone) provider.telephone = businessPhone;
  serviceSchema.provider = provider;

  // Add service type from category if available
  if (serviceLocation.service.category?.title) {
    serviceSchema.serviceType = serviceLocation.service.category.title;
  }

  schemas.push(serviceSchema);

  // 2. LocalBusiness Schema (if location has coordinates)
  if (serviceLocation.location.coordinates?.lat && serviceLocation.location.coordinates?.lng) {
    const localBusinessSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${url}#localbusiness`,
      url,
      name: businessName,
    };

    if (businessPhone) {
      localBusinessSchema.telephone = businessPhone;
    }

    // Add geo coordinates
    localBusinessSchema.geo = {
      "@type": "GeoCoordinates",
      latitude: serviceLocation.location.coordinates.lat,
      longitude: serviceLocation.location.coordinates.lng,
    };

    // Add address
    const address: Record<string, unknown> = {
      "@type": "PostalAddress",
      addressLocality: serviceLocation.location.city,
    };
    if (serviceLocation.location.state) {
      address.addressRegion = serviceLocation.location.state;
    }
    if (serviceLocation.location.zip) {
      address.postalCode = serviceLocation.location.zip;
    }
    localBusinessSchema.address = address;

    schemas.push(localBusinessSchema);
  }

  // 3. FAQPage Schema (if FAQ section exists)
  if (serviceLocation.sections && Array.isArray(serviceLocation.sections)) {
    const faqSection = serviceLocation.sections.find(
      (section: any) => section._type === 'sectionFaq'
    );

    if (faqSection && faqSection.questions && Array.isArray(faqSection.questions)) {
      const questions = faqSection.questions
        .filter((q: any) => q.question && q.answer)
        .map((q: any) => {
          // Extract text from answer if it's Portable Text
          let answerText = "";
          if (Array.isArray(q.answer)) {
            answerText = extractTextFromPortableText(q.answer);
          } else if (typeof q.answer === 'string') {
            answerText = q.answer;
          }

          return {
            question: q.question,
            answer: answerText,
          };
        })
        .filter((q: any) => q.answer); // Only include questions with valid answers

      if (questions.length > 0) {
        const faqSchema = buildFAQJsonLd({
          baseUrl,
          urlPath,
          questions,
        });
        schemas.push(faqSchema);
      }
    }
  }

  // 4. Offer Schema (if offers section exists)
  if (serviceLocation.sections && Array.isArray(serviceLocation.sections)) {
    const offersSection = serviceLocation.sections.find(
      (section: any) => section._type === 'sectionOffers'
    );

    if (offersSection && offersSection.offers && Array.isArray(offersSection.offers)) {
      // Process each offer that has a title
      offersSection.offers.forEach((offer: any, index: number) => {
        if (!offer.title) return;

        const offerInput: OfferInput = {
          baseUrl,
          urlPath: `${urlPath}#offer-${index}`,
          name: offer.title,
          businessName,
          businessUrl,
        };

        // Extract description from Portable Text if available
        if (offer.description && Array.isArray(offer.description)) {
          offerInput.description = truncate(extractTextFromPortableText(offer.description), 200);
        }

        // Add pricing if available
        if (offer.price) {
          offerInput.price = offer.price;
        }
        if (offer.currency) {
          offerInput.currency = offer.currency;
        }

        // Add validity dates if available
        if (offer.validFrom) {
          offerInput.validFrom = offer.validFrom;
        }
        if (offer.validThrough) {
          offerInput.validThrough = offer.validThrough;
        }

        // Add image if available
        if (offer.image?.asset?.url) {
          offerInput.image = offer.image.asset.url;
        }

        const offerSchema = buildOfferJsonLd(offerInput);
        schemas.push(offerSchema);
      });
    }
  }

  return schemas;
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
