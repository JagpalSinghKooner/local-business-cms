#!/bin/bash

# Test script to verify iframe headers are correctly configured
# Run this after starting dev server: pnpm dev

echo "🧪 Testing Iframe Preview Headers..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check homepage headers
echo "Test 1: Checking homepage CSP headers..."
RESPONSE=$(curl -s -I http://localhost:3001/ 2>/dev/null)

if echo "$RESPONSE" | grep -q "frame-ancestors \*"; then
    echo -e "${GREEN}✅ PASS${NC} - frame-ancestors allows all origins (development mode)"
elif echo "$RESPONSE" | grep -q "frame-ancestors"; then
    echo -e "${YELLOW}⚠️  WARN${NC} - frame-ancestors found but may be restricted"
    echo "$RESPONSE" | grep "frame-ancestors"
else
    echo -e "${RED}❌ FAIL${NC} - No frame-ancestors directive found"
fi

# Test 2: Check X-Frame-Options is removed
echo ""
echo "Test 2: Checking X-Frame-Options header..."
if echo "$RESPONSE" | grep -qi "X-Frame-Options"; then
    echo -e "${RED}❌ FAIL${NC} - X-Frame-Options header still present (blocks iframe)"
    echo "$RESPONSE" | grep -i "X-Frame-Options"
else
    echo -e "${GREEN}✅ PASS${NC} - X-Frame-Options header removed (allows iframe)"
fi

# Test 3: Check /api/preview route
echo ""
echo "Test 3: Checking /api/preview endpoint..."
PREVIEW_RESPONSE=$(curl -s -I "http://localhost:3001/api/preview?type=page&slug=test" 2>/dev/null)

if echo "$PREVIEW_RESPONSE" | grep -q "HTTP"; then
    echo -e "${GREEN}✅ PASS${NC} - /api/preview endpoint is accessible"
else
    echo -e "${RED}❌ FAIL${NC} - /api/preview endpoint not responding"
fi

# Test 4: Check NODE_ENV
echo ""
echo "Test 4: Checking environment..."
if [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Running in development mode"
else
    echo -e "${YELLOW}⚠️  WARN${NC} - NODE_ENV=$NODE_ENV (not development)"
fi

echo ""
echo "📋 Summary:"
echo "If all tests pass, Studio iframe preview should work."
echo ""
echo "Next steps:"
echo "1. Restart dev server: pnpm dev"
echo "2. Open Studio: http://localhost:3001/studio"
echo "3. Open any page document"
echo "4. Click 'Live Preview' tab"
echo "5. Iframe should load without 'content blocked' error"
echo ""
