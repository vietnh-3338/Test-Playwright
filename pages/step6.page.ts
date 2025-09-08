import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { APP_CONFIG, UI_TEXT, TEST_DATA } from '../utils/constants';

/**
 * Step 6 Page - Care Level Selection
 * Handles care level selection
 */
export class Step6Page extends BasePage {
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP6);
  }

  get careLevelSupport1(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.CARE_LEVEL_1);
  }

  get careLevelSupport2(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.CARE_LEVEL_2);
  }

  get nursingCare1(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_1);
  }

  get nursingCare2(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_2);
  }

  get nursingCare3(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_3);
  }

  get nursingCare4(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_4);
  }

  get nursingCare5(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_5);
  }

  get confirmButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.CONFIRM });
  }

  get resetButton(): Locator {
    return this.page.getByText('最初からやりなおす');
  }

  // Verifications
  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
    await expect(this.careLevelSupport1).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.careLevelSupport2).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nursingCare1).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nursingCare2).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nursingCare3).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nursingCare4).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nursingCare5).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.resetButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyConfirmButtonDisabled(): Promise<void> {
    await expect(this.confirmButton).toBeDisabled({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyConfirmButtonEnabled(): Promise<void> {
    await expect(this.confirmButton).toBeEnabled({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  // Actions
  async selectCareLevelSupport1(): Promise<void> {
    await this.careLevelSupport1.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectCareLevelSupport2(): Promise<void> {
    await this.careLevelSupport2.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectNursingCare1(): Promise<void> {
    await this.nursingCare1.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectNursingCare2(): Promise<void> {
    await this.nursingCare2.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectNursingCare3(): Promise<void> {
    await this.nursingCare3.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectNursingCare4(): Promise<void> {
    await this.nursingCare4.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectNursingCare5(): Promise<void> {
    await this.nursingCare5.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  // Navigation methods
  async navigateToStep7WithCareLevel(): Promise<void> {
    await this.clickConfirm();
    
    // Verify we're on step 7 (review page)
    const completionMessage = this.page.getByText(UI_TEXT.QUESTIONS.STEP7_COMPLETION);
    await expect(completionMessage).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
  }
}
