# Agent Quick Reference Card
**Local Business CMS Framework**

---

## 🚀 **AUTOMATIC ROUTING ENABLED**

**You don't need to pick agents - just describe your task!**

The auto-router analyzes your request and invokes the correct specialist(s) automatically.

---

## 🎯 Just Say What You Want

**Examples (System routes automatically):**

```
You: "Add a warranty field to service schema"
→ System routes to sanity-cms-master ✅

You: "Fix the mobile menu not closing"
→ System routes to frontend-developer-pro ✅

You: "Run the tests"
→ System routes to test-writer-fixer ✅

You: "Why is the homepage so slow?"
→ System routes to performance-benchmarker ✅

You: "Deploy to production"
→ System routes to devops-automator ✅
```

**Multi-step tasks? Also automatic:**

```
You: "Add a blog feature"
→ System chains: sanity-cms-master → frontend-developer-pro
   → test-writer-fixer → devops-automator ✅
```

---

## 📊 What The System Detects (For Reference Only)

You don't need to memorize this - the system detects automatically:

| Task | Auto-Routes To | Example |
|------|-------|---------|
| Add schema field | sanity-cms-master | "Add urgency field to service" |
| Fix mobile menu | frontend-developer-pro | "Menu doesn't close on mobile" |
| SEO tests failing | test-writer-fixer | "Fix failing meta tag tests" |
| Slow page load | performance-benchmarker | "Homepage LCP is 4.5s" |
| Deploy to all sites | devops-automator | "Push schema to 100 datasets" |
| Create API route | backend-architect | "API for lead submissions" |
| Test webhook | api-tester | "Verify webhook signatures" |
| A/B test setup | experiment-tracker | "Test hero variant" |
| Design tokens | ui-designer | "Refine color system" |
| Major launch | project-shipper | "Coordinate v2.0 release" |

---

## 🔥 Emergency Quick Picks

**"Site is broken!"**
→ Start with test-writer-fixer to diagnose

**"Build is failing!"**
→ devops-automator

**"Types are wrong!"**
→ sanity-cms-master (regenerate types)

**"Performance tanked!"**
→ performance-benchmarker (find bottleneck)

**"Tests won't pass!"**
→ test-writer-fixer

---

## 🎨 File Path → Auto-Route

```
src/sanity/schemaTypes/** → sanity-cms-master
src/sanity/queries.ts → sanity-cms-master
src/components/** → frontend-developer-pro
src/app/**/page.tsx → frontend-developer-pro
tests/** → test-writer-fixer
.github/workflows/** → devops-automator
src/app/api/** → backend-architect
```

---

## 💡 Keyword Triggers

**Instant Routes:**
- `schema` → sanity-cms-master
- `GROQ` → sanity-cms-master
- `component` → frontend-developer-pro
- `test` → test-writer-fixer
- `deploy` → devops-automator
- `benchmark` → performance-benchmarker

---

## 🔄 Multi-Step Workflows

### New Feature
1. sanity-cms-master (schema)
2. frontend-developer-pro (UI)
3. test-writer-fixer (tests)
4. devops-automator (deploy)

### Bug Fix
1. test-writer-fixer (reproduce)
2. [specialist agent] (fix)
3. test-writer-fixer (verify)
4. devops-automator (deploy)

### Performance Issue
1. performance-benchmarker (diagnose)
2. [specialist agent] (optimize)
3. performance-benchmarker (re-test)
4. devops-automator (deploy)

### New Site Launch
1. sanity-cms-master (clone dataset)
2. devops-automator (configure/deploy)
3. test-writer-fixer (validate)
4. performance-benchmarker (audit)

---

## 📖 Full Documentation

- **[AGENT_TEAM.md](.claude/AGENT_TEAM.md)** - Complete agent details
- **[WORKFLOW_ROUTING.md](.claude/WORKFLOW_ROUTING.md)** - Routing logic & patterns
- **[CLAUDE.md](../CLAUDE.md)** - Main project guide

---

**Last Updated**: October 24, 2025
