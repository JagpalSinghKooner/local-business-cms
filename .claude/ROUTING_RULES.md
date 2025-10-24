# Bulletproof Agent Routing Rules

**VERSION**: 2.0
**STATUS**: Production
**LAST UPDATED**: 2025-10-24

---

## Core Routing Principle

**Route tasks to specialists based on DOMAIN, not just KEYWORDS**

Every route must include:
1. **Which agent** to use
2. **Why that agent** (domain expertise required)
3. **Success criteria** (how to verify routing was correct)
4. **Verification requirements** (what agent must prove)
5. **Escalation path** (what to do if agent fails)

---

## Routing Decision Tree

### Level 1: Identify Task Category

```
User Request
    │
    ├─→ WCAG/Accessibility Issue → Level 2A (UI/Design)
    ├─→ Performance/Bundle Issue → Level 2B (Performance)
    ├─→ Test Failure/Writing → Level 2C (Testing)
    ├─→ Visual/Responsive Issue → Level 2D (Frontend)
    ├─→ API/Backend Logic → Level 2E (Backend)
    ├─→ Deployment/CI/CD → Level 2F (DevOps)
    ├─→ Schema/CMS Issue → Level 2G (Sanity)
    └─→ Complex Multi-Agent → Level 2H (Orchestration)
```

### Level 2A: UI/Design Issues

```
WCAG/Accessibility Issue
    │
    ├─→ Color Contrast Violation
    │   Agent: ui-designer
    │   Why: Knows WCAG standards, color theory, contrast ratios
    │   Verification: Must run `pnpm a11y` and show 0 violations
    │   Must search: ALL color instances (CSS + TypeScript + JS)
    │
    ├─→ Component Styling
    │   Agent: frontend-developer-pro
    │   Why: Knows React, Tailwind, responsive design
    │   Verification: Must run visual regression tests
    │
    └─→ Design System/Tokens
        Agent: ui-designer
        Why: Manages design tokens, theme system
        Verification: Must check tokens.ts AND globals.css
```

**Critical Routing Rule for Color Issues**:
```markdown
IF (issue mentions "color" OR "contrast" OR "WCAG" OR "accessibility")
THEN route to: ui-designer
AND require:
  - Search: grep -r "COLOR_HEX" src/
  - Verify: pnpm a11y
  - Check: tokens.ts + globals.css + component overrides
```

---

### Level 2B: Performance Issues

```
Performance/Bundle Issue
    │
    ├─→ Bundle Size Too Large
    │   Agent: performance-benchmarker
    │   Why: Knows webpack, code splitting, lazy loading
    │   Verification: Must run `rm -rf .next && pnpm build && ls -lh`
    │   Critical: NEVER estimate, ALWAYS measure
    │
    ├─→ Slow TTFB/Page Load
    │   Agent: performance-benchmarker
    │   Why: Knows GROQ optimization, caching strategies
    │   Verification: Must measure with curl or performance API
    │
    └─→ Core Web Vitals Failing
        Agent: performance-benchmarker
        Why: Knows LCP, CLS, FID metrics
        Verification: Must run Lighthouse CI or Web Vitals API
```

**Critical Routing Rule for Bundle Issues**:
```markdown
IF (issue mentions "bundle" OR "7MB" OR "main-app.js" OR "lazy loading")
THEN route to: performance-benchmarker
AND require:
  - Clean build: rm -rf .next && pnpm build
  - Measure: ls -lh .next/static/chunks/main-app*.js
  - Check: Next.js metadata exports (common cause)
  - Verify: pnpm bundle
  - Report: ACTUAL file sizes, not estimates
```

---

### Level 2C: Testing Issues

```
Test Failure/Writing
    │
    ├─→ Tests Failing After Code Change
    │   Agent: test-writer-fixer
    │   Why: Runs tests, analyzes failures, fixes issues
    │   Verification: Must show passing test output
    │   Gold Standard: This agent has 100% success rate
    │
    ├─→ Need New Tests for Feature
    │   Agent: test-writer-fixer
    │   Why: Writes comprehensive test suites
    │   Verification: Must run new tests and show coverage
    │
    └─→ Visual Regression Tests
        Agent: frontend-developer-pro
        Why: Knows Playwright, screenshot testing
        Verification: Must generate/update baselines
```

**Why test-writer-fixer is Gold Standard**:
- ✅ Always runs actual commands
- ✅ Reports real test output
- ✅ Never estimates or theorizes
- ✅ Fails honestly when tests don't pass

**All agents should emulate this pattern**

---

### Level 2D: Frontend Issues

```
Visual/Responsive Issue
    │
    ├─→ Responsive Design Broken
    │   Agent: frontend-developer-pro
    │   Why: Knows media queries, flexbox, grid
    │   Verification: Must test at 768px, 1024px, 1440px breakpoints
    │
    ├─→ Component Not Rendering
    │   Agent: frontend-developer-pro
    │   Why: Knows React debugging, component lifecycle
    │   Verification: Must fix and show working component
    │
    └─→ Horizontal Overflow
        Agent: frontend-developer-pro
        Why: Knows CSS containment, overflow debugging
        Verification: Must test with viewport width checks
```

---

### Level 2E: Backend Issues

```
API/Backend Logic
    │
    ├─→ Server Action Failing
    │   Agent: backend-architect
    │   Why: Knows Next.js server actions, form handling
    │   Verification: Must test API route manually
    │
    ├─→ Database Query Slow
    │   Agent: backend-architect
    │   Why: Knows query optimization, indexing
    │   Verification: Must measure query time before/after
    │
    └─→ GROQ Query Issues
        Agent: backend-architect
        Why: Knows Sanity GROQ optimization
        Verification: Must test in Sanity Vision
```

---

### Level 2F: DevOps Issues

```
Deployment/CI/CD
    │
    ├─→ Build Failing in CI
    │   Agent: devops-automator
    │   Why: Knows GitHub Actions, build pipelines
    │   Verification: Must show passing CI run
    │
    ├─→ Deployment Issues
    │   Agent: devops-automator
    │   Why: Knows Vercel, environment variables
    │   Verification: Must deploy and verify live site
    │
    └─→ Multi-Site Schema Deploy
        Agent: devops-automator
        Why: Knows pnpm deploy-schema-all workflow
        Verification: Must verify schema on all datasets
```

---

### Level 2G: CMS/Sanity Issues

```
Schema/CMS Issue
    │
    ├─→ Schema Validation Error
    │   Agent: sanity-cms-master-doctrine
    │   Why: Knows Sanity schema patterns, validation
    │   Verification: Must run sanitize:types without errors
    │
    ├─→ Desk Structure Issue
    │   Agent: sanity-cms-master-doctrine
    │   Why: Knows Sanity desk customization
    │   Verification: Must test in Studio UI
    │
    └─→ Cross-Tenant Data Leak
        Agent: sanity-cms-master-doctrine
        Why: Knows dataset isolation, security
        Verification: Must test GROQ queries with filters
```

---

### Level 2H: Complex Multi-Agent Tasks

```
Complex Multi-Agent Task
    │
    ├─→ Multiple Domains Involved
    │   Orchestrator: auto-router (YOU)
    │   Strategy: Route sub-tasks to specialists
    │   Verification: All sub-tasks must report success
    │   Pattern: Sequential or Parallel based on dependencies
    │
    ├─→ Agent Failed Twice
    │   Orchestrator: studio-coach
    │   Strategy: Analyze failure, motivate, provide clarity
    │   Verification: Re-route with detailed feedback
    │
    └─→ Launch/Go-To-Market
        Orchestrator: project-shipper
        Strategy: Coordinate releases, communication
        Verification: All launch checklist items complete
```

---

## Automatic Verification Loop

**Every agent task follows this pattern:**

```
┌─────────────────────────────────────────────┐
│  1. Route Task to Specialist Agent         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  2. Agent Executes Task                     │
│     - Search & Scope                        │
│     - Implementation                        │
│     - Verification (MANDATORY)              │
│     - Honest Reporting                      │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  3. Orchestrator Verifies Agent's Report    │
│     (Don't trust agent's self-assessment)   │
└──────────────┬──────────────────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ▼           ▼
    ┌────────┐  ┌─────────┐
    │ PASS?  │  │ FAIL?   │
    └────┬───┘  └────┬────┘
         │           │
         │           ▼
         │      ┌──────────────────────────────┐
         │      │  4. Provide Specific Feedback│
         │      │     - What failed             │
         │      │     - Why it failed           │
         │      │     - What's needed           │
         │      └──────────┬───────────────────┘
         │                 │
         │                 ▼
         │      ┌──────────────────────────────┐
         │      │  5. Retry (Max 2 attempts)   │
         │      └──────────┬───────────────────┘
         │                 │
         │           ┌─────┴─────┐
         │           │           │
         │           ▼           ▼
         │      ┌────────┐  ┌───────────┐
         │      │Success │  │Failed 2x  │
         │      └────┬───┘  └─────┬─────┘
         │           │            │
         ▼           ▼            ▼
    ┌────────────────────────────────────┐
    │  Task Complete                     │
    └────────────────────────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │ Escalate to     │
                            │ Different Agent │
                            │ or Human        │
                            └─────────────────┘
```

---

## Routing Examples with Success Criteria

### Example 1: Color Contrast Violation

**User Request**: "Fix the color contrast violation on primary buttons"

**Routing Decision**:
```markdown
✅ Route to: ui-designer

Why:
- Domain: WCAG accessibility, color theory
- Requires: Contrast ratio calculations
- Needs: Knowledge of CSS cascade and TypeScript defaults

Required Context:
- Current color: #0ea5e9 (sky-500)
- Contrast ratio: 2.77:1
- WCAG AA requires: 4.5:1
- Must check: CSS + TypeScript + JavaScript

Success Criteria:
- [ ] All color instances updated (not just CSS)
- [ ] Contrast ratio ≥ 4.5:1
- [ ] `pnpm a11y` shows 0 violations
- [ ] Agent provides before/after measurements

Verification Commands:
```bash
grep -r "#0ea5e9" src/
grep -r "sky-500" src/
pnpm a11y
```

Escalation:
If failed 2x → Route to frontend-developer-pro for full component audit
```

---

### Example 2: Bundle Size Explosion

**User Request**: "main-app.js is 7.4MB, need to fix immediately"

**Routing Decision**:
```markdown
✅ Route to: performance-benchmarker

Why:
- Domain: Bundle optimization, code splitting
- Requires: Understanding of Next.js bundling
- Needs: Knowledge of lazy loading patterns

Required Context:
- Current size: 7.4MB
- Budget: 200KB
- Violation: 3600% over budget
- Likely cause: Sanity Studio bundled into main app

Success Criteria:
- [ ] main-app.js < 200KB
- [ ] `pnpm bundle` passes
- [ ] Agent provides `ls -lh` output as proof
- [ ] Studio code isolated to /studio route

Verification Commands:
```bash
rm -rf .next
pnpm build
ls -lh .next/static/chunks/main-app*.js
pnpm bundle
```

Critical Rule:
Agent MUST run these commands and report ACTUAL sizes.
NO estimates. NO theories. Only measured results.

Escalation:
If failed 2x → Route to backend-architect to investigate server-side bundling
```

---

### Example 3: Tests Failing After Refactor

**User Request**: "Tests are failing after I refactored the authentication module"

**Routing Decision**:
```markdown
✅ Route to: test-writer-fixer

Why:
- Domain: Test debugging, fixture updates
- Requires: Understanding of test frameworks
- Needs: Ability to analyze test failures
- Gold Standard: This agent has 100% success rate

Required Context:
- What was refactored: authentication module
- Which tests failing: (agent will discover)
- Error messages: (agent will capture)

Success Criteria:
- [ ] All tests passing
- [ ] `pnpm test` shows green output
- [ ] Agent provides test output as proof
- [ ] No tests skipped or disabled

Verification Commands:
```bash
pnpm test
pnpm typecheck
pnpm lint
```

Why This Agent Always Succeeds:
- Always runs actual commands
- Reports real output
- Fails honestly if tests still broken
- No assumptions or estimates

Escalation:
If failed 2x → Unlikely (has 100% success rate)
But if happens → Route to backend-architect for deeper code review
```

---

## Common Routing Mistakes to Avoid

### ❌ Mistake 1: Routing Based on Keywords Alone

**Bad**:
```
User: "The blue color is too light"
→ Route to: ui-designer (keyword: "color")
```

**Why Bad**: Missing context about WHAT needs fixing

**Good**:
```
User: "The blue color is too light"
→ Analyze: Is this a contrast issue? Design preference? Branding?
→ Ask clarifying question OR route with full context:
   "Route to ui-designer: Adjust primary brand color brightness
    Current: sky-500, Need: darker for better contrast
    Verify: Check WCAG compliance after change"
```

---

### ❌ Mistake 2: Not Providing Success Criteria

**Bad**:
```
Route to performance-benchmarker: "Optimize the bundle"
```

**Why Bad**: Agent doesn't know what "optimized" means

**Good**:
```
Route to performance-benchmarker: "Reduce main-app.js bundle size"
Success Criteria:
- Target: < 200KB (currently 7.4MB)
- Budget: per-chunk limit
- Verification: Must run `ls -lh` and provide proof
- Must check: Sanity metadata exports (common cause)
```

---

### ❌ Mistake 3: Trusting Agent Self-Assessment

**Bad**:
```
Agent reports: "Fixed! Bundle reduced 80%"
Orchestrator: "Great, task complete"
```

**Why Bad**: Agent didn't provide verification proof

**Good**:
```
Agent reports: "Fixed! Bundle reduced 80%"
Orchestrator: "Show me the ls -lh output"
Agent provides: "main-app.js: 7.4M"
Orchestrator: "❌ FAILED - size unchanged. Root cause?"
→ Retry with specific feedback
```

---

### ❌ Mistake 4: Not Escalating After 2 Failures

**Bad**:
```
Agent fails → Retry
Agent fails again → Retry again
Agent fails 3rd time → Retry again
(infinite loop)
```

**Why Bad**: Agent clearly doesn't have capability

**Good**:
```
Agent fails → Retry with specific feedback
Agent fails again → Escalate to different agent OR request human help
Maximum retries: 2
```

---

## Framework-Specific Routing Rules

### Next.js 15 Specific

**Bundle Size Issues**:
- Check for: `export { X } from 'large-package'` (triggers build-time import)
- Solution: Define inline or use `dynamic(() => import())`
- Agent: performance-benchmarker

**Metadata Issues**:
- Check for: Re-exporting from `next-sanity/studio`
- Solution: Define metadata inline
- Agent: performance-benchmarker

**Server Actions**:
- Check for: `'use server'` directive
- Solution: Proper error handling, validation
- Agent: backend-architect

---

### Sanity CMS Specific

**GROQ Query Slow**:
- Check for: Missing field projection `{ _id, title }` vs `{ ... }`
- Solution: Fetch only needed fields
- Agent: backend-architect

**Cross-Tenant Data Leak**:
- Check for: Missing `_id.startsWith('drafts.')` filters
- Solution: Add dataset-specific filters
- Agent: sanity-cms-master-doctrine

**Schema Validation**:
- Check for: Reserved field names (`_type`, `_schemaVersion`)
- Solution: Rename to non-reserved names
- Agent: sanity-cms-master-doctrine

---

### WCAG 2.1 AA Specific

**Color Contrast**:
- Requirement: 4.5:1 for normal text, 3:1 for large text (18pt+)
- Check: CSS + TypeScript + JavaScript (all color definitions)
- Agent: ui-designer
- Verification: `pnpm a11y` must show 0 violations

**Touch Targets**:
- Requirement: Minimum 44x44px for interactive elements
- Check: All buttons, links, form inputs
- Agent: frontend-developer-pro
- Verification: Visual regression tests

**Keyboard Navigation**:
- Requirement: All interactive elements accessible via keyboard
- Check: Focus styles, tab order
- Agent: frontend-developer-pro
- Verification: Manual keyboard testing + axe-core

---

## Quick Routing Reference

| Issue Type | Primary Agent | Backup Agent | Verification |
|------------|--------------|--------------|--------------|
| Color contrast | ui-designer | frontend-developer-pro | `pnpm a11y` |
| Bundle size | performance-benchmarker | backend-architect | `ls -lh` + `pnpm bundle` |
| Tests failing | test-writer-fixer | backend-architect | `pnpm test` |
| Visual regression | frontend-developer-pro | ui-designer | `pnpm playwright test` |
| GROQ query slow | backend-architect | sanity-cms-master-doctrine | Measure query time |
| Responsive design | frontend-developer-pro | ui-designer | Test at breakpoints |
| CI/CD issues | devops-automator | backend-architect | Show passing CI run |
| Schema errors | sanity-cms-master-doctrine | backend-architect | `pnpm sanitize:types` |

---

## Success Metrics

**Target Success Rates** (First Attempt):
- test-writer-fixer: 100% ✅ (Gold Standard)
- All other agents: 80%+ (Current: 50%)

**How to Improve**:
1. Mandatory verification protocols
2. Search-before-edit requirements
3. Honest failure reporting
4. Framework-specific knowledge
5. Automatic retry with feedback

---

## Remember

**The goal is not speed. The goal is correctness.**

- Better to take 2 attempts with verification than 1 attempt with false success
- Better to escalate after 2 failures than infinite retry loop
- Better to report honest FAIL than false PASS

**Trust, but verify.**

---

**For full verification protocol, see**: `.claude/VERIFICATION_PROTOCOL.md`
**For agent-specific knowledge, see**: `.claude/knowledge/`
**For agent capabilities, see**: `.claude/AGENT_TEAM.md`
