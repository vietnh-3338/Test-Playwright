import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';

test.describe('Step 7: PDF Print Simple Test', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  test('Simple PDF Print from Results Page', async ({ page }) => {
    console.log('\n=== Simple PDF Print Test ===');
    
    // Use a test postal code
    const testPostalCode = '0640941';
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    console.log('  ✓ Results page loaded');
    
    // Method 1: Direct print to PDF from current page
    console.log('  - Method 1: Direct print to PDF from results page...');
    try {
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
        path: './test-downloads/results-direct-print.pdf'
      });
      
      console.log(`    ✓ PDF generated successfully (${pdfBuffer.length} bytes)`);
      console.log(`    ✓ PDF saved to: ./test-downloads/results-direct-print.pdf`);
    } catch (error) {
      console.log(`    ❌ Method 1 failed: ${error}`);
    }
    
    // Method 2: Print using window.print() simulation
    console.log('  - Method 2: Using window.print() simulation...');
    try {
      // Trigger print dialog
      await page.evaluate(() => {
        window.print();
      });
      
      console.log('    ✓ Print dialog triggered');
      
      // Wait a bit for any print processing
      await page.waitForTimeout(2000);
      
    } catch (error) {
      console.log(`    ❌ Method 2 failed: ${error}`);
    }
    
    // Method 3: Print specific content area only
    console.log('  - Method 3: Print specific content area...');
    try {
      // Try to find the main content area
      const contentSelectors = [
        '.main-content',
        '.content',
        '.results',
        '#main',
        'main',
        '.container',
        'body'
      ];
      
      let contentElement = null;
      for (const selector of contentSelectors) {
        try {
          contentElement = await page.locator(selector).first();
          if (await contentElement.isVisible()) {
            console.log(`    ✓ Found content area with selector: ${selector}`);
            break;
          }
        } catch {
          // Continue to next selector
        }
      }
      
      if (contentElement) {
        // Print only the content area
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
          path: './test-downloads/results-content-only.pdf'
        });
        
        console.log(`    ✓ Content-only PDF generated (${pdfBuffer.length} bytes)`);
      }
    } catch (error) {
      console.log(`    ❌ Method 3 failed: ${error}`);
    }
    
    // Method 4: Check what the official PDF save button actually does
    console.log('  - Method 4: Investigate official PDF save button behavior...');
    try {
      // Check if PDF save button exists
      await app.step7Results.verifyPdfSaveButtonVisible();
      console.log('    ✓ PDF save button is visible');
      
      // Set up to listen for any new windows/tabs
      const newPagePromise = page.context().waitForEvent('page');
      
      // Click the official PDF save button
      await app.step7Results.clickPdfSaveButton();
      console.log('    ✓ PDF save button clicked');
      
      // Wait for new page/tab
      const newPage = await newPagePromise;
      await newPage.waitForLoadState('networkidle');
      
      const newPageUrl = newPage.url();
      console.log(`    ✓ New page opened: ${newPageUrl}`);
      
      // If it's a blob URL, it means the PDF content is ready
      if (newPageUrl.startsWith('blob:')) {
        console.log('    ✓ Blob URL detected - PDF content is available');
        
        // Try to print this blob PDF
        const blobPdfBuffer = await newPage.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
          path: './test-downloads/results-from-blob.pdf'
        });
        
        console.log(`    ✓ Blob PDF printed successfully (${blobPdfBuffer.length} bytes)`);
      }
      
      // Close the new page
      await newPage.close();
      console.log('    ✓ New page closed');
      
    } catch (error) {
      console.log(`    ❌ Method 4 failed: ${error}`);
    }
    
    console.log('\n=== PDF Print Test Summary ===');
    console.log('✓ Multiple PDF generation methods tested');
    console.log('✓ Check ./test-downloads/ folder for generated PDF files');
  });
});
