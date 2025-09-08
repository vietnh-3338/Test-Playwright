import { Page } from '@playwright/test';
import { Step1Page } from './step1.page';
import { Step2Page } from './step2.page';
import { Step3Page } from './step3.page';
import { Step4Page } from './step4.page';
import { Step5Page } from './step5.page';
import { Step6Page } from './step6.page';
import { Step7Page } from './step7.page';
import { Step7ResultsPage } from './step7Results.page';
import { APP_CONFIG } from '../utils/constants';
import { TestScenario } from '../utils/testData';

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
    await this.step1.goto(APP_CONFIG.BASE_URL);
  }

  /**
   * Complete Step 1 and navigate to Step 2
   */
  async completeStep1(): Promise<void> {
    await this.launch();
    await this.step1.verifyAllElementsVisible();
    await this.step1.selectPersonalAnswer();
    await this.step1.verifyNextButtonEnabled();
    await this.step1.clickNext();
    await this.step2.verifyAllElementsVisible();
  }

  /**
   * Complete Step 1 and Step 2 with valid postal code, navigate to Step 3
   */
  async completeStep1And2(): Promise<void> {
    await this.completeStep1();
    await this.step2.searchValidPostalCode();
    await this.step2.clickNext();
    await this.step3.verifyAllElementsVisible();
  }

  /**
   * Complete Steps 1-2 and navigate to Step 3 (alias for completeStep1And2)
   */
  async completeToStep3(): Promise<void> {
    await this.completeStep1And2();
  }

  /**
   * Complete Step 1, 2 and navigate to Step 3 (same as completeStep1And2)
   */
  async completeStep1And2AndNavigateToStep3(): Promise<void> {
    await this.completeStep1();
    await this.step2.searchValidPostalCode();
    await this.step2.clickNext();
    await this.step3.verifyAllElementsVisible();
  }

  /**
   * Complete the entire flow from Step 1 to Step 3
   */
  async completeFullFlow(): Promise<void> {
    // Step 1
    await this.launch();
    await this.step1.verifyAllElementsVisible();
    await this.step1.selectPersonalAnswer();
    await this.step1.verifyNextButtonEnabled();
    await this.step1.clickNext();

    // Step 2
    await this.step2.verifyAllElementsVisible();
    await this.step2.searchValidPostalCode();
    await this.step2.clickNext();

    // Step 3
    await this.step3.verifyAllElementsVisible();
  }

  /**
   * Complete entire flow and proceed to Step 4
   */
  async completeToStep4(): Promise<void> {
    await this.completeFullFlow();
    await this.step3.testValidAgeOver40();
    await this.step3.clickNext();
    await this.step4.verifyAllElementsVisible();
  }

  /**
   * Complete entire flow to Step 5
   */
  async completeToStep5(): Promise<void> {
    await this.completeToStep4();
    await this.step4.selectHomeAnswer();
    await this.step4.navigateToStep5();
    await this.step5.verifyAllElementsVisible();
  }

  /**
   * Complete entire flow to Step 6
   */
  async completeToStep6(): Promise<void> {
    await this.completeToStep5();
    await this.step5.selectApprovedAnswer();
    await this.step5.clickNext();
    await this.step6.verifyAllElementsVisible();
  }

  /**
   * Complete entire flow to Step 7 (Review page)
   */
  async completeToStep7(careLevel: string = '要介護1'): Promise<void> {
    await this.completeToStep6();
    
    // Select care level based on parameter
    switch(careLevel) {
      case '要支援1':
        await this.step6.selectCareLevelSupport1();
        break;
      case '要支援2':
        await this.step6.selectCareLevelSupport2();
        break;
      case '要介護1':
        await this.step6.selectNursingCare1();
        break;
      case '要介護2':
        await this.step6.selectNursingCare2();
        break;
      case '要介護3':
        await this.step6.selectNursingCare3();
        break;
      case '要介護4':
        await this.step6.selectNursingCare4();
        break;
      case '要介護5':
        await this.step6.selectNursingCare5();
        break;
      default:
        await this.step6.selectNursingCare1(); // Default to 要介護1
    }
    
    await this.step6.navigateToStep7WithCareLevel();
    await this.step7.waitForReviewPageToLoad();
  }

  /**
   * Complete workflow with custom scenario data
   */
  async completeWorkflowWithScenario(scenario: TestScenario): Promise<void> {
    // Step 1: User type selection
    await this.launch();
    await this.step1.verifyAllElementsVisible();
    
    if (scenario.step1Selection === 'personal') {
      await this.step1.selectPersonalAnswer();
    } else {
      await this.step1.selectFamilyAnswer();
    }
    
    await this.step1.verifyNextButtonEnabled();
    await this.step1.clickNext();
    await this.step2.verifyAllElementsVisible();

    // Step 2: Postal code
    await this.step2.enterPostalCode(scenario.step2PostalCode);
    await this.step2.clickSearch();
    // Wait for address to be displayed - using a more generic check
    await this.page.waitForTimeout(2000); // Wait for search result
    await this.step2.clickNext();
    await this.step3.verifyAllElementsVisible();

    // Step 3: Age
    await this.step3.enterAge(scenario.step3Age);
    await this.step3.clickNext();
    await this.step4.verifyAllElementsVisible();

    // Step 4: Living environment
    if (scenario.step4Selection === 'home') {
      await this.step4.selectHomeAnswer();
    } else {
      await this.step4.selectFacilityAnswer();
    }
    await this.step4.navigateToStep5();
    await this.step5.verifyAllElementsVisible();

    // Step 5: Certification status
    if (scenario.step5Selection === 'approved') {
      await this.step5.selectApprovedAnswer();
      await this.step5.clickNext();
      await this.step6.verifyAllElementsVisible();

      // Step 6: Care level (only if approved)
      await this.selectCareLevel(scenario.step6CareLevel);
      await this.step6.navigateToStep7WithCareLevel();
      await this.step7.waitForReviewPageToLoad();
    } else {
      // Not applied - use the dedicated navigation method
      await this.step5.navigateToStep7WithNotApplied();
      await this.step7.waitForReviewPageToLoad();
    }
  }

  /**
   * Helper method to select care level based on string
   */
  private async selectCareLevel(careLevel: string): Promise<void> {
    switch(careLevel) {
      case '要支援1':
        await this.step6.selectCareLevelSupport1();
        break;
      case '要支援2':
        await this.step6.selectCareLevelSupport2();
        break;
      case '要介護1':
        await this.step6.selectNursingCare1();
        break;
      case '要介護2':
        await this.step6.selectNursingCare2();
        break;
      case '要介護3':
        await this.step6.selectNursingCare3();
        break;
      case '要介護4':
        await this.step6.selectNursingCare4();
        break;
      case '要介護5':
        await this.step6.selectNursingCare5();
        break;
      default:
        await this.step6.selectNursingCare1(); // Default to 要介護1
    }
  }

  /**
   * Complete workflow to Step 7 Results page (for not-applied scenarios)
   */
  async completeToStep7Results(postalCode: string, age: string = '65'): Promise<void> {
    // Step 1: User type selection
    await this.launch();
    await this.step1.verifyAllElementsVisible();
    await this.step1.selectPersonalAnswer(); // Default to personal
    await this.step1.verifyNextButtonEnabled();
    await this.step1.clickNext();
    await this.step2.verifyAllElementsVisible();

    // Step 2: Postal code
    await this.step2.enterPostalCode(postalCode);
    await this.step2.clickSearch();
    await this.page.waitForTimeout(2000); // Wait for search result
    await this.step2.clickNext();
    await this.step3.verifyAllElementsVisible();

    // Step 3: Age
    await this.step3.enterAge(age);
    await this.step3.clickNext();
    await this.step4.verifyAllElementsVisible();

    // Step 4: Living environment (default to home)
    await this.step4.selectHomeAnswer();
    await this.step4.navigateToStep5();
    await this.step5.verifyAllElementsVisible();

    // Step 5: Not applied - navigate to step 7 completion
    await this.step5.navigateToStep7WithNotApplied();
    await this.step7.waitForReviewPageToLoad();

    // Click "結果を表示する" button to go to results page
    await this.step7Results.verifyShowResultsButtonVisible();
    await this.step7Results.clickShowResults();
    await this.step7Results.waitForResultsPageToLoad();
  }
}
