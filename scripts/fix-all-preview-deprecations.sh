#!/bin/bash

# Array of section files to fix
FILES=(
  "src/sanity/schemaTypes/objects/sections/text.ts"
  "src/sanity/schemaTypes/objects/sections/services.ts"
  "src/sanity/schemaTypes/objects/sections/locations.ts"
  "src/sanity/schemaTypes/objects/sections/testimonials.ts"
  "src/sanity/schemaTypes/objects/sections/faq.ts"
  "src/sanity/schemaTypes/objects/sections/offers.ts"
  "src/sanity/schemaTypes/objects/sections/cta.ts"
  "src/sanity/schemaTypes/objects/sections/contact.ts"
  "src/sanity/schemaTypes/objects/sections/features.ts"
  "src/sanity/schemaTypes/objects/sections/mediaText.ts"
  "src/sanity/schemaTypes/objects/sections/steps.ts"
  "src/sanity/schemaTypes/objects/sections/stats.ts"
  "src/sanity/schemaTypes/objects/sections/logos.ts"
  "src/sanity/schemaTypes/objects/sections/timeline.ts"
  "src/sanity/schemaTypes/objects/sections/pricingTable.ts"
  "src/sanity/schemaTypes/objects/sections/gallery.ts"
  "src/sanity/schemaTypes/objects/sections/quote.ts"
  "src/sanity/schemaTypes/objects/sections/blogList.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Create backup
    cp "$file" "$file.bak"
    
    # Use perl for multi-line replacement
    perl -i -0pe 's/(\s+)(\/\/ @ts-ignore\s+component:\s+(\w+),\s+\},)/  },\n  components: {\n    preview: $3,\n  },/gs' "$file"
    
    echo "✅ Fixed $file"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo ""
echo "🎉 All files processed!"
