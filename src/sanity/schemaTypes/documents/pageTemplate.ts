import { defineArrayMember, defineField, defineType } from 'sanity'

const key = () => Math.random().toString(36).slice(2, 10)

const block = (text: string) => [
  {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: key(),
        text,
        marks: [],
      },
    ],
  },
]

const cta = (label: string, path: string, style: 'primary' | 'secondary' | 'outline' | 'link' = 'primary') => ({
  _type: 'cta',
  _key: key(),
  label,
  style,
  link: {
    _type: 'link',
    linkType: 'internal',
    internalPath: path,
    openInNewTab: false,
  },
})

const breadcrumbItem = (label: string, path: string) => ({
  _type: 'breadcrumb.item',
  _key: key(),
  label,
  link: {
    _type: 'link',
    linkType: 'internal',
    internalPath: path,
    openInNewTab: false,
  },
})

const heroSection = ({
  heading,
  subheading,
  eyebrow,
  variant = 'split',
  ctas,
}: {
  heading: string
  subheading?: string
  eyebrow?: string
  variant?: 'split' | 'centered' | 'background'
  ctas?: ReturnType<typeof cta>[]
}) => ({
  _type: 'section.hero',
  _key: key(),
  heading,
  subheading,
  eyebrow,
  variant,
  ctas,
})

const textSection = ({
  eyebrow,
  heading,
  body,
  alignment = 'left',
}: {
  eyebrow?: string
  heading?: string
  body: string
  alignment?: 'left' | 'center'
}) => ({
  _type: 'section.text',
  _key: key(),
  eyebrow,
  heading,
  body: block(body),
  alignment,
})

const featuresSection = ({
  title,
  description,
  items,
  eyebrow,
}: {
  title: string
  description?: string
  eyebrow?: string
  items: Array<{ title: string; body: string; icon?: string }>
}) => ({
  _type: 'section.features',
  _key: key(),
  eyebrow,
  title,
  description,
  columns: 3,
  items: items.map((item) => ({
    _key: key(),
    _type: 'object',
    title: item.title,
    icon: item.icon,
    body: block(item.body),
  })),
})

const stepsSection = ({
  title,
  description,
  steps,
}: {
  title: string
  description?: string
  steps: Array<{ title: string; body: string }>
}) => ({
  _type: 'section.steps',
  _key: key(),
  title,
  description,
  items: steps.map((step) => ({
    _key: key(),
    _type: 'object',
    title: step.title,
    body: block(step.body),
  })),
})

const servicesSection = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => ({
  _type: 'section.services',
  _key: key(),
  title,
  description,
  display: 'all',
  columns: 3,
})

const locationsSection = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => ({
  _type: 'section.locations',
  _key: key(),
  title,
  description,
  columns: 3,
})

const ctaSection = ({
  heading,
  body,
  buttons,
  background = 'brand',
}: {
  heading: string
  body?: string
  buttons: ReturnType<typeof cta>[]
  background?: 'brand' | 'dark' | 'light'
}) => ({
  _type: 'section.cta',
  _key: key(),
  heading,
  body,
  background,
  ctas: buttons,
})

const statsSection = ({
  eyebrow,
  title,
  stats,
}: {
  eyebrow?: string
  title: string
  stats: Array<{ label: string; value: string }>
}) => ({
  _type: 'section.stats',
  _key: key(),
  eyebrow,
  title,
  items: stats.map((stat) => ({
    _key: key(),
    _type: 'object',
    label: stat.label,
    value: stat.value,
  })),
})

const faqSection = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => ({
  _type: 'section.faq',
  _key: key(),
  title,
  description,
  faqs: [
    { _type: 'reference', _key: key(), _ref: 'template-faq-1', _weak: true },
    { _type: 'reference', _key: key(), _ref: 'template-faq-2', _weak: true },
  ],
  display: 'accordion',
})

const testimonialsSection = ({
  title,
  description,
}: {
  title: string
  description?: string
}) => ({
  _type: 'section.testimonials',
  _key: key(),
  title,
  description,
  testimonials: [
    { _type: 'reference', _key: key(), _ref: 'template-testimonial-1', _weak: true },
    { _type: 'reference', _key: key(), _ref: 'template-testimonial-2', _weak: true },
  ],
  style: 'grid',
})

const blogListSection = ({
  heading,
  body,
}: {
  heading: string
  body?: string
}) => ({
  _type: 'section.blogList',
  _key: key(),
  heading,
  body,
  sourceMode: 'latest',
  limit: 3,
  layoutMode: 'cards',
  showAuthor: true,
  showPublishedDate: true,
})

const templateOptions = [
  { title: 'Home', value: 'home' },
  { title: 'Services index', value: 'servicesIndex' },
  { title: 'Service detail', value: 'serviceDetail' },
  { title: 'Locations index', value: 'locationsIndex' },
  { title: 'Location detail', value: 'locationDetail' },
  { title: 'Offers index', value: 'offersIndex' },
  { title: 'Offer detail', value: 'offerDetail' },
  { title: 'Blog list', value: 'blogList' },
  { title: 'Blog article', value: 'blogArticle' },
  { title: 'Generic page', value: 'genericPage' },
] as const

type PageTemplateType = (typeof templateOptions)[number]['value']

type TemplateDefinition = {
  templateName: string
  pageTitle: string
  slug: string
  description?: string
  sections: () => Record<string, unknown>[]
  body?: () => Record<string, unknown>[]
  breadcrumbs?: Record<string, unknown>
}

const templates: Record<PageTemplateType, TemplateDefinition> = {
  home: {
    templateName: 'Home layout',
    pageTitle: 'Welcome to our local service team',
    slug: 'home',
    description: 'Hero + feature highlights + services overview + CTA banner.',
    sections: () => [
      heroSection({
        eyebrow: 'Trusted locally',
        heading: 'Expert home services without the hassle',
        subheading: 'Use this hero to communicate your value proposition. Update the CTAs to match your primary conversion goal.',
        ctas: [cta('Book service', '/contact'), cta('View services', '/services', 'outline')],
      }),
      featuresSection({
        eyebrow: 'Why choose us',
        title: 'Built for busy homeowners',
        description: 'Replace the copy in each feature card with the differentiators that matter most to your audience.',
        items: [
          { title: 'Licensed technicians', body: 'Highlight professional credentials and the experience customers can expect.' },
          { title: 'Upfront pricing', body: 'Explain your pricing philosophy or guarantees to reduce friction.' },
          { title: 'Rapid scheduling', body: 'Show how quickly your team can respond with clear next steps.' },
        ],
      }),
      servicesSection({
        title: 'Signature services',
        description: 'Curate category landing pages in the CMS and they will appear here automatically.',
      }),
      testimonialsSection({
        title: 'Customers love working with us',
        description: 'Replace placeholder testimonials with real social proof from your service area.',
      }),
      ctaSection({
        heading: 'Ready to schedule your next visit?',
        body: 'Use this CTA banner to drive bookings or consultations.',
        buttons: [cta('Start a booking', '/contact'), cta('Call our team', '/contact', 'outline')],
      }),
    ],
  },
  servicesIndex: {
    templateName: 'Services index layout',
    pageTitle: 'Our services',
    slug: 'services',
    description: 'Hero + service overview + booking CTA.',
    sections: () => [
      heroSection({
        heading: 'Services built around your property',
        subheading: 'Use the intro copy to explain how your team approaches service packages.',
        ctas: [cta('Request a quote', '/contact')],
      }),
      textSection({
        eyebrow: 'How it works',
        heading: 'A simple process from first call to final inspection',
        body: 'Outline the high-level steps so prospects know what to expect before reaching out.',
      }),
      servicesSection({
        title: 'Explore our most requested services',
        description: 'Each card links to a detailed CMS-driven service page.',
      }),
      ctaSection({
        heading: 'Need help choosing the right service?',
        body: 'Direct visitors to your intake or scheduling workflow.',
        buttons: [cta('Talk to a specialist', '/contact')],
      }),
    ],
    breadcrumbs: {
      mode: 'auto',
    },
  },
  serviceDetail: {
    templateName: 'Service detail layout',
    pageTitle: 'Service title',
    slug: 'services/sample-service',
    description: 'Detail page with hero, proof points, process, FAQs, and CTA.',
    sections: () => [
      heroSection({
        eyebrow: 'Service spotlight',
        heading: 'Service name',
        subheading: 'Use the hero subheading for a concise elevator pitch.',
        ctas: [cta('Schedule service', '/contact'), cta('View pricing', '/offers', 'outline')],
      }),
      textSection({
        heading: 'Why this service matters',
        body: 'Summarise outcomes, materials, and the problems this service solves for customers.',
      }),
      stepsSection({
        title: 'Our proven process',
        description: 'Reassure visitors with a transparent breakdown of your workflow.',
        steps: [
          { title: 'Assess the project', body: 'Explain what happens during the initial consultation or site visit.' },
          { title: 'Complete the work', body: 'Describe how your technicians execute with minimal disruption.' },
          { title: 'Follow-up & warranty', body: 'Share the post-service support customers can expect.' },
        ],
      }),
      statsSection({
        eyebrow: 'By the numbers',
        title: 'Confidence-building proof points',
        stats: [
          { label: 'Response time', value: '< 24hrs' },
          { label: 'Projects completed', value: '1,200+' },
          { label: 'Customer rating', value: '4.9/5' },
        ],
      }),
      faqSection({
        title: 'Common questions',
        description: 'Link FAQs authored in the CMS to answer objections for this specific service.',
      }),
      ctaSection({
        heading: 'Book this service today',
        body: 'Wrap up the page with a clear next action.',
        buttons: [cta('Book now', '/contact')],
      }),
    ],
    breadcrumbs: {
      mode: 'auto',
      additionalItems: [breadcrumbItem('Services', '/services')],
    },
  },
  locationsIndex: {
    templateName: 'Locations index layout',
    pageTitle: 'Service areas',
    slug: 'locations',
    description: 'Overview of all locations with localised CTA.',
    sections: () => [
      heroSection({
        heading: 'Serving communities across the region',
        subheading: 'Introduce your locations strategy and highlight what makes each area unique.',
        ctas: [cta('Find your location', '/locations')],
      }),
      locationsSection({
        title: 'Explore nearby service areas',
        description: 'Locations are auto-populated from CMS entries.',
      }),
      textSection({
        heading: 'Can’t find your city?',
        body: 'Use this space to mention upcoming launches or how to request service outside your core footprint.',
        alignment: 'center',
      }),
      ctaSection({
        heading: 'Talk with our dispatch team',
        body: 'Direct visitors to the scheduling channel that works best for your operations.',
        buttons: [cta('Contact dispatch', '/contact')],
      }),
    ],
    breadcrumbs: {
      mode: 'auto',
    },
  },
  locationDetail: {
    templateName: 'Location detail layout',
    pageTitle: 'City service area',
    slug: 'locations/sample-city',
    description: 'Localised page with hero, neighbourhood insights, services, and CTA.',
    sections: () => [
      heroSection({
        heading: 'Service area name',
        subheading: 'Use this hero to reinforce your local expertise and response times.',
        ctas: [cta('Request local service', '/contact')],
      }),
      textSection({
        heading: 'Local insights',
        body: 'Share knowledge about the neighbourhood, common repairs, or seasonal considerations.',
      }),
      servicesSection({
        title: 'Popular services in this area',
        description: 'Highlight services most relevant to this location.',
      }),
      stepsSection({
        title: 'How scheduling works here',
        steps: [
          { title: 'Book online or call', body: 'Ensure customers know how to reach your local team.' },
          { title: 'Confirm visit window', body: 'Outline expectations for arrival times or coordination.' },
        ],
      }),
      ctaSection({
        heading: 'Ready for fast local support?',
        buttons: [cta('Book a visit', '/contact')],
      }),
    ],
    breadcrumbs: {
      mode: 'auto',
      additionalItems: [breadcrumbItem('Locations', '/locations')],
    },
  },
  offersIndex: {
    templateName: 'Offers index layout',
    pageTitle: 'Current promotions',
    slug: 'offers',
    description: 'Promo overview with urgency messaging and CTA.',
    sections: () => [
      heroSection({
        heading: 'Seasonal savings & promotions',
        subheading: 'Use the hero to explain eligibility and timelines so visitors understand how to claim an offer.',
        ctas: [cta('Submit a request', '/contact')],
      }),
      textSection({
        heading: 'How to redeem offers',
        body: 'Provide instructions or terms so customers know what to prepare before booking.',
      }),
      ctaSection({
        heading: 'Have a direct question about pricing?',
        buttons: [cta('Talk to sales', '/contact'), cta('Call now', '/contact', 'outline')],
      }),
    ],
    breadcrumbs: {
      mode: 'auto',
    },
  },
  offerDetail: {
    templateName: 'Offer detail layout',
    pageTitle: 'Offer title',
    slug: 'offers/sample-offer',
    description: 'Detail page for a single promotion.',
    sections: () => [
      heroSection({
        heading: 'Limited-time offer headline',
        subheading: 'Describe eligibility details, timelines, or bundle requirements here.',
        ctas: [cta('Claim this offer', '/contact')],
      }),
      textSection({
        heading: 'Why customers love this offer',
        body: 'Explain the benefits and remind visitors how the offer complements your core services.',
      }),
      ctaSection({
        heading: 'Lock in your savings',
        buttons: [cta('Schedule with discount', '/contact')],
      }),
    ],
    body: () => [
      {
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: key(), text: 'Use the body to outline fine print, terms, or product bundles linked to this offer.', marks: [] },
        ],
      },
    ],
    breadcrumbs: {
      mode: 'auto',
      additionalItems: [breadcrumbItem('Offers', '/offers')],
    },
  },
  blogList: {
    templateName: 'Blog index layout',
    pageTitle: 'Insights & resources',
    slug: 'blog',
    description: 'Blog listing with hero and CTA back to services.',
    sections: () => [
      heroSection({
        heading: 'The resource hub for local property care',
        subheading: 'Share educational content that builds trust with homeowners and facility managers.',
        ctas: [cta('Subscribe to updates', '/contact', 'outline')],
      }),
      blogListSection({
        heading: 'Latest posts',
        body: 'Posts are sorted automatically. Use categories or selected mode for curated feeds.',
      }),
      ctaSection({
        heading: 'Need hands-on help?',
        body: 'Close the loop by directing readers back into your sales or booking workflow.',
        buttons: [cta('Book a consultation', '/contact')],
      }),
    ],
    breadcrumbs: {
      mode: 'auto',
    },
  },
  blogArticle: {
    templateName: 'Blog article layout',
    pageTitle: 'Article title',
    slug: 'blog/sample-article',
    description: 'Article hero with supporting CTA.',
    sections: () => [
      heroSection({
        heading: 'Article headline',
        subheading: 'Use the hero to set expectations for the article content and audience.',
        ctas: [cta('Back to blog', '/blog', 'link')],
      }),
      textSection({
        eyebrow: 'Key takeaway',
        heading: 'Summarise the main point',
        body: 'Provide a short executive summary or TL;DR for skimmers.',
      }),
      ctaSection({
        heading: 'Discuss this topic with our team',
        buttons: [cta('Book a consultation', '/contact')],
      }),
    ],
    body: () => [
      {
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: key(), text: 'Replace this body content with rich text written for the article.', marks: [] },
        ],
      },
    ],
    breadcrumbs: {
      mode: 'auto',
      additionalItems: [breadcrumbItem('Blog', '/blog')],
    },
  },
  genericPage: {
    templateName: 'Generic marketing page layout',
    pageTitle: 'Page title',
    slug: 'about',
    description: 'Flexible hero + narrative + stats + CTA.',
    sections: () => [
      heroSection({
        heading: 'Page headline',
        subheading: 'Use this layout for landing pages, about pages, or campaigns.',
        ctas: [cta('Primary CTA', '/contact'), cta('Secondary CTA', '/services', 'outline')],
      }),
      textSection({
        eyebrow: 'Intro',
        heading: 'Tell the story behind this page',
        body: 'Break the narrative into shorter paragraphs so visitors can skim quickly.',
      }),
      statsSection({
        title: 'Credibility metrics',
        stats: [
          { label: 'Years in business', value: '25+' },
          { label: 'Team members', value: '80+' },
          { label: 'Projects completed', value: '5k+' },
        ],
      }),
      ctaSection({
        heading: 'Keep the conversation going',
        buttons: [cta('Contact the team', '/contact')],
      }),
    ],
    breadcrumbs: {
      mode: 'auto',
    },
  },
}

const sectionsFieldOf = [
  defineArrayMember({ type: 'section.hero' }),
  defineArrayMember({ type: 'section.text' }),
  defineArrayMember({ type: 'section.services' }),
  defineArrayMember({ type: 'section.locations' }),
  defineArrayMember({ type: 'section.testimonials' }),
  defineArrayMember({ type: 'section.faq' }),
  defineArrayMember({ type: 'section.offers' }),
  defineArrayMember({ type: 'section.cta' }),
  defineArrayMember({ type: 'section.contact' }),
  defineArrayMember({ type: 'section.features' }),
  defineArrayMember({ type: 'section.mediaText' }),
  defineArrayMember({ type: 'section.steps' }),
  defineArrayMember({ type: 'section.stats' }),
  defineArrayMember({ type: 'section.logos' }),
  defineArrayMember({ type: 'section.timeline' }),
  defineArrayMember({ type: 'section.pricingTable' }),
  defineArrayMember({ type: 'section.gallery' }),
  defineArrayMember({ type: 'section.quote' }),
  defineArrayMember({ type: 'section.blogList' }),
  defineArrayMember({ type: 'section.layout' }),
]

const resolveTemplate = (pageType?: PageTemplateType): TemplateDefinition => {
  if (pageType && templates[pageType]) {
    return templates[pageType]
  }
  return templates.genericPage
}

export default defineType({
  name: 'pageTemplate',
  title: 'Page Template',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Template name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Page type',
      type: 'string',
      options: { list: templateOptions.map((option) => ({ ...option })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageTitle',
      title: 'Suggested page title',
      type: 'string',
      description: 'Default title applied when creating a page from this template.',
    }),
    defineField({
      name: 'slugSuggestion',
      title: 'Suggested slug (no leading /)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Template notes',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sections',
      title: 'Recommended sections',
      type: 'array',
      of: sectionsFieldOf,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'body',
      title: 'Suggested body copy',
      type: 'richText',
    }),
    defineField({
      name: 'breadcrumbs',
      title: 'Breadcrumb defaults',
      type: 'breadcrumbSettings',
      options: { collapsible: true, collapsed: true },
    }),
  ],
  initialValue: (params) => {
    const requestedType = (params?.pageType as PageTemplateType | undefined) ?? 'genericPage'
    const definition = resolveTemplate(requestedType)
    const isHome = requestedType === 'home'
    return {
      pageType: requestedType,
      title: params?.title ?? definition.templateName,
      pageTitle: definition.pageTitle,
      slugSuggestion: definition.slug,
      description: definition.description,
      sections: definition.sections(),
      body: definition.body ? definition.body() : undefined,
      breadcrumbs: isHome ? undefined : definition.breadcrumbs ?? { mode: 'auto' },
    }
  },
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
    },
    prepare({ title, subtitle }) {
      const typeOption = templateOptions.find((option) => option.value === subtitle)
      return {
        title: title || 'Page template',
        subtitle: typeOption ? `Type: ${typeOption.title}` : 'Template',
      }
    },
  },
})
