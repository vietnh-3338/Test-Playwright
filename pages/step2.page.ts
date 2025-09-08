import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { APP_CONFIG, UI_TEXT, TEST_DATA } from '../utils/constants';

/**
 * Step 2 Page - Postal code input and address search
 */
export class Step2Page extends BasePage {
  
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP2);
  }

  get postalCodeInput(): Locator {
    return this.page.getByPlaceholder(UI_TEXT.PLACEHOLDERS.POSTAL_CODE);
  }

  get addressDisplay(): Locator {
    return this.page.getByText(UI_TEXT.MESSAGES.ADDRESS_PLACEHOLDER);
  }

  get searchButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.SEARCH });
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  // Actions
  async enterPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  async clickSearch(): Promise<void> {
    await this.searchButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.SEARCH_RESPONSE);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  // Verifications
  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.postalCodeInput).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.addressDisplay).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.searchButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyErrorMessage(errorText: string): Promise<void> {
    const errorMessage = this.page.getByText(errorText);
    await expect(errorMessage).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyAddressDisplayed(address: string): Promise<void> {
    const addressResult = this.page.getByText(address);
    await expect(addressResult).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled({ timeout: APP_CONFIG.TIMEOUTS.SHORT });
  }

  // Business logic methods
  async searchInvalidShortPostalCode(): Promise<void> {
    await this.enterPostalCode(TEST_DATA.POSTAL_CODES.INVALID_SHORT);
    await this.clickSearch();
    await this.verifyErrorMessage(TEST_DATA.EXPECTED_RESULTS.ERROR_SHORT_POSTAL);
  }

  async searchUnsupportedRegionPostalCode(): Promise<void> {
    await this.enterPostalCode(TEST_DATA.POSTAL_CODES.UNSUPPORTED_REGION);
    await this.clickSearch();
    await this.verifyErrorMessage(TEST_DATA.EXPECTED_RESULTS.ERROR_UNSUPPORTED_REGION);
  }

  async searchValidPostalCode(): Promise<void> {
    await this.enterPostalCode(TEST_DATA.POSTAL_CODES.VALID);
    await this.clickSearch();
    await this.verifyAddressDisplayed(TEST_DATA.EXPECTED_RESULTS.VALID_ADDRESS);
    await this.verifyNextButtonEnabled();
  }
}
