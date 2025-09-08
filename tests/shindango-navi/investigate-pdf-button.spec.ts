import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';

test.describe('Step 7: PDF Save Button Investigation', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  test('Investigate PDF Save Button', async () => {
    console.log(`\n=== Investigating PDF Save Button ===`);
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results('0640941');
    await app.step7Results.verifyResultsPageLoaded();
    
    // Take screenshot for inspection
    await app.page.screenshot({ path: 'step7-results-with-save-button.png', fullPage: true });
    console.log('  - Screenshot saved: step7-results-with-save-button.png');
    
    // Look for save/print buttons with various text patterns
    const saveButtons = [
      'まとめて印刷用に保存',
      'まとめて 印刷用に保存', 
      '保存',
      'まとめて',
      '印刷用に保存',
      'print',
      'save',
      'PDF'
    ];
    
    console.log('  - Searching for save/print buttons...');
    
    for (const buttonText of saveButtons) {
      try {
        const button = app.page.getByText(buttonText);
        const isVisible = await button.isVisible();
        if (isVisible) {
          console.log(`    ✓ Found button: "${buttonText}"`);
          
          // Get button details
          const buttonElement = await button.first();
          const tagName = await buttonElement.evaluate(el => el.tagName);
          const className = await buttonElement.evaluate(el => el.className);
          const href = await buttonElement.evaluate(el => (el as any).href || 'no href');
          
          console.log(`      Tag: ${tagName}, Class: ${className}, Href: ${href}`);
        }
      } catch (error) {
        // Button not found, continue
      }
    }
    
    // Look for buttons with specific classes or attributes
    const buttonSelectors = [
      'button[class*="print"]',
      'button[class*="save"]',  
      'button[class*="pdf"]',
      'a[class*="print"]',
      'a[class*="save"]',
      'a[class*="pdf"]',
      '[role="button"]',
      'button',
      'a[href*="pdf"]',
      'a[download]'
    ];
    
    console.log('  - Searching by selectors...');
    
    for (const selector of buttonSelectors) {
      try {
        const elements = await app.page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`    Found ${elements.length} elements with selector: ${selector}`);
          
          for (let i = 0; i < Math.min(elements.length, 3); i++) {
            const element = elements[i];
            const text = await element.textContent();
            const isVisible = await element.isVisible();
            
            if (text && text.trim()) {
              console.log(`      Element ${i}: "${text.trim()}" (visible: ${isVisible})`);
            }
          }
        }
      } catch (error) {
        // Continue
      }
    }
    
    // Get all text content to search for patterns
    const bodyText = await app.page.textContent('body');
    const hasSaveText = bodyText?.includes('保存') || bodyText?.includes('印刷') || bodyText?.includes('まとめて');
    console.log(`  - Page contains save/print related text: ${hasSaveText}`);
    
    if (hasSaveText) {
      // Find exact text locations
      const saveRelatedTexts = ['保存', '印刷', 'まとめて', 'PDF', 'ダウンロード'];
      for (const text of saveRelatedTexts) {
        if (bodyText?.includes(text)) {
          console.log(`    Found text: "${text}"`);
        }
      }
    }
  });
});
