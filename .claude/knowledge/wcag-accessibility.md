# WCAG 2.1 AA Accessibility Knowledge

## Color Contrast Requirements

### Standard Requirements:
- **Normal text** (< 18pt): 4.5:1 contrast ratio
- **Large text** (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio against adjacent colors

### Common Contrast Ratios (Text on White #FFFFFF):

| Color | Hex | Contrast | WCAG AA | WCAG AAA |
|-------|-----|----------|---------|----------|
| sky-400 | #38bdf8 | 2.35:1 | ❌ FAIL | ❌ FAIL |
| sky-500 | #0ea5e9 | 2.77:1 | ❌ FAIL | ❌ FAIL |
| sky-600 | #0284c7 | 4.09:1 | ❌ FAIL | ❌ FAIL |
| sky-700 | #0369a1 | 5.63:1 | ✅ PASS | ❌ FAIL |
| sky-800 | #075985 | 7.15:1 | ✅ PASS | ✅ PASS |
| sky-900 | #0c4a6e | 9.42:1 | ✅ PASS | ✅ PASS |

| Color | Hex | Contrast | WCAG AA | WCAG AAA |
|-------|-----|----------|---------|---------|
| amber-500 | #f59e0b | 2.11:1 | ❌ FAIL | ❌ FAIL |
| amber-600 | #d97706 | 3.18:1 | ❌ FAIL | ❌ FAIL |
| amber-700 | #b45309 | 4.54:1 | ✅ PASS | ❌ FAIL |
| amber-800 | #92400e | 7.48:1 | ✅ PASS | ✅ PASS |

## Critical: Search ALL Color Instances

Colors can be defined in multiple places:

\`\`\`bash
# 1. CSS Files
grep -r "#0ea5e9" src/app/
grep -r "sky-500" src/

# 2. TypeScript/JavaScript
grep -r "'#0ea5e9'" src/lib/
grep -r '"#0ea5e9"' src/

# 3. Tailwind Classes
grep -r "bg-sky-500" src/components/
grep -r "text-amber-600" src/

# 4. Design Tokens (CRITICAL - Often Missed)
cat src/lib/tokens.ts | grep -i "primary"
\`\`\`

## Color Definition Hierarchy

1. **tokens.ts** (DEFAULT_COLORS) → Overrides everything at runtime
2. **globals.css** (CSS variables) → Loaded at startup
3. **Component styles** (Tailwind classes) → Per-component
4. **Inline styles** → Highest specificity

**⚠️ Must update ALL levels for consistency**

## Verification Commands

\`\`\`bash
# Run accessibility tests
pnpm a11y

# Expected output for PASS:
# ✓ should not have accessibility violations (7 tests)
# ✓ All tests passed
# Status: 0 violations

# Expected output for FAIL:
# ✗ should not have accessibility violations
# Violation: color-contrast
# Elements: 2
# Impact: Serious
\`\`\`

## Common Mistakes

### ❌ Mistake 1: Fixing CSS Only
\`\`\`css
/* globals.css */
--color-brand-primary: #0369a1;  /* ✅ Fixed here */
\`\`\`

\`\`\`typescript
/* tokens.ts */
primary: '#0ea5e9',  /* ❌ Still wrong - overrides CSS! */
\`\`\`

**Result**: Tests still fail because TypeScript overrides CSS at runtime

### ❌ Mistake 2: Manual Contrast Calculation
\`\`\`
Agent: "sky-600 (#0284c7) has 4.54:1 contrast"
Reality: Actual contrast is 4.09:1 (FAILS WCAG AA)
\`\`\`

**Solution**: Use WebAIM Contrast Checker or actual tests

### ❌ Mistake 3: Not Running Tests
\`\`\`
Agent: "Changed color to darker blue, should now pass WCAG"
Verification: None
Reality: Tests still show violations
\`\`\`

**Solution**: Always run `pnpm a11y` and report actual output

## Touch Target Sizes

### Requirements:
- Minimum: 44x44px (WCAG AAA recommendation)
- Acceptable: 40x40px (common practice)
- Mobile: Always use 44x44px minimum

### Implementation:
\`\`\`css
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 20px;
}
\`\`\`

## Verification Checklist

- [ ] Searched ALL color instances (CSS + TypeScript + JS + Tailwind)
- [ ] Verified contrast ratios with tool (not manual calculation)
- [ ] Updated ALL color definition locations
- [ ] Ran `pnpm a11y` and captured output
- [ ] Reported 0 violations (or specific failures)
- [ ] Touch targets meet 44x44px minimum
