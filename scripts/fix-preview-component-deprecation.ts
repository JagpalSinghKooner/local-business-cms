/**
 * Fix Preview Component Deprecation Script
 * Updates all section schemas from deprecated preview.component to components.preview
 */

import fs from 'fs'
import path from 'path'

const sectionsDir = path.join(process.cwd(), 'src/sanity/schemaTypes/objects/sections')

const sectionFiles = [
  'hero.ts',
  'text.ts',
  'services.ts',
  'locations.ts',
  'testimonials.ts',
  'faq.ts',
  'offers.ts',
  'cta.ts',
  'contact.ts',
  'features.ts',
  'mediaText.ts',
  'steps.ts',
  'stats.ts',
  'logos.ts',
  'timeline.ts',
  'pricingTable.ts',
  'gallery.ts',
  'quote.ts',
  'blogList.ts',
]

let updatedCount = 0
let errorCount = 0

sectionFiles.forEach((filename) => {
  const filePath = path.join(sectionsDir, filename)
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Check if file needs updating
    if (!content.includes('preview: {')) {
      console.log(`⏭️  Skipping ${filename} - no preview configuration found`)
      return
    }
    
    if (content.includes('components: {')) {
      console.log(`✅ Skipping ${filename} - already using components.preview`)
      return
    }
    
    // Pattern 1: Replace preview.component with components.preview
    const pattern1 = /preview:\s*\{([^}]*?)\/\/\s*@ts-ignore\s*component:\s*(\w+),/gs
    const pattern2 = /preview:\s*\{([^}]*?)component:\s*(\w+),/gs
    
    let modified = false
    
    if (pattern1.test(content)) {
      content = content.replace(pattern1, (match, selectBlock, componentName) => {
        modified = true
        return `preview: {${selectBlock}},
  components: {
    preview: ${componentName},
  },`
      })
    } else if (pattern2.test(content)) {
      content = content.replace(pattern2, (match, selectBlock, componentName) => {
        modified = true
        return `preview: {${selectBlock}},
  components: {
    preview: ${componentName},
  },`
      })
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8')
      console.log(`✅ Updated ${filename}`)
      updatedCount++
    } else {
      console.log(`⚠️  No changes needed for ${filename}`)
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error)
    errorCount++
  }
})

console.log('\n📊 Summary:')
console.log(`✅ Updated: ${updatedCount} files`)
console.log(`❌ Errors: ${errorCount} files`)
console.log(`📁 Total processed: ${sectionFiles.length} files`)
