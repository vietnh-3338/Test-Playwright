import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { APP_CONFIG, UI_TEXT, TEST_DATA } from '../utils/constants';

/**
 * Step 5 Page - Care Certification Status
 * Handles care certification status selection
 */
export class Step5Page extends BasePage {
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP5);
  }

  get notAppliedAnswer(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NOT_APPLIED);
  }

  get approvedAnswer(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.APPROVED);
  }

  get confirmButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.CONFIRM });
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  get resetButton(): Locator {
    return this.page.getByText('最初からやりなおす');
  }

  // Verifications
  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
    await expect(this.notAppliedAnswer).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.approvedAnswer).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.resetButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyConfirmButtonDisabled(): Promise<void> {
    await expect(this.confirmButton).toBeDisabled({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyConfirmButtonEnabled(): Promise<void> {
    await expect(this.confirmButton).toBeEnabled({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  // Actions
  async selectNotAppliedAnswer(): Promise<void> {
    await this.notAppliedAnswer.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectApprovedAnswer(): Promise<void> {
    await this.approvedAnswer.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  // Navigation methods
  async navigateToStep7WithNotApplied(): Promise<void> {
    await this.selectNotAppliedAnswer();
    await this.clickConfirm();
    
    // Verify we're on step 7 (completion page)
    const completionMessage = this.page.getByText(UI_TEXT.QUESTIONS.STEP7_COMPLETION);
    await expect(completionMessage).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
  }

  async navigateToStep6WithApproved(): Promise<void> {
    await this.selectApprovedAnswer();
    await this.clickNext();
    
    // Verify we're on step 6
    const step6Question = this.page.getByText(UI_TEXT.QUESTIONS.STEP6);
    await expect(step6Question).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
  }
}
