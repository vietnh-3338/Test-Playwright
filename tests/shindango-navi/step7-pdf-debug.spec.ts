import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';

test.describe('Step 7: PDF Debug Tests', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  test('Debug PDF Save Button Workflow', async ({ page }) => {
    console.log('\n=== Debugging PDF Save Button Workflow ===');
    
    // Use a test postal code
    const testPostalCode = '0640941';
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    console.log('  ✓ Results page loaded');
    
    // Verify PDF save button is visible
    await app.step7Results.verifyPdfSaveButtonVisible();
    console.log('  ✓ PDF save button is visible');
    
    // Set up new page listener for debugging
    const newPagePromise = page.context().waitForEvent('page');
    
    // Click the PDF save button
    console.log('  - Clicking PDF save button...');
    await app.step7Results.clickPdfSaveButton();
    console.log('  ✓ PDF save button clicked');
    
    // Wait for new tab to open
    console.log('  - Waiting for new tab to open...');
    const newTab = await newPagePromise;
    console.log('  ✓ New tab opened');
    
    // Wait for the new tab to load
    await newTab.waitForLoadState('networkidle', { timeout: 30000 });
    console.log('  ✓ New tab loaded');
    
    // Get the URL of the new tab
    const newTabUrl = newTab.url();
    console.log(`  - New tab URL: ${newTabUrl}`);
    
    // Check if it's a PDF viewer
    if (newTabUrl.includes('pdf') || newTabUrl.includes('PDF')) {
      console.log('  ✓ New tab appears to be a PDF viewer');
    }
    
    // Get page title and content info
    const title = await newTab.title();
    console.log(`  - New tab title: ${title}`);
    
    // Look for download-related elements
    console.log('  - Looking for download elements...');
    
    const downloadSelectors = [
      'button[download]',
      'a[download]',
      '[aria-label*="download" i]',
      '[title*="download" i]',
      'button:has-text("download")',
      'button:has-text("ダウンロード")',
      'button:has-text("保存")',
      '[role="button"]:has-text("download")',
      'input[type="button"][value*="download" i]',
      '.download-button',
      '#download-button',
      '[data-action*="download" i]'
    ];
    
    for (const selector of downloadSelectors) {
      try {
        const elements = await newTab.locator(selector).all();
        if (elements.length > 0) {
          console.log(`    ✓ Found ${elements.length} element(s) with selector: ${selector}`);
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const isVisible = await element.isVisible();
            const text = await element.textContent();
            console.log(`      - Element ${i}: visible=${isVisible}, text="${text}"`);
          }
        }
      } catch (error) {
        // Selector not found, continue
      }
    }
    
    // Check for any clickable elements that might be download buttons
    console.log('  - Looking for any clickable elements...');
    const clickableElements = await newTab.locator('button, a, [role="button"], input[type="button"]').all();
    console.log(`    Found ${clickableElements.length} clickable elements`);
    
    for (let i = 0; i < Math.min(clickableElements.length, 10); i++) {
      const element = clickableElements[i];
      try {
        const isVisible = await element.isVisible();
        const text = await element.textContent();
        const tagName = await element.evaluate(el => el.tagName);
        if (isVisible && text) {
          console.log(`    - ${tagName}: "${text.trim()}"`);
        }
      } catch (error) {
        // Element might be stale, continue
      }
    }
    
    // Try to take a screenshot for debugging
    await newTab.screenshot({ path: './test-results/pdf-preview-tab.png', fullPage: true });
    console.log('  ✓ Screenshot saved: pdf-preview-tab.png');
    
    // Keep the tab open for manual inspection
    console.log('  - Keeping tab open for 5 seconds for manual inspection...');
    await newTab.waitForTimeout(5000);
    
    // Close the new tab
    await newTab.close();
    console.log('  ✓ New tab closed');
  });
});
