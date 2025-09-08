import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { APP_CONFIG } from '../utils/constants';

export class Step7ResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Results page elements
  private get showResultsButton() {
    return this.page.getByRole('button', { name: '結果を表示する' });
  }

  // PDF Save buttons - PC and Mobile versions
  private get pdfSaveButtonPC() {
    return this.page.getByText('まとめて印刷用に保存');
  }

  private get pdfSaveButtonMobile() {
    return this.page.getByText('保存').first(); // Mobile version
  }

  private get downloadLinkButton() {
    return this.page.getByRole('link', { name: 'ダウンロード' }).or(
      this.page.locator('a[href*="k141sinse"]')
    );
  }

  // Contact Information sections
  private get governmentOfficeSection() {
    return this.page.locator('[data-testid="government-office"]').or(
      this.page.locator('text=区役所').locator('..')
    );
  }

  private get communityCenterSection() {
    return this.page.locator('[data-testid="community-center"]').or(
      this.page.locator('text=地域包括支援センター').locator('..')
    );
  }

  // Generic locators for contact information
  private get contactInfoElements() {
    return this.page.locator('[class*="contact"], [class*="info"], [data-testid*="contact"]');
  }

  // Methods to interact with results page
  async clickShowResults(): Promise<void> {
    await this.showResultsButton.waitFor({ state: 'visible', timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await this.showResultsButton.click();
    await this.page.waitForTimeout(1500); // Reduced from APP_CONFIG.WAIT_TIMES.PAGE_LOAD
  }

  async verifyShowResultsButtonVisible(): Promise<void> {
    await expect(this.showResultsButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyResultsPageLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    // Wait for either download link or contact info to be visible
    await expect(
      this.downloadLinkButton.or(this.contactInfoElements.first())
    ).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
  }

  // Verify download link
  async verifyDownloadLink(expectedUrl: string): Promise<void> {
    console.log(`    Verifying download link: ${expectedUrl}`);
    
    // Use more specific selector for the actual download link
    const downloadLink = this.page.getByRole('link', { name: 'ダウンロードページへ' }).or(
      this.page.locator(`a[href="${expectedUrl}"][target="_blank"]`)
    );
    
    await expect(downloadLink).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    
    // Verify the href attribute
    const href = await downloadLink.getAttribute('href');
    if (href) {
      expect(href).toBe(expectedUrl);
      console.log(`    ✓ Download link verified: ${href}`);
    }
  }

  // Verify government office contact information
  async verifyGovernmentOfficeInfo(expectedAddress: string, expectedPhone: string): Promise<void> {
    console.log(`    Verifying government office info:`);
    console.log(`      Address: ${expectedAddress}`);
    console.log(`      Phone: ${expectedPhone}`);
    
    // Look for address text - try full text first, then partial
    const fullAddressElement = this.page.getByText(expectedAddress);
    const partialAddressElement = this.page.getByText(expectedAddress.split(' ')[0], { exact: false });
    
    try {
      await expect(fullAddressElement).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Government office address found (full match)`);
    } catch {
      await expect(partialAddressElement).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
      console.log(`    ✓ Government office address found (partial match)`);
    }
    
    // Look for phone number with multiple strategies
    let phoneFound = false;
    
    try {
      // Strategy 1: Exact text match
      const phoneElement = this.page.getByText(expectedPhone);
      await expect(phoneElement).toBeVisible({ timeout: 5000 });
      phoneFound = true;
    } catch (error) {
      // Strategy 2: Wait for element containing phone to be loaded
      try {
        await this.page.waitForFunction(
          (phone) => document.body.textContent?.includes(phone),
          expectedPhone,
          { timeout: 5000 }
        );
        phoneFound = true;
      } catch (error2) {
        console.log(`    ❌ Phone number not found: ${expectedPhone}`);
        throw new Error(`Government office phone number not found: ${expectedPhone}`);
      }
    }
    
    if (phoneFound) {
      console.log(`    ✓ Government office phone found`);
    }
  }

  // Verify community center contact information
  async verifyCommunityCenterInfo(expectedAddress: string, expectedPhone: string): Promise<void> {
    console.log(`    Verifying community center info:`);
    console.log(`      Address: ${expectedAddress}`);
    console.log(`      Phone: ${expectedPhone}`);
    
    // Look for address text - try full text first, then partial
    const fullAddressElement = this.page.getByText(expectedAddress);
    const partialAddressElement = this.page.getByText(expectedAddress.split(' ')[0], { exact: false });
    
    try {
      await expect(fullAddressElement).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Community center address found (full match)`);
    } catch {
      await expect(partialAddressElement).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
      console.log(`    ✓ Community center address found (partial match)`);
    }
    
    // Look for phone number with multiple strategies
    let phoneFound = false;
    
    try {
      // Strategy 1: Exact text match
      const phoneElement = this.page.getByText(expectedPhone);
      await expect(phoneElement).toBeVisible({ timeout: 5000 });
      phoneFound = true;
    } catch (error) {
      // Strategy 2: Wait for element containing phone to be loaded
      try {
        await this.page.waitForFunction(
          (phone) => document.body.textContent?.includes(phone),
          expectedPhone,
          { timeout: 5000 }
        );
        phoneFound = true;
      } catch (error2) {
        console.log(`    ❌ Phone number not found: ${expectedPhone}`);
        throw new Error(`Community center phone number not found: ${expectedPhone}`);
      }
    }
    
    if (phoneFound) {
      console.log(`    ✓ Community center phone found`);
    }
  }

  // Verify all contact information for a postal code
  async verifyContactInformation(
    governmentAddress: string,
    governmentPhone: string,
    communityAddress: string,
    communityPhone: string
  ): Promise<void> {
    console.log(`  - Verifying contact information...`);
    
    await this.verifyGovernmentOfficeInfo(governmentAddress, governmentPhone);
    await this.verifyCommunityCenterInfo(communityAddress, communityPhone);
    
    console.log(`    ✓ All contact information verified`);
  }

  // Get all visible text for debugging
  async getPageContent(): Promise<string> {
    return await this.page.textContent('body') || '';
  }

  // Check if specific text exists on page
  async hasText(text: string): Promise<boolean> {
    try {
      await this.page.getByText(text).waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // PDF Save functionality
  async clickPdfSaveButton(isMobile: boolean = false): Promise<void> {
    console.log(`  - Clicking PDF save button (${isMobile ? 'Mobile' : 'PC'})...`);
    
    const saveButton = isMobile ? this.pdfSaveButtonMobile : this.pdfSaveButtonPC;
    
    // Wait for button to be visible
    await expect(saveButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    
    // Click the save button - this will open a new tab
    await saveButton.click();
    
    console.log(`    ✓ PDF save button clicked (new tab should open)`);
  }

  async verifyPdfSaveButtonVisible(isMobile: boolean = false): Promise<void> {
    const saveButton = isMobile ? this.pdfSaveButtonMobile : this.pdfSaveButtonPC;
    await expect(saveButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    console.log(`    ✓ PDF save button is visible (${isMobile ? 'Mobile' : 'PC'})`);
  }

  // Handle PDF preview tab and download - Using print workflow
  async openPdfPreviewAndDownload(): Promise<any> {
    console.log(`  - Using 印刷用に保存 workflow to generate PDF...`);
    
    try {
      // Set up new page listener for the PDF preview tab
      const newPagePromise = this.page.context().waitForEvent('page');
      
      // Click the 印刷用に保存 button to open PDF preview tab
      await this.clickPdfSaveButton();
      
      // Wait for new tab (PDF preview) to open
      const pdfPreviewTab = await newPagePromise;
      await pdfPreviewTab.waitForLoadState('networkidle', { timeout: 15000 });
      console.log(`    ✓ PDF preview tab opened: ${pdfPreviewTab.url()}`);
      
      // Generate PDF from the preview tab using Playwright's pdf() method
      console.log(`    - Generating PDF from preview tab...`);
      const pdfBuffer = await pdfPreviewTab.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
      });
      
      console.log(`    ✓ PDF generated successfully (${pdfBuffer.length} bytes)`);
      
      // Close the PDF preview tab
      await pdfPreviewTab.close();
      console.log(`    ✓ PDF preview tab closed`);
      
      // Create a mock download object that matches Playwright's Download interface
      const mockDownload = {
        suggestedFilename: () => 'shindango-results.pdf',
        path: async () => {
          // Save to a temporary file
          const fs = require('fs');
          const path = require('path');
          const tempPath = path.join('./test-downloads', `temp-${Date.now()}.pdf`);
          
          // Ensure directory exists
          const dir = path.dirname(tempPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(tempPath, pdfBuffer);
          return tempPath;
        },
        saveAs: async (path: string) => {
          const fs = require('fs');
          const pathModule = require('path');
          
          // Ensure directory exists
          const dir = pathModule.dirname(path);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(path, pdfBuffer);
        },
        _buffer: pdfBuffer
      };
      
      return mockDownload;
      
    } catch (error) {
      console.log(`    ❌ 印刷用に保存 workflow failed: ${error}`);
      throw new Error(`PDF generation via print workflow failed: ${error}`);
    }
  }

  // Alternative method that handles the complete flow
  async downloadPdfFromSaveButton(): Promise<any> {
    console.log(`  - Complete PDF download flow from save button...`);
    
    // Method 1: Try to handle new tab opening
    try {
      return await this.openPdfPreviewAndDownload();
    } catch (error) {
      console.log(`    ⚠️  Tab-based download failed: ${error}`);
      
      // Method 2: Try direct download approach
      console.log(`    - Trying direct download approach...`);
      
      const downloadPromise = this.page.waitForEvent('download');
      await this.clickPdfSaveButton();
      
      try {
        const download = await downloadPromise;
        console.log(`    ✓ Direct download completed: ${download.suggestedFilename()}`);
        return download;
      } catch (directError) {
        console.log(`    ❌ Direct download also failed: ${directError}`);
        throw new Error('PDF download failed with both tab and direct methods');
      }
    }
  }

  // Wait for results page to be fully loaded
  async waitForResultsPageToLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    // Wait for either download section or contact info to appear
    await this.page.waitForTimeout(1000); // Reduced timeout
  }
}
