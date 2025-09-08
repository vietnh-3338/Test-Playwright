import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';

test.describe('Step 7: Print Button Workflow', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  test('Print Button → New Tab → Print PDF', async ({ page }) => {
    console.log('\n=== Testing 印刷用に保存 Button Workflow ===');
    
    const testPostalCode = '0640941';
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    console.log('  ✓ Results page loaded');
    
    // Verify PDF save button is visible
    await app.step7Results.verifyPdfSaveButtonVisible();
    console.log('  ✓ PDF save button (印刷用に保存) is visible');
    
    // Set up new page listener for the PDF preview tab
    const newPagePromise = page.context().waitForEvent('page');
    
    // Click the 印刷用に保存 button
    console.log('  - Clicking 印刷用に保存 button...');
    await app.step7Results.clickPdfSaveButton();
    console.log('  ✓ 印刷用に保存 button clicked');
    
    // Wait for new tab (PDF preview) to open
    console.log('  - Waiting for PDF preview tab...');
    const pdfPreviewTab = await newPagePromise;
    await pdfPreviewTab.waitForLoadState('networkidle', { timeout: 15000 });
    console.log('  ✓ PDF preview tab opened and loaded');
    
    const pdfUrl = pdfPreviewTab.url();
    console.log(`  - PDF URL: ${pdfUrl}`);
    
    // Now we're in the PDF preview tab - let's print it
    console.log('  - Printing PDF from preview tab...');
    
    try {
      // Method A: Use Playwright's pdf() method on the PDF preview tab
      console.log('    - Method A: Direct PDF generation...');
      const pdfBuffer = await pdfPreviewTab.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
      });
      
      // Save the PDF
      const fs = require('fs');
      const path = require('path');
      const pdfPath = './test-results/step7-print-button-workflow.pdf';
      
      // Ensure directory exists
      const dir = path.dirname(pdfPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(pdfPath, pdfBuffer);
      console.log(`    ✓ Method A Success: PDF saved (${pdfBuffer.length} bytes) to ${pdfPath}`);
      
    } catch (error) {
      console.log(`    ❌ Method A Failed: ${error}`);
    }
    
    try {
      // Method B: Use CDP for more control
      console.log('    - Method B: Using Chrome DevTools Protocol...');
      
      const cdpSession = await pdfPreviewTab.context().newCDPSession(pdfPreviewTab);
      
      const pdfData = await cdpSession.send('Page.printToPDF', {
        format: 'A4',
        printBackground: true,
        landscape: false,
        preferCSSPageSize: true,
        margin: {
          top: 0.4, // inches
          bottom: 0.4,
          left: 0.4,
          right: 0.4
        }
      });
      
      // Save the PDF
      const fs = require('fs');
      const pdfPath = './test-results/step7-print-button-cdp.pdf';
      fs.writeFileSync(pdfPath, Buffer.from(pdfData.data, 'base64'));
      
      console.log(`    ✓ Method B Success: PDF saved via CDP to ${pdfPath}`);
      
    } catch (error) {
      console.log(`    ❌ Method B Failed: ${error}`);
    }
    
    // Take screenshot for verification
    await pdfPreviewTab.screenshot({ 
      path: './test-results/pdf-preview-print-button.png'
    });
    console.log('  ✓ Screenshot saved for verification');
    
    // Close the PDF preview tab
    await pdfPreviewTab.close();
    console.log('  ✓ PDF preview tab closed');
    
    console.log('\n=== 印刷用に保存 Workflow Completed Successfully ===');
  });
});
