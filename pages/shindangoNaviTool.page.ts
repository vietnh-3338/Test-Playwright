import { Page, Locator, expect } from '@playwright/test';

export class ShindangoNaviToolPage {
  readonly page: Page;
  readonly baseUrl = 'https://dev-theotol.soudan-e65.com/special/shindango-navi/tool?ck=1';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.baseUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await this.page.waitForTimeout(5000);
  }

  // Step 1 elements
  get step1Question(): Locator {
    return this.page.getByText('あなたは診断を受けたご本人ですか、それともご家族・支援者ですか？');
  }

  get answerPersonal(): Locator {
    return this.page.getByText('ご本人', { exact: true });
  }

  get answerFamily(): Locator {
    return this.page.getByText('ご家族または支援者', { exact: true });
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: '次へ進む' });
  }

  // Step 2 elements
  get step2Question(): Locator {
    return this.page.getByText('診断を受けた方がお住まいの地域の郵便番号を入力し、「住所を検索」を押して下さい。');
  }

  get postalCodeInput(): Locator {
    return this.page.getByPlaceholder('例)0000000（ハイフン不要）');
  }

  get addressDisplay(): Locator {
    return this.page.getByText('ここに住所が表示されます');
  }

  get searchButton(): Locator {
    return this.page.getByRole('button', { name: '住所を検索' });
  }

  // Step 3 elements
  get step3Question(): Locator {
    return this.page.getByText('診断を受けた方のご年齢を教えてください。');
  }

  // Actions for Step 1
  async selectPersonalAnswer(): Promise<void> {
    await this.answerPersonal.click();
    await this.page.waitForTimeout(1000);
  }

  async selectFamilyAnswer(): Promise<void> {
    await this.answerFamily.click();
    await this.page.waitForTimeout(1000);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(3000);
  }

  async verifyStep1Elements(): Promise<void> {
    await expect(this.step1Question).toBeVisible({ timeout: 15000 });
    await expect(this.answerPersonal).toBeVisible({ timeout: 10000 });
    await expect(this.answerFamily).toBeVisible({ timeout: 10000 });
    await expect(this.nextButton).toBeVisible({ timeout: 10000 });
  }

  async verifyNextButtonDisabled(): Promise<void> {
    await expect(this.nextButton).toHaveClass(/cursor-not-allowed/);
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled({ timeout: 5000 });
  }

  // Actions for Step 2
  async enterPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  async clickSearch(): Promise<void> {
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }

  async verifyStep2Elements(): Promise<void> {
    await expect(this.step2Question).toBeVisible({ timeout: 10000 });
    await expect(this.postalCodeInput).toBeVisible({ timeout: 10000 });
    await expect(this.addressDisplay).toBeVisible({ timeout: 10000 });
    await expect(this.searchButton).toBeVisible({ timeout: 10000 });
  }

  async verifyErrorMessage(errorText: string): Promise<void> {
    const errorMessage = this.page.getByText(errorText);
    await expect(errorMessage).toBeVisible({ timeout: 8000 });
  }

  async verifyAddressDisplayed(address: string): Promise<void> {
    const addressResult = this.page.getByText(address);
    await expect(addressResult).toBeVisible({ timeout: 8000 });
  }

  // Actions for Step 3
  async verifyStep3Elements(): Promise<void> {
    await expect(this.step3Question).toBeVisible({ timeout: 15000 });
  }

  // Navigation helpers
  async navigateToStep2(): Promise<void> {
    await this.goto();
    await this.verifyStep1Elements();
    await this.selectPersonalAnswer();
    await this.verifyNextButtonEnabled();
    await this.clickNext();
    await this.verifyStep2Elements();
  }

  async navigateToStep3WithValidPostalCode(): Promise<void> {
    await this.navigateToStep2();
    await this.enterPostalCode('0010011');
    await this.clickSearch();
    await this.verifyAddressDisplayed('北海道札幌市北区 北十一条西（１〜４丁目）');
    await this.verifyNextButtonEnabled();
    await this.clickNext();
    await this.verifyStep3Elements();
  }

  // Utility methods
  async testForceClickDisabledButton(): Promise<void> {
    const currentUrl = this.page.url();
    await this.nextButton.click({ force: true });
    await this.page.waitForTimeout(1000);
    expect(this.page.url()).toBe(currentUrl);
  }
}
