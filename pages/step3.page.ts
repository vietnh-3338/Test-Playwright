import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { APP_CONFIG, UI_TEXT, TEST_DATA } from '../utils/constants';

/**
 * Step 3 Page - Age Input
 * Handles age input and validation
 */
export class Step3Page extends BasePage {
  // Locators
  get questionText(): Locator {
    return this.page.getByText('診断を受けた方のご年齢を教えて下さい。');
  }

  get ageInput(): Locator {
    return this.page.locator('input[placeholder*="80"]');
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  get resetButton(): Locator {
    return this.page.getByText('最初からやりなおす');
  }

  get supportLink(): Locator {
    return this.page.getByText('こちら');
  }

  // Verifications
  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
    await expect(this.ageInput).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nextButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.resetButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonDisabled(): Promise<void> {
    await expect(this.nextButton).toBeDisabled({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  // Actions
  async enterAge(age: string): Promise<void> {
    await this.ageInput.clear();
    await this.ageInput.fill(age);
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  // Simple test methods
  async testValidAgeOver40(): Promise<void> {
    await this.enterAge(TEST_DATA.AGES.VALID_OVER_40);
    await this.verifyNextButtonEnabled();
  }

  async clickSupportLink(): Promise<void> {
    // Store current page count
    const pageCount = this.page.context().pages().length;
    
    // Click support link
    await this.supportLink.click();
    
    // Wait for new tab/page to open
    await this.page.waitForTimeout(2000);
    
    // Verify new page opened
    const newPageCount = this.page.context().pages().length;
    expect(newPageCount).toBeGreaterThan(pageCount);
    
    // Get the new page and verify URL
    const pages = this.page.context().pages();
    const newPage = pages[pages.length - 1];
    await newPage.waitForLoadState();
    
    const newUrl = newPage.url();
    expect(newUrl).toContain('y-ninchisyotel.net/support');
  }

  async navigateToStep4(): Promise<void> {
    await this.clickNext();
    
    // Verify we're on step 4
    const step4Question = this.page.getByText(UI_TEXT.QUESTIONS.STEP4);
    await expect(step4Question).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
  }
}
