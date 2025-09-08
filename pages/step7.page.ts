import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { UI_TEXT } from '../utils/constants';

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
