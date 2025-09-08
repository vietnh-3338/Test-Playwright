import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';

test.describe('Step 7: PDF Print Testing', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  test('Test PDF Print Function', async ({ page }) => {
    console.log('\n=== Testing PDF Print Function ===');
    
    // Use a test postal code
    const testPostalCode = '0640941';
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    console.log('  ✓ Results page loaded');
    
    // Verify PDF save button is visible
    await app.step7Results.verifyPdfSaveButtonVisible();
    console.log('  ✓ PDF save button is visible');
    
    // Set up new page listener
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
    
    // Try different print/save approaches
    console.log('  - Testing different print approaches...');
    
    // Method 1: Generate PDF using page.pdf()
    try {
      console.log('    - Method 1: Using page.pdf()...');
      const pdfBuffer = await newTab.pdf({
        format: 'A4',
        printBackground: true,
        path: './test-results/step7-print-method1.pdf'
      });
      console.log(`    ✓ Method 1 successful - PDF saved (${pdfBuffer.length} bytes)`);
    } catch (error) {
      console.log(`    ❌ Method 1 failed: ${error}`);
    }
    
    // Method 2: Try window.print() simulation
    try {
      console.log('    - Method 2: Using window.print() simulation...');
      
      // Inject a script to capture print event
      await newTab.evaluate(() => {
        window.addEventListener('beforeprint', () => {
          console.log('Print dialog opened');
        });
        window.addEventListener('afterprint', () => {
          console.log('Print dialog closed');
        });
      });
      
      // Trigger print
      await newTab.keyboard.press('Control+P');
      await newTab.waitForTimeout(2000);
      
      // Try to escape print dialog
      await newTab.keyboard.press('Escape');
      console.log('    ✓ Method 2 - Print dialog triggered and closed');
    } catch (error) {
      console.log(`    ❌ Method 2 failed: ${error}`);
    }
    
    // Method 3: Try to access PDF content directly from blob URL
    try {
      console.log('    - Method 3: Accessing blob content directly...');
      
      if (newTabUrl.startsWith('blob:')) {
        // Try to fetch blob content
        const pdfContent = await newTab.evaluate(async (blobUrl) => {
          try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return {
              size: blob.size,
              type: blob.type
            };
          } catch (error) {
            return { error: error.message };
          }
        }, newTabUrl);
        
        console.log(`    ✓ Method 3 - Blob info:`, pdfContent);
      }
    } catch (error) {
      console.log(`    ❌ Method 3 failed: ${error}`);
    }
    
    // Method 4: Try save as using browser automation
    try {
      console.log('    - Method 4: Save As automation...');
      
      // Focus on the tab
      await newTab.bringToFront();
      
      // Try Ctrl+S
      await newTab.keyboard.press('Control+S');
      await newTab.waitForTimeout(1000);
      
      // Try to escape any save dialog
      await newTab.keyboard.press('Escape');
      console.log('    ✓ Method 4 - Save As attempted');
    } catch (error) {
      console.log(`    ❌ Method 4 failed: ${error}`);
    }
    
    // Take a screenshot of the PDF preview
    await newTab.screenshot({ 
      path: './test-results/pdf-preview-print-test.png', 
      fullPage: true 
    });
    console.log('    ✓ Screenshot saved: pdf-preview-print-test.png');
    
    // Keep tab open for manual inspection
    console.log('  - Keeping tab open for 3 seconds for manual inspection...');
    await newTab.waitForTimeout(3000);
    
    // Close the new tab
    await newTab.close();
    console.log('  ✓ New tab closed');
    
    console.log('\n=== PDF Print Test Completed ===');
  });
});
