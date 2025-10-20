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
    header[]{label, href},
    utility[]{label, href},
    footer[]{label, href}
  },
  "tokens": *[_type == "tokens"][0]{
    primary,
    secondary,
    fontFamily,
    radius,
    containerWidth
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
  seo,
  locations[]->{
    city,
    "slug":slug.current
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
      _type == 'section.features' => items[]{ icon, title, body, linkLabel, linkHref },
      _type == 'section.steps' => items[]{ title, body },
      _type == 'section.stats' => items[]{ value, label },
      _type == 'section.logos' => items[]{
        name,
        url,
        logo{ asset->{ url } }
      }
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
    _key,
    _type,
    variant,
    eyebrow,
    heading,
    subheading,
    background,
    alignment,
    title,
    description,
    display,
    columns,
    style,
    formType,
    embedCode,
    externalLink,
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
      _type == 'section.features' => items[]{ icon, title, body, linkLabel, linkHref },
      _type == 'section.steps' => items[]{ title, body },
      _type == 'section.stats' => items[]{ value, label },
      _type == 'section.logos' => items[]{
        name,
        url,
        logo{
          asset->{ url }
        }
      }
    )
  },
  body,
  seo
}`
