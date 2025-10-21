import { groq } from 'next-sanity'

export const globalSettingsQ = groq`{
  "site": *[_type == "siteSettings"][0]{
    name,
    tagline,
    legalName,
    domain,
    phone,
    email,
    contactCta,
    primaryColor,
    secondaryColor,
    fontHeading,
    fontBody,
    hours,
    social[],
    sameAs,
    metaTitle,
    metaDescription,
    ogImage{
      asset->{
        url,
        metadata{ lqip, dimensions{ width, height } }
      }
    },
    twitterHandle,
    robots,
    googleTagManagerId,
    googleAnalyticsId,
    metaPixelId,
    trackingScripts[],
    address,
    businessType,
    serviceAreas,
    priceRange,
    geo
  },
  "navigation": *[_type == "navigation"][0]{
    header[]{
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    },
    utility[]{
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    },
    footer[]{
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    }
  },
  "pages": *[_type == "page" && defined(slug.current)]{
    title,
    "slug": slug.current
  },
  "tokens": *[_type == "tokens"][0]{
    primary,
    onPrimary,
    secondary,
    onSecondary,
    surface,
    surfaceMuted,
    surfaceStrong,
    textStrong,
    textMuted,
    textInverted,
    borderColor,
    fontBody,
    fontHeading,
    typographyScale[]{
      token,
      fontSize,
      lineHeight,
      fontWeight
    },
    spacingScale[]{
      token,
      value
    },
    containerWidth,
    radiusScale[]{
      token,
      value
    },
    shadowScale[]{
      token,
      value
    },
    buttonStyles[]{
      token,
      label,
      background,
      text,
      border,
      hoverBackground,
      hoverText,
      shadow
    }
  },
  "services": *[_type == "service" && defined(slug.current)] | order(title asc){
    title,
    "slug": slug.current,
    "intro": coalesce(body[0..1], []),
    "category": category->{
      title,
      "slug": slug.current
    },
    "heroImage": heroImage{
      alt,
      asset->{
        url,
        metadata{ lqip, dimensions{ width, height } }
      }
    }
  },
  "locations": *[_type == "location" && defined(slug.current)] | order(city asc){
    city,
    "slug": slug.current,
    "intro": coalesce(intro, [])
  }
}`

export const servicesQ = groq`*[_type == "service" && defined(slug.current)]|order(title asc){
  title,
  "slug": slug.current,
  "intro": coalesce(body[0..1], []),
  heroImage{
    alt,
    asset->{
      url,
      metadata{ lqip, dimensions{ width, height } }
    }
  },
  seo
}`

export const servicesListQ = groq`*[_type == "service" && defined(slug.current)]|order(title asc){
  title,
  "slug": slug.current,
  "intro": coalesce(body[0..1], []),
  "category": category->{
    title,
    "slug": slug.current
  },
  heroImage{
    alt,
    asset->{
      url,
      metadata{ lqip, dimensions{ width, height } }
    }
  }
}`

export const offersListQ = groq`*[_type == "offer" && defined(slug.current)]|order(validTo desc){
  title,
  summary,
  "slug": slug.current,
  validFrom,
  validTo
}`

export const serviceBySlugQ = groq`*[_type=="service" && slug.current==$slug][0]{
  title,
  "slug":slug.current,
  "intro": coalesce(body[0..1], []),
  "category": category->{
    title,
    "slug": slug.current
  },
  heroImage{
    alt,
    asset->{
      url,
      metadata{ lqip, dimensions{ width, height } }
    }
  },
  body,
  breadcrumbs{
    mode,
    currentLabel,
    manualItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    },
    additionalItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    }
  },
  displayOptions,
  seo,
  locations[]->{
    city,
    "slug":slug.current
  },
  scriptOverrides[]{
    scriptKey,
    enabled
  },
  sections[]{
    ...,
    "media": media{
      ...,
      "image": select(
        defined(image) => {
          alt,
          asset->{
            url,
            metadata{ lqip, dimensions{ width, height } }
          }
        },
        null
      )
    },
    "servicesSelected": select(_type == 'section.services' => services[]->{
      _id,
      title,
      "intro": coalesce(body[0..1], []),
      "slug": slug.current,
      heroImage{
        alt,
        asset->{
          url,
          metadata{ lqip, dimensions{ width, height } }
        }
      },
      seo
    }),
    "servicesCategory": select(_type == 'section.services' => category->{
      title,
      "slug": slug.current
    }),
    "locationsSelected": select(_type == 'section.locations' => locations[]->{
      _id,
      city,
      "slug": slug.current,
      intro
    }),
    "testimonialsSelected": select(_type == 'section.testimonials' => testimonials[]->{
      _id,
      author,
      quote,
      role,
      location,
      rating
    }),
    "faqsSelected": select(_type == 'section.faq' => faqs[]->{
      _id,
      question,
      answer
    }),
    "offersSelected": select(_type == 'section.offers' => offers[]->{
      _id,
      title,
      summary,
      "slug": slug.current,
      validFrom,
      validTo
    }),
    ctas[]{
      ...
    },
    "items": select(
      _type == 'section.features' => items[]{
        icon,
        title,
        body,
        linkLabel,
        "link": link
      },
      _type == 'section.steps' => items[]{ title, body },
      _type == 'section.stats' => items[]{ value, label },
      _type == 'section.logos' => items[]{
        name,
        url,
        logo{ asset->{ url } }
      },
      _type == 'section.timeline' => items[]{
        title,
        subheading,
        summary,
        date,
        "link": link,
        media{
          ...,
          image{
            alt,
            asset->{
              url,
              metadata{ lqip, dimensions{ width, height } }
            }
          }
        }
      }
    ),
    "plans": select(_type == 'section.pricingTable' => plans[]{
      title,
      tagline,
      price,
      frequency,
      description,
      features,
      isFeatured,
      cta
    }),
    "images": select(_type == 'section.gallery' => images[]{
      _key,
      caption,
      image{
        alt,
        asset->{
          url,
          metadata{ lqip, dimensions{ width, height } }
        }
      }
    }),
    "postsResolved": select(
      _type == 'section.blogList' => select(
        sourceMode == 'selected' => posts[]->{
          title,
          "slug": slug.current,
          "excerpt": coalesce(pt::text(body[0]), ''),
          "coverImage": hero.asset->url,
          "author": author,
          "publishedAt": date
        },
        sourceMode == 'category' => *[_type == "post" && references(^.category._ref)] | order(date desc){
          title,
          "slug": slug.current,
          "excerpt": coalesce(pt::text(body[0]), ''),
          "coverImage": hero.asset->url,
          "author": author,
          "publishedAt": date
        },
        true => *[_type == "post"] | order(date desc){
          title,
          "slug": slug.current,
          "excerpt": coalesce(pt::text(body[0]), ''),
          "coverImage": hero.asset->url,
          "author": author,
          "publishedAt": date
        }
      )
    )
  }
}`

export const locationBySlugQ = groq`*[_type=="location" && slug.current==$slug][0]{
  city,
  "slug":slug.current,
  "intro": coalesce(intro, []),
  gallery[]{
    image{
      alt,
      asset->{
        url,
        metadata{ lqip, dimensions{ width, height } }
      }
    },
    alt
  },
  map,
  breadcrumbs{
    mode,
    currentLabel,
    manualItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    },
    additionalItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    }
  },
  services[]->{
    title,
    "slug":slug.current,
    "intro": coalesce(body[0..1], []),
    heroImage{
      alt,
      asset->{
        url,
        metadata{ lqip, dimensions{ width, height } }
      }
    },
    category->{
      title,
      "slug": slug.current
    }
  },
  displayOptions,
  seo
}`

export const locationsListQ = groq`*[_type == "location" && defined(slug.current)]|order(city asc){
  city,
  "slug": slug.current,
  "intro": coalesce(intro, [])
}`

export const pageBySlugQ = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  sections[]{
    ...,
    "media": media{
      ...,
      "image": select(
        defined(image) => {
          alt,
          asset->{
            url,
            metadata{ lqip, dimensions{ width, height } }
          }
        },
        null
      )
    },
    "servicesSelected": services[]->{
      _id,
      title,
      "intro": coalesce(body[0..1], []),
      "slug": slug.current,
      heroImage{
        alt,
        asset->{
          url,
          metadata{ lqip, dimensions{ width, height } }
        }
      },
      seo
    },
    "servicesCategory": category->{
      title,
      "slug": slug.current
    },
    "locationsSelected": locations[]->{
      _id,
      city,
      "slug": slug.current,
      intro
    },
    "testimonialsSelected": testimonials[]->{
      _id,
      author,
      quote,
      role,
      location,
      rating
    },
    "faqsSelected": faqs[]->{
      _id,
      question,
      answer
    },
    "offersSelected": offers[]->{
      _id,
      title,
      summary,
      "slug": slug.current,
      validFrom,
      validTo
    },
    ctas[]{
      ...
    },
    "items": select(
      _type == 'section.features' => items[]{
        icon,
        title,
        body,
        linkLabel,
        "link": link
      },
      _type == 'section.steps' => items[]{ title, body },
      _type == 'section.stats' => items[]{ value, label },
      _type == 'section.logos' => items[]{
        name,
        url,
        logo{
          asset->{ url }
        }
      },
      _type == 'section.timeline' => items[]{
        title,
        subheading,
        summary,
        date,
        "link": link,
        media{
          ...,
          image{
            alt,
            asset->{
              url,
              metadata{ lqip, dimensions{ width, height } }
            }
          }
        }
      }
    ),
    "plans": select(_type == 'section.pricingTable' => plans[]{
      title,
      tagline,
      price,
      frequency,
      description,
      features,
      isFeatured,
      cta
    }),
    "images": select(_type == 'section.gallery' => images[]{
      _key,
      caption,
      image{
        alt,
        asset->{
          url,
          metadata{ lqip, dimensions{ width, height } }
        }
      }
    }),
    "postsResolved": select(
      _type == 'section.blogList' => select(
        sourceMode == 'selected' => posts[]->{
          title,
          "slug": slug.current,
          "excerpt": coalesce(pt::text(body[0]), ''),
          "coverImage": hero.asset->url,
          "author": author,
          "publishedAt": date
        },
        sourceMode == 'category' => *[_type == "post" && references(^.category._ref)] | order(date desc){
          title,
          "slug": slug.current,
          "excerpt": coalesce(pt::text(body[0]), ''),
          "coverImage": hero.asset->url,
          "author": author,
          "publishedAt": date
        },
        true => *[_type == "post"] | order(date desc){
          title,
          "slug": slug.current,
          "excerpt": coalesce(pt::text(body[0]), ''),
          "coverImage": hero.asset->url,
          "author": author,
          "publishedAt": date
        }
      )
    )
  },
  scriptOverrides[]{
    scriptKey,
    enabled
  },
  body,
  breadcrumbs{
    mode,
    currentLabel,
    manualItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    },
    additionalItems[]{
      _key,
      label,
      link{
        linkType,
        internalPath,
        href,
        openInNewTab
      }
    }
  },
  seo
}`
