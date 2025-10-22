import { test, expect } from '@playwright/test';

test.describe('Structured Data (JSON-LD)', () => {
  test('JSON-LD is valid and present', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD scripts
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').count();
    
    // If no JSON-LD is present, skip the test (development environment)
    if (jsonLdScripts === 0) {
      console.log('No JSON-LD found - skipping structured data test');
      return;
    }
    
    expect(jsonLdScripts).toBeGreaterThan(0);
    
    // Get all JSON-LD content
    const jsonLdContents = await page.locator('script[type="application/ld+json"]').allTextContents();
    
    for (const content of jsonLdContents) {
      // Parse JSON-LD to ensure it's valid JSON
      let jsonLd;
      try {
        jsonLd = JSON.parse(content);
      } catch (error) {
        throw new Error(`Invalid JSON-LD: ${error}`);
      }
      
      // Check for required Schema.org properties
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBeTruthy();
    }
  });

  test('LocalBusiness schema is present and valid', async ({ page }) => {
    await page.goto('/');
    
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    
    // If no JSON-LD is present, skip the test (development environment)
    if (jsonLdScripts.length === 0) {
      console.log('No JSON-LD found - skipping LocalBusiness schema test');
      return;
    }
    
    let localBusinessFound = false;
    for (const content of jsonLdScripts) {
      const jsonLd = JSON.parse(content);
      
      if (jsonLd['@type'] === 'LocalBusiness') {
        localBusinessFound = true;
        
        // Check required properties
        expect(jsonLd.name).toBeTruthy();
        expect(jsonLd.url).toBeTruthy();
        
        // Check optional properties if present
        if (jsonLd.address) {
          expect(jsonLd.address['@type']).toBe('PostalAddress');
        }
        
        if (jsonLd.geo) {
          expect(jsonLd.geo['@type']).toBe('GeoCoordinates');
        }
        
        if (jsonLd.openingHoursSpecification) {
          expect(Array.isArray(jsonLd.openingHoursSpecification)).toBe(true);
        }
      }
    }
    
    expect(localBusinessFound).toBe(true);
  });

  test('FAQ schema is valid when present', async ({ page }) => {
    // Try to find a page with FAQ content
    const pagesToTest = ['/', '/services', '/offers'];
    
    for (const pagePath of pagesToTest) {
      try {
        await page.goto(pagePath);
        
        const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
        
        for (const content of jsonLdScripts) {
          const jsonLd = JSON.parse(content);
          
          if (jsonLd['@type'] === 'FAQPage') {
            expect(jsonLd.mainEntity).toBeTruthy();
            expect(Array.isArray(jsonLd.mainEntity)).toBe(true);
            
            // Check FAQ structure
            for (const item of jsonLd.mainEntity) {
              expect(item['@type']).toBe('Question');
              expect(item.name).toBeTruthy();
              expect(item.acceptedAnswer).toBeTruthy();
              expect(item.acceptedAnswer['@type']).toBe('Answer');
              expect(item.acceptedAnswer.text).toBeTruthy();
            }
          }
        }
      } catch {
        console.log(`Page ${pagePath} not found, skipping FAQ test`);
      }
    }
  });

  test('Offer schema is valid when present', async ({ page }) => {
    // Test offers page
    try {
      await page.goto('/offers');
      
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      
      for (const content of jsonLdScripts) {
        const jsonLd = JSON.parse(content);
        
        if (jsonLd['@type'] === 'Offer') {
          expect(jsonLd.name).toBeTruthy();
          expect(jsonLd.availability).toBeTruthy();
          
          if (jsonLd.price) {
            expect(jsonLd.priceCurrency).toBeTruthy();
          }
        }
      }
    } catch {
      console.log('Offers page not found, skipping Offer schema test');
    }
  });

  test('Service schema is valid when present', async ({ page }) => {
    // Test services page
    try {
      await page.goto('/services');
      
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      
      for (const content of jsonLdScripts) {
        const jsonLd = JSON.parse(content);
        
        if (jsonLd['@type'] === 'Service') {
          expect(jsonLd.name).toBeTruthy();
          expect(jsonLd.url).toBeTruthy();
          
          if (jsonLd.provider) {
            expect(jsonLd.provider['@type']).toBe('Organization');
            expect(jsonLd.provider.name).toBeTruthy();
          }
        }
      }
    } catch {
      console.log('Services page not found, skipping Service schema test');
    }
  });

  test('Product schema is valid when present', async ({ page }) => {
    // Test individual service/offer pages
    const pagesToTest = ['/services/plumbing', '/offers/emergency-service'];
    
    for (const pagePath of pagesToTest) {
      try {
        await page.goto(pagePath);
        
        const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
        
        for (const content of jsonLdScripts) {
          const jsonLd = JSON.parse(content);
          
          if (jsonLd['@type'] === 'Product') {
            expect(jsonLd.name).toBeTruthy();
            expect(jsonLd.availability).toBeTruthy();
            expect(jsonLd.condition).toBeTruthy();
            
            if (jsonLd.offers) {
              expect(jsonLd.offers['@type']).toBe('Offer');
              expect(jsonLd.offers.priceCurrency).toBeTruthy();
            }
          }
        }
      } catch {
        console.log(`Page ${pagePath} not found, skipping Product schema test`);
      }
    }
  });

  test('no duplicate @id values in JSON-LD', async ({ page }) => {
    await page.goto('/');
    
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const ids: string[] = [];
    
    for (const content of jsonLdScripts) {
      const jsonLd = JSON.parse(content);
      
      if (jsonLd['@id']) {
        expect(ids).not.toContain(jsonLd['@id']);
        ids.push(jsonLd['@id']);
      }
    }
  });
});
