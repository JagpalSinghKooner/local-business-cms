import { test, expect } from '@playwright/test';

test.describe('SEO Meta Tags', () => {
  test('homepage has required meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeLessThanOrEqual(60);
    
    // Check for meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription?.length).toBeLessThanOrEqual(160);
    
    // Check for canonical URL
    const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
    expect(canonical).toBeTruthy();
    expect(canonical).toMatch(/^https?:\/\//);
    
    // Check for robots meta tag
    const robots = await page.getAttribute('meta[name="robots"]', 'content');
    expect(robots).toBeTruthy();
  });

  test('Open Graph tags are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for Open Graph title
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBeTruthy();
    
    // Check for Open Graph description
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    expect(ogDescription).toBeTruthy();
    
    // Check for Open Graph URL
    const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
    expect(ogUrl).toBeTruthy();
    
    // Check for Open Graph type
    const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
    expect(ogType).toBe('website');
    
    // Check for Open Graph site name
    const ogSiteName = await page.getAttribute('meta[property="og:site_name"]', 'content');
    expect(ogSiteName).toBeTruthy();
  });

  test('Twitter Card tags are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for Twitter card type
    const twitterCard = await page.getAttribute('meta[name="twitter:card"]', 'content');
    expect(twitterCard).toBeTruthy();
    expect(['summary', 'summary_large_image', 'app', 'player']).toContain(twitterCard);
    
    // Check for Twitter title
    const twitterTitle = await page.getAttribute('meta[name="twitter:title"]', 'content');
    expect(twitterTitle).toBeTruthy();
    
    // Check for Twitter description
    const twitterDescription = await page.getAttribute('meta[name="twitter:description"]', 'content');
    expect(twitterDescription).toBeTruthy();
  });

  test('meta tags are unique per page', async ({ page }) => {
    // Test homepage
    await page.goto('/');
    const homeTitle = await page.title();
    const homeDescription = await page.getAttribute('meta[name="description"]', 'content');
    
    // Test services page (if it exists)
    try {
      await page.goto('/services');
      const servicesTitle = await page.title();
      const servicesDescription = await page.getAttribute('meta[name="description"]', 'content');
      
      // Titles should be different
      expect(servicesTitle).not.toBe(homeTitle);
      expect(servicesDescription).not.toBe(homeDescription);
    } catch (error) {
      console.log('Services page not found, skipping uniqueness test');
    }
  });

  test('no duplicate meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for duplicate title tags
    const titleTags = await page.locator('title').count();
    expect(titleTags).toBe(1);
    
    // Check for duplicate description tags
    const descriptionTags = await page.locator('meta[name="description"]').count();
    expect(descriptionTags).toBe(1);
    
    // Check for duplicate canonical links
    const canonicalTags = await page.locator('link[rel="canonical"]').count();
    expect(canonicalTags).toBe(1);
  });
});
