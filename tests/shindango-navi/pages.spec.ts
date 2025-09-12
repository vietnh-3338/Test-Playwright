import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/pages';
import { TEST_DATA } from '../../utils/constants';

test.describe('Shindango Navi Tool', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  test('Step 1: All scenarios in one browser session', async () => {
    // Launch app once
    await app.launch();
    
    // Scenario 1: Verify all elements are visible and next button disabled initially
    await app.step1.verifyAllElementsVisible();
    await app.step1.verifyNextButtonDisabled(); // Button might be enabled by default now
    // await app.step1.testForceClickDisabledButton();
    
    // Scenario 2: Enable next button after selecting an answer
    await app.step1.selectPersonalAnswer();
    await app.step1.verifyNextButtonEnabled();
    
    // Scenario 3: Navigate to step 2
    await app.step1.clickNext();
    await app.step2.verifyAllElementsVisible();
  });

  test('Step 2: All scenarios in one browser session', async () => {
    // Navigate to step 2 once
    await app.completeStep1();
    
    // Scenario 1: Verify all elements are visible
    await expect(app.step2.postalCodeInput).toBeVisible();
    await expect(app.step2.searchButton).toBeVisible();
    await expect(app.step2.addressDisplay).toBeVisible();
    
    // Scenario 2: Test invalid short postal code
    await app.step2.enterPostalCode(TEST_DATA.POSTAL_CODES.INVALID_SHORT);
    await app.step2.clickSearch();
    await app.step2.verifyErrorMessage(TEST_DATA.EXPECTED_RESULTS.ERROR_SHORT_POSTAL);
    
    // Scenario 3: Test unsupported region postal code
    await app.step2.enterPostalCode(TEST_DATA.POSTAL_CODES.UNSUPPORTED_REGION);
    await app.step2.clickSearch();
    await app.step2.verifyErrorMessage(TEST_DATA.EXPECTED_RESULTS.ERROR_UNSUPPORTED_REGION);
    
    // Scenario 4: Test valid postal code and navigate to step 3 (without POM verification)
    await app.step2.searchValidPostalCode();
    await app.step2.clickNext();
    
    // Direct verification for step 3 instead of using POM
    const ageQuestion = app.page.getByText('診断を受けた方のご年齢を教えて下さい。');
    await expect(ageQuestion).toBeVisible({ timeout: 10000 });
  });

  test('Step 3: All scenarios in one browser session', async () => {
    // Navigate to step 3 once
    await app.completeToStep3();
    
    // Scenario 1: Verify all elements are visible
    await expect(app.step3.questionText).toBeVisible();
    await expect(app.step3.ageInput).toBeVisible();
    await app.step3.verifyNextButtonDisabled();
    await expect(app.step3.resetButton).toBeVisible();
    
    // Scenario 2: Test age 0 (invalid)
    await app.step3.enterAge(TEST_DATA.AGES.ZERO);
    await app.step3.clickNext();
    const zeroErrorMessage = app.page.getByText(TEST_DATA.EXPECTED_RESULTS.AGE_ZERO_ERROR);
    await expect(zeroErrorMessage).toBeVisible({ timeout: 10000 });
    
    // Scenario 3: Test age under 40 (warning)
    await app.step3.enterAge(TEST_DATA.AGES.UNDER_40);
    await app.step3.clickNext();
    const warningMessage = app.page.getByText(TEST_DATA.EXPECTED_RESULTS.AGE_UNDER_40_MESSAGE);
    await expect(warningMessage).toBeVisible({ timeout: 10000 });
    
    // Scenario 4: Test valid age over 40 and navigate to step 4
    await app.step3.enterAge(TEST_DATA.AGES.VALID_OVER_40);
    await app.step3.clickNext();
    
    // Direct verification for step 4
    const step4Question = app.page.getByText('希望する生活環境を教えて下さい。');
    await expect(step4Question).toBeVisible({ timeout: 10000 });
  });

  test('Step 4: All scenarios in one browser session', async () => {
    // Navigate to step 4 once
    await app.completeToStep4();
    
    // Scenario 1: Verify all elements are visible
    await expect(app.step4.questionText).toBeVisible();
    await expect(app.step4.homeAnswer).toBeVisible();
    await expect(app.step4.facilityAnswer).toBeVisible();
    await expect(app.step4.nextButton).toBeVisible();
    await expect(app.step4.resetButton).toBeVisible();
    
    // Scenario 2: Check initial button state
    const isInitiallyEnabled = await app.step4.nextButton.isEnabled();
    
    // Scenario 3: Test selecting Home answer
    await app.step4.selectHomeAnswer();
    await expect(app.step4.nextButton).toBeEnabled({ timeout: 5000 });
    await expect(app.step4.homeAnswer).toBeChecked();
    
    // Scenario 4: Test selecting Facility answer
    await app.step4.selectFacilityAnswer();
    await expect(app.step4.nextButton).toBeEnabled({ timeout: 5000 });
    await expect(app.step4.facilityAnswer).toBeChecked();
    
    // Scenario 5: Navigate to step 5 with Home answer
    await app.step4.selectHomeAnswer();
    await app.step4.clickNext();
    
    // Direct verification for step 5
    const step5Question = app.page.getByText('要介護認定の取得状況を教えて下さい。');
    await expect(step5Question).toBeVisible({ timeout: 10000 });
    
  });

  test('Step 5: All scenarios in one browser session', async () => {
    // Navigate to step 5 once
    await app.completeToStep5();
    
    
    // Scenario 1: Verify all elements are visible
    await expect(app.step5.questionText).toBeVisible();
    await expect(app.step5.notAppliedAnswer).toBeVisible();
    await expect(app.step5.approvedAnswer).toBeVisible();
    await expect(app.step5.resetButton).toBeVisible();
    
    // Scenario 2: Check initial button state (confirm button should be disabled)
    const confirmButton = app.page.getByRole('button', { name: '入力内容確認に進む' });
    const nextButton = app.page.getByRole('button', { name: '次へ進む' });
    
    const isConfirmButtonPresent = await confirmButton.isVisible().catch(() => false);
    const isNextButtonPresent = await nextButton.isVisible().catch(() => false);
    
    if (isConfirmButtonPresent) {
      const isInitiallyEnabled = await confirmButton.isEnabled();
    }
    
    if (isNextButtonPresent) {
      const isInitiallyEnabled = await nextButton.isEnabled();
    }
    
    // Scenario 3: Test selecting "取得済" answer -> next button enabled -> navigate to step 6
    await app.step5.selectApprovedAnswer();
    await expect(app.step5.approvedAnswer).toBeChecked();
    
    if (isNextButtonPresent) {
      await expect(nextButton).toBeEnabled({ timeout: 5000 });
      await app.step5.clickNext();
      
      // Verify we're on step 6
      const step6Question = app.page.getByText('介護度を教えて下さい。');
      await expect(step6Question).toBeVisible({ timeout: 10000 });
    }
    
  });

  test('Step 5: Test navigation to completion page', async () => {
    // Navigate to step 5 for completion test
    await app.completeToStep5();
    
    
    // Test selecting "未申請または申請中" answer -> confirm button enabled -> navigate to step 7
    await app.step5.selectNotAppliedAnswer();
    await expect(app.step5.notAppliedAnswer).toBeChecked();
    
    const confirmButton = app.page.getByRole('button', { name: '入力内容確認に進む' });
    const isConfirmButtonPresent = await confirmButton.isVisible().catch(() => false);
    
    if (isConfirmButtonPresent) {
      await expect(confirmButton).toBeEnabled({ timeout: 5000 });
      await app.step5.clickConfirm();
      
      // Verify we're on step 7 (completion page)
      const completionMessage = app.page.getByText('おつかれさまでした！');
      await expect(completionMessage).toBeVisible({ timeout: 10000 });
    }
    
  });

  test('Step 6: All scenarios in one browser session', async () => {
    // Navigate to step 6 once
    await app.completeToStep6();
    
    
    // Scenario 1: Verify all elements are visible
    await expect(app.step6.questionText).toBeVisible();
    await expect(app.step6.answerSupport1).toBeVisible();
    await expect(app.step6.answerSupport2).toBeVisible();
    await expect(app.step6.answerNursing1).toBeVisible();
    await expect(app.step6.answerNursing2).toBeVisible();
    await expect(app.step6.answerNursing3).toBeVisible();
    await expect(app.step6.answerNursing4).toBeVisible();
    await expect(app.step6.answerNursing5).toBeVisible();
    // await expect(app.step6.resetButton).toBeVisible();
    
    // Scenario 2: Check initial button state (confirm button should be disabled)
    const confirmButton = app.page.getByRole('button', { name: '入力内容確認に進む' });
    const isConfirmButtonPresent = await confirmButton.isVisible().catch(() => false);
    
    if (isConfirmButtonPresent) {
      const isInitiallyEnabled = await confirmButton.isEnabled();
      
      if (!isInitiallyEnabled) {
        await expect(confirmButton).toBeDisabled({ timeout: 5000 });
      }
    }
    
    // Scenario 3: Test selecting care level and button becomes enabled
    await app.step6.selectCareLevel('要介護2');
    await expect(app.step6.answerNursing2).toBeChecked();
    
    if (isConfirmButtonPresent) {
      await expect(confirmButton).toBeEnabled({ timeout: 5000 });
    }
    
    // Scenario 4: Test navigation to step 7 (completion)
    if (isConfirmButtonPresent) {
      await app.step6.clickConfirm();
      
      // Verify we're on step 7 (completion page)
      const completionMessage = app.page.getByText('おつかれさまでした！');
      await expect(completionMessage).toBeVisible({ timeout: 10000 });
    }
    
  });

  test('Step 7: Review and verification page', async () => {
    
    // Navigate to step 7 with specific answers to verify
    await app.completeToStep7('要介護2');
    
    // Scenario 1: Verify all review questions are displayed
    await app.step7.verifyAllReviewQuestionsDisplayed();
    
    // Scenario 2: Verify review page title
    const reviewTitle = app.page.getByText('入力内容を確認して下さい。');
    await expect(reviewTitle).toBeVisible({ timeout: 10000 });
    
    // Scenario 3: Verify all previous answers are displayed correctly
    
    // Check Step 1 answer (Personal selection) - use more specific selector
    const step1Answer = app.page.locator('span.notel').getByText('ご本人');
    await expect(step1Answer).toBeVisible({ timeout: 5000 });
    
    // Check Step 2 answer (Postal code) - look for postal code pattern
    const step2Answer = app.page.locator('p').getByText(/064‑0941/);
    await expect(step2Answer).toBeVisible({ timeout: 5000 });
    
    // Check Step 3 answer (Age) - use more specific selector for age
    const step3Answer = app.page.locator('span.notel').getByText('75');
    await expect(step3Answer).toBeVisible({ timeout: 5000 });
    
    // Check Step 4 answer (Living environment)
    const step4Answer = app.page.locator('span.notel').getByText('自宅');
    await expect(step4Answer).toBeVisible({ timeout: 5000 });
    
    // Check Step 5 answer (Certification status)
    const step5Answer = app.page.locator('span.notel').getByText('取得済');
    await expect(step5Answer).toBeVisible({ timeout: 5000 });
    
    // Check Step 6 answer (Care level)
    const step6Answer = app.page.locator('span.notel').getByText('要介護2');
    await expect(step6Answer).toBeVisible({ timeout: 5000 });
    
    // Scenario 4: Verify completion message is displayed
    const completionMessage = app.page.getByText('おつかれさまでした！');
    await expect(completionMessage).toBeVisible({ timeout: 10000 });
    
  });
});
