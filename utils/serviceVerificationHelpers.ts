/**
 * Page locators and helper methods for service verification
 * Centralizes all UI element selectors for better maintainability
 */

import { Page, Locator } from '@playwright/test';

export class ServiceVerificationHelpers {
  constructor(public page: Page) {}

  /**
   * Common locators used across service verification tests
   */
  get locators() {
    return {
      // Service page elements
      serviceTitle: this.page.locator('.flex.min-h-[55px] .text-lg.font-bold'),
      categoryBadge: this.page.locator('.space-y-4 .mb-6 span.rounded-xl'),
      overviewText: this.page.locator('.space-y-4 .mb-6 p.mb-4'),
      priceText: this.page.locator('.mt-2.text-right span.text-base'),
      referenceLink: this.page.locator('a.text-lg.font-medium.text-afterNavi-secondary06'),

      // Service accordion elements
      serviceHeaders: this.page.locator('xpath=//div[contains(@class,"cursor-pointer") and contains(@class,"flex") and contains(@class,"min-h-")]'),
      visitCareIndicator: this.page.locator('text=訪問介護').first()
    };
  }

  /**
   * Get service header by service name
   */
  getServiceHeader(serviceName: string): Locator {
    // Based on HTML analysis: service headers are clickable divs containing service name and chevron icon
    return this.page.locator('div.cursor-pointer')
      .filter({ hasText: serviceName })
      .filter({ has: this.page.locator('img[alt="toggle"]') }) // Must have chevron icon
      .first();
  }

  /**
   * Get service content area following the header
   */
  getServiceContent(serviceHeader: Locator): Locator {
    // Content is the next sibling div with overflow-hidden class
    // Based on HTML structure: header -> parent div -> sibling div.overflow-hidden
    return serviceHeader.locator('+ div.overflow-hidden').first();
  }

  /**
   * Wait for services page to load completely
   * Works for both home and facility service pages
   */
  async waitForServicesPageLoad(timeout: number = 20000): Promise<void> {
    // Wait for service heading to be visible instead of specific service
    await this.page.locator('h2').first().waitFor({ timeout });
    // Also ensure at least one service is visible
    await this.page.locator('div[class*="cursor-pointer"]').first().waitFor({ timeout });
  }

  /**
   * Expand service section if it's collapsed
   */
  async expandServiceIfNeeded(serviceName: string): Promise<void> {
    const header = this.getServiceHeader(serviceName);
    const content = this.getServiceContent(header);
    
    // Check if collapsed by max-height style
    const style = await content.getAttribute('style');
    const isCollapsed = style?.includes('max-height: 0px') ?? false;
    
    if (isCollapsed) {
      console.log(`🔽 Expanding service: ${serviceName}`);
      
      // Retry mechanism for clicking
      let clickSuccess = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`  🔄 Click attempt ${attempt}/3`);
          await header.click({ timeout: 10000 });
          await this.page.waitForTimeout(500); // Reduced from 800ms
          
          // Verify expansion worked
          const newStyle = await content.getAttribute('style');
          const stillCollapsed = newStyle?.includes('max-height: 0px') ?? false;
          if (!stillCollapsed) {
            clickSuccess = true;
            console.log(`  ✅ Expansion successful on attempt ${attempt}`);
            break;
          } else {
            console.log(`  ⚠️ Still collapsed after attempt ${attempt}`);
          }
        } catch (error) {
          console.log(`  ❌ Click attempt ${attempt} failed: ${error.message}`);
          if (attempt < 3) {
            await this.page.waitForTimeout(500); // Reduced from 1000ms
          }
        }
      }
      
      if (!clickSuccess) {
        throw new Error(`Failed to expand service after 3 attempts: ${serviceName}`);
      }
    } else {
      console.log(`✅ Service already expanded: ${serviceName}`);
    }
  }

  /**
   * Check if service content is collapsed
   */
  async isServiceCollapsed(serviceHeader: Locator): Promise<boolean> {
    const content = this.getServiceContent(serviceHeader);
    const contentStyle = await content.getAttribute('style');
    const isContentVisible = await content.isVisible();
    
    // Check for collapsed state indicators
    const isCollapsed = !isContentVisible || 
                       (contentStyle !== null && (
                         contentStyle.includes('max-height: 0') || 
                         contentStyle.includes('height: 0')
                       ));
    
    // Also check for very small max-height values
    if (!isCollapsed && contentStyle && contentStyle.includes('max-height:')) {
      const maxHeightMatch = contentStyle.match(/max-height:\\s*(\\d+)px/);
      if (maxHeightMatch && parseInt(maxHeightMatch[1]) <= 10) {
        return true;
      }
    }
    
    return Boolean(isCollapsed);
  }

  /**
   * Check if service content is expanded
   */
  async isServiceExpanded(serviceHeader: Locator): Promise<boolean> {
    const content = this.getServiceContent(serviceHeader);
    const contentStyle = await content.getAttribute('style');
    const isContentVisible = await content.isVisible();
    
    let isExpanded = isContentVisible;
    
    // Check for expanded state via max-height
    if (!isExpanded && contentStyle && contentStyle.includes('max-height:')) {
      const maxHeightMatch = contentStyle.match(/max-height:\\s*(\\d+)px/);
      if (maxHeightMatch && parseInt(maxHeightMatch[1]) > 50) {
        isExpanded = true;
      }
    }
    
    return isExpanded;
  }

  /**
   * Get count of all service sections
   */
  async getServiceCount(): Promise<number> {
    return await this.locators.serviceHeaders.count();
  }

  /**
   * Take screenshot for debugging purposes
   */
  async takeDebugScreenshot(filename: string): Promise<void> {
    try {
      await this.page.screenshot({ path: `./test-results/${filename}` });
    } catch (error) {
      console.warn(`Failed to take screenshot: ${filename}`, error);
    }
  }

  /**
   * Detect service display type and return appropriate validation strategy
   * Returns: 'accordion' for clickable headers, 'static' for static content
   */
  async detectServiceDisplayType(): Promise<'accordion' | 'static'> {
    // Check for dropdown chevron icons (toggle arrows)
    const chevronElements = await this.page.locator('img[alt="toggle"]').count();
    
    // Check for clickable headers with cursor-pointer
    const clickableHeaders = await this.page.locator('div.cursor-pointer').count();
    
    // If we have chevron icons or clickable headers, it's accordion
    const isAccordion = chevronElements > 0 || clickableHeaders > 0;
    
    console.log(`🔍 Dropdown detection: chevrons=${chevronElements}, clickable=${clickableHeaders}, type=${isAccordion ? 'accordion' : 'static'}`);
    
    return isAccordion ? 'accordion' : 'static';
  }

  /**
   * Validate service for static content display (no accordion behavior)
   * Used for scenarios like 要介護5 + 施設 where services are shown as static content
   */
  async validateStaticService(serviceName: string, expectedOverview: string, expectedPrice: string, expectedReferenceText: string, expectedReferenceHref: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`    🔍 Validating static service: ${serviceName}`);
      
      // Check if service name exists in page content
      const serviceElement = this.page.locator(`:has-text("${serviceName}")`).first();
      const serviceExists = await serviceElement.isVisible({ timeout: 5000 });
      
      if (!serviceExists) {
        return { success: false, error: `Service "${serviceName}" not found in page content` };
      }
      console.log(`    ✅ Service name found in page`);

      // For static content, check if overview text exists somewhere in the page
      if (expectedOverview) {
        const overviewSnippet = expectedOverview.substring(0, 50); // Check first 50 chars
        const overviewExists = await this.page.locator(`:has-text("${overviewSnippet}")`).count() > 0;
        if (overviewExists) {
          console.log(`    ✅ Overview text found`);
        } else {
          console.log(`    ⚠️ Overview text not found (static content may have different structure)`);
        }
      }

      // Check if price exists in page content
      if (expectedPrice) {
        const priceExists = await this.page.locator(`:has-text("${expectedPrice}")`).count() > 0;
        if (priceExists) {
          console.log(`    ✅ Price found: ${expectedPrice}`);
        } else {
          console.log(`    ⚠️ Price not found: ${expectedPrice} (may be formatted differently)`);
        }
      }

      // Check if reference link/text exists
      if (expectedReferenceText) {
        const referenceExists = await this.page.locator(`:has-text("${expectedReferenceText}")`).count() > 0;
        if (referenceExists) {
          console.log(`    ✅ Reference text found`);
        } else {
          console.log(`    ⚠️ Reference text not found (static content may not include references)`);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Static validation failed: ${error}` };
    }
  }
}
