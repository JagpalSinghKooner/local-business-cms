#!/bin/bash

# Markdown File Governance Checker
# Validates that .md files are in approved locations only
# See docs/MARKDOWN-FILE-GOVERNANCE.md for rules

set -e

echo "🔍 Checking Markdown file locations..."

# Find .md files in forbidden locations
FORBIDDEN_MD=$(find . -name "*.md" \
  -not -path "./README.md" \
  -not -path "./CLAUDE.md" \
  -not -path "./.claude/*" \
  -not -path "./docs/*" \
  -not -path "./test-results/*" \
  -not -path "./playwright-report/*" \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.git/*" \
  2>/dev/null || true)

if [ ! -z "$FORBIDDEN_MD" ]; then
  echo ""
  echo "❌ ERROR: Markdown files found in forbidden locations:"
  echo ""
  echo "$FORBIDDEN_MD"
  echo ""
  echo "📋 Approved locations (see docs/MARKDOWN-FILE-GOVERNANCE.md):"
  echo "  1. Root level:"
  echo "     - README.md (project overview)"
  echo "     - CLAUDE.md (agent instructions)"
  echo ""
  echo "  2. Agent config:"
  echo "     - ./.claude/agents/*.md"
  echo ""
  echo "  3. Operational guides:"
  echo "     - ./docs/*.md"
  echo ""
  echo "  4. Planning/Audit archive:"
  echo "     - ./docs/md-files/*.md"
  echo ""
  echo "💡 Suggested actions:"
  echo "   - Planning/audit/PRD → mv to ./docs/md-files/"
  echo "   - Operational guide → mv to ./docs/"
  echo "   - Agent config → mv to ./.claude/agents/"
  echo ""
  exit 1
fi

echo "✅ All Markdown files in approved locations"
exit 0
