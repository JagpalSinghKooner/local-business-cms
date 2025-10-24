# Testing Best Practices Knowledge

## The Gold Standard: test-writer-fixer Pattern

### Why This Agent Has 100% Success Rate:

1. **Always Runs Actual Commands**
   \`\`\`bash
   pnpm test
   # Captures real output, not estimates
   \`\`\`

2. **Reports Measurable Results**
   \`\`\`
   Running 35 tests...
   ✓ 32 passed
   ✗ 3 failed
   \`\`\`

3. **Fails Honestly**
   \`\`\`
   Status: ❌ FAILED
   Failures: 3 tests
   Details: [specific test names and errors]
   \`\`\`

4. **Never Estimates or Assumes**
   - No "tests should pass"
   - No "probably fixed"
   - Only "tests passed" with proof

## Test Verification Commands

### Unit Tests:
\`\`\`bash
pnpm test
pnpm test:coverage  # Check coverage percentage
\`\`\`

### E2E Tests:
\`\`\`bash
pnpm playwright test
pnpm playwright test --headed  # Debug mode
pnpm playwright test --ui  # Interactive mode
\`\`\`

### Visual Regression:
\`\`\`bash
pnpm playwright test tests/visual/
pnpm e2e:update  # Update baselines
\`\`\`

### Accessibility Tests:
\`\`\`bash
pnpm a11y
# Must show: "0 violations"
\`\`\`

### Type Checking:
\`\`\`bash
pnpm typecheck
# Must show: "Found 0 errors"
\`\`\`

## Test-Driven Verification Pattern

\`\`\`
1. Make Code Change
   ↓
2. Run Tests
   ↓
3. Capture Output
   ↓
4. Analyze Results
   ├─→ All Pass → Report SUCCESS with evidence
   └─→ Any Fail → Report FAIL with specific errors
\`\`\`

## Common Testing Mistakes

### ❌ Mistake 1: Not Running Tests
\`\`\`
Agent: "I fixed the bug, the test should pass now"
Reality: Test still fails, bug not actually fixed
\`\`\`

### ❌ Mistake 2: Ignoring Test Output
\`\`\`
Agent: "Tests are passing" (didn't actually check)
Reality: 5 tests failing, agent didn't verify
\`\`\`

### ❌ Mistake 3: Skipping Tests to "Fix" Later
\`\`\`
Agent: "I'll comment out failing tests and fix them later"
Reality: Tests remain broken, issues accumulate
\`\`\`

## Test Reporting Format

### ✅ GOOD Report:
\`\`\`markdown
## Test Status: ✅ PASS

Command: `pnpm test`
Output:
```
Test Suites: 12 passed, 12 total
Tests: 45 passed, 45 total
```

Status: All tests passing
Coverage: 87% (above 80% threshold)
\`\`\`

### ❌ BAD Report:
\`\`\`markdown
## Test Status: Pass

The tests are now passing after my fixes.
\`\`\`

**Problems**:
- No command shown
- No actual output
- No verification proof

## Verification Checklist

- [ ] Ran actual test commands (not skipped)
- [ ] Captured real test output
- [ ] Reported pass/fail counts
- [ ] Listed specific failures (if any)
- [ ] Provided evidence of success/failure
- [ ] No tests skipped or commented out

## Remember:

**The test-writer-fixer agent is the gold standard because it ALWAYS verifies.**

**All agents should follow this pattern:**
1. Run commands
2. Capture output
3. Report honestly
4. Provide evidence
