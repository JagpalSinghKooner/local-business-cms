# Universal Agent Verification Protocol

**STATUS**: MANDATORY for all editing agents
**EFFECTIVE DATE**: 2025-10-24
**VIOLATION**: Any agent that skips verification will be considered FAILED

---

## Core Principle

**NEVER CLAIM SUCCESS WITHOUT PROOF**

Every editing agent MUST run actual verification commands and report measured results. Estimates, theories, and assumptions are NOT acceptable.

---

## Four-Phase Mandatory Protocol

### Phase 1: Search & Scope (BEFORE ANY EDITS)

**Objective**: Find ALL instances of the issue

**Required Actions**:
```bash
# 1. Search for all instances
grep -r "PATTERN_TO_FIX" src/
grep -r "ALTERNATIVE_PATTERN" src/

# 2. List all affected files
echo "Files requiring changes:"
# - file1.ts (line 42)
# - file2.tsx (line 103)
# - file3.css (line 8)

# 3. Confirm scope
echo "Total files to modify: N"
echo "Proceeding with edits..."
```

**Success Criteria**:
- ✅ All grep searches completed
- ✅ All affected files identified
- ✅ No assumptions about "probably only one file"

**Common Failures**:
- ❌ Editing first file found, missing others
- ❌ Assuming CSS change is enough (missing TypeScript/JavaScript)
- ❌ Not checking for component overrides

---

### Phase 2: Implementation

**Objective**: Make edits to ALL identified files

**Required Actions**:
1. Edit every file identified in Phase 1
2. Run formatter/linter on changed files
3. Verify syntax (no compilation errors)

**Success Criteria**:
- ✅ ALL files edited (not just some)
- ✅ Code formatted consistently
- ✅ No syntax errors

**Common Failures**:
- ❌ Editing some files but not all
- ❌ Forgetting to update related configuration files
- ❌ Missing test files that reference changed code

---

### Phase 3: Verification (MANDATORY - NO EXCEPTIONS)

**Objective**: Prove the fix works with actual measurements

**Required Actions**:

#### For Accessibility Fixes:
```bash
# 1. Clean verification
pnpm a11y

# 2. Report ACTUAL test output (not theory)
# Example:
# "✅ Tests passed - 0 violations"
# OR
# "❌ Tests failed - 2 violations found: [specific error messages]"
```

#### For Performance Fixes:
```bash
# 1. Clean build
rm -rf .next
pnpm build

# 2. Measure ACTUAL sizes
ls -lh .next/static/chunks/main-app*.js
du -sh .next/static/

# 3. Report EXACT measurements
# Example:
# "main-app.js: 569 bytes (budget: 200KB) ✅ PASS"
# OR
# "main-app.js: 7.4MB (budget: 200KB) ❌ FAIL"
```

#### For Visual/UI Fixes:
```bash
# 1. Run visual regression tests
pnpm playwright test tests/visual/

# 2. Report test results
# "✅ All visual tests passed"
# OR
# "❌ 3 tests failed: [test names]"
```

#### For Code Quality Fixes:
```bash
# 1. Run type checker
pnpm typecheck

# 2. Run linter
pnpm lint

# 3. Run tests
pnpm test
```

**Success Criteria**:
- ✅ Actual commands executed (not skipped)
- ✅ Real output captured and reported
- ✅ Measurements compared against budgets/targets
- ✅ Honest assessment of PASS/FAIL

**CRITICAL RULES**:
- **NEVER estimate** ("should be around X")
- **NEVER theorize** ("this ought to reduce by Y%")
- **NEVER assume** ("probably fixes it")
- **ALWAYS measure** (run commands, capture output)
- **ALWAYS compare** (actual vs target)

**Common Failures**:
- ❌ Claiming "80% reduction" without measuring
- ❌ Saying "tests should pass" without running them
- ❌ Assuming build is clean without checking
- ❌ Reporting success when actual verification shows failure

---

### Phase 4: Honest Reporting

**Objective**: Provide evidence-based status report

**Required Format**:

#### If Verification PASSED:
```markdown
## Fix Status: ✅ SUCCESS

### Changes Made:
- File 1: [description]
- File 2: [description]

### Verification Results:
- Command: `pnpm a11y`
- Output: "35 tests passed"
- Status: ✅ PASS (0 violations)

### Metrics:
- Before: 2.77:1 contrast ratio (FAIL)
- After: 5.63:1 contrast ratio (PASS)
- Improvement: 103% increase

### Files Modified:
1. src/lib/tokens.ts (line 41, 97)
2. src/app/globals.css (line 8, 49)
```

#### If Verification FAILED:
```markdown
## Fix Status: ❌ FAILED

### Changes Attempted:
- File 1: [description]
- File 2: [description]

### Verification Results:
- Command: `ls -lh .next/static/chunks/main-app*.js`
- Output: "7.4M main-app-xxx.js"
- Status: ❌ FAIL (exceeds 200KB budget by 3600%)

### Root Cause:
The LazyStudio wrapper was created but the page still has:
`export { metadata } from 'next-sanity/studio'`
This imports 7.4MB at build time, defeating lazy loading.

### What's Needed:
- Remove the metadata export line
- Define metadata inline instead
- Estimated time to fix: 5 minutes
```

**Success Criteria**:
- ✅ Clear PASS/FAIL statement
- ✅ Evidence from verification commands
- ✅ Before/after metrics (if PASS)
- ✅ Root cause analysis (if FAIL)
- ✅ Next steps (if FAIL)

**Common Failures**:
- ❌ Claiming PASS when verification shows FAIL
- ❌ Not providing evidence
- ❌ Blaming external factors instead of admitting incomplete fix
- ❌ Not explaining what went wrong

---

## Examples: Good vs Bad Reports

### ❌ BAD Report (No Verification):
```
I've fixed the color contrast issue by changing the primary color
from sky-500 to sky-600. This should now meet WCAG AA standards.

Files modified:
- src/app/globals.css
```

**Problems**:
- "should now meet" = No verification run
- Only one file modified (missed tokens.ts)
- No actual test results
- No contrast ratio measurements

---

### ✅ GOOD Report (With Verification):
```
## Fix Status: ✅ SUCCESS

### Changes Made:
Changed primary brand color from sky-500 (#0ea5e9) to sky-700 (#0369a1)

### Verification Results:
Command: `pnpm a11y`
Output:
```
Running 35 tests...
✓ should not have accessibility violations (7 tests)
✓ All tests passed in 9.8s
```

Status: ✅ PASS - 0 WCAG violations

### Metrics:
- Before: #0ea5e9 on white = 2.77:1 (FAIL - requires 4.5:1)
- After: #0369a1 on white = 5.63:1 (PASS - exceeds 4.5:1)
- Improvement: 103% increase in contrast

### Files Modified:
1. src/lib/tokens.ts (line 41: primary color, line 97: hover state)
2. src/app/globals.css (line 8: CSS variable, line 49: hover variable)

### Why Both Files:
tokens.ts provides DEFAULT_COLORS that override CSS variables at runtime.
Both must be updated for consistency.
```

**Why This Works**:
- Actual test output provided
- Exact measurements given
- All files identified
- Evidence-based success claim

---

## Agent-Specific Verification Requirements

### ui-designer Agent
**Must verify**:
- Color contrast ratios (use actual calculator, not manual math)
- Accessibility tests (`pnpm a11y`)
- All instances of colors (CSS + TypeScript + JS)

**Commands**:
```bash
grep -r "#OLD_COLOR" src/
pnpm a11y
```

---

### performance-benchmarker Agent
**Must verify**:
- Actual file sizes (`ls -lh`)
- Actual build output
- Bundle size budgets

**Commands**:
```bash
rm -rf .next
pnpm build
ls -lh .next/static/chunks/main-app*.js
pnpm bundle
```

---

### frontend-developer-pro Agent
**Must verify**:
- Visual regression tests
- Responsive design tests
- No TypeScript errors

**Commands**:
```bash
pnpm typecheck
pnpm playwright test tests/visual/
```

---

### test-writer-fixer Agent
**Already Perfect** ✅

**Why**: Always runs actual tests, reports real output

**Example to follow**:
```bash
pnpm test
# Reports actual test output
# Provides pass/fail counts
# Lists failing tests by name
```

---

## Enforcement

### Success Definition:
An agent task is considered successful ONLY if:
1. ✅ All four phases completed
2. ✅ Verification commands executed
3. ✅ Actual results match success criteria
4. ✅ Evidence provided in report

### Failure Definition:
An agent task is considered failed if:
1. ❌ Verification phase skipped
2. ❌ Claims made without evidence
3. ❌ Partial fixes (some files missed)
4. ❌ False success claims (verification shows FAIL)

### Retry Policy:
- **First failure**: Provide specific feedback, retry with detailed instructions
- **Second failure**: Escalate to different agent or request human intervention
- **Maximum retries**: 2 per agent per task

---

## Why This Protocol Exists

### Lesson Learned: Quality Gates Session (2025-10-24)

**What Happened**:
- ui-designer: Fixed CSS but missed tokens.ts → Tests still failed
- performance-benchmarker: Claimed 80% reduction → Actually 0% (7.4MB remained)
- test-writer-fixer: 100% success rate → Always ran actual verification

**Root Cause**:
Agents without mandatory verification can make partial fixes and claim success without evidence.

**Solution**:
This protocol makes verification mandatory. No agent can skip it.

---

## Quick Reference Checklist

Before reporting success, verify you can answer YES to all:

- [ ] Did I search for ALL instances of the issue?
- [ ] Did I edit ALL affected files?
- [ ] Did I run actual verification commands?
- [ ] Did I capture real output (not estimates)?
- [ ] Did I compare actual vs target metrics?
- [ ] Can I provide evidence of success?
- [ ] If tests failed, did I report honest FAIL status?

**If ANY answer is NO → Task is INCOMPLETE**

---

**Remember**: The goal is not to claim success quickly. The goal is to achieve actual, verified success.

**Honest failure reports are valuable. False success claims are harmful.**
