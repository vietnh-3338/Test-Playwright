import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';
import { POSTAL_CODE_DATA, getPostalCodeData, formatPostalCodeForDisplay } from '../../utils/postalCodeData';

test.describe('Step 7: Results Page Testing (No Certificate)', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  // Test each postal code from the data set
  for (const postalData of POSTAL_CODE_DATA) {
    test(`Results Page: Postal Code ${postalData.postalCode} - ${postalData.applicableRegion}`, async () => {
      console.log(`\n=== Testing Postal Code: ${postalData.postalCode} ===`);
      console.log(`Region: ${postalData.applicableRegion}`);
      console.log(`Expected download link: ${postalData.linkToCertificateForm}`);
      
      // Complete workflow to Step 7 results page with "未申請または申請中"
      await app.completeToStep7Results(postalData.postalCode);
      
      console.log('  - Verifying results page loaded...');
      await app.step7Results.verifyResultsPageLoaded();
      console.log('    ✓ Results page loaded successfully');
      
      // Verify download link
      console.log('  - Verifying download link...');
      await app.step7Results.verifyDownloadLink(postalData.linkToCertificateForm);
      console.log('    ✓ Download link verified');
      
      // Verify contact information
      await app.step7Results.verifyContactInformation(
        postalData.governmentOfficeAddress,
        postalData.governmentOfficePhone,
        postalData.communityCenterAddress,
        postalData.communityCenterPhone
      );
      
      console.log(`✅ Postal code ${postalData.postalCode} testing completed successfully!\n`);
    });
  }

  // Test specific scenarios for different postal codes
  test('Results Page: Compare Different Regions', async () => {
    console.log('\n=== Comparing Different Postal Code Results ===');
    
    // Test a few different postal codes to ensure different contact info appears
    const testCodes = ['0640941', '0600041', '0640802']; // Different community centers
    
    for (const postalCode of testCodes) {
      const postalData = getPostalCodeData(postalCode);
      if (!postalData) {
        throw new Error(`Postal code data not found for: ${postalCode}`);
      }
      
      console.log(`\n  Testing: ${postalCode} - ${postalData.applicableRegion}`);
      
      await app.completeToStep7Results(postalCode);
      await app.step7Results.verifyResultsPageLoaded();
      
      // Verify this specific postal code has correct community center
      console.log(`    Expected community center: ${postalData.communityCenterAddress}`);
      const hasCorrectCenter = await app.step7Results.hasText(postalData.communityCenterAddress);
      expect(hasCorrectCenter).toBe(true);
      console.log(`    ✓ Correct community center displayed`);
      
      // Reset for next test
      if (postalCode !== testCodes[testCodes.length - 1]) {
        await app.page.reload();
      }
    }
    
    console.log('\n✅ Different regions comparison completed!\n');
  });

  // Test download link functionality
  test('Results Page: Download Link Validation', async () => {
    console.log('\n=== Testing Download Link Functionality ===');
    
    const testPostalCode = '0640941'; // Use first postal code
    const postalData = getPostalCodeData(testPostalCode);
    
    if (!postalData) {
      throw new Error(`Postal code data not found for: ${testPostalCode}`);
    }
    
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    
    console.log('  - Verifying download link exists and is clickable...');
    
    // Find the download link with specific text
    const downloadLink = app.page.getByRole('link', { name: 'ダウンロードページへ' });
    await expect(downloadLink).toBeVisible({ timeout: 10000 });
    
    // Verify the link href
    const href = await downloadLink.getAttribute('href');
    expect(href).toBe(postalData.linkToCertificateForm);
    console.log(`    ✓ Download link URL verified: ${href}`);
    
    // Verify link is clickable (but don't actually click to avoid navigation)
    await expect(downloadLink).toBeEnabled();
    console.log(`    ✓ Download link is clickable`);
    
    console.log('✅ Download link validation completed!\n');
  });

  // Test contact information format
  test('Results Page: Contact Information Format Validation', async () => {
    console.log('\n=== Testing Contact Information Format ===');
    
    const testPostalCode = '0600041'; // Use postal code with different community center
    const postalData = getPostalCodeData(testPostalCode);
    
    if (!postalData) {
      throw new Error(`Postal code data not found for: ${testPostalCode}`);
    }
    
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    
    console.log('  - Verifying all contact information is displayed...');
    
    // Check government office information
    console.log(`    Government Office: ${postalData.governmentOfficeAddress}`);
    const hasGovOffice = await app.step7Results.hasText(postalData.governmentOfficeAddress);
    expect(hasGovOffice).toBe(true);
    
    console.log(`    Government Phone: ${postalData.governmentOfficePhone}`);
    const hasGovPhone = await app.step7Results.hasText(postalData.governmentOfficePhone);
    expect(hasGovPhone).toBe(true);
    
    // Check community center information
    console.log(`    Community Center: ${postalData.communityCenterAddress}`);
    const hasCommunityCenter = await app.step7Results.hasText(postalData.communityCenterAddress);
    expect(hasCommunityCenter).toBe(true);
    
    console.log(`    Community Phone: ${postalData.communityCenterPhone}`);
    const hasCommunityPhone = await app.step7Results.hasText(postalData.communityCenterPhone);
    expect(hasCommunityPhone).toBe(true);
    
    console.log('    ✓ All contact information displayed correctly');
    
    console.log('✅ Contact information format validation completed!\n');
  });

  // Summary test showing all data coverage
  test('Data Coverage Summary: Results Page', async () => {
    console.log('\n=== Results Page Data Coverage Summary ===');
    
    console.log(`Total postal codes tested: ${POSTAL_CODE_DATA.length}`);
    
    // Show unique regions
    const uniqueRegions = [...new Set(POSTAL_CODE_DATA.map(d => d.applicableRegion))];
    console.log(`\nUnique regions covered: ${uniqueRegions.length}`);
    uniqueRegions.forEach(region => console.log(`  - ${region}`));
    
    // Show unique community centers
    const uniqueCommunityCenters = [...new Set(POSTAL_CODE_DATA.map(d => d.communityCenterAddress))];
    console.log(`\nUnique community centers: ${uniqueCommunityCenters.length}`);
    uniqueCommunityCenters.forEach(center => console.log(`  - ${center}`));
    
    // Show unique government offices
    const uniqueGovOffices = [...new Set(POSTAL_CODE_DATA.map(d => d.governmentOfficeAddress))];
    console.log(`\nUnique government offices: ${uniqueGovOffices.length}`);
    uniqueGovOffices.forEach(office => console.log(`  - ${office}`));
    
    console.log('\nPostal Code Range:');
    const sortedCodes = POSTAL_CODE_DATA.map(d => d.postalCode).sort();
    console.log(`  First: ${formatPostalCodeForDisplay(sortedCodes[0])}`);
    console.log(`  Last: ${formatPostalCodeForDisplay(sortedCodes[sortedCodes.length - 1])}`);
    
    console.log('\n✅ Data coverage analysis completed!\n');
    
    // This test doesn't interact with UI, just shows coverage
    expect(POSTAL_CODE_DATA.length).toBeGreaterThan(0);
    expect(uniqueRegions.length).toBeGreaterThan(0);
    expect(uniqueCommunityCenters.length).toBeGreaterThan(0);
  });
});
