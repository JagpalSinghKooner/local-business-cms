# Markdown File Governance

**Version:** 1.0
**Last Updated:** October 24, 2025
**Status:** Enforced

---

## 🎯 Purpose

This document establishes strict rules for where Markdown files belong in this repository to prevent file scatter, maintain organization, and ensure dashboard automation works correctly.

---

## 📁 Approved Locations (THE ONLY 4 PLACES)

### 1. **Root Level** (2 files maximum)
**Location:** `./`
**Allowed Files:**
- `README.md` - Project overview (GitHub convention)
- `CLAUDE.md` - Agent instructions (required by Claude Code)

**Rules:**
- ❌ NO other `.md` files allowed in root
- ❌ NO audit reports, roadmaps, or notes in root
- ✅ Only these two standard files

---

### 2. **Agent Doctrines** (17+ files)
**Location:** `./.claude/agents/`
**Purpose:** Agent behavior definitions
**Allowed Files:**
- `*.md` - Agent doctrine files (e.g., `ui-designer.md`, `backend-architect.md`)
- `.claude/AGENT_TEAM.md`
- `.claude/WORKFLOW_ROUTING.md`
- `.claude/AGENT_QUICK_REFERENCE.md`

**Rules:**
- ✅ Only agent-related configuration
- ❌ NO planning docs, audits, or PRDs
- ❌ NO operational guides
- 🔒 Required for Claude Code framework

---

### 3. **Operational Documentation** (stable guides)
**Location:** `./docs/`
**Purpose:** Active reference guides used in daily operations
**Allowed File Types:**
- Technical guides (testing, monitoring, deployment)
- Architecture references (multi-tenant, cross-site)
- Configuration docs (ports, rollback procedures)
- Content authoring guides

**Current Approved Files:**
- `authoring-guide.md` - CMS content editing guide
- `multi-tenant-shared-vs-isolated.md` - Architecture reference (referenced in CLAUDE.md)
- `cross-site-references-guide.md` - Technical feature guide
- `rollback-playbook.md` - Emergency procedures
- `monitoring-guide.md` - Site monitoring procedures
- `TESTING-GUIDE.md` - Test suite commands
- `PORT-CONFIGURATION.md` - Dev server port setup

**Rules:**
- ✅ Must be actively referenced or used operationally
- ✅ Should be "stable" (not frequently changing)
- ❌ NOT for audits, planning, or temporary notes
- ❌ NOT for roadmaps or PRDs

---

### 4. **Planning & Audit Archive** (consolidated)
**Location:** `./docs/md-files/`
**Purpose:** All planning, audits, PRDs, strategies, and "thinking" documents
**File Categories:**

#### **a) Audits**
Prefix: `audit-*`
Examples:
- `audit-code-quality.md`
- `audit-performance-fixes.md`
- `audit-bundle-size-fix.md`
- `audit-verification-summary.md`
- `audit-schema-scalability.md`

#### **b) Schema & Models**
Prefix: `schema-*`
Examples:
- `schema-multi-tenant-summary.md`
- `schema-content-model-v2.md`

#### **c) Studio UX**
Prefix: `studio-ux-*`
Examples:
- `studio-ux-placeholder-urls.md`
- `studio-ux-improvements.md`

#### **d) SEO & Performance**
Prefix: `seo-*` or `performance-*`
Examples:
- `seo-groq-optimization.md`
- `seo-strategy-notes.md`
- `performance-benchmark-results.md`

#### **e) Roadmaps & PRDs**
Prefix: `prd-*` or `roadmap-*`
Examples:
- `prd-framework.md`
- `roadmap-cms-modernization.md`
- `roadmap-phase8-ui-polish.md`

#### **f) Backlog & TODOs**
Prefix: `backlog-*` or `todo-*`
Examples:
- `backlog-feature-ideas.md`
- `todo-tech-debt.md`

**Rules:**
- ✅ ALL planning, audit, strategy docs go here
- ✅ Use prefixes for categorization
- ✅ Never delete, only archive/update
- ❌ NO operational guides (those go in `./docs/`)

---

## 🚫 Forbidden Locations

### **NEVER put `.md` files in:**
- ❌ `./src/` - Source code only
- ❌ `./public/` - Static assets only
- ❌ `./scripts/` - Executable scripts only
- ❌ `./tests/` - Test code only (except test reports in `test-results/`)
- ❌ Root-level subdirectories (e.g., `./notes/`, `./archive/`)

### **Exception: Generated Artifacts**
**Allowed temporarily:**
- `./test-results/**/*.md` - Generated test error contexts (ephemeral)
- `./playwright-report/**/*.md` - Generated test reports (ephemeral)
- These are `.gitignore`d and don't count toward governance

---

## 📋 Decision Flowchart

When creating a new `.md` file, ask:

```
1. Is this file README.md or CLAUDE.md?
   YES → Root level (`./)
   NO → Continue

2. Is this an agent doctrine/config file?
   YES → `.claude/agents/`
   NO → Continue

3. Is this an active operational guide?
   (Testing, monitoring, architecture reference, deployment procedures)
   YES → `./docs/`
   NO → Continue

4. Is this planning, audit, PRD, strategy, or "thinking" doc?
   YES → `./docs/md-files/` (with appropriate prefix)
   NO → ❌ Reconsider if you need a Markdown file
```

---

## 🔄 Migration Rules

### **When to Move Existing Files**

**Move to `./docs/md-files/` if:**
- ✅ File is a completed audit/report
- ✅ File is planning/roadmap content
- ✅ File is a PRD or strategy doc
- ✅ File contains "thinking" or analysis
- ✅ File is NOT referenced by runtime code

**Leave in `./docs/` if:**
- ✅ File is actively used as reference guide
- ✅ File contains operational procedures
- ✅ File is referenced in `CLAUDE.md` or other configs
- ✅ File would break workflows if moved

**Never Move:**
- 🔒 `README.md`
- 🔒 `CLAUDE.md`
- 🔒 `.claude/agents/*.md`
- 🔒 Agent coordination files

---

## 🛠️ Enforcement

### **Pre-commit Hook (Recommended)**
```bash
# .git/hooks/pre-commit
#!/bin/bash
# Check for .md files in forbidden locations

FORBIDDEN_MD=$(git diff --cached --name-only --diff-filter=A | grep -E '\.md$' | grep -v -E '^(README\.md|CLAUDE\.md|\.claude/|docs/|test-results/|playwright-report/)')

if [ ! -z "$FORBIDDEN_MD" ]; then
  echo "❌ ERROR: Markdown files in forbidden locations:"
  echo "$FORBIDDEN_MD"
  echo ""
  echo "Please move to appropriate location:"
  echo "  - Planning/Audit → ./docs/md-files/"
  echo "  - Operational Guide → ./docs/"
  echo "  - Agent Config → ./.claude/agents/"
  echo ""
  echo "See docs/MARKDOWN-FILE-GOVERNANCE.md for rules"
  exit 1
fi
```

### **GitHub Actions Check**
```yaml
# .github/workflows/markdown-governance.yml
name: Markdown File Governance
on: [pull_request]
jobs:
  check-md-locations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Markdown locations
        run: |
          # Find .md files in forbidden locations
          if find . -name "*.md" \
            -not -path "./README.md" \
            -not -path "./CLAUDE.md" \
            -not -path "./.claude/*" \
            -not -path "./docs/*" \
            -not -path "./test-results/*" \
            -not -path "./playwright-report/*" \
            -not -path "./node_modules/*" \
            -not -path "./.next/*" | grep .; then
            echo "❌ Markdown files found in forbidden locations"
            exit 1
          fi
```

---

## 📊 Dashboard Integration

The audit dashboard (`./docs/audit-report.html`) relies on this structure:

**Data Sources:**
1. `./docs/md-files/**/*.md` - All planning/audit content
2. `./.claude/agents/**/*.md` - Agent capabilities

**Why This Matters:**
- ✅ Dashboard has stable, predictable sources
- ✅ No need to search entire repo for planning docs
- ✅ Automated categorization works correctly
- ✅ New docs auto-appear in dashboard

---

## 🎓 Examples

### ✅ CORRECT Placements

```
# Audit report
./docs/md-files/audit-accessibility-fixes.md

# Performance analysis
./docs/md-files/performance-lighthouse-scores.md

# New feature PRD
./docs/md-files/prd-ai-content-generator.md

# Roadmap update
./docs/md-files/roadmap-q1-2026.md

# Schema planning
./docs/md-files/schema-taxonomy-system.md

# Operational guide
./docs/deployment-checklist.md

# Agent doctrine
./.claude/agents/content-strategist.md
```

### ❌ INCORRECT Placements

```
# ❌ Audit in root
./SECURITY_AUDIT.md
→ Move to: ./docs/md-files/audit-security.md

# ❌ Planning in src
./src/REFACTOR_PLAN.md
→ Move to: ./docs/md-files/roadmap-refactor-plan.md

# ❌ PRD scattered
./features/NEW_CMS_FEATURES.md
→ Move to: ./docs/md-files/prd-cms-features-v2.md

# ❌ Operational in md-files
./docs/md-files/testing-guide.md
→ Move to: ./docs/TESTING-GUIDE.md

# ❌ Random notes
./NOTES.md
→ Delete or move to: ./docs/md-files/backlog-notes.md
```

---

## 🔍 Audit Checklist

**Run this monthly:**

```bash
# Find all .md files
find . -name "*.md" \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./test-results/*" \
  -not -path "./playwright-report/*" \
  | sort

# Check against governance rules
# Files should only appear in:
# - ./README.md
# - ./CLAUDE.md
# - ./.claude/
# - ./docs/*.md (operational)
# - ./docs/md-files/*.md (planning/audit)
```

---

## 📞 Questions?

**"Where does my new Markdown file go?"**
- Planning/audit/PRD → `./docs/md-files/` (with prefix)
- Operational guide → `./docs/`
- Agent config → `./.claude/agents/`
- If unsure → `./docs/md-files/` (safest default)

**"Can I create a new category?"**
- Yes, but use a consistent prefix in `./docs/md-files/`
- Update this document with the new category

**"What about private notes?"**
- Use `./docs/md-files/notes-*.md` (gitignored if sensitive)
- Or keep in personal notes app outside repo

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-24 | Initial governance rules established |

---

**Remember:** A well-organized repository is easier to navigate, automate, and maintain. When in doubt, use `./docs/md-files/` with an appropriate prefix.
