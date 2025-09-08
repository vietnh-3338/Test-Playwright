import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';

test.describe('Step 7: Debug Testing', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  test('Debug Postal Code 0640802', async () => {
    console.log(`\n=== Debug Testing Postal Code: 0640802 ===`);
    
    // Complete workflow to Step 7 results page with "未申請または申請中"
    await app.completeToStep7Results('0640802');
    
    console.log('  - Verifying results page loaded...');
    await app.step7Results.verifyResultsPageLoaded();
    console.log('    ✓ Results page loaded successfully');
    
    // Take screenshot for debugging
    await app.page.screenshot({ path: 'debug-0640802.png', fullPage: true });
    
    // Check if contact info section exists
    const contactSection = app.page.getByRole('heading', { name: 'お問い合わせ先' });
    await expect(contactSection).toBeVisible({ timeout: 10000 });
    console.log('    ✓ Contact section found');
    
    // Look for phone numbers with broader search
    const phonePattern = /011[‑\-]205[‑\-]3304/;
    const phoneText = await app.page.textContent('body');
    console.log('    Phone text search result:', phoneText?.includes('011‑205‑3304'));
    console.log('    Phone text search result (regular dash):', phoneText?.includes('011-205-3304'));
    
    // Try different selectors
    const phoneElement1 = app.page.getByText('011‑205‑3304');
    const phoneElement2 = app.page.getByText('011-205-3304');
    const phoneElement3 = app.page.locator('text=/011[‑\\-]205[‑\\-]3304/');
    
    console.log('    Checking phone visibility...');
    const isVisible1 = await phoneElement1.isVisible();
    const isVisible2 = await phoneElement2.isVisible();
    const isVisible3 = await phoneElement3.isVisible();
    
    console.log(`    Phone with full-width dash: ${isVisible1}`);
    console.log(`    Phone with regular dash: ${isVisible2}`);
    console.log(`    Phone with regex: ${isVisible3}`);
    
    // Show all text content containing phone numbers
    const allElements = await app.page.locator('*:has-text("011")').all();
    console.log(`    Found ${allElements.length} elements containing "011"`);
    
    for (let i = 0; i < allElements.length; i++) {
      const text = await allElements[i].textContent();
      console.log(`    Element ${i}: "${text}"`);
    }
  });
});
