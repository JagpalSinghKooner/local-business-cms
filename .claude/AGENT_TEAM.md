# Agent Team Configuration
## Local Business CMS Framework

This document defines the specialized agent team for the Local Business CMS Framework and automatic workflow routing rules.

---

## 🎯 Core Team (Essential - Always Active)

### 1. **Sanity CMS Master** (`sanity-cms-master-doctrine`)
**Primary Responsibility**: All Sanity CMS operations, schema management, GROQ queries, multi-tenant dataset architecture

**Auto-Route When**:
- Schema modifications or additions
- GROQ query optimization needed
- Dataset cloning or migrations
- Type generation issues
- Content modeling questions
- Multi-tenant data isolation tasks
- Sanity Studio customization

**Example Triggers**:
- "Add a new field to the service schema"
- "Optimize this GROQ query"
- "Deploy schema to all datasets"
- "Fix type generation errors"

---

### 2. **Frontend Developer Pro** (`frontend-developer-pro`)
**Primary Responsibility**: Next.js 15, React components, UI development, performance optimization, accessibility

**Auto-Route When**:
- Creating or modifying React components
- Page route implementation
- Performance optimization needed
- Accessibility issues (WCAG AA)
- Image optimization tasks
- Client-side state management
- Tailwind CSS styling
- SEO metadata implementation

**Example Triggers**:
- "Build a new section component"
- "Fix the mobile navigation"
- "Optimize Core Web Vitals"
- "Make this component accessible"

---

### 3. **Test Writer Fixer** (`test-writer-fixer`)
**Primary Responsibility**: Writing, running, and fixing all tests - unit, integration, E2E

**Auto-Route When**:
- Code changes require test updates
- New features need test coverage
- Test failures need diagnosis
- SEO validation tests needed
- Playwright E2E tests required
- Test suite maintenance

**Example Triggers**:
- "Write tests for the new contact form"
- "Fix failing SEO tests"
- "Run and update tests after refactoring"
- "Add E2E tests for the checkout flow"

---

### 4. **Performance Benchmarker** (`performance-benchmarker`)
**Primary Responsibility**: Performance testing, profiling, Core Web Vitals monitoring, optimization recommendations

**Auto-Route When**:
- Performance regression detected
- Need to measure page speed
- Core Web Vitals need improvement
- Bundle size optimization needed
- Lighthouse audits required
- Build time optimization needed

**Example Triggers**:
- "Benchmark the homepage performance"
- "Why is LCP so slow?"
- "Analyze bundle size"
- "Run Lighthouse audit"

---

### 5. **DevOps Automator** (`devops-automator`)
**Primary Responsibility**: CI/CD, deployment automation, Vercel configuration, monitoring, multi-site deployments

**Auto-Route When**:
- CI/CD pipeline issues
- Deployment automation needed
- Vercel configuration changes
- Multi-site deployment orchestration
- Build optimization required
- Monitoring setup needed

**Example Triggers**:
- "Set up automated deployments"
- "Fix the build pipeline"
- "Deploy to all 100 sites"
- "Configure Vercel edge functions"

---

## 🔧 Specialized Team (Situational - Use When Needed)

### 6. **Backend Architect** (`backend-architect`)
**Primary Responsibility**: API design, Server Actions, webhooks, database optimization

**Auto-Route When**:
- Designing new API routes
- Server Actions implementation
- Webhook system development
- Database query optimization
- Third-party API integrations

**Example Triggers**:
- "Design API for lead submissions"
- "Implement webhook retry logic"
- "Optimize database queries"

---

### 7. **UI Designer** (`ui-designer`)
**Primary Responsibility**: Design system, component library, design tokens, visual polish

**Auto-Route When**:
- Design system enhancements
- Component library refinement
- Design token updates
- Visual consistency needed
- Responsive design challenges

**Example Triggers**:
- "Refine the design token system"
- "Create consistent button variants"
- "Design the hero section variants"

---

### 8. **API Tester** (`api-tester`)
**Primary Responsibility**: API testing, integration testing, contract validation

**Auto-Route When**:
- Testing Sanity API integrations
- Webhook endpoint testing
- Third-party API validation
- Server Action testing

**Example Triggers**:
- "Test the webhook endpoints"
- "Validate GA4 integration"
- "Test server actions"

---

### 9. **Experiment Tracker** (`experiment-tracker`)
**Primary Responsibility**: A/B testing, feature flags, experiment tracking, multi-site rollouts

**Auto-Route When**:
- Setting up A/B tests
- Feature flag implementation
- Tracking site experiments
- Gradual multi-site rollouts

**Example Triggers**:
- "Set up A/B test for new hero"
- "Track conversion experiment"
- "Roll out feature to 10% of sites"

---

## 🎭 Orchestration Team (Meta - Use for Complex Coordination)

### 10. **Studio Producer** (`studio-producer`)
**Primary Responsibility**: Cross-team coordination, resource allocation, workflow optimization

**Auto-Route When**:
- Multiple agents need coordination
- Complex multi-phase projects
- Resource allocation needed
- Workflow bottlenecks exist

**Example Triggers**:
- "Coordinate Phase 7 implementation"
- "Manage multi-agent refactoring"

---

### 11. **Studio Coach** (`studio-coach`)
**Primary Responsibility**: Agent motivation, performance coaching, task clarity

**Auto-Route When**:
- Agents seem confused/stuck
- Complex projects starting
- Team morale/clarity needed

**Example Triggers**:
- "Start of major sprint"
- "Agent coordination needed"

---

### 12. **Project Shipper** (`project-shipper`)
**Primary Responsibility**: Launch coordination, release management, go-to-market

**Auto-Route When**:
- Launching major features
- Coordinating releases
- Multi-site launch planning

**Example Triggers**:
- "Launch Phase 7 features"
- "Coordinate v2.0 release"

---

## 🔍 Support Team (Optional - Use Sparingly)

### 13. **Tool Evaluator** (`tool-evaluator`)
**Primary Responsibility**: Evaluate new tools, frameworks, dependencies

**Auto-Route When**:
- Evaluating new dependencies
- Comparing framework options
- Tool selection needed

---

### 14. **Workflow Optimizer** (`workflow-optimizer`)
**Primary Responsibility**: Developer workflow optimization, process improvement

**Auto-Route When**:
- Developer workflow inefficiencies
- Process optimization needed

---

### 15. **Test Results Analyzer** (`test-results-analyzer`)
**Primary Responsibility**: Complex test failure analysis, test metrics reporting

**Auto-Route When**:
- Complex test failure patterns
- Test suite analytics needed

---

### 16. **UX Researcher** (`ux-researcher`)
**Primary Responsibility**: User research, journey mapping, behavior analysis

**Auto-Route When**:
- User research needed
- Design validation required

---

## 🤖 Automatic Routing Rules

### Rule Priority System

**Level 1 - Exact Match (Highest Priority)**
```
Keywords → Agent Mapping:
- "schema", "GROQ", "dataset" → sanity-cms-master
- "component", "Next.js", "performance" → frontend-developer-pro
- "test", "Playwright", "failing" → test-writer-fixer
- "benchmark", "Core Web Vitals", "LCP" → performance-benchmarker
- "deploy", "CI/CD", "Vercel" → devops-automator
```

**Level 2 - Context Match**
```
File Types → Agent:
- src/sanity/schemaTypes/** → sanity-cms-master
- src/components/** → frontend-developer-pro
- tests/** → test-writer-fixer
- src/app/**/page.tsx → frontend-developer-pro
- .github/workflows/** → devops-automator
```

**Level 3 - Task Type Match**
```
Task Categories:
- Content Modeling → sanity-cms-master
- UI Development → frontend-developer-pro
- Quality Assurance → test-writer-fixer
- Performance → performance-benchmarker
- Infrastructure → devops-automator
```

---

## 📋 Common Workflow Patterns

### Pattern 1: New Feature Implementation
```
1. sanity-cms-master → Define schema
2. frontend-developer-pro → Build UI components
3. test-writer-fixer → Write comprehensive tests
4. performance-benchmarker → Verify performance
5. devops-automator → Deploy to production
```

### Pattern 2: Bug Fix
```
1. test-writer-fixer → Reproduce with test
2. frontend-developer-pro OR backend-architect → Fix bug
3. test-writer-fixer → Verify fix and update tests
4. devops-automator → Deploy fix
```

### Pattern 3: Schema Update (Multi-Tenant)
```
1. sanity-cms-master → Update schema locally
2. sanity-cms-master → Test with one dataset
3. devops-automator → Deploy to all 100+ datasets
4. test-writer-fixer → Validate across environments
```

### Pattern 4: Performance Optimization
```
1. performance-benchmarker → Identify bottlenecks
2. frontend-developer-pro → Implement optimizations
3. test-writer-fixer → Ensure no regressions
4. performance-benchmarker → Re-benchmark
5. devops-automator → Deploy if improved
```

### Pattern 5: Multi-Site Launch
```
1. project-shipper → Coordinate launch plan
2. sanity-cms-master → Clone datasets
3. frontend-developer-pro → Verify site rendering
4. test-writer-fixer → Run full test suite
5. devops-automator → Deploy to new sites
6. experiment-tracker → Monitor rollout
```

---

## 🎯 Quick Reference: "Which Agent Do I Need?"

| I Need To... | Use This Agent |
|--------------|----------------|
| Modify Sanity schema | sanity-cms-master |
| Write a GROQ query | sanity-cms-master |
| Clone a dataset | sanity-cms-master |
| Build a new page | frontend-developer-pro |
| Fix mobile styling | frontend-developer-pro |
| Improve LCP score | performance-benchmarker |
| Write new tests | test-writer-fixer |
| Fix failing tests | test-writer-fixer |
| Set up CI/CD | devops-automator |
| Deploy to all sites | devops-automator |
| Design API endpoint | backend-architect |
| Test webhooks | api-tester |
| A/B test feature | experiment-tracker |
| Refine design tokens | ui-designer |
| Coordinate big project | studio-producer |
| Launch new feature | project-shipper |

---

## 🔄 Agent Hand-Off Protocol

When an agent completes its task, it should explicitly hand off to the next agent:

**Example Hand-Off**:
```
sanity-cms-master: "Schema updated successfully.
Handing off to devops-automator to deploy schema to all datasets."

devops-automator: "Schema deployed to 100 datasets.
Handing off to test-writer-fixer to validate deployment."
```

---

## 📊 Success Metrics

Track agent effectiveness:
- **Task completion rate**: >95%
- **Correct agent routing**: >90%
- **Hand-off clarity**: >95%
- **Time to agent selection**: <5 seconds
- **Multi-agent coordination**: Seamless

---

**Last Updated**: October 24, 2025
**Version**: 1.0
**Maintained By**: Development Team
