import { Page } from '@playwright/test';
import { APP_CONFIG } from '../utils/constants';

/**
 * Base page class with common functionality
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000 // Sử dụng timeout cố định
    });
    await this.page.waitForTimeout(5000); // Đợi như trong code cũ
  }

  /**
   * Wait for a specific amount of time
   */
  async waitFor(time: number): Promise<void> {
    await this.page.waitForTimeout(time);
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Force click an element (useful for testing disabled buttons)
   */
  async forceClick(selector: string): Promise<void> {
    await this.page.locator(selector).click({ force: true });
  }
}
