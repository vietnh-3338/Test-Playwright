import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { APP_CONFIG, UI_TEXT, SELECTORS } from '../utils/constants';

/**
 * Step 1 Page - User type selection
 */
export class Step1Page extends BasePage {
  
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP1);
  }

  get answerPersonal(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.PERSONAL, { exact: true });
  }

  get answerFamily(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.FAMILY, { exact: true });
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  // Actions
  async selectPersonalAnswer(): Promise<void> {
    await this.answerPersonal.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectFamilyAnswer(): Promise<void> {
    await this.answerFamily.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  // Verifications
  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
    await expect(this.answerPersonal).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerFamily).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nextButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonDisabled(): Promise<void> {
    await expect(this.nextButton).toHaveClass(new RegExp(SELECTORS.CSS_CLASSES.DISABLED_CURSOR));
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled({ timeout: APP_CONFIG.TIMEOUTS.SHORT });
  }

  async testForceClickDisabledButton(): Promise<void> {
    const currentUrl = this.getCurrentUrl();
    await this.nextButton.click({ force: true });
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
    expect(this.getCurrentUrl()).toBe(currentUrl);
  }
}
