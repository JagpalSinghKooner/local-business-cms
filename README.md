# Local Business CMS Framework

A fully dynamic, CMS-driven website framework for local service businesses built with **Next.js 15** and **Sanity CMS**. This framework allows you to launch high-performance, SEO-optimized websites for any service-based business with minimal configuration.

## 🚀 Overview

This is a **reusable boilerplate** that enables launching new business websites where:
- **All content, design, and SEO settings** are controlled in Sanity CMS
- **Next.js** automatically renders pages and metadata based on CMS data
- **No code changes** are needed to deploy a new business or vertical
- **Multiple brands, categories, and geographies** can be served from a single core system

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 (App Router) with TypeScript
- **CMS**: Sanity v4 with custom schema
- **Styling**: Tailwind CSS with dynamic theming
- **Deployment**: Vercel with ISR (Incremental Static Regeneration)
- **SEO**: Custom utilities + JSON-LD structured data

### Key Features
- ✅ **CMS-Driven Frontend**: All content, styling, and metadata from Sanity
- ✅ **SEO-First Architecture**: Automated technical SEO with canonical URLs, Open Graph, JSON-LD
- ✅ **Dynamic Theming**: Brand colors, fonts, and styling controlled via CMS
- ✅ **Performance Optimized**: Core Web Vitals ≥ 90, SSG with ISR
- ✅ **Multi-Site Ready**: One codebase for multiple businesses
- ✅ **Lead Capture**: Configurable contact forms with validation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [...slug]/         # Dynamic page routing
│   ├── [servicePlusCity]/ # Service + Location combinations
│   ├── services/          # Service pages
│   ├── locations/         # Location pages
│   ├── offers/            # Special offers
│   ├── studio/            # Sanity Studio
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Header, Footer, Navigation
│   ├── sections/        # Reusable content sections
│   ├── forms/           # Lead capture forms
│   └── ui/              # UI components
├── sanity/              # Sanity CMS configuration
│   ├── schemaTypes/     # Content schemas
│   ├── loaders.ts       # Data fetching
│   └── queries.ts       # GROQ queries
└── lib/                 # Utilities
    ├── seo.ts           # SEO helpers
    ├── jsonld.ts        # Structured data
    └── tokens.ts        # Design tokens
```

## 🎯 Content Model

### Global Settings
- Business information (name, contact, address)
- Brand identity (logo, colors, fonts)
- SEO settings (meta tags, structured data)
- Analytics & tracking codes

### Content Types
- **Services**: Service offerings with descriptions, SEO, and related services
- **Locations**: Geographic service areas with contact overrides
- **Offers**: Special promotions and discounts
- **Testimonials**: Customer reviews and ratings
- **FAQ**: Frequently asked questions
- **Blog**: Content marketing articles

### Page Templates
- Homepage with customizable sections
- Service detail pages
- Location detail pages
- Service + Location combination pages
- Blog articles and listings
- Generic content pages

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Sanity account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd local-business-cms
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   SANITY_API_TOKEN=your_api_token
   ```

4. **Generate Sanity Types**
   ```bash
   pnpm sanitize:types
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

6. **Access Sanity Studio**
   Visit `http://localhost:3000/studio` to manage content

### Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Sanity CMS
pnpm sanitize:types   # Generate TypeScript types from schema
pnpm sanity:export    # Export content from Sanity
pnpm sanity:import    # Import content to Sanity

# Code Quality
pnpm lint             # Run ESLint
```

## 🎨 Customization

### Branding & Theming
All visual customization is done through Sanity CMS:

1. **Logo & Branding**: Upload your logo and set brand colors
2. **Typography**: Choose from Google Fonts or upload custom fonts
3. **Color Scheme**: Define primary, secondary, and accent colors
4. **Layout**: Control spacing, borders, and component styling

### Content Management
- **Services**: Add your service offerings with descriptions and SEO
- **Locations**: Define your service areas and contact information
- **Pages**: Create custom pages with flexible content sections
- **SEO**: Configure meta tags, structured data, and social sharing

### Sections Available
- Hero sections with CTAs
- Service grids and listings
- Testimonials and reviews
- FAQ sections
- Contact forms
- Gallery and media
- Pricing tables
- Blog listings
- And many more...

## 🔧 Advanced Configuration

### Multi-Site Setup
To serve multiple businesses from one codebase:

1. Create separate Sanity datasets for each business
2. Configure environment variables per deployment
3. Use domain-based routing to serve appropriate content

### SEO Configuration
- **Structured Data**: Automatic JSON-LD generation for LocalBusiness, Service, and FAQ schemas
- **Sitemap**: Auto-generated XML sitemap from CMS content
- **Meta Tags**: Dynamic title, description, and Open Graph tags
- **Canonical URLs**: Automatic canonical URL management

### Performance Optimization
- **Image Optimization**: Automatic WebP/AVIF conversion via Sanity CDN
- **Static Generation**: ISR for optimal performance
- **Caching**: Intelligent caching strategies for content and assets

## 📊 SEO Features

### Technical SEO
- ✅ Automatic sitemap generation
- ✅ Robots.txt management
- ✅ Canonical URL handling
- ✅ Open Graph and Twitter Card support
- ✅ JSON-LD structured data
- ✅ Mobile-first responsive design

### Content SEO
- ✅ Page-level SEO controls
- ✅ Meta descriptions and titles
- ✅ Schema.org markup for local business
- ✅ FAQ structured data
- ✅ Service and location-specific SEO

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms
The framework works with any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Custom VPS

## 📚 Documentation

- [Local Business Framework PRD](./docs/md-files/prd-framework.md) - Complete product requirements
- [CMS Modernization Roadmap](./docs/md-files/roadmap-cms-modernization.md) - Development roadmap
- [Authoring Guide](./docs/authoring-guide.md) - Content management guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the documentation in the `/docs` folder
- Review the Sanity Studio for content management guidance

## 🗺️ Roadmap

### Phase 1: Core Framework ✅
- [x] CMS-driven frontend
- [x] SEO automation
- [x] Dynamic theming
- [x] Lead capture forms

### Phase 2: Advanced Features 🚧
- [ ] Multi-site architecture
- [ ] Advanced SEO controls
- [ ] A/B testing capabilities
- [ ] Analytics integration

### Phase 3: Enterprise Features 📋
- [ ] Workflow management
- [ ] Role-based permissions
- [ ] API integrations
- [ ] Advanced personalization

---

**Built with ❤️ for local businesses**

*This framework enables rapid deployment of professional, SEO-optimized websites for service-based businesses without requiring extensive development resources.*