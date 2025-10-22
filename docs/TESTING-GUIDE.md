# Testing Guide

Complete guide to running and maintaining tests for the Local Business CMS.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Test Categories](#test-categories)
3. [Running Tests](#running-tests)
4. [Writing New Tests](#writing-new-tests)
5. [CI/CD Integration](#cicd-integration)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# Install dependencies (if not already done)
pnpm install

# Run all tests
pnpm test

# Run SEO tests only
pnpm test:seo

# Run integration tests only
pnpm test:integration

# Open interactive UI
pnpm test:seo:ui
```

---

## 📂 Test Categories

### 1. SEO Tests (`tests/seo/`)

Tests for search engine optimization and meta tags:

| File | Tests | Purpose |
|------|-------|---------|
| `basic-seo.spec.ts` | 2 | Basic SEO functionality |
| `meta-tags.spec.ts` | 5 | Title, description, OG tags, Twitter cards |
| `structured-data.spec.ts` | - | JSON-LD validation |
| `technical-seo.spec.ts` | - | Canonical URLs, robots.txt, sitemap |
| `service-location-seo.spec.ts` | 10 | 336 service+location pages SEO |
| `internal-links.spec.ts` | 11 | Link auditing, no 404s |

**Total**: 28+ SEO tests

### 2. Integration Tests (`tests/integration/`)

Tests for system integration and workflows:

| File | Tests | Purpose |
|------|-------|---------|
| `redirects.spec.ts` | 10 | Redirect rules (exact, wildcard, regex) |
| `form-submission.spec.ts` | 10 | Lead capture forms, validation |
| `static-generation.spec.ts` | - | ⏳ TODO: `generateStaticParams` logic |
| `preview-mode.spec.ts` | - | ⏳ TODO: Draft content, real-time updates |

**Total**: 20+ integration tests

### 3. Visual Regression Tests (`tests/visual/`)

⏳ **TODO** - Component screenshots, cross-browser, responsive

---

## 🎮 Running Tests

### All Tests

```bash
pnpm test
```

Runs all Playwright tests in headless mode.

---

### SEO Tests

```bash
# All SEO tests
pnpm test:seo

# Basic SEO tests only (fast)
pnpm test:seo:basic

# Interactive UI mode
pnpm test:seo:ui

# Debug mode (step through)
pnpm test:seo:debug

# Show browser (headed mode)
pnpm test:seo:headed
```

---

### Integration Tests

```bash
# All integration tests
pnpm test:integration

# Interactive UI mode
pnpm test:integration:ui
```

---

### Specific Test File

```bash
# Run single file
pnpm test tests/seo/service-location-seo.spec.ts

# Run specific test
pnpm test tests/seo/meta-tags.spec.ts -g "Open Graph"
```

---

### CI Mode

```bash
# GitHub Actions reporter
pnpm test:ci
```

---

## ✍️ Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path')

    const element = page.locator('selector')
    await expect(element).toBeVisible()
  })
})
```

---

### SEO Test Example

```typescript
test('has proper meta description', async ({ page }) => {
  await page.goto('/services/plumbing-toronto')

  const description = await page.getAttribute(
    'meta[name="description"]',
    'content'
  )

  expect(description).toBeTruthy()
  expect(description!.length).toBeLessThanOrEqual(160)
  expect(description!.toLowerCase()).toContain('toronto')
})
```

---

### Integration Test Example

```typescript
test('form validates email', async ({ page }) => {
  await page.goto('/')

  const emailInput = page.locator('input[type="email"]')
  await emailInput.fill('invalid-email')

  const submitButton = page.locator('button[type="submit"]')
  await submitButton.click()

  const isInvalid = await emailInput.evaluate(
    (el: HTMLInputElement) => !el.validity.valid
  )

  expect(isInvalid).toBe(true)
})
```

---

### Skip Tests Conditionally

```typescript
test.skip('requires production environment', async ({ page }) => {
  // Test skipped unless certain conditions are met
})

test('conditional skip', async ({ page }) => {
  const form = page.locator('form').first()

  if ((await form.count()) === 0) {
    test.skip() // Skip if form doesn't exist
    return
  }

  // Rest of test...
})
```

---

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
{
  testDir: './tests',
  baseURL: 'http://localhost:3000',
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
}
```

---

### Environment Variables

```bash
# Set base URL (default: http://localhost:3000)
export PLAYWRIGHT_BASE_URL=http://localhost:3001

# Run in CI mode
export CI=true
```

---

## 🤖 CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests

**Workflow**: `.github/workflows/validate.yml`

```yaml
- name: Run SEO tests
  run: pnpm test:seo:basic
  env:
    NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
    NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}
    NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
```

---

## 🐛 Troubleshooting

### Tests Failing Locally

**Issue**: Tests pass in CI but fail locally

**Solution**: Clear browser cache and restart dev server
```bash
rm -rf .next
pnpm dev
pnpm test
```

---

### Port Already in Use

**Issue**: `Port 3000 is in use`

**Solution**: Change base URL or kill existing process
```bash
# Option 1: Use different port
export PLAYWRIGHT_BASE_URL=http://localhost:3001

# Option 2: Kill process
lsof -ti:3000 | xargs kill -9
```

---

### Timeouts

**Issue**: Tests timeout waiting for page load

**Solution**: Increase timeout or check dev server
```typescript
test('slow test', async ({ page }) => {
  await page.goto('/', { timeout: 60000 }) // 60s timeout
})
```

---

### Flaky Tests

**Issue**: Tests pass sometimes, fail other times

**Solution**: Add wait conditions
```typescript
// Bad (flaky)
await page.click('button')
const text = await page.locator('.result').textContent()

// Good (stable)
await page.click('button')
await page.waitForSelector('.result')
const text = await page.locator('.result').textContent()
```

---

### CORS Errors in Studio Tests

**Issue**: Sanity Studio shows CORS errors

**Solution**: Add localhost to allowed origins
```bash
npx sanity cors add http://localhost:3000 --credentials
npx sanity cors add http://localhost:3001 --credentials
```

---

## 📊 Test Reports

### HTML Report

After running tests, open the HTML report:

```bash
pnpm exec playwright show-report
```

Interactive report shows:
- Test results by browser
- Screenshots on failure
- Trace files
- Performance metrics

---

### CI Reports

In GitHub Actions, view:
- Test summary in PR comments
- Detailed logs in Actions tab
- Uploaded artifacts (screenshots, traces)

---

## 🎯 Best Practices

### 1. Write Descriptive Test Names

```typescript
// ❌ Bad
test('test1', async ({ page }) => { ... })

// ✅ Good
test('homepage has proper meta description within 160 characters', async ({ page }) => { ... })
```

---

### 2. Use Data Attributes for Selectors

```typescript
// ❌ Bad (fragile)
page.locator('.btn-primary.large')

// ✅ Good (stable)
page.locator('[data-testid="submit-button"]')
```

---

### 3. Group Related Tests

```typescript
test.describe('Service+Location Pages', () => {
  test.describe('SEO Meta Tags', () => {
    test('has title', ...)
    test('has description', ...)
  })

  test.describe('JSON-LD', () => {
    test('has LocalBusiness', ...)
    test('has Service', ...)
  })
})
```

---

### 4. Cleanup Test Data

```typescript
test('creates lead', async ({ page }) => {
  // Create test data
  await submitForm()

  // Test assertions
  ...

  // Cleanup (if possible)
  // await deleteTestLead()
})
```

---

### 5. Use Page Object Model for Complex Pages

```typescript
// page-objects/ContactForm.ts
class ContactForm {
  constructor(public page: Page) {}

  async fillName(name: string) {
    await this.page.locator('[name="name"]').fill(name)
  }

  async submit() {
    await this.page.locator('button[type="submit"]').click()
  }
}

// In test
const form = new ContactForm(page)
await form.fillName('John Doe')
await form.submit()
```

---

## 📚 Resources

- [Playwright Docs](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles/)
- [Phase 4 Progress](./phase-4-progress.md)

---

## 🆘 Getting Help

1. Check test output for error messages
2. Open HTML report: `pnpm exec playwright show-report`
3. Run in debug mode: `pnpm test:seo:debug`
4. Check logs: `pnpm test --reporter=line`

---

**Last Updated**: 2025-10-22
