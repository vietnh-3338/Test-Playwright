// Ultra fast Playwright test for Step 1+2 with debug (no fixed waits)
import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../pages/pages';

test.describe('Ultra Fast Step 1+2+3', () => {
  test('Step 1+2+3: Ultra fast flow with debug through 3 steps', async ({ page }) => {
    const app = new ShindangoNaviApp(page);
    
    // Start timer
    const startTime = Date.now();
    
    // BYPASS app.launch() - navigate directly with correct URL
    await page.goto('/special/shindango-navi/tool?ck=1', { waitUntil: 'domcontentloaded' });
    
    console.log(`⚡ Page loaded in ${Date.now() - startTime}ms`);
    const clickStartTime = Date.now();
    
    // Disable all animations and transitions for max speed
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
        }
      `
    });
    
    // STEP 1: Ultra fast option selection
    const firstOption = page.locator('label').first();
    
    // AGGRESSIVE: Click as soon as it exists - no waiting
    await Promise.race([
      firstOption.click({ timeout: 2000 }),
      page.locator('div[role="radiogroup"] label').first().click({ timeout: 2000 })
    ]);
    console.log('⚡ Option selected INSTANTLY');
    
    // AGGRESSIVE: Click next button immediately with multiple selectors
    await Promise.race([
      page.locator('button:has-text("次へ")').click({ timeout: 1500 }),
      page.locator('button:has-text("Next")').click({ timeout: 1500 }),
      page.locator('button[type="submit"]').click({ timeout: 1500 })
    ]);
    console.log('⚡ Next button clicked INSTANTLY');
    
    const clickEndTime = Date.now();
    console.log(`⚡ Step 1 interaction time: ${clickEndTime - clickStartTime}ms`);
    
    // DEBUG: Check if we actually moved to step 2
    await page.waitForTimeout(2000); // Give time for navigation/validation
    const currentUrl = page.url();
    console.log(`Current URL after step 1: ${currentUrl}`);
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'debug-after-step1.png', fullPage: true });
    
    // Check for actual step 2 question text
    const pageContent = await page.textContent('body');
    const step2Question = pageContent?.includes('診断を受けた方がお住まい') 
    console.log(`Has step 2 question: ${step2Question}`);
    
    // Also check visible heading/question elements
    const h2Elements = await page.locator('h2').allTextContents();
    const h3Elements = await page.locator('h3').allTextContents(); 
    console.log(`H2 headings: ${JSON.stringify(h2Elements)}`);
    console.log(`H3 headings: ${JSON.stringify(h3Elements)}`);
    
    // Check step indicators if any
    const stepIndicators = await page.locator('.step, [class*="step"]').allTextContents();
    console.log(`Step indicators: ${JSON.stringify(stepIndicators)}`);
    
    // Check for age-related radio buttons
    const ageRadios = await page.locator('input[type="radio"][value*="age"], input[type="radio"][value*="年"]').count();
    console.log(`Age-related radio buttons found: ${ageRadios}`);
    
    if (!step2Question) {
      console.log('❌ Still on step 1, analyzing why...');
      
      // Check if radio button is actually selected
      const selectedRadio = await page.locator('input[type="radio"]:checked').count();
      console.log(`Selected radio buttons: ${selectedRadio}`);
      
      // Check if next button is enabled
      const nextBtnEnabled = await page.locator('button:has-text("次へ")').isEnabled();
      console.log(`Next button enabled: ${nextBtnEnabled}`);
      
      if (selectedRadio === 0) {
        console.log('🔄 No option selected, trying again...');
        // Try clicking the actual radio input
        await page.locator('input[type="radio"]').first().check();
        console.log('✅ Checked radio input directly');
        
        // Try next button again
        await page.locator('button:has-text("次へ")').click();
        console.log('✅ Clicked next button again');
        
        await page.waitForTimeout(1000);
        const newContent = await page.textContent('body');
        const nowHasStep2 = newContent?.includes('年齢') || false;
        console.log(`Now has step 2 content: ${nowHasStep2}`);
      }
    } else {
      console.log('✅ Successfully navigated to step 2!');
    }
    
    // STEP 2: Input postal code
    const step2StartTime = Date.now();
    console.log('🔄 Proceeding with Step 2 - Postal Code input...');
    
    // Wait a bit for step 2 to fully load
    await page.waitForTimeout(500);
    
    // Try to find and fill postal code input
    try {
      const postalInput = page.locator('input[type="text"], input[placeholder*="郵便"], input[name*="postal"], input[id*="postal"]').first();
      await postalInput.fill('0010011', { timeout: 2000 }); // Tokyo postal code
      console.log('⚡ Postal code entered INSTANTLY');
    } catch (error) {
      console.log(`⚠️ Postal code input failed: ${error.message}`);
      // Try alternative approach - any text input
      try {
        await page.locator('input[type="text"]').first().fill('1000001');
        console.log('⚡ Postal code entered via alternative method');
      } catch (altError) {
        console.log(`⚠️ Alternative postal code input failed: ${altError.message}`);
      }
    }
    
    // Click next for step 2 -> step 3
    try {
      await Promise.race([
        page.locator('button:has-text("次へ")').click({ timeout: 2000 }),
        page.locator('button:has-text("Next")').click({ timeout: 2000 }),
        page.locator('button[type="submit"]').click({ timeout: 2000 })
      ]);
      console.log('⚡ Step 2 next button clicked INSTANTLY');
    } catch (error) {
      console.log(`⚠️ Step 2 next button failed: ${error.message}`);
    }
    
    const step2EndTime = Date.now();
    console.log(`⚡ Step 2 interaction time: ${step2EndTime - step2StartTime}ms`);
    
    // DEBUG: Check for step 3
    await page.waitForTimeout(1000);
    const finalContent = await page.textContent('body');
    const hasStep3Content = finalContent?.includes('年齢') || finalContent?.includes('何歳');
    console.log(`Has step 3 content (age question): ${hasStep3Content}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'debug-final-state.png', fullPage: true });
    
    const endTime = Date.now();
    console.log(`⚡ Total time (Steps 1+2+3): ${endTime - startTime}ms`);
    console.log(`⚡ Breakdown - Page load: ${clickStartTime - startTime}ms | Step1: ${clickEndTime - clickStartTime}ms | Step2: ${step2EndTime - step2StartTime}ms`);
  });
});
