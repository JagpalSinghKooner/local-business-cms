/// <reference types="@sanity-codegen/types" />

declare namespace Sanity {
  namespace Schema {
    /**
     * Global Settings
     */
    interface SiteSettings extends Sanity.Document {
      _type: "siteSettings";

      /**
       * Business Name - `String`
       */
      name?: string;

      /**
       * Tagline - `String`
       */
      tagline?: string;

      /**
       * Primary Domain - `Url`
Used for canonical URLs and sitemap generation
       */
      domain?: string;

      /**
       * Logo - `Image`
       */
      logo?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Favicon - `Image`
       */
      favicon?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Primary Colour - `String`
Hex value e.g. #0EA5E9
       */
      primaryColor?: string;

      /**
       * Secondary Colour - `String`
Hex value e.g. #F97316
       */
      secondaryColor?: string;

      /**
       * Heading Font - `String`
CSS font family for headings, e.g. "Poppins, sans-serif"
       */
      fontHeading?: string;

      /**
       * Body Font - `String`
CSS font family for body copy
       */
      fontBody?: string;

      /**
       * Primary Phone - `String`
       */
      phone?: string;

      /**
       * Primary Email - `String`
       */
      email?: string;

      /**
       * Headquarters Address - `RegistryReference`
       */
      address?: Address;

      /**
       * Business Hours - `Array`
       */
      hours?: Array<Sanity.Keyed<OpeningHoursSpec>>;

      /**
       * Social Profiles - `Array`
       */
      social?: Array<Sanity.Keyed<SocialLink>>;

      /**
       * Contact CTA Label - `String`
Optional CTA text used in the header or hero CTA button
       */
      contactCta?: string;

      /**
       * Schema.org Business Type - `String`
       */
      businessType?:
        | "AutoRepair"
        | "Dentist"
        | "Electrician"
        | "GeneralContractor"
        | "HVACBusiness"
        | "HousePainter"
        | "Locksmith"
        | "Plumber"
        | "RoofingContractor"
        | "MovingCompany"
        | "PestControl"
        | "DryCleaningOrLaundry"
        | "HomeAndConstructionBusiness"
        | "ProfessionalService"
        | "LocalBusiness";

      /**
       * Legal business name - `String`
       */
      legalName?: string;

      /**
       * Primary Service Areas - `Array`
       */
      serviceAreas?: Array<Sanity.Keyed<string>>;

      /**
       * Headquarters Geo - `RegistryReference`
Used for JSON-LD structured data
       */
      geo?: Geo;

      /**
       * Price Range - `String`
Use $, $$, $$$ etc for Google rich results
       */
      priceRange?: string;

      /**
       * SameAs (social URLs) - `Array`
Add authoritative profile URLs for structured data.
       */
      sameAs?: Array<Sanity.Keyed<string>>;

      /**
       * Default Meta Title - `String`
       */
      metaTitle?: string;

      /**
       * Default Meta Description - `Text`
       */
      metaDescription?: string;

      /**
       * Default Open Graph Image - `Image`
       */
      ogImage?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Twitter Handle - `String`
Do not include @ symbol
       */
      twitterHandle?: string;

      /**
       * Robots Directives - `String`
Defaults to "index,follow" if left blank
       */
      robots?: string;

      /**
       * Google Tag Manager ID - `String`
       */
      googleTagManagerId?: string;

      /**
       * Google Analytics ID - `String`
       */
      googleAnalyticsId?: string;

      /**
       * Meta Pixel ID - `String`
       */
      metaPixelId?: string;

      /**
       * Additional Tracking Scripts - `Array`
       */
      trackingScripts?: Array<Sanity.Keyed<TrackingScript>>;
    }

    /**
     * Robots.txt
     */
    interface RobotsTxt extends Sanity.Document {
      _type: "robotsTxt";

      /**
       * Environment - `String`
       */
      environment?: "production" | "staging" | "development";

      /**
       * User Agents - `Array`
       */
      userAgents?: Array<
        Sanity.Keyed<{
          /**
       * User Agent - `String`
e.g., *, Googlebot, Bingbot
       */
          name?: string;

          /**
       * Allow - `Array`
Paths to allow (e.g., /, /sitemap.xml)
       */
          allow?: Array<Sanity.Keyed<string>>;

          /**
       * Disallow - `Array`
Paths to disallow (e.g., /admin, /private)
       */
          disallow?: Array<Sanity.Keyed<string>>;

          /**
       * Crawl Delay - `Number`
Delay in seconds between requests
       */
          crawlDelay?: number;
        }>
      >;

      /**
       * Sitemap URL - `Url`
URL to your sitemap (e.g., https://example.com/sitemap.xml)
       */
      sitemap?: string;

      /**
       * Additional Directives - `Array`
Custom directives to add to robots.txt
       */
      additionalDirectives?: Array<
        Sanity.Keyed<{
          /**
       * Directive - `String`
e.g., Host: example.com
       */
          directive?: string;
        }>
      >;

      /**
       * Active - `Boolean`
Whether this robots.txt configuration is active
       */
      isActive?: boolean;
    }

    /**
     * Navigation
     */
    interface Navigation extends Sanity.Document {
      _type: "navigation";

      /**
       * Header Links - `Array`
       */
      header?: Array<Sanity.Keyed<NavLink>>;

      /**
       * Footer Links - `Array`
       */
      footer?: Array<Sanity.Keyed<NavLink>>;

      /**
       * Utility Links - `Array`
       */
      utility?: Array<Sanity.Keyed<NavLink>>;
    }

    /**
     * Brand Tokens
     */
    interface Tokens extends Sanity.Document {
      _type: "tokens";

      /**
       * Primary Colour - `String`
Primary brand colour (e.g. #0EA5E9)
       */
      primary?: string;

      /**
       * Text on Primary - `String`
Text colour when displayed on top of the primary colour
       */
      onPrimary?: string;

      /**
       * Secondary Colour - `String`
Accent colour for secondary CTAs
       */
      secondary?: string;

      /**
       * Text on Secondary - `String`
Text colour for secondary CTAs
       */
      onSecondary?: string;

      /**
       * Surface - `String`
Default background colour
       */
      surface?: string;

      /**
       * Muted Surface - `String`
Muted background for alternating sections
       */
      surfaceMuted?: string;

      /**
       * Strong Surface - `String`
Dark background colour
       */
      surfaceStrong?: string;

      /**
       * Strong Text - `String`
Primary text colour
       */
      textStrong?: string;

      /**
       * Muted Text - `String`
Muted text colour for secondary copy
       */
      textMuted?: string;

      /**
       * Inverted Text - `String`
Text colour when displayed on dark surfaces
       */
      textInverted?: string;

      /**
       * Border Colour - `String`
Default border colour
       */
      borderColor?: string;

      /**
       * Body Font - `String`
CSS font stack for body copy
       */
      fontBody?: string;

      /**
       * Heading Font - `String`
CSS font stack for headings
       */
      fontHeading?: string;

      /**
       * Typography Scale - `Array`
Define reusable typography tokens for headings and body copy
       */
      typographyScale?: Array<
        Sanity.Keyed<{
          /**
       * Token - `String`
e.g. heading-xl, heading-md, body-sm
       */
          token?: string;

          /**
           * Font Size - `String`
           */
          fontSize?: string;

          /**
           * Line Height - `String`
           */
          lineHeight?: string;

          /**
           * Font Weight - `String`
           */
          fontWeight?: string;
        }>
      >;

      /**
       * Spacing Scale - `Array`
Spacing tokens applied across layout and section padding
       */
      spacingScale?: Array<
        Sanity.Keyed<{
          /**
           * Token - `String`
           */
          token?: string;

          /**
           * Value - `String`
           */
          value?: string;
        }>
      >;

      /**
       * Container Width - `String`
Max width for containers (e.g. 1200px)
       */
      containerWidth?: string;

      /**
       * Border Radius - `Array`
       */
      radiusScale?: Array<
        Sanity.Keyed<{
          /**
           * Token - `String`
           */
          token?: string;

          /**
           * Value - `String`
           */
          value?: string;
        }>
      >;

      /**
       * Shadow Presets - `Array`
       */
      shadowScale?: Array<
        Sanity.Keyed<{
          /**
           * Token - `String`
           */
          token?: string;

          /**
           * Value - `String`
           */
          value?: string;
        }>
      >;

      /**
       * Button Styles - `Array`
Custom button variants
       */
      buttonStyles?: Array<
        Sanity.Keyed<{
          /**
           * Token - `String`
           */
          token?: string;

          /**
           * Label - `String`
           */
          label?: string;

          /**
           * Background - `String`
           */
          background?: string;

          /**
           * Text Colour - `String`
           */
          text?: string;

          /**
           * Border Colour - `String`
           */
          border?: string;

          /**
           * Hover Background - `String`
           */
          hoverBackground?: string;

          /**
           * Hover Text - `String`
           */
          hoverText?: string;

          /**
           * Shadow - `String`
           */
          shadow?: string;
        }>
      >;
    }

    /**
     * Service Category
     */
    interface ServiceCategory extends Sanity.Document {
      _type: "serviceCategory";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Order - `Number`
       */
      order?: number;
    }

    /**
     * Service
     */
    interface Service extends Sanity.Document {
      _type: "service";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Category - `Reference`
Assign the category used for navigation, filtering and mega menu grouping
       */
      category?: Sanity.Reference<ServiceCategory>;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Hero Image - `Image`
16:9 recommended
       */
      heroImage?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Breadcrumbs - `RegistryReference`
       */
      breadcrumbs?: BreadcrumbSettings;

      /**
       * Page Sections - `Array`
Optional modular sections rendered beneath the hero
       */
      sections?: Array<
        | Sanity.Keyed<SectionFeatures>
        | Sanity.Keyed<SectionSteps>
        | Sanity.Keyed<SectionStats>
        | Sanity.Keyed<SectionLogos>
        | Sanity.Keyed<SectionText>
        | Sanity.Keyed<SectionServices>
        | Sanity.Keyed<SectionLocations>
        | Sanity.Keyed<SectionTestimonials>
        | Sanity.Keyed<SectionFaq>
        | Sanity.Keyed<SectionOffers>
        | Sanity.Keyed<SectionCta>
        | Sanity.Keyed<SectionContact>
        | Sanity.Keyed<SectionMediaText>
        | Sanity.Keyed<SectionTimeline>
        | Sanity.Keyed<SectionPricingTable>
        | Sanity.Keyed<SectionGallery>
        | Sanity.Keyed<SectionQuote>
        | Sanity.Keyed<SectionBlogList>
        | Sanity.Keyed<SectionLayout>
      >;

      /**
       * Display Options - `Object`
       */
      displayOptions?: {
        /**
         * Show related locations - `Boolean`
         */
        showRelatedLocations?: boolean;

        /**
         * Show other services - `Boolean`
         */
        showOtherServices?: boolean;
      };

      /**
       * Body - `RegistryReference`
       */
      body?: RichText;

      /**
       * Served Locations - `Array`
       */
      locations?: Array<Sanity.KeyedReference<Location>>;

      /**
       * Global Script Overrides - `Array`
       */
      scriptOverrides?: Array<
        Sanity.Keyed<{
          /**
           * Script key - `String`
           */
          scriptKey?: string;

          /**
           * Enabled - `Boolean`
           */
          enabled?: boolean;
        }>
      >;

      /**
       * Seo - `RegistryReference`
       */
      seo?: Seo;
    }

    /**
     * Location
     */
    interface Location extends Sanity.Document {
      _type: "location";

      /**
       * City - `String`
       */
      city?: string;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Intro - `RegistryReference`
       */
      intro?: RichText;

      /**
       * Gallery - `Array`
       */
      gallery?: Array<Sanity.Keyed<GalleryImage>>;

      /**
       * Map - `RegistryReference`
Used for JSON-LD and map embeds
       */
      map?: Geo;

      /**
       * Local SEO Data - `Object`
Additional data for local SEO and Schema.org structured data
       */
      localSEO?: {
        /**
       * County - `String`
County or region name
       */
        county?: string;

        /**
       * State - `String`
State or province (e.g., "ON", "CA")
       */
        state?: string;

        /**
       * ZIP/Postal Codes - `Array`
List of ZIP or postal codes served
       */
        zipCodes?: Array<Sanity.Keyed<string>>;

        /**
       * Neighborhoods - `Array`
Neighborhoods or districts within this location
       */
        neighborhoods?: Array<Sanity.Keyed<string>>;

        /**
       * Radius - `Number`
Service radius in miles from this location
       */
        radius?: number;

        /**
       * Population Size - `String`
Used to prioritize locations in listings
       */
        populationSize?: "small" | "medium" | "large";
      };

      /**
       * Popular Services - `Array`
       */
      services?: Array<Sanity.KeyedReference<Service>>;

      /**
       * Breadcrumbs - `RegistryReference`
       */
      breadcrumbs?: BreadcrumbSettings;

      /**
       * Display Options - `Object`
       */
      displayOptions?: {
        /**
         * Show gallery - `Boolean`
         */
        showGallery?: boolean;

        /**
         * Show popular services - `Boolean`
         */
        showPopularServices?: boolean;

        /**
         * Show other nearby locations - `Boolean`
         */
        showOtherLocations?: boolean;
      };

      /**
       * Seo - `RegistryReference`
       */
      seo?: Seo;
    }

    /**
     * Offer
     */
    interface Offer extends Sanity.Document {
      _type: "offer";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Excerpt - `Text`
       */
      excerpt?: string;

      /**
       * Body - `RegistryReference`
       */
      body?: RichText;

      /**
       * Valid From - `Datetime`
       */
      validFrom?: string;

      /**
       * Valid To - `Datetime`
       */
      validTo?: string;

      /**
       * Breadcrumbs - `RegistryReference`
       */
      breadcrumbs?: BreadcrumbSettings;

      /**
       * Seo - `RegistryReference`
       */
      seo?: Seo;
    }

    /**
     * Case Study
     */
    interface CaseStudy extends Sanity.Document {
      _type: "caseStudy";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Hero Image - `Image`
       */
      heroImage?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Summary - `Text`
       */
      summary?: string;

      /**
       * Body - `RegistryReference`
       */
      body?: RichText;

      /**
       * Related Services - `Array`
       */
      relatedServices?: Array<Sanity.KeyedReference<Service>>;

      /**
       * Seo - `RegistryReference`
       */
      seo?: Seo;
    }

    /**
     * Coupon
     */
    interface Coupon extends Sanity.Document {
      _type: "coupon";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Code - `String`
       */
      code?: string;

      /**
       * Discount Text - `String`
e.g. £25 off drain cleaning
       */
      discountText?: string;

      /**
       * Valid To - `Datetime`
       */
      validTo?: string;

      /**
       * Applies To Services - `Array`
       */
      appliesTo?: Array<Sanity.KeyedReference<Service>>;
    }

    /**
     * Lead
     */
    interface Lead extends Sanity.Document {
      _type: "lead";

      /**
       * Name - `String`
       */
      name?: string;

      /**
       * Email - `String`
       */
      email?: string;

      /**
       * Phone - `String`
       */
      phone?: string;

      /**
       * Service Interest - `String`
       */
      service?: string;

      /**
       * Message - `Text`
       */
      message?: string;

      /**
       * Source Page - `String`
Relative path where the lead submitted the form.
       */
      page?: string;

      /**
       * Status - `String`
       */
      status?: "new" | "inProgress" | "closedWon" | "closedLost";

      /**
       * Internal Notes - `Text`
       */
      notes?: string;

      /**
       * Submitted At - `Datetime`
       */
      createdAt?: string;
    }

    /**
     * Page Template
     */
    interface PageTemplate extends Sanity.Document {
      _type: "pageTemplate";

      /**
       * Template name - `String`
       */
      title?: string;

      /**
       * Page type - `String`
       */
      pageType?:
        | "home"
        | "servicesIndex"
        | "serviceDetail"
        | "locationsIndex"
        | "locationDetail"
        | "offersIndex"
        | "offerDetail"
        | "blogList"
        | "blogArticle"
        | "genericPage";

      /**
       * Suggested page title - `String`
Default title applied when creating a page from this template.
       */
      pageTitle?: string;

      /**
       * Suggested slug (no leading /) - `String`
       */
      slugSuggestion?: string;

      /**
       * Template notes - `Text`
       */
      description?: string;

      /**
       * Recommended sections - `Array`
       */
      sections?: Array<
        | Sanity.Keyed<SectionHero>
        | Sanity.Keyed<SectionText>
        | Sanity.Keyed<SectionServices>
        | Sanity.Keyed<SectionLocations>
        | Sanity.Keyed<SectionTestimonials>
        | Sanity.Keyed<SectionFaq>
        | Sanity.Keyed<SectionOffers>
        | Sanity.Keyed<SectionCta>
        | Sanity.Keyed<SectionContact>
        | Sanity.Keyed<SectionFeatures>
        | Sanity.Keyed<SectionMediaText>
        | Sanity.Keyed<SectionSteps>
        | Sanity.Keyed<SectionStats>
        | Sanity.Keyed<SectionLogos>
        | Sanity.Keyed<SectionTimeline>
        | Sanity.Keyed<SectionPricingTable>
        | Sanity.Keyed<SectionGallery>
        | Sanity.Keyed<SectionQuote>
        | Sanity.Keyed<SectionBlogList>
        | Sanity.Keyed<SectionLayout>
      >;

      /**
       * Suggested body copy - `RegistryReference`
       */
      body?: RichText;

      /**
       * Breadcrumb defaults - `RegistryReference`
       */
      breadcrumbs?: BreadcrumbSettings;
    }

    /**
     * Redirect
     */
    interface Redirect extends Sanity.Document {
      _type: "redirect";

      /**
       * From Path - `String`
The path to redirect from. Supports wildcards (*) and regex patterns.
       */
      from?: string;

      /**
       * To URL - `String`
The URL to redirect to. Use $1, $2 for wildcard/regex capture groups.
       */
      to?: string;

      /**
       * Match Type - `String`
How to match the from path
       */
      matchType?: "exact" | "wildcard" | "regex";

      /**
       * Status Code - `Number`
       */
      statusCode?: 301 | 302 | 307 | 308;

      /**
       * Active - `Boolean`
Whether this redirect is currently active
       */
      isActive?: boolean;

      /**
       * Notes - `Text`
Internal notes about this redirect
       */
      notes?: string;

      /**
       * Priority - `Number`
Lower numbers are checked first (default: 100). Use for ordering redirect rules.
       */
      priority?: number;

      /**
       * Validation Warnings - `Array`
       */
      validationWarnings?: Array<Sanity.Keyed<string>>;
    }

    /**
     * Testimonial
     */
    interface Testimonial extends Sanity.Document {
      _type: "testimonial";

      /**
       * Author - `String`
       */
      author?: string;

      /**
       * Role - `String`
       */
      role?: string;

      /**
       * Location - `String`
       */
      location?: string;

      /**
       * Rating - `Number`
       */
      rating?: number;

      /**
       * Quote - `Text`
       */
      quote?: string;
    }

    /**
     * FAQ
     */
    interface Faq extends Sanity.Document {
      _type: "faq";

      /**
       * Question - `String`
       */
      question?: string;

      /**
       * Answer - `Array`
       */
      answer?: Array<Sanity.Keyed<Sanity.Block>>;

      /**
       * Related Services - `Array`
       */
      services?: Array<Sanity.KeyedReference<Service>>;
    }

    /**
     * Page
     */
    interface Page extends Sanity.Document {
      _type: "page";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Sections - `Array`
       */
      sections?: Array<
        | Sanity.Keyed<SectionHero>
        | Sanity.Keyed<SectionText>
        | Sanity.Keyed<SectionServices>
        | Sanity.Keyed<SectionLocations>
        | Sanity.Keyed<SectionTestimonials>
        | Sanity.Keyed<SectionFaq>
        | Sanity.Keyed<SectionOffers>
        | Sanity.Keyed<SectionCta>
        | Sanity.Keyed<SectionContact>
        | Sanity.Keyed<SectionFeatures>
        | Sanity.Keyed<SectionMediaText>
        | Sanity.Keyed<SectionSteps>
        | Sanity.Keyed<SectionStats>
        | Sanity.Keyed<SectionLogos>
        | Sanity.Keyed<SectionTimeline>
        | Sanity.Keyed<SectionPricingTable>
        | Sanity.Keyed<SectionGallery>
        | Sanity.Keyed<SectionQuote>
        | Sanity.Keyed<SectionBlogList>
        | Sanity.Keyed<SectionLayout>
      >;

      /**
       * Breadcrumbs - `RegistryReference`
Override automatic breadcrumbs or inject additional items.
       */
      breadcrumbs?: BreadcrumbSettings;

      /**
       * Global Script Overrides - `Array`
Enable or disable global scripts (use the keys defined in Site Settings).
       */
      scriptOverrides?: Array<
        Sanity.Keyed<{
          /**
           * Script key - `String`
           */
          scriptKey?: string;

          /**
           * Enabled - `Boolean`
           */
          enabled?: boolean;
        }>
      >;

      /**
       * Legacy Body - `Array`
Optional fallback content. Prefer building pages with sections.
       */
      body?: Array<
        | Sanity.Keyed<Sanity.Block>
        | Sanity.Keyed<{
            asset: Sanity.Asset;
            crop?: Sanity.ImageCrop;
            hotspot?: Sanity.ImageHotspot;
          }>
      >;

      /**
       * Meta Title - `String`
Title for search results (~60 chars).
       */
      metaTitle?: string;

      /**
       * Meta Description - `Text`
Description for search results (~155 chars).
       */
      metaDescription?: string;

      /**
       * Canonical URL - `Url`
Override the canonical URL for this page. Leave empty to use the page URL.
       */
      canonicalUrl?: string;

      /**
       * Meta Robots - `Object`
       */
      metaRobots?: {
        /**
         * Index - `Boolean`
         */
        index?: boolean;

        /**
         * Follow - `Boolean`
         */
        follow?: boolean;

        /**
         * No Archive - `Boolean`
         */
        noarchive?: boolean;

        /**
         * No Snippet - `Boolean`
         */
        nosnippet?: boolean;
      };

      /**
       * Social Media - `Object`
       */
      socialMedia?: {
        /**
       * Open Graph Title - `String`
Override title for social media sharing
       */
        ogTitle?: string;

        /**
       * Open Graph Description - `Text`
Override description for social media sharing
       */
        ogDescription?: string;

        /**
       * Open Graph Image - `Image`
1200×630 recommended for social media sharing
       */
        ogImage?: {
          asset: Sanity.Asset;
          crop?: Sanity.ImageCrop;
          hotspot?: Sanity.ImageHotspot;
        };

        /**
       * Twitter Title - `String`
Override title for Twitter sharing
       */
        twitterTitle?: string;

        /**
       * Twitter Description - `Text`
Override description for Twitter sharing
       */
        twitterDescription?: string;

        /**
       * Twitter Image - `Image`
1200×630 recommended for Twitter sharing
       */
        twitterImage?: {
          asset: Sanity.Asset;
          crop?: Sanity.ImageCrop;
          hotspot?: Sanity.ImageHotspot;
        };

        /**
         * Twitter Card Type - `String`
         */
        twitterCard?: "summary" | "summary_large_image" | "app" | "player";
      };

      /**
       * Structured Data - `Object`
       */
      structuredData?: {
        /**
         * Enable Local Business Schema - `Boolean`
         */
        enableLocalBusiness?: boolean;

        /**
         * Enable FAQ Schema - `Boolean`
         */
        enableFAQ?: boolean;

        /**
         * Enable Offer Schema - `Boolean`
         */
        enableOffer?: boolean;

        /**
         * Enable Service Schema - `Boolean`
         */
        enableService?: boolean;

        /**
         * Enable Product Schema - `Boolean`
         */
        enableProduct?: boolean;

        /**
       * Custom JSON-LD - `Text`
Custom JSON-LD structured data (JSON format)
       */
        customJsonLd?: string;
      };

      /**
       * Hreflang - `Array`
Language and URL pairs for international SEO
       */
      hreflang?: Array<
        Sanity.Keyed<{
          /**
           * Language - `String`
           */
          language?: string;

          /**
           * URL - `Url`
           */
          url?: string;
        }>
      >;

      /**
       * Custom Head Scripts - `Array`
Custom scripts to inject into the page head or body
       */
      customHeadScripts?: Array<
        Sanity.Keyed<{
          /**
           * Script Name - `String`
           */
          name?: string;

          /**
           * Script Content - `Text`
           */
          script?: string;

          /**
           * Position - `String`
           */
          position?: "head" | "body-start" | "body-end";
        }>
      >;

      /**
       * Fallback Description Source - `String`
Fallback source for description when meta description is empty
       */
      fallbackDescription?: "meta" | "content" | "site";

      /**
       * Image Optimization - `Object`
       */
      imageOptimization?: {
        /**
       * Image Width - `Number`
Default width for images on this page
       */
        width?: number;

        /**
       * Image Height - `Number`
Default height for images on this page
       */
        height?: number;

        /**
       * Priority Loading - `Boolean`
Load images with high priority
       */
        priority?: boolean;

        /**
         * Loading Strategy - `String`
         */
        loading?: "lazy" | "eager";
      };

      /**
       * Pagination - `Object`
Pagination links for series of pages
       */
      pagination?: {
        /**
       * Previous Page URL - `Url`
URL for the previous page in a series
       */
        prevUrl?: string;

        /**
       * Next Page URL - `Url`
URL for the next page in a series
       */
        nextUrl?: string;
      };
    }

    /**
     * Blog Post
     */
    interface Post extends Sanity.Document {
      _type: "post";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Author - `String`
       */
      author?: string;

      /**
       * Date - `Datetime`
       */
      date?: string;

      /**
       * Categories - `Array`
       */
      categories?: Array<Sanity.KeyedReference<Category>>;

      /**
       * Hero - `Image`
       */
      hero?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Body - `Array`
       */
      body?: Array<
        | Sanity.Keyed<Sanity.Block>
        | Sanity.Keyed<{
            asset: Sanity.Asset;
            crop?: Sanity.ImageCrop;
            hotspot?: Sanity.ImageHotspot;
          }>
      >;

      /**
       * Breadcrumbs - `RegistryReference`
       */
      breadcrumbs?: BreadcrumbSettings;

      /**
       * Meta Title - `String`
Title for search results (~60 chars).
       */
      metaTitle?: string;

      /**
       * Meta Description - `Text`
Description for search results (~155 chars).
       */
      metaDescription?: string;

      /**
       * Canonical URL - `Url`
Override the canonical URL for this page. Leave empty to use the page URL.
       */
      canonicalUrl?: string;

      /**
       * Meta Robots - `Object`
       */
      metaRobots?: {
        /**
         * Index - `Boolean`
         */
        index?: boolean;

        /**
         * Follow - `Boolean`
         */
        follow?: boolean;

        /**
         * No Archive - `Boolean`
         */
        noarchive?: boolean;

        /**
         * No Snippet - `Boolean`
         */
        nosnippet?: boolean;
      };

      /**
       * Social Media - `Object`
       */
      socialMedia?: {
        /**
       * Open Graph Title - `String`
Override title for social media sharing
       */
        ogTitle?: string;

        /**
       * Open Graph Description - `Text`
Override description for social media sharing
       */
        ogDescription?: string;

        /**
       * Open Graph Image - `Image`
1200×630 recommended for social media sharing
       */
        ogImage?: {
          asset: Sanity.Asset;
          crop?: Sanity.ImageCrop;
          hotspot?: Sanity.ImageHotspot;
        };

        /**
       * Twitter Title - `String`
Override title for Twitter sharing
       */
        twitterTitle?: string;

        /**
       * Twitter Description - `Text`
Override description for Twitter sharing
       */
        twitterDescription?: string;

        /**
       * Twitter Image - `Image`
1200×630 recommended for Twitter sharing
       */
        twitterImage?: {
          asset: Sanity.Asset;
          crop?: Sanity.ImageCrop;
          hotspot?: Sanity.ImageHotspot;
        };

        /**
         * Twitter Card Type - `String`
         */
        twitterCard?: "summary" | "summary_large_image" | "app" | "player";
      };

      /**
       * Structured Data - `Object`
       */
      structuredData?: {
        /**
         * Enable Local Business Schema - `Boolean`
         */
        enableLocalBusiness?: boolean;

        /**
         * Enable FAQ Schema - `Boolean`
         */
        enableFAQ?: boolean;

        /**
         * Enable Offer Schema - `Boolean`
         */
        enableOffer?: boolean;

        /**
         * Enable Service Schema - `Boolean`
         */
        enableService?: boolean;

        /**
         * Enable Product Schema - `Boolean`
         */
        enableProduct?: boolean;

        /**
       * Custom JSON-LD - `Text`
Custom JSON-LD structured data (JSON format)
       */
        customJsonLd?: string;
      };

      /**
       * Hreflang - `Array`
Language and URL pairs for international SEO
       */
      hreflang?: Array<
        Sanity.Keyed<{
          /**
           * Language - `String`
           */
          language?: string;

          /**
           * URL - `Url`
           */
          url?: string;
        }>
      >;

      /**
       * Custom Head Scripts - `Array`
Custom scripts to inject into the page head or body
       */
      customHeadScripts?: Array<
        Sanity.Keyed<{
          /**
           * Script Name - `String`
           */
          name?: string;

          /**
           * Script Content - `Text`
           */
          script?: string;

          /**
           * Position - `String`
           */
          position?: "head" | "body-start" | "body-end";
        }>
      >;

      /**
       * Fallback Description Source - `String`
Fallback source for description when meta description is empty
       */
      fallbackDescription?: "meta" | "content" | "site";

      /**
       * Image Optimization - `Object`
       */
      imageOptimization?: {
        /**
       * Image Width - `Number`
Default width for images on this page
       */
        width?: number;

        /**
       * Image Height - `Number`
Default height for images on this page
       */
        height?: number;

        /**
       * Priority Loading - `Boolean`
Load images with high priority
       */
        priority?: boolean;

        /**
         * Loading Strategy - `String`
         */
        loading?: "lazy" | "eager";
      };

      /**
       * Pagination - `Object`
Pagination links for series of pages
       */
      pagination?: {
        /**
       * Previous Page URL - `Url`
URL for the previous page in a series
       */
        prevUrl?: string;

        /**
       * Next Page URL - `Url`
URL for the next page in a series
       */
        nextUrl?: string;
      };
    }

    /**
     * Post Category
     */
    interface Category extends Sanity.Document {
      _type: "category";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Slug - `Slug`
       */
      slug?: {
        _type: "slug";
        current: string;
      };
    }

    /**
     * Redirects
     */
    interface Redirects extends Sanity.Document {
      _type: "redirects";

      /**
       * From (legacy path) - `String`
Path only, starting with /. Example: /old-page (no domain, no query, no hash).
       */
      from?: string;

      /**
       * To (destination) - `String`
New path (e.g. /new-page) or full URL (https://example.com/new-page).
       */
      to?: string;

      /**
       * HTTP Status - `Number`
       */
      status?: 301 | 302 | 307 | 308;
    }

    type NavLink = {
      _type: "navLink";

      /**
       * Label - `String`
       */
      label?: string;

      /**
       * Destination - `RegistryReference`
       */
      link?: Link;
    };

    type Seo = {
      _type: "seo";

      /**
       * Meta Title - `String`
       */
      title?: string;

      /**
       * Meta Description - `Text`
       */
      description?: string;

      /**
       * Canonical URL - `Url`
       */
      canonical?: string;

      /**
       * Open Graph Image - `Image`
       */
      ogImage?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };
    };

    type RichText = Array<
      | Sanity.Keyed<Sanity.Block>
      | Sanity.Keyed<{
          asset: Sanity.Asset;
          crop?: Sanity.ImageCrop;
          hotspot?: Sanity.ImageHotspot;
        }>
    >;

    type Address = {
      _type: "address";

      /**
       * Street Address - `String`
       */
      street1?: string;

      /**
       * Suite / Unit - `String`
       */
      street2?: string;

      /**
       * City - `String`
       */
      city?: string;

      /**
       * State / Province - `String`
       */
      state?: string;

      /**
       * Postal Code - `String`
       */
      postcode?: string;

      /**
       * Country - `String`
       */
      country?: string;
    };

    type GalleryImage = {
      _type: "galleryImage";

      /**
       * Image - `Image`
       */
      image?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Alt - `String`
       */
      alt?: string;
    };

    type ImageWithPriority = {
      _type: "imageWithPriority";

      /**
       * Image - `Image`
       */
      image?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Alt Text - `String`
Descriptive text for accessibility and SEO
       */
      alt?: string;

      /**
       * Loading Priority - `String`
Control when this image loads. "Eager" for above-fold/hero images (improves LCP). "Lazy" for below-fold images. "Auto" uses default behavior.
       */
      loadingPriority?: "auto" | "eager" | "lazy";
    };

    type Geo = {
      _type: "geo";

      /**
       * Latitude - `Number`
       */
      lat?: number;

      /**
       * Longitude - `Number`
       */
      lng?: number;
    };

    type OpeningHoursSpec = {
      _type: "openingHoursSpec";

      /**
       * Day(s) of Week - `Array`
       */
      dayOfWeek?: Array<Sanity.Keyed<string>>;

      /**
       * Opens (HH:MM) - `String`
       */
      opens?: string;

      /**
       * Closes (HH:MM) - `String`
       */
      closes?: string;
    };

    type SocialLink = {
      _type: "socialLink";

      /**
       * Platform - `String`
       */
      platform?: string;

      /**
       * URL - `Url`
       */
      url?: string;
    };

    type TrackingScript = {
      _type: "trackingScript";

      /**
       * Key - `String`
Unique identifier used for per-page overrides (letters, numbers, dashes).
       */
      key?: string;

      /**
       * Label - `String`
Internal name to identify this script
       */
      label?: string;

      /**
       * Script Code - `Text`
Full script tag or inline snippet injected on every page
       */
      code?: string;

      /**
       * Injection Point - `String`
       */
      location?: "head" | "body";
    };

    type Cta = {
      _type: "cta";

      /**
       * Label - `String`
       */
      label?: string;

      /**
       * Link - `RegistryReference`
       */
      link?: Link;

      /**
       * Style - `String`
       */
      style?: "primary" | "secondary" | "outline" | "link";
    };

    type Link = {
      _type: "link";

      /**
       * Link type - `String`
       */
      linkType?: "internal" | "external";

      /**
       * Internal path - `String`
Select or enter a relative path such as /contact.
       */
      internalPath?: string;

      /**
       * External URL - `Url`
Use a full URL including https://. Mailto: and tel: are also supported.
       */
      href?: string;

      /**
       * Open in new tab - `Boolean`
       */
      openInNewTab?: boolean;
    };

    type BreadcrumbItem = {
      _type: "breadcrumb.item";

      /**
       * Label - `String`
       */
      label?: string;

      /**
       * Destination - `RegistryReference`
       */
      link?: Link;
    };

    type BreadcrumbSettings = {
      _type: "breadcrumbSettings";

      /**
       * Mode - `String`
       */
      mode?: "auto" | "manual";

      /**
       * Manual trail - `Array`
Provide full breadcrumb trail when manual mode is selected.
       */
      manualItems?: Array<Sanity.Keyed<BreadcrumbItem>>;

      /**
       * Additional items (auto mode) - `Array`
Optional items inserted before the current page when automatic mode is used.
       */
      additionalItems?: Array<Sanity.Keyed<BreadcrumbItem>>;

      /**
       * Current page label override - `String`
       */
      currentLabel?: string;
    };

    type SectionHero = {
      _type: "section.hero";

      /**
       * Layout - `String`
       */
      variant?: "split" | "centered" | "background";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Subtitle - `Text`
       */
      subheading?: string;

      /**
       * Hero Media - `RegistryReference`
Hero images should use "Eager" loading priority for optimal LCP performance.
       */
      media?: ImageWithPriority;

      /**
       * Background - `String`
       */
      background?: "default" | "muted" | "brand";

      /**
       * Calls to Action - `Array`
       */
      ctas?: Array<Sanity.Keyed<Cta>>;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionText = {
      _type: "section.text";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Body - `RegistryReference`
       */
      body?: RichText;

      /**
       * Alignment - `String`
       */
      alignment?: "left" | "center";

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionServices = {
      _type: "section.services";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Intro Copy - `Text`
       */
      description?: string;

      /**
       * Display - `String`
       */
      display?: "selected" | "all" | "category";

      /**
       * Filter by Category - `Reference`
       */
      category?: Sanity.Reference<ServiceCategory>;

      /**
       * Services - `Array`
       */
      services?: Array<Sanity.KeyedReference<Service>>;

      /**
       * Columns - `Number`
       */
      columns?: number;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionLocations = {
      _type: "section.locations";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Intro Copy - `Text`
       */
      description?: string;

      /**
       * Locations - `Array`
Leave empty to display all locations.
       */
      locations?: Array<Sanity.KeyedReference<Location>>;

      /**
       * Columns - `Number`
       */
      columns?: number;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionTestimonials = {
      _type: "section.testimonials";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Intro Copy - `Text`
       */
      description?: string;

      /**
       * Testimonials - `Array`
       */
      testimonials?: Array<Sanity.KeyedReference<Testimonial>>;

      /**
       * Layout - `String`
       */
      style?: "grid" | "carousel";

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionFaq = {
      _type: "section.faq";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Intro Copy - `Text`
       */
      description?: string;

      /**
       * FAQs - `Array`
       */
      faqs?: Array<Sanity.KeyedReference<Faq>>;

      /**
       * Display Style - `String`
       */
      display?: "accordion" | "columns";

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionOffers = {
      _type: "section.offers";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Intro Copy - `Text`
       */
      description?: string;

      /**
       * Offers - `Array`
Leave empty to show all published offers.
       */
      offers?: Array<Sanity.KeyedReference<Offer>>;

      /**
       * Max Offers to Show - `Number`
       */
      limit?: number;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionCta = {
      _type: "section.cta";

      /**
       * Background - `String`
       */
      background?: "brand" | "dark" | "light";

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Body - `Text`
       */
      body?: string;

      /**
       * Buttons - `Array`
       */
      ctas?: Array<Sanity.Keyed<Cta>>;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionContact = {
      _type: "section.contact";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Description - `Text`
       */
      description?: string;

      /**
       * Form Type - `String`
       */
      formType?: "inline" | "embed" | "external";

      /**
       * Embed HTML - `Text`
       */
      embedCode?: string;

      /**
       * External form link - `RegistryReference`
       */
      externalLink?: Link;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionFeatures = {
      _type: "section.features";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Description - `Text`
       */
      description?: string;

      /**
       * Columns - `Number`
       */
      columns?: number;

      /**
       * Features - `Array`
       */
      items?: Array<
        Sanity.Keyed<{
          /**
       * Icon - `String`
Emoji or short text tag (optional)
       */
          icon?: string;

          /**
           * Title - `String`
           */
          title?: string;

          /**
           * Body - `RegistryReference`
           */
          body?: RichText;

          /**
           * Link Label - `String`
           */
          linkLabel?: string;

          /**
           * Link - `RegistryReference`
           */
          link?: Link;
        }>
      >;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionMediaText = {
      _type: "section.mediaText";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Subheading - `Text`
       */
      subheading?: string;

      /**
       * Body - `RegistryReference`
       */
      body?: RichText;

      /**
       * Media - `RegistryReference`
       */
      media?: ImageWithPriority;

      /**
       * Image position - `String`
       */
      mediaPosition?: "image-left" | "image-right";

      /**
       * Background - `String`
       */
      background?: "default" | "muted" | "brand";

      /**
       * Calls to action - `Array`
       */
      ctas?: Array<Sanity.Keyed<Cta>>;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionSteps = {
      _type: "section.steps";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Description - `Text`
       */
      description?: string;

      /**
       * Steps - `Array`
       */
      items?: Array<
        Sanity.Keyed<{
          /**
           * Title - `String`
           */
          title?: string;

          /**
           * Body - `RegistryReference`
           */
          body?: RichText;
        }>
      >;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionStats = {
      _type: "section.stats";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Description - `Text`
       */
      description?: string;

      /**
       * Stats - `Array`
       */
      items?: Array<
        Sanity.Keyed<{
          /**
           * Value - `String`
           */
          value?: string;

          /**
           * Label - `String`
           */
          label?: string;
        }>
      >;

      /**
       * Alignment - `String`
       */
      alignment?: "left" | "center";

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionLogos = {
      _type: "section.logos";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Description - `Text`
       */
      description?: string;

      /**
       * Logos - `Array`
       */
      items?: Array<
        Sanity.Keyed<{
          /**
           * Name - `String`
           */
          name?: string;

          /**
           * Logo - `Image`
           */
          logo?: {
            asset: Sanity.Asset;
            crop?: Sanity.ImageCrop;
            hotspot?: Sanity.ImageHotspot;
          };

          /**
           * Url - `Url`
           */
          url?: string;
        }>
      >;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionTimeline = {
      _type: "section.timeline";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Supporting Copy - `Text`
       */
      body?: string;

      /**
       * Layout - `String`
       */
      layoutMode?: "vertical" | "horizontal";

      /**
       * Timeline Items - `Array`
       */
      items?: Array<
        Sanity.Keyed<{
          /**
           * Title - `String`
           */
          title?: string;

          /**
           * Subheading - `String`
           */
          subheading?: string;

          /**
           * Summary - `Text`
           */
          summary?: string;

          /**
       * Date / Label - `String`
Shown above the milestone (e.g. Q1 2025, Step 1)
       */
          date?: string;

          /**
           * Image - `Image`
           */
          media?: {
            asset: Sanity.Asset;
            crop?: Sanity.ImageCrop;
            hotspot?: Sanity.ImageHotspot;
          };

          /**
           * CTA Link - `RegistryReference`
           */
          link?: Cta;
        }>
      >;

      /**
       * Calls to Action - `Array`
       */
      ctas?: Array<Sanity.Keyed<Cta>>;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionPricingTable = {
      _type: "section.pricingTable";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Supporting Copy - `Text`
       */
      body?: string;

      /**
       * Layout - `String`
       */
      layoutMode?: "cards" | "table";

      /**
       * Plans - `Array`
       */
      plans?: Array<
        Sanity.Keyed<{
          /**
           * Title - `String`
           */
          title?: string;

          /**
           * Tagline - `String`
           */
          tagline?: string;

          /**
       * Price - `String`
Displayed prominently (e.g. $299)
       */
          price?: string;

          /**
       * Billing Frequency - `String`
e.g. per month, annually, once-off
       */
          frequency?: string;

          /**
           * Description - `Text`
           */
          description?: string;

          /**
           * Features - `Array`
           */
          features?: Array<Sanity.Keyed<string>>;

          /**
           * Highlight plan - `Boolean`
           */
          isFeatured?: boolean;

          /**
           * Primary CTA - `RegistryReference`
           */
          cta?: Cta;
        }>
      >;

      /**
       * Footer Note - `Text`
Displayed below the pricing table for disclaimers or guarantees.
       */
      footerNote?: string;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionGallery = {
      _type: "section.gallery";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Supporting Copy - `Text`
       */
      body?: string;

      /**
       * Layout - `String`
       */
      layoutMode?: "grid" | "masonry" | "carousel";

      /**
       * Enable lightbox - `Boolean`
       */
      enableLightbox?: boolean;

      /**
       * Images - `Array`
       */
      images?: Array<Sanity.Keyed<GalleryImage>>;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionQuote = {
      _type: "section.quote";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Quote - `Text`
       */
      quote?: string;

      /**
       * Author - `String`
       */
      author?: string;

      /**
       * Author Title / Role - `String`
       */
      role?: string;

      /**
       * Company - `String`
       */
      company?: string;

      /**
       * Author Photo - `Image`
       */
      avatar?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Company Logo - `Image`
       */
      logo?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;
      };

      /**
       * Layout - `String`
       */
      alignment?: "center" | "left";

      /**
       * Optional CTA - `RegistryReference`
       */
      cta?: Cta;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionBlogList = {
      _type: "section.blogList";

      /**
       * Eyebrow - `String`
       */
      eyebrow?: string;

      /**
       * Heading - `String`
       */
      heading?: string;

      /**
       * Supporting Copy - `Text`
       */
      body?: string;

      /**
       * Source - `String`
       */
      sourceMode?: "latest" | "selected" | "category";

      /**
       * Category - `Reference`
       */
      category?: Sanity.Reference<Category>;

      /**
       * Selected Posts - `Array`
       */
      posts?: Array<Sanity.KeyedReference<Post>>;

      /**
       * Maximum Posts - `Number`
       */
      limit?: number;

      /**
       * Layout - `String`
       */
      layoutMode?: "cards" | "list";

      /**
       * Show author details - `Boolean`
       */
      showAuthor?: boolean;

      /**
       * Show publish date - `Boolean`
       */
      showPublishedDate?: boolean;

      /**
       * Section CTA - `RegistryReference`
       */
      cta?: Cta;

      /**
       * Layout & Theme - `Object`
       */
      layout?: {
        /**
         * Background - `String`
         */
        background?:
          | "surface"
          | "surface-muted"
          | "surface-strong"
          | "brand"
          | "secondary";

        /**
         * Text Tone - `String`
         */
        textTone?: "default" | "dark" | "light";

        /**
         * Padding Top - `String`
         */
        paddingTop?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Padding Bottom - `String`
         */
        paddingBottom?:
          | "none"
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "3xl"
          | "section";

        /**
         * Container Width - `String`
         */
        container?: "default" | "full" | "narrow";

        /**
         * Content Alignment - `String`
         */
        contentAlignment?: "start" | "center";
      };

      /**
       * Entrance Animation - `String`
       */
      animation?: "none" | "fade" | "slide-up" | "slide-right" | "slide-left";

      /**
       * Visibility - `Object`
       */
      visibility?: {
        /**
         * Hide on mobile - `Boolean`
         */
        hideOnMobile?: boolean;

        /**
         * Hide on desktop - `Boolean`
         */
        hideOnDesktop?: boolean;
      };
    };

    type SectionLayout = {
      _type: "section.layout";

      /**
       * Internal Title - `String`
Only used in Studio to identify this layout block.
       */
      title?: string;

      /**
       * Layout Settings - `Object`
       */
      layoutSettings?: {
        /**
         * Layout & Theme - `Object`
         */
        layout?: {
          /**
           * Background - `String`
           */
          background?:
            | "surface"
            | "surface-muted"
            | "surface-strong"
            | "brand"
            | "secondary";

          /**
           * Text Tone - `String`
           */
          textTone?: "default" | "dark" | "light";

          /**
           * Padding Top - `String`
           */
          paddingTop?:
            | "none"
            | "xs"
            | "sm"
            | "md"
            | "lg"
            | "xl"
            | "2xl"
            | "3xl"
            | "section";

          /**
           * Padding Bottom - `String`
           */
          paddingBottom?:
            | "none"
            | "xs"
            | "sm"
            | "md"
            | "lg"
            | "xl"
            | "2xl"
            | "3xl"
            | "section";

          /**
           * Container Width - `String`
           */
          container?: "default" | "full" | "narrow";

          /**
           * Content Alignment - `String`
           */
          contentAlignment?: "start" | "center";
        };
      };

      /**
       * Gap Between Sections - `String`
       */
      gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "section";

      /**
       * Nested Sections - `Array`
       */
      sections?: Array<
        | Sanity.Keyed<SectionHero>
        | Sanity.Keyed<SectionText>
        | Sanity.Keyed<SectionServices>
        | Sanity.Keyed<SectionLocations>
        | Sanity.Keyed<SectionTestimonials>
        | Sanity.Keyed<SectionFaq>
        | Sanity.Keyed<SectionOffers>
        | Sanity.Keyed<SectionCta>
        | Sanity.Keyed<SectionContact>
        | Sanity.Keyed<SectionFeatures>
        | Sanity.Keyed<SectionMediaText>
        | Sanity.Keyed<SectionSteps>
        | Sanity.Keyed<SectionStats>
        | Sanity.Keyed<SectionLogos>
        | Sanity.Keyed<SectionTimeline>
        | Sanity.Keyed<SectionPricingTable>
        | Sanity.Keyed<SectionGallery>
        | Sanity.Keyed<SectionQuote>
        | Sanity.Keyed<SectionBlogList>
      >;
    };

    type Document =
      | SiteSettings
      | RobotsTxt
      | Navigation
      | Tokens
      | ServiceCategory
      | Service
      | Location
      | Offer
      | CaseStudy
      | Coupon
      | Lead
      | PageTemplate
      | Redirect
      | Testimonial
      | Faq
      | Page
      | Post
      | Category
      | Redirects;
  }
}
