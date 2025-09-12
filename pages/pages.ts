import { Page, Locator, expect } from '@playwright/test';
import { UI_TEXT } from '../utils/uiText';
import { APP_CONFIG, SELECTORS, TEST_DATA } from '../utils/constants';
import { TestScenario } from '../utils/testData';

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
    // If it's a root path, use the full tool URL path
    const targetUrl = url === '/' ? '/special/shindango-navi/tool?ck=1' : url;
    await this.page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await this.page.waitForTimeout(5000);
  }

  /**
   * Wait for a specific amount of time
   */
  async waitFor(time: number): Promise<void> {
    await this.page.waitForTimeout(time);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = APP_CONFIG.TIMEOUTS.MEDIUM): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Click an element with wait
   */
  async clickElement(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await locator.click();
  }
}

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
    await expect(this.nextButton).toBeEnabled();
  }

  async testForceClickDisabledButton(): Promise<void> {
    const isDisabled = await this.nextButton.isDisabled();
    if (isDisabled) {
      await this.nextButton.click({ force: true });
      await this.waitFor(1000);
    }
  }
}

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
    return this.page.getByText(UI_TEXT.PLACEHOLDERS.ADDRESS_DISPLAY);
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
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.SEARCH_RESPONSE);
  }

  async clickSearch(): Promise<void> {
    await this.clickSearchButton();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.postalCodeInput).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.addressDisplay).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.searchButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    const errorMessage = this.page.getByText(expectedMessage);
    await expect(errorMessage).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyAddressResult(expectedAddress: string): Promise<void> {
    const addressResult = this.page.getByText(expectedAddress);
    await expect(addressResult).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled({ timeout: APP_CONFIG.TIMEOUTS.SHORT });
  }

  async searchPostalCodeAndProceed(postalCode: string): Promise<void> {
    await this.enterPostalCode(postalCode);
    await this.clickSearchButton();
    await this.verifyNextButtonEnabled();
    await this.clickNext();
  }

  async searchValidPostalCode(): Promise<void> {
    await this.searchPostalCodeAndProceed(TEST_DATA.POSTAL_CODES.VALID);
  }
}

/**
 * Step 3 Page - Age Input
 */
export class Step3Page extends BasePage {
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP3);
  }

  get ageInput(): Locator {
    return this.page.locator('input[placeholder*="80"]');
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  get resetButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.RESET });
  }

  // Actions
  async enterAge(age: string): Promise<void> {
    await this.ageInput.fill(age);
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.ageInput).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nextButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonDisabled(): Promise<void> {
 await expect(this.nextButton).toHaveClass(new RegExp(SELECTORS.CSS_CLASSES.DISABLED_CURSOR));
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled();
  }

  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    const errorMessage = this.page.getByText(expectedMessage);
    await expect(errorMessage).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyWarningMessage(expectedMessage: string): Promise<void> {
    const warningMessage = this.page.getByText(expectedMessage);
    await expect(warningMessage).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async navigateToStep4(): Promise<void> {
    await this.clickNext();
  }

  async enterAgeAndProceed(age: string): Promise<void> {
    await this.enterAge(age);
    await this.verifyNextButtonEnabled();
    await this.navigateToStep4();
  }
}

/**
 * Step 4 Page - Living Environment Selection
 */
export class Step4Page extends BasePage {
  
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP4);
  }

  get answerHome(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.HOME, { exact: true });
  }

  get answerFacility(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.FACILITY, { exact: true });
  }

  get homeAnswer(): Locator {
    return this.answerHome;
  }

  get facilityAnswer(): Locator {
    return this.answerFacility;
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  get resetButton(): Locator {
    return this.page.getByRole('button', { name: 'リセット' });
  }

  // Actions
  async selectHomeAnswer(): Promise<void> {
    await this.answerHome.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectFacilityAnswer(): Promise<void> {
    await this.answerFacility.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerHome).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerFacility).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.nextButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonDisabled(): Promise<void> {
await expect(this.nextButton).toHaveClass(new RegExp(SELECTORS.CSS_CLASSES.DISABLED_CURSOR));  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled();
  }

  async navigateToStep5(): Promise<void> {
    await this.clickNext();
  }

  async selectAnswerAndProceed(answer: 'home' | 'facility'): Promise<void> {
    if (answer === 'home') {
      await this.selectHomeAnswer();
    } else {
      await this.selectFacilityAnswer();
    }
    await this.verifyNextButtonEnabled();
    await this.navigateToStep5();
  }
}

/**
 * Step 5 Page - Care Certification Status
 */
export class Step5Page extends BasePage {
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP5);
  }

  get answerApproved(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.APPROVED, { exact: true });
  }

  get answerNotApplied(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NOT_APPLIED, { exact: true });
  }

  get approvedAnswer(): Locator {
    return this.answerApproved;
  }

  get notAppliedAnswer(): Locator {
    return this.answerNotApplied;
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  get confirmButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.CONFIRM });
  }

  get resetButton(): Locator {
    return this.page.getByRole('button', { name: 'リセット' });
  }

  // Actions
  async selectApprovedAnswer(): Promise<void> {
    await this.answerApproved.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async selectNotAppliedAnswer(): Promise<void> {
    await this.answerNotApplied.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerApproved).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerNotApplied).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled();
  }

  async verifyConfirmButtonEnabled(): Promise<void> {
    await expect(this.confirmButton).toBeEnabled();
  }

  async navigateToStep7WithNotApplied(): Promise<void> {
    await this.selectNotAppliedAnswer();
    await this.verifyConfirmButtonEnabled();
    await this.clickConfirm();
  }

  async navigateToStep6WithApproved(): Promise<void> {
    await this.selectApprovedAnswer();
    await this.verifyNextButtonEnabled();
    await this.clickNext();
  }
}

/**
 * Step 6 Page - Care Level Selection
 */
export class Step6Page extends BasePage {
  // Locators
  get questionText(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP6);
  }

  get answerSupport1(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.CARE_LEVEL_1, { exact: true });
  }

  get answerSupport2(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.CARE_LEVEL_2, { exact: true });
  }

  get answerNursing1(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_1, { exact: true });
  }

  get answerNursing2(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_2, { exact: true });
  }

  get answerNursing3(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_3, { exact: true });
  }

  get answerNursing4(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_4, { exact: true });
  }

  get answerNursing5(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.NURSING_CARE_5, { exact: true });
  }

  get careLevelSupport1(): Locator {
    return this.answerSupport1;
  }

  get confirmButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.CONFIRM });
  }

  // Actions
  async selectCareLevel(level: string): Promise<void> {
    const levelMap: { [key: string]: Locator } = {
      '要支援1': this.answerSupport1,
      '要支援2': this.answerSupport2,
      '要介護1': this.answerNursing1,
      '要介護2': this.answerNursing2,
      '要介護3': this.answerNursing3,
      '要介護4': this.answerNursing4,
      '要介護5': this.answerNursing5,
    };

    const locator = levelMap[level];
    if (locator) {
      await locator.click();
      await this.waitFor(APP_CONFIG.WAIT_TIMES.UI_UPDATE);
    }
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  async verifyAllElementsVisible(): Promise<void> {
    await expect(this.questionText).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerSupport1).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerSupport2).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerNursing1).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerNursing2).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerNursing3).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerNursing4).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.answerNursing5).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.confirmButton).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
  }

  async verifyConfirmButtonEnabled(): Promise<void> {
    await expect(this.confirmButton).toBeEnabled();
  }

  async navigateToStep7WithCareLevel(): Promise<void> {
    await this.verifyConfirmButtonEnabled();
    await this.clickConfirm();
  }

  async selectCareLevelAndProceed(level: string): Promise<void> {
    await this.selectCareLevel(level);
    await this.verifyConfirmButtonEnabled();
    await this.navigateToStep7WithCareLevel();
  }
}

/**
 * Step 7 Page - Review Page
 */
export class Step7Page extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Review page elements
  private get reviewTitle() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_REVIEW_TITLE);
  }

  private get reviewQuestion1() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_REVIEW_Q1);
  }

  private get reviewQuestion2() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_REVIEW_Q2);
  }

  private get reviewQuestion3() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_REVIEW_Q3);
  }

  private get reviewQuestion4() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_REVIEW_Q4);
  }

  private get reviewQuestion5() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_REVIEW_Q5);
  }

  private get reviewQuestion6() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_REVIEW_Q6);
  }

  private get completionMessage() {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP7_COMPLETION);
  }
  get resultButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.RESULT });
  }

  // Methods to verify answers from previous steps
  async verifyUserTypeAnswer(expectedAnswer: string) {
    const answerElement = this.page.locator('span.notel').getByText(expectedAnswer);
    await answerElement.waitFor({ state: 'visible' });
    return answerElement;
  }

  async verifyPostalCodeAnswer(expectedPostalCode: string) {
    const answerElement = this.page.locator('p').getByText(new RegExp(expectedPostalCode));
    await answerElement.waitFor({ state: 'visible' });
    return answerElement;
  }

  async verifyAgeAnswer(expectedAge: string) {
    const answerElement = this.page.locator('span.notel').getByText(expectedAge);
    await answerElement.waitFor({ state: 'visible' });
    return answerElement;
  }

  async verifyLivingEnvironmentAnswer(expectedEnvironment: string) {
    const answerElement = this.page.locator('span.notel').getByText(expectedEnvironment);
    await answerElement.waitFor({ state: 'visible' });
    return answerElement;
  }

  async verifyCertificationStatusAnswer(expectedStatus: string) {
    const answerElement = this.page.locator('span.notel').getByText(expectedStatus);
    await answerElement.waitFor({ state: 'visible' });
    return answerElement;
  }

  async verifyCareLevelAnswer(expectedCareLevel: string) {
    const answerElement = this.page.locator('span.notel').getByText(expectedCareLevel);
    await answerElement.waitFor({ state: 'visible' });
    return answerElement;
  }
  async clickResult(): Promise<void> {
    await this.resultButton.click();
    await this.waitFor(APP_CONFIG.WAIT_TIMES.NAVIGATION);
  }

  // Verify all review questions are displayed
  async verifyAllReviewQuestionsDisplayed() {
    await this.reviewTitle.waitFor({ state: 'visible' });
    await this.reviewQuestion1.waitFor({ state: 'visible' });
    await this.reviewQuestion2.waitFor({ state: 'visible' });
    await this.reviewQuestion3.waitFor({ state: 'visible' });
    await this.reviewQuestion4.waitFor({ state: 'visible' });
    await this.reviewQuestion5.waitFor({ state: 'visible' });
    await this.reviewQuestion6.waitFor({ state: 'visible' });
  }

  // Verify all user answers from Steps 1-6
  async verifyAllAnswers(
    userType: string,
    postalCode: string, 
    age: string,
    livingEnvironment: string,
    certificationStatus: string,
    careLevel: string
  ) {
    await this.verifyUserTypeAnswer(userType);
    await this.verifyPostalCodeAnswer(postalCode);
    await this.verifyAgeAnswer(age);
    await this.verifyLivingEnvironmentAnswer(livingEnvironment);
    await this.verifyCertificationStatusAnswer(certificationStatus);
    await this.verifyCareLevelAnswer(careLevel);
  }

  // Check if completion message is displayed
  async isCompletionMessageVisible() {
    try {
      await this.completionMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Wait for page to be fully loaded
  async waitForReviewPageToLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.reviewTitle.waitFor({ state: 'visible' });
  }
}
/**
 * Step 7 Results Page - Final results with contact information
 */
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

/**
 * Application class that orchestrates all pages and provides high-level workflows
 */
export class ShindangoNaviApp {
  readonly page: Page;
  readonly step1: Step1Page;
  readonly step2: Step2Page;
  readonly step3: Step3Page;
  readonly step4: Step4Page;
  readonly step5: Step5Page;
  readonly step6: Step6Page;
  readonly step7: Step7Page;
  readonly step7Results: Step7ResultsPage;

  constructor(page: Page) {
    this.page = page;
    this.step1 = new Step1Page(page);
    this.step2 = new Step2Page(page);
    this.step3 = new Step3Page(page);
    this.step4 = new Step4Page(page);
    this.step5 = new Step5Page(page);
    this.step6 = new Step6Page(page);
    this.step7 = new Step7Page(page);
    this.step7Results = new Step7ResultsPage(page);
  }

  /**
   * Navigate to the application
   */
  async launch(): Promise<void> {
    await this.step1.goto('/');
  }

  /**
   * Complete Step 1 and navigate to Step 2
   */
  async completeStep1(): Promise<void> {
    await this.launch();
    await this.step1.selectPersonalAnswer();
    await this.step1.verifyNextButtonEnabled();
    await this.step1.clickNext();
  }

  /**
   * Complete Step 1 and Step 2 with valid postal code, navigate to Step 3
   */
  async completeStep1And2(): Promise<void> {
    await this.completeStep1();
    await this.step2.searchPostalCodeAndProceed(TEST_DATA.POSTAL_CODES.VALID);
  }

  /**
   * Complete Steps 1-2 and navigate to Step 3 (alias for completeStep1And2)
   */
  async navigateToStep3(): Promise<void> {
    await this.completeStep1And2();
  }

  async completeToStep3(): Promise<void> {
    await this.completeStep1And2();
  }

  /**
   * Complete Step 1, 2 and navigate to Step 3 (same as completeStep1And2)
   */
  async completeStep1And2AndNavigateToStep3(): Promise<void> {
    await this.completeStep1And2();
  }

  /**
   * Complete Steps 1-3 and navigate to Step 4
   */
  async completeStep1To3(): Promise<void> {
    await this.completeStep1And2();
    await this.step3.enterAgeAndProceed('65');
  }

  /**
   * Navigate to Step 4 by completing previous steps
   */
  async navigateToStep4(): Promise<void> {
    await this.completeStep1To3();
  }

  async completeToStep4(): Promise<void> {
    await this.completeStep1To3();
  }

  /**
   * Complete Steps 1-4 and navigate to Step 5
   */
  async completeStep1To4(): Promise<void> {
    await this.completeStep1To3();
    await this.step4.selectAnswerAndProceed('home');
  }

  /**
   * Navigate to Step 5 by completing previous steps
   */
  async navigateToStep5(): Promise<void> {
    await this.completeStep1To4();
  }

  async completeToStep5(): Promise<void> {
    await this.completeStep1To4();
  }

  /**
   * Complete Steps 1-5 with approved status and navigate to Step 6
   */
  async completeStep1To5WithApproved(): Promise<void> {
    await this.completeStep1To4();
    await this.step5.navigateToStep6WithApproved();
  }

  /**
   * Navigate to Step 6 by completing previous steps with approved status
   */
  async navigateToStep6(): Promise<void> {
    await this.completeStep1To5WithApproved();
  }

  async completeToStep6(): Promise<void> {
    await this.completeStep1To5WithApproved();
  }

  /**
   * Complete Steps 1-6 and navigate to Step 7 with care level
   */
  async completeStep1To6WithCareLevel(): Promise<void> {
    await this.completeStep1To5WithApproved();
    await this.step6.selectCareLevelAndProceed('要介護1');
  }

  /**
   * Navigate to Step 7 with care level by completing previous steps
   */
  async navigateToStep7WithCareLevel(): Promise<void> {
    await this.completeStep1To6WithCareLevel();
  }

  /**
   * Complete Steps 1-5 and navigate directly to Step 7 (not applied path)
   */
  async completeStep1To5WithNotApplied(): Promise<void> {
    await this.completeStep1To4();
    await this.step5.navigateToStep7WithNotApplied();
  }

  /**
   * Navigate to Step 7 with not applied status by completing previous steps
   */
  async navigateToStep7WithNotApplied(): Promise<void> {
    await this.completeStep1To5WithNotApplied();
  }

  /**
   * Complete full workflow based on scenario data
   */
  async runCompleteScenario(scenarioData: TestScenario): Promise<void> {
    // Step 1: Start application
    await this.launch();

    // Step 1: Select user type
    if (scenarioData.step1Selection === 'personal') {
      await this.step1.selectPersonalAnswer();
    } else {
      await this.step1.selectFamilyAnswer();
    }
    await this.step1.clickNext();

    // Step 2: Enter postal code
    await this.step2.searchPostalCodeAndProceed(scenarioData.step2PostalCode);

    // Step 3: Enter age
    await this.step3.enterAgeAndProceed(scenarioData.step3Age.toString());

    // Step 4: Select living environment
    await this.step4.selectAnswerAndProceed(scenarioData.step4Selection);

    // Step 5: Handle care certification status
    if (scenarioData.step5Selection === 'approved') {
      await this.step5.navigateToStep6WithApproved();
      
      // Step 6: Select care level
      await this.step6.selectCareLevelAndProceed(scenarioData.step6Expected);
    } else {
      // Direct to Step 7 for not applied
      await this.step5.navigateToStep7WithNotApplied();
    }

    // Wait for final page load
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Alias for runCompleteScenario for backward compatibility
   */
  async completeWorkflowWithScenario(scenarioData: TestScenario): Promise<void> {
    await this.runCompleteScenario(scenarioData);
  }

  /**
   * Complete workflow to Step 7 review page
   */
  async completeToStep7(careLevel: string = '要介護2', livingEnvironment: 'home' | 'facility' = 'home'): Promise<void> {
    await this.page.goto('/special/shindango-navi/tool');
    await this.page.waitForLoadState('networkidle');
    await this.step1.selectPersonalAnswer();
    await this.step1.clickNext();

    await this.step2.enterPostalCode('0640941'); // 札幌市中央区
    await this.step2.clickSearch();
    await this.step2.clickNext();

    await this.step3.enterAge('75');
    await this.step3.clickNext();

    // Select living environment based on parameter
    if (livingEnvironment === 'home') {
      await this.step4.selectHomeAnswer();
    } else {
      await this.step4.selectFacilityAnswer();
    }
    await this.step4.clickNext();

    await this.step5.selectApprovedAnswer();
    await this.step5.clickNext();

    await this.step6.selectCareLevel(careLevel);
    await this.step6.confirmButton.click();
    
    // Now at Step 7 review page
  }

  /**
   * Complete workflow to Step 7 results page (skip Step 6)
   */
  async completeToStep7Results(postalCode: string = '0640941'): Promise<void> {
    await this.page.goto('/special/shindango-navi/tool');
    await this.page.waitForLoadState('networkidle');
    await this.step1.selectPersonalAnswer();
    await this.step1.clickNext();

    await this.step2.enterPostalCode(postalCode);
    await this.step2.clickSearch();
    await this.step2.clickNext();

    await this.step3.enterAge('75');
    await this.step3.clickNext();

    await this.step4.selectHomeAnswer();
    await this.step4.clickNext();

    await this.step5.selectNotAppliedAnswer();
    await this.step5.clickConfirm();

    await this.step7.clickResult();

    
    
    // Now at Step 7 results page (skips Step 6)
  }
}

/**
 * Legacy ShindangoNaviToolPage for backward compatibility
 */
export class ShindangoNaviToolPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    await this.page.waitForTimeout(5000);
  }

  // Step 1 elements
  get step1Question(): Locator {
    return this.page.getByText(UI_TEXT.QUESTIONS.STEP1);
  }

  get personalAnswer(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.PERSONAL, { exact: true });
  }

  get familyAnswer(): Locator {
    return this.page.getByText(UI_TEXT.ANSWERS.FAMILY, { exact: true });
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: UI_TEXT.BUTTONS.NEXT });
  }

  async navigateToStep2(): Promise<void> {
    await this.goto();
    await this.personalAnswer.click();
    await this.nextButton.click();
  }

  async navigateToStep3WithValidPostalCode(): Promise<void> {
    await this.navigateToStep2();
    // Add postal code input logic if needed
  }
}
