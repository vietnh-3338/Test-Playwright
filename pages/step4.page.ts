import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { APP_CONFIG, UI_TEXT } from '../utils/constants';

/**
 * Step 4 Page - Living Environment Selection
 */
export class Step4Page extends BasePage {
  
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP4);
  }

  get homeAnswer(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.HOME, { exact: true });
  }

  get facilityAnswer(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.FACILITY, { exact: true });
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
    await expect(this.homeAnswer).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.facilityAnswer).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
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
  async selectHomeAnswer(): Promise<void> {
    await this.homeAnswer.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectFacilityAnswer(): Promise<void> {
    await this.facilityAnswer.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(1000); // Giảm wait time
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
    await this.page.waitForTimeout(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async navigateToStep5(): Promise<void> {
    await this.clickNext();
    
    // Verify we're on step 5
    const step5Question = this.page.getByText(UI_TEXT.QUESTIONS.STEP5);
    await expect(step5Question).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.LONG });
  }
}
