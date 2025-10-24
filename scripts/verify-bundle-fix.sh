#!/bin/bash

# Bundle Fix Verification Script
# Ensures main-app.js stays under 1KB to prevent Sanity Studio bundling regression

set -e

echo "=========================================="
echo "Bundle Size Verification"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if build exists
if [ ! -d ".next" ]; then
  echo -e "${RED}ERROR: .next directory not found${NC}"
  echo "Run 'pnpm build' first"
  exit 1
fi

# Find main-app.js
MAIN_APP=$(find .next/static/chunks -name "main-app*.js" -type f)

if [ -z "$MAIN_APP" ]; then
  echo -e "${RED}ERROR: main-app.js not found${NC}"
  exit 1
fi

# Get size in bytes
SIZE_BYTES=$(stat -f%z "$MAIN_APP" 2>/dev/null || stat -c%s "$MAIN_APP" 2>/dev/null)

# Convert to human readable
SIZE_HUMAN=$(ls -lh "$MAIN_APP" | awk '{print $5}')

echo "File: $MAIN_APP"
echo "Size: $SIZE_HUMAN ($SIZE_BYTES bytes)"
echo ""

# Check if size is under threshold (1KB = 1024 bytes)
THRESHOLD=1024

if [ "$SIZE_BYTES" -gt "$THRESHOLD" ]; then
  echo -e "${RED}❌ FAILED: main-app.js is larger than 1KB${NC}"
  echo ""
  echo "This indicates Sanity Studio is being bundled in the main app."
  echo "Check /src/app/studio/[[...tool]]/page.tsx for imports from 'next-sanity/studio'"
  echo ""
  exit 1
else
  echo -e "${GREEN}✓ PASSED: main-app.js is under 1KB${NC}"
  echo ""
  
  # Show largest chunks (likely studio lazy-loaded)
  echo "Largest chunks (lazy-loaded code):"
  echo "-----------------------------------"
  find .next/static/chunks -name "*.js" -type f -exec ls -lh {} \; | awk '{print $5, $9}' | sort -h -r | head -5
  echo ""
  
  echo -e "${GREEN}✓ Bundle size verification PASSED${NC}"
  echo ""
  echo "Expected behavior:"
  echo "- main-app.js: <1KB (verified)"
  echo "- Sanity Studio: ~2-3MB (lazy-loaded chunk)"
  echo "- Studio only loads when visiting /studio route"
  exit 0
fi
