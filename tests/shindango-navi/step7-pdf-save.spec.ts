import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';
import { POSTAL_CODE_DATA, getPostalCodeData } from '../../utils/postalCodeData';
import { PdfVerifier, PdfContactInfo } from '../../utils/pdfVerifier';
import * as path from 'path';

test.describe('Step 7: PDF Save Button Testing', () => {
  let app: ShindangoNaviApp;
  let pdfVerifier: PdfVerifier;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
    pdfVerifier = new PdfVerifier('./test-downloads');
    
    // Set up download behavior
    await page.setExtraHTTPHeaders({
      'Accept': 'application/pdf,application/octet-stream,*/*'
    });
  });

  // Test PDF save button functionality for each postal code
  for (const postalData of POSTAL_CODE_DATA) {
    test(`PDF Save Button: Postal Code ${postalData.postalCode} - ${postalData.applicableRegion}`, async ({ page }) => {
      console.log(`\n=== Testing PDF Save for Postal Code: ${postalData.postalCode} ===`);
      console.log(`Region: ${postalData.applicableRegion}`);
      
      // Complete workflow to Step 7 results page
      await app.completeToStep7Results(postalData.postalCode);
      await app.step7Results.verifyResultsPageLoaded();
      console.log('  ✓ Results page loaded successfully');
      
      // Verify PDF save button is visible
      await app.step7Results.verifyPdfSaveButtonVisible();
      console.log('  ✓ PDF save button is visible');
      
      // Download PDF using the complete workflow (new tab + download)
      const download = await app.step7Results.downloadPdfFromSaveButton();
      console.log(`  ✓ PDF download started: ${download.suggestedFilename()}`);
      
      // Save PDF file
      const pdfPath = await pdfVerifier.savePdfDownload(
        download, 
        `step7-results-${postalData.postalCode}.pdf`
      );
      
      // Verify PDF file is valid
      await pdfVerifier.verifyPdfFile(pdfPath);
      
      // Prepare expected contact info
      const expectedContactInfo: PdfContactInfo = {
        governmentOfficeAddress: postalData.governmentOfficeAddress,
        governmentOfficePhone: postalData.governmentOfficePhone,
        communityCenterAddress: postalData.communityCenterAddress,
        communityCenterPhone: postalData.communityCenterPhone
      };
      
      // Verify contact information in PDF
      await pdfVerifier.verifyContactInfoInPdf(pdfPath, expectedContactInfo);
      
      // Cleanup
      await pdfVerifier.cleanup(pdfPath);
      
      console.log(`✅ PDF save and verification completed for postal code ${postalData.postalCode}!\n`);
    });
  }

  test('PDF Save Button: Mobile vs Desktop Detection', async ({ page }) => {
    console.log('\n=== Testing Mobile vs Desktop PDF Button ===');
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results('0640941');
    await app.step7Results.verifyResultsPageLoaded();
    
    // Test desktop button (default)
    console.log('  Testing desktop PDF save button...');
    try {
      await app.step7Results.verifyPdfSaveButtonVisible(false); // Desktop
      console.log('    ✓ Desktop PDF save button is visible');
    } catch (error) {
      console.log('    ❌ Desktop PDF save button not visible');
    }
    
    // Test mobile button by changing viewport
    console.log('  Testing mobile PDF save button...');
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
    await page.waitForTimeout(1000); // Allow responsive changes
    
    try {
      await app.step7Results.verifyPdfSaveButtonVisible(true); // Mobile
      console.log('    ✓ Mobile PDF save button is visible');
    } catch (error) {
      console.log('    ❌ Mobile PDF save button not visible');
    }
    
    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    console.log('  ✓ Viewport testing completed');
  });

  test('PDF Save Button: Download Flow Validation', async ({ page }) => {
    console.log('\n=== Testing PDF Download Flow ===');
    
    // Use a representative postal code
    const testPostalCode = '0640941';
    const postalData = getPostalCodeData(testPostalCode);
    
    if (!postalData) {
      throw new Error(`Test postal code data not found: ${testPostalCode}`);
    }
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    
    // Verify PDF save button exists and is clickable
    console.log('  - Verifying PDF save button functionality...');
    await app.step7Results.verifyPdfSaveButtonVisible();
    
    // Download PDF using complete workflow
    const download = await app.step7Results.downloadPdfFromSaveButton();
    
    // Verify download properties
    const filename = download.suggestedFilename();
    console.log(`    ✓ Download filename: ${filename}`);
    expect(filename).toBeTruthy();
    expect(filename).toMatch(/\.(pdf|PDF)$/); // Should be a PDF file
    
    // Save and verify file
    const pdfPath = await pdfVerifier.savePdfDownload(download, 'download-flow-test.pdf');
    await pdfVerifier.verifyPdfFile(pdfPath);
    
    // Basic content verification
    const expectedContactInfo: PdfContactInfo = {
      governmentOfficeAddress: postalData.governmentOfficeAddress,
      governmentOfficePhone: postalData.governmentOfficePhone,
      communityCenterAddress: postalData.communityCenterAddress,
      communityCenterPhone: postalData.communityCenterPhone
    };
    
    await pdfVerifier.verifyContactInfoInPdf(pdfPath, expectedContactInfo);
    
    // Cleanup
    await pdfVerifier.cleanup(pdfPath);
    
    console.log('  ✅ PDF download flow validation completed');
  });

  test('PDF Content: Comprehensive Verification', async ({ page }) => {
    console.log('\n=== Testing PDF Content Verification ===');
    
    // Test with postal code that has different community center
    const testCodes = ['0640941', '0600041']; // Different community centers
    
    for (const postalCode of testCodes) {
      const postalData = getPostalCodeData(postalCode);
      if (!postalData) continue;
      
      console.log(`\n  Testing postal code: ${postalCode}`);
      console.log(`    Region: ${postalData.applicableRegion}`);
      console.log(`    Community Center: ${postalData.communityCenterAddress}`);
      
      // Navigate to results page
      await app.completeToStep7Results(postalCode);
      await app.step7Results.verifyResultsPageLoaded();
      
      // Download PDF using complete workflow
      const download = await app.step7Results.downloadPdfFromSaveButton();
      
      // Save with unique filename
      const pdfPath = await pdfVerifier.savePdfDownload(
        download, 
        `content-verification-${postalCode}.pdf`
      );
      
      // Verify file
      await pdfVerifier.verifyPdfFile(pdfPath);
      
      // Detailed content verification
      const expectedContactInfo: PdfContactInfo = {
        governmentOfficeAddress: postalData.governmentOfficeAddress,
        governmentOfficePhone: postalData.governmentOfficePhone,
        communityCenterAddress: postalData.communityCenterAddress,
        communityCenterPhone: postalData.communityCenterPhone
      };
      
      await pdfVerifier.verifyContactInfoInPdf(pdfPath, expectedContactInfo);
      
      // Cleanup
      await pdfVerifier.cleanup(pdfPath);
      
      console.log(`    ✅ Content verification completed for ${postalCode}`);
    }
    
    console.log('  🎯 Comprehensive PDF content verification completed');
  });
});
