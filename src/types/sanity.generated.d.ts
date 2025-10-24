/// <reference types="@sanity-codegen/types" />

declare namespace Sanity {
  namespace Schema {
    /**
     * Site Settings
     */
    interface SiteSettings extends Sanity.Document {
      _type: "siteSettings";

      /**
       * Dataset Name - `String`
The Sanity dataset for this site. Must match NEXT_PUBLIC_SANITY_DATASET env var.
       */
      datasetName?: string;

      /**
       * Site Status - `String`
Current deployment status
       */
      status?: "active" | "staging" | "inactive" | "development";

      /**
       * Last Deployed - `Datetime`
When this site was last deployed (auto-updated by deployment scripts)
       */
      deployedAt?: string;

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

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
    }

    /**
     * Cookie Consent
     */
    interface CookieConsent extends Sanity.Document {
      _type: "cookieConsent";

      /**
       * Enable Cookie Consent - `Boolean`
Show cookie consent banner to users
       */
      enabled?: boolean;

      /**
       * Consent Mode - `String`
       */
      mode?: "opt-in" | "opt-out" | "notice";

      /**
       * Banner Text - `Text`
       */
      bannerText?: string;

      /**
       * Cookie Categories - `Array`
       */
      categories?: Array<
        Sanity.Keyed<{
          /**
           * Category ID - `String`
           */
          id?: string;

          /**
           * Category Name - `String`
           */
          name?: string;

          /**
           * Description - `Text`
           */
          description?: string;

          /**
       * Required - `Boolean`
Cannot be opted out
       */
          required?: boolean;

          /**
           * Enabled by Default - `Boolean`
           */
          defaultEnabled?: boolean;
        }>
      >;

      /**
       * Privacy Policy URL - `String`
Link to privacy policy page
       */
      privacyPolicyUrl?: string;

      /**
       * Cookie Policy URL - `String`
Link to cookie policy page
       */
      cookiePolicyUrl?: string;
    }

    /**
     * Privacy Policy
     */
    interface PrivacyPolicy extends Sanity.Document {
      _type: "privacyPolicy";

      /**
       * Title - `String`
       */
      title?: string;

      /**
       * Content - `Array`
Privacy policy content
       */
      content?: Array<Sanity.Keyed<Sanity.Block>>;

      /**
       * Effective Date - `Date`
When this version becomes effective
       */
      effectiveDate?: string;

      /**
       * Version - `String`
Version number (e.g., 1.0, 2.0)
       */
      version?: string;

      /**
       * Last Updated - `Datetime`
       */
      lastUpdated?: string;

      /**
       * Policy Sections - `Array`
       */
      sections?: Array<
        Sanity.Keyed<{
          /**
           * Heading - `String`
           */
          heading?: string;

          /**
           * Content - `Array`
           */
          content?: Array<Sanity.Keyed<Sanity.Block>>;
        }>
      >;
    }

    /**
       * Navigation
Configure site navigation menus. Each site (dataset) has its own navigation configuration.
       */
    interface Navigation extends Sanity.Document {
      _type: "navigation";

      /**
       * Header Links - `Array`
Main navigation links displayed in the header. Services and Locations are added automatically.
       */
      header?: Array<Sanity.Keyed<NavLink>>;

      /**
       * Footer Links - `Array`
Links displayed in the footer navigation.
       */
      footer?: Array<Sanity.Keyed<NavLink>>;

      /**
       * Utility Links - `Array`
Utility links (e.g., Privacy Policy, Terms of Service) typically displayed in footer or header utility bar.
       */
      utility?: Array<Sanity.Keyed<NavLink>>;
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

        /**
         * Alt text - `String`
         */
        alt?: string;
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
      seo?: SeoUnified;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
    }

    /**
       * Service Location
Service-specific content for a particular location (e.g., "Plumbing in Toronto")
       */
    interface ServiceLocation extends Sanity.Document {
      _type: "serviceLocation";

      /**
       * Title - `String`
Auto-generated from service + location (e.g., "Plumbing in Toronto")
       */
      title?: string;

      /**
       * Service - `Reference`
The service being offered
       */
      service?: Sanity.Reference<Service>;

      /**
       * Location - `Reference`
The location where this service is offered
       */
      location?: Sanity.Reference<Location>;

      /**
       * Slug - `Slug`
Auto-generated from service + location slugs (e.g., "plumbing-toronto")
       */
      slug?: {
        _type: "slug";
        current: string;
      };

      /**
       * Content Source - `String`
How content for this page is generated
       */
      contentSource?: "inherit" | "custom" | "ai";

      /**
       * Introduction - `RegistryReference`
Unique opening paragraph for this service in this location (50-150 words). Critical for SEO differentiation.
       */
      intro?: RichText;

      /**
       * Page Sections - `Array`
Custom sections for this service+location page. Leave empty to inherit from service page.
       */
      sections?: Array<
        | Sanity.Keyed<SectionHero>
        | Sanity.Keyed<SectionFeatures>
        | Sanity.Keyed<SectionTestimonials>
        | Sanity.Keyed<SectionFaq>
        | Sanity.Keyed<SectionCta>
        | Sanity.Keyed<SectionContact>
        | Sanity.Keyed<SectionGallery>
        | Sanity.Keyed<SectionOffers>
        | Sanity.Keyed<SectionStats>
        | Sanity.Keyed<SectionText>
        | Sanity.Keyed<SectionMediaText>
        | Sanity.Keyed<SectionTimeline>
        | Sanity.Keyed<SectionQuote>
        | Sanity.Keyed<SectionLayout>
        | Sanity.Keyed<SectionSteps>
        | Sanity.Keyed<SectionLogos>
        | Sanity.Keyed<SectionPricingTable>
        | Sanity.Keyed<SectionServices>
        | Sanity.Keyed<SectionLocations>
        | Sanity.Keyed<SectionBlogList>
      >;

      /**
       * Display Options - `Object`
Control which related content sections are shown
       */
      displayOptions?: {
        /**
       * Show nearby locations - `Boolean`
Display other locations where this service is available
       */
        showNearbyLocations?: boolean;

        /**
       * Show related services - `Boolean`
Display other services available in this location
       */
        showRelatedServices?: boolean;
      };

      /**
       * Seo - `RegistryReference`
Auto-generated from service + location data if left empty. Override for custom SEO.
       */
      seo?: SeoUnified;

      /**
       * Published At - `Datetime`
When this serviceLocation page was created
       */
      publishedAt?: string;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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
      seo?: SeoUnified;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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
      seo?: SeoUnified;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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

        /**
         * Alt text - `String`
         */
        alt?: string;
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
      seo?: SeoUnified;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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
Manage URL redirects with pattern matching, priority ordering, and loop detection. Test redirects using the validation script: pnpm redirects:validate
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
       * Case Sensitive - `Boolean`
Whether the from path should be matched case-sensitively
       */
      caseSensitive?: boolean;

      /**
       * Query String Handling - `String`
How to handle query strings in the redirect
       */
      queryStringHandling?: "preserve" | "remove" | "ignore";

      /**
       * Notes - `Text`
Internal notes about this redirect
       */
      notes?: string;

      /**
       * Priority - `Number`
Higher numbers are evaluated first (default: 0). Use 10+ for important redirects.
       */
      priority?: number;

      /**
       * Order - `Number`
Auto-incremented position for redirects with same priority
       */
      order?: number;

      /**
       * Validation Warnings - `Array`
       */
      validationWarnings?: Array<Sanity.Keyed<string>>;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
    }

    /**
     * Audit Log
     */
    interface AuditLog extends Sanity.Document {
      _type: "auditLog";

      /**
       * Action - `String`
Type of action performed
       */
      action?:
        | "created"
        | "updated"
        | "deleted"
        | "published"
        | "unpublished"
        | "workflow_changed"
        | "scheduled";

      /**
       * Document ID - `String`
ID of the document that was changed
       */
      documentId?: string;

      /**
       * Document Type - `String`
Type of document (service, page, offer, etc.)
       */
      documentType?: string;

      /**
       * Document Title - `String`
Title of the document at time of change
       */
      documentTitle?: string;

      /**
       * User ID - `String`
ID of user who performed the action
       */
      userId?: string;

      /**
       * User Name - `String`
Name of user who performed the action
       */
      userName?: string;

      /**
       * User Email - `String`
Email of user who performed the action
       */
      userEmail?: string;

      /**
       * Timestamp - `Datetime`
When the action occurred
       */
      timestamp?: string;

      /**
       * Changes - `Array`
List of fields that were changed
       */
      changes?: Array<
        Sanity.Keyed<{
          /**
           * Field Name - `String`
           */
          field?: string;

          /**
           * Old Value - `Text`
           */
          oldValue?: string;

          /**
           * New Value - `Text`
           */
          newValue?: string;
        }>
      >;

      /**
       * Metadata - `Object`
Additional context about the change
       */
      metadata?: {
        /**
         * IP Address - `String`
         */
        ipAddress?: string;

        /**
         * User Agent - `String`
         */
        userAgent?: string;

        /**
         * Dataset - `String`
         */
        dataset?: string;

        /**
         * Previous Workflow State - `String`
         */
        previousWorkflowState?: string;

        /**
         * New Workflow State - `String`
         */
        newWorkflowState?: string;
      };

      /**
       * Notes - `Text`
Additional notes about the change
       */
      notes?: string;
    }

    /**
     * Webhook
     */
    interface Webhook extends Sanity.Document {
      _type: "webhook";

      /**
       * Name - `String`
Descriptive name for this webhook
       */
      name?: string;

      /**
       * Webhook URL - `Url`
The endpoint URL to send webhook events to
       */
      url?: string;

      /**
       * Enabled - `Boolean`
Enable or disable this webhook
       */
      enabled?: boolean;

      /**
       * Events - `Array`
Which events should trigger this webhook
       */
      events?: Array<Sanity.Keyed<string>>;

      /**
       * Document Types - `Array`
Filter by document types (leave empty for all types)
       */
      documentTypes?: Array<Sanity.Keyed<string>>;

      /**
       * Secret Key - `String`
Secret key for signing webhook payloads (HMAC-SHA256)
       */
      secret?: string;

      /**
       * Custom Headers - `Array`
Additional HTTP headers to send with webhook requests
       */
      headers?: Array<
        Sanity.Keyed<{
          /**
           * Header Name - `String`
           */
          key?: string;

          /**
           * Header Value - `String`
           */
          value?: string;
        }>
      >;

      /**
       * Retry Configuration - `Object`
Configure retry behavior for failed webhook deliveries
       */
      retryConfig?: {
        /**
       * Max Retries - `Number`
Maximum number of retry attempts
       */
        maxRetries?: number;

        /**
       * Retry Delay (seconds) - `Number`
Initial delay between retries (exponential backoff)
       */
        retryDelay?: number;
      };

      /**
       * Timeout (seconds) - `Number`
Request timeout in seconds
       */
      timeout?: number;

      /**
       * Description - `Text`
Notes about this webhook integration
       */
      description?: string;

      /**
       * Statistics - `Object`
Webhook delivery statistics
       */
      statistics?: {
        /**
         * Total Deliveries - `Number`
         */
        totalDeliveries?: number;

        /**
         * Successful Deliveries - `Number`
         */
        successfulDeliveries?: number;

        /**
         * Failed Deliveries - `Number`
         */
        failedDeliveries?: number;

        /**
         * Last Delivery At - `Datetime`
         */
        lastDeliveryAt?: string;

        /**
         * Last Delivery Status - `String`
         */
        lastDeliveryStatus?: string;
      };
    }

    /**
     * Webhook Log
     */
    interface WebhookLog extends Sanity.Document {
      _type: "webhookLog";

      /**
       * Webhook ID - `String`
Reference to the webhook configuration
       */
      webhookId?: string;

      /**
       * Webhook Name - `String`
Name of the webhook at time of delivery
       */
      webhookName?: string;

      /**
       * Event - `String`
The event that triggered this webhook
       */
      event?: string;

      /**
       * Document ID - `String`
ID of the document that triggered the webhook
       */
      documentId?: string;

      /**
       * Document Type - `String`
Type of the document
       */
      documentType?: string;

      /**
       * Document Title - `String`
Title of the document
       */
      documentTitle?: string;

      /**
       * Timestamp - `Datetime`
When the webhook was triggered
       */
      timestamp?: string;

      /**
       * URL - `Url`
The endpoint URL that was called
       */
      url?: string;

      /**
       * HTTP Method - `String`
HTTP method used
       */
      method?: string;

      /**
       * Payload - `Text`
The JSON payload that was sent
       */
      payload?: string;

      /**
       * Headers - `Text`
HTTP headers sent with the request
       */
      headers?: string;

      /**
       * Status Code - `Number`
HTTP response status code
       */
      statusCode?: number;

      /**
       * Response Body - `Text`
Response body from the webhook endpoint
       */
      responseBody?: string;

      /**
       * Success - `Boolean`
Whether the delivery was successful
       */
      success?: boolean;

      /**
       * Error - `Text`
Error message if delivery failed
       */
      error?: string;

      /**
       * Duration (ms) - `Number`
How long the request took in milliseconds
       */
      duration?: number;

      /**
       * Attempt Number - `Number`
Retry attempt number (1 for initial attempt)
       */
      attemptNumber?: number;

      /**
       * Will Retry - `Boolean`
Whether this delivery will be retried
       */
      willRetry?: boolean;
    }

    /**
     * Approval Request
     */
    interface ApprovalRequest extends Sanity.Document {
      _type: "approvalRequest";

      /**
       * Document - `Reference`
The document requiring approval
       */
      document?: Sanity.Reference<
        Page | Post | Service | Location | Offer | Coupon | CaseStudy
      >;

      /**
       * Document Title - `String`
Title of the document at time of request
       */
      documentTitle?: string;

      /**
       * Document Type - `String`
Type of the document
       */
      documentType?: string;

      /**
       * Status - `String`
Current status of the approval request
       */
      status?: "pending" | "approved" | "rejected" | "cancelled";

      /**
       * Requested By - `Object`
User who requested approval
       */
      requestedBy?: {
        /**
         * User ID - `String`
         */
        userId?: string;

        /**
         * User Name - `String`
         */
        userName?: string;

        /**
         * User Email - `String`
         */
        userEmail?: string;
      };

      /**
       * Requested At - `Datetime`
When the approval was requested
       */
      requestedAt?: string;

      /**
       * Approvers - `Array`
Users who can approve this request
       */
      approvers?: Array<
        Sanity.Keyed<{
          /**
           * User ID - `String`
           */
          userId?: string;

          /**
           * User Name - `String`
           */
          userName?: string;

          /**
           * User Email - `String`
           */
          userEmail?: string;

          /**
       * Role - `String`
Approver role (e.g., Content Manager, Editor)
       */
          role?: string;
        }>
      >;

      /**
       * Approval Type - `String`
Type of approval required
       */
      approvalType?: "single" | "all" | "majority";

      /**
       * Approvals - `Array`
Individual approval decisions
       */
      approvals?: Array<
        Sanity.Keyed<{
          /**
           * User ID - `String`
           */
          userId?: string;

          /**
           * User Name - `String`
           */
          userName?: string;

          /**
           * Decision - `String`
           */
          decision?: "approved" | "rejected";

          /**
           * Comment - `Text`
           */
          comment?: string;

          /**
           * Decided At - `Datetime`
           */
          decidedAt?: string;
        }>
      >;

      /**
       * Request Notes - `Text`
Notes from the requester
       */
      requestNotes?: string;

      /**
       * Final Comment - `Text`
Final comment when request is resolved
       */
      finalComment?: string;

      /**
       * Resolved At - `Datetime`
When the request was resolved (approved/rejected/cancelled)
       */
      resolvedAt?: string;

      /**
       * Due Date - `Datetime`
When approval is needed by
       */
      dueDate?: string;

      /**
       * Priority - `String`
Priority level for this approval
       */
      priority?: "low" | "normal" | "high" | "urgent";

      /**
       * Tags - `Array`
Tags for categorizing approvals
       */
      tags?: Array<Sanity.Keyed<string>>;
    }

    /**
     * Role
     */
    interface Role extends Sanity.Document {
      _type: "role";

      /**
       * Role Name - `String`
Unique name for this role
       */
      name?: string;

      /**
       * Display Title - `String`
Human-readable title
       */
      title?: string;

      /**
       * Description - `Text`
What this role is for
       */
      description?: string;

      /**
       * Permissions - `Object`
Granular permissions for this role
       */
      permissions?: {
        /**
         * Document Permissions - `Object`
         */
        documents?: {
          /**
           * Create Documents - `Array`
           */
          create?: Array<Sanity.Keyed<string>>;

          /**
           * Read Documents - `Array`
           */
          read?: Array<Sanity.Keyed<string>>;

          /**
           * Update Documents - `Array`
           */
          update?: Array<Sanity.Keyed<string>>;

          /**
           * Delete Documents - `Array`
           */
          delete?: Array<Sanity.Keyed<string>>;

          /**
           * Publish Documents - `Array`
           */
          publish?: Array<Sanity.Keyed<string>>;
        };

        /**
         * Workflow Permissions - `Object`
         */
        workflows?: {
          /**
           * Change Workflow State - `Boolean`
           */
          changeState?: boolean;

          /**
           * Request Approval - `Boolean`
           */
          requestApproval?: boolean;

          /**
           * Approve Content - `Boolean`
           */
          approveContent?: boolean;

          /**
           * Schedule Publishing - `Boolean`
           */
          schedulePublish?: boolean;
        };

        /**
         * Feature Permissions - `Object`
         */
        features?: {
          /**
           * View Audit Logs - `Boolean`
           */
          viewAuditLogs?: boolean;

          /**
           * Export Audit Logs - `Boolean`
           */
          exportAuditLogs?: boolean;

          /**
           * Manage Webhooks - `Boolean`
           */
          manageWebhooks?: boolean;

          /**
           * Manage Roles - `Boolean`
           */
          manageRoles?: boolean;

          /**
           * Manage Users - `Boolean`
           */
          manageUsers?: boolean;

          /**
           * View Analytics - `Boolean`
           */
          viewAnalytics?: boolean;
        };
      };

      /**
       * System Role - `Boolean`
System roles cannot be deleted
       */
      isSystem?: boolean;

      /**
       * User Count - `Number`
Number of users with this role
       */
      userCount?: number;
    }

    /**
     * User Profile
     */
    interface UserProfile extends Sanity.Document {
      _type: "userProfile";

      /**
       * User ID - `String`
Unique user identifier from authentication system
       */
      userId?: string;

      /**
       * Email - `String`
       */
      email?: string;

      /**
       * Full Name - `String`
       */
      name?: string;

      /**
       * Role - `Reference`
User role with associated permissions
       */
      role?: Sanity.Reference<Role>;

      /**
       * Active - `Boolean`
Whether user account is active
       */
      active?: boolean;

      /**
       * Last Login At - `Datetime`
When user last logged in
       */
      lastLoginAt?: string;

      /**
       * Created At - `Datetime`
When user profile was created
       */
      createdAt?: string;
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
       * Seo - `RegistryReference`
       */
      seo?: SeoUnified;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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

        /**
         * Alt text - `String`
         */
        alt?: string;
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
       * Seo - `RegistryReference`
       */
      seo?: SeoUnified;

      /**
       * Schema Version - `String`
Internal: tracks schema version for safe migrations
       */
      schemaVersion?: string;
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

    type SeoUnified = {
      _type: "seoUnified";

      /**
       * Meta Title - `String`
Leave empty to auto-generate from page content (~60 chars)
       */
      metaTitle?: string;

      /**
       * Meta Description - `Text`
Leave empty to auto-generate (~155 chars)
       */
      metaDescription?: string;

      /**
       * Canonical URL - `Url`
Override canonical URL (rarely needed - leave empty for auto-generation)
       */
      canonicalUrl?: string;

      /**
       * Social Share Image - `Image`
1200×630px recommended. Falls back to page hero image if empty.
       */
      ogImage?: {
        asset: Sanity.Asset;
        crop?: Sanity.ImageCrop;
        hotspot?: Sanity.ImageHotspot;

        /**
         * Alt text - `String`
         */
        alt?: string;
      };

      /**
       * Social Title Override - `String`
Optional. Defaults to meta title if empty.
       */
      ogTitle?: string;

      /**
       * Social Description Override - `Text`
Optional. Defaults to meta description if empty.
       */
      ogDescription?: string;

      /**
       * Hide from Search Engines - `Boolean`
Check to add "noindex" meta tag (prevents Google indexing)
       */
      noIndex?: boolean;

      /**
       * No Follow Links - `Boolean`
Check to add "nofollow" meta tag (prevents Google following links)
       */
      noFollow?: boolean;

      /**
       * Structured Data (JSON-LD) - `Object`
Control which Schema.org structured data to include
       */
      structuredData?: {
        /**
       * Enable Service Schema - `Boolean`
Automatically enabled for service pages
       */
        enableService?: boolean;

        /**
       * Enable FAQ Schema - `Boolean`
Auto-enabled if page has FAQ section
       */
        enableFAQ?: boolean;

        /**
       * Enable Offer Schema - `Boolean`
Enable special offer structured data
       */
        enableOffer?: boolean;
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

    type CrossSiteReference = {
      _type: "crossSiteReference";

      /**
       * Source Dataset - `String`
The dataset to fetch content from (e.g., site-shared, site-budds)
       */
      dataset?: "site-shared" | "site-budds" | "site-hvac";

      /**
       * Document ID - `String`
The _id of the document to reference
       */
      documentId?: string;

      /**
       * Document Type - `String`
Optional: The _type of the document (for validation)
       */
      documentType?: "faq" | "service" | "post" | "testimonial" | "page";

      /**
       * Preview - `Object`
Preview information (auto-populated)
       */
      preview?: {
        /**
         * Title - `String`
         */
        title?: string;

        /**
         * Description - `Text`
         */
        description?: string;
      };
    };

    type WorkflowState = {
      _type: "workflowState";

      /**
       * Current State - `String`
       */
      state?: "draft" | "in_review" | "approved" | "published" | "archived";

      /**
       * State Changed At - `Datetime`
When the workflow state was last changed
       */
      changedAt?: string;

      /**
       * Changed By - `String`
User who changed the workflow state
       */
      changedBy?: string;

      /**
       * Notes - `Text`
Optional notes about the current state
       */
      notes?: string;
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
      | CookieConsent
      | PrivacyPolicy
      | Navigation
      | ServiceCategory
      | Service
      | ServiceLocation
      | Location
      | Offer
      | CaseStudy
      | Coupon
      | Lead
      | PageTemplate
      | Redirect
      | AuditLog
      | Webhook
      | WebhookLog
      | ApprovalRequest
      | Role
      | UserProfile
      | Testimonial
      | Faq
      | Page
      | Post
      | Category
      | Redirects;
  }
}
