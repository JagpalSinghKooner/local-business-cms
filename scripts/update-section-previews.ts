#!/usr/bin/env tsx
/**
 * Script to update section schemas with visual preview components
 * This adds lucide-react icons and preview cards to all section types
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const sectionsDir = join(process.cwd(), 'src/sanity/schemaTypes/objects/sections')

const updates = [
  {
    file: 'faq.ts',
    icon: 'HelpCircle',
    previewCard: 'FaqPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      faqs: 'faqs',
      display: 'display',
    },
  },
  {
    file: 'cta.ts',
    icon: 'Megaphone',
    previewCard: 'CtaPreviewCard',
    selectFields: {
      heading: 'heading',
      body: 'body',
      background: 'background',
      ctas: 'ctas',
    },
  },
  {
    file: 'testimonials.ts',
    icon: 'Quote',
    previewCard: 'TestimonialPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      testimonials: 'testimonials',
      layout: 'style',
    },
  },
  {
    file: 'gallery.ts',
    icon: 'Images',
    previewCard: 'GalleryPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      images: 'images',
      columns: 'columns',
    },
  },
  {
    file: 'features.ts',
    icon: 'Zap',
    previewCard: 'FeaturesPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      features: 'features',
      layout: 'layout',
    },
  },
  {
    file: 'contact.ts',
    icon: 'Mail',
    previewCard: 'ContactPreviewCard',
    selectFields: {
      heading: 'heading',
      description: 'description',
      showMap: 'showMap',
      showContactInfo: 'showContactInfo',
    },
  },
  {
    file: 'services.ts',
    icon: 'Wrench',
    previewCard: 'ServicesPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      services: 'services',
      displayAll: 'displayAll',
      layout: 'layout',
    },
  },
  {
    file: 'locations.ts',
    icon: 'MapPin',
    previewCard: 'LocationsPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      locations: 'locations',
      displayAll: 'displayAll',
      showMap: 'showMap',
    },
  },
  {
    file: 'offers.ts',
    icon: 'Tag',
    previewCard: 'OffersPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      offers: 'offers',
      displayAll: 'displayAll',
      layout: 'layout',
    },
  },
  {
    file: 'text.ts',
    icon: 'FileText',
    previewCard: 'TextPreviewCard',
    selectFields: {
      heading: 'heading',
      body: 'body',
      align: 'alignment',
    },
  },
  {
    file: 'stats.ts',
    icon: 'TrendingUp',
    previewCard: 'StatsPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      stats: 'stats',
    },
  },
  {
    file: 'steps.ts',
    icon: 'ListOrdered',
    previewCard: 'StepsPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      steps: 'steps',
    },
  },
  {
    file: 'logos.ts',
    icon: 'Grid3x3',
    previewCard: 'LogosPreviewCard',
    selectFields: {
      title: 'title',
      logos: 'logos',
    },
  },
  {
    file: 'mediaText.ts',
    icon: 'LayoutTemplate',
    previewCard: 'MediaTextPreviewCard',
    selectFields: {
      heading: 'heading',
      body: 'body',
      media: 'media',
      mediaPosition: 'mediaPosition',
    },
  },
  {
    file: 'timeline.ts',
    icon: 'Clock',
    previewCard: 'TimelinePreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      events: 'events',
    },
  },
  {
    file: 'pricingTable.ts',
    icon: 'DollarSign',
    previewCard: 'PricingTablePreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      plans: 'plans',
    },
  },
  {
    file: 'quote.ts',
    icon: 'MessageSquareQuote',
    previewCard: 'QuotePreviewCard',
    selectFields: {
      quote: 'quote',
      author: 'author',
      role: 'role',
    },
  },
  {
    file: 'blogList.ts',
    icon: 'BookOpen',
    previewCard: 'BlogListPreviewCard',
    selectFields: {
      title: 'title',
      description: 'description',
      postsToShow: 'postsToShow',
      showFeaturedFirst: 'showFeaturedFirst',
    },
  },
]

function updateSectionFile(update: (typeof updates)[0]) {
  const filePath = join(sectionsDir, update.file)

  try {
    let content = readFileSync(filePath, 'utf-8')

    // Add lucide-react icon import if not present
    if (!content.includes('lucide-react')) {
      const importLine = `import { ${update.icon} } from 'lucide-react'\n`
      // Insert after the last import
      const lastImportIndex = content.lastIndexOf('import ')
      const nextLineIndex = content.indexOf('\n', lastImportIndex)
      content = content.slice(0, nextLineIndex + 1) + importLine + content.slice(nextLineIndex + 1)
    }

    // Add preview card import if not present
    if (!content.includes(update.previewCard)) {
      const importLine = `import ${update.previewCard} from '../../../components/previews/${update.previewCard}'\n`
      const lastImportIndex = content.lastIndexOf('import ')
      const nextLineIndex = content.indexOf('\n', lastImportIndex)
      content = content.slice(0, nextLineIndex + 1) + importLine + content.slice(nextLineIndex + 1)
    }

    // Add icon property if not present
    if (!content.includes('icon:')) {
      const typeObjectIndex = content.indexOf('type: \'object\',')
      if (typeObjectIndex !== -1) {
        content =
          content.slice(0, typeObjectIndex + 'type: \'object\','.length) +
          `\n  icon: ${update.icon},` +
          content.slice(typeObjectIndex + 'type: \'object\','.length)
      }
    }

    // Update preview section
    const previewIndex = content.indexOf('preview: {')
    if (previewIndex !== -1) {
      // Find the closing brace of the preview object
      let braceCount = 1
      let currentIndex = previewIndex + 'preview: {'.length
      while (braceCount > 0 && currentIndex < content.length) {
        if (content[currentIndex] === '{') braceCount++
        if (content[currentIndex] === '}') braceCount--
        currentIndex++
      }

      // Build new preview object
      const selectFieldsStr = Object.entries(update.selectFields)
        .map(([key, value]) => `      ${key}: '${value}',`)
        .join('\n')

      const newPreview = `preview: {
    select: {
${selectFieldsStr}
    },
    // @ts-ignore
    component: ${update.previewCard},
  },`

      content =
        content.slice(0, previewIndex) + newPreview + content.slice(currentIndex + 1)
    }

    writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ Updated ${update.file}`)
  } catch (error) {
    console.error(`❌ Error updating ${update.file}:`, error)
  }
}

// Run updates
console.log('🚀 Updating section schemas with visual previews...\n')
updates.forEach(updateSectionFile)
console.log('\n✨ Done! All section schemas updated.')
