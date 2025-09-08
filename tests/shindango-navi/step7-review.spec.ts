import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/pages';
import { TEST_SCENARIOS, TestScenario } from '../../utils/testData';
import { getApprovedScenarios, getNotAppliedScenarios } from '../../utils/helpers';

test.describe('Step 7: Data-Driven Review Page Testing', () => {
  let app: ShindangoNaviApp;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
  });

  // Test all approved scenarios (those that reach Step 7 with care level)
  const approvedScenarios = getApprovedScenarios(TEST_SCENARIOS);
  
  // Create individual test for each approved scenario
  for (const scenario of approvedScenarios) {
    test(`Review Page (Approved): ${scenario.scenarioName}`, async () => {
      console.log(`\n=== Testing: ${scenario.scenarioName} ===`);
      console.log(`Description: ${scenario.description}`);
      
      // Execute the complete workflow with scenario data
      await app.completeWorkflowWithScenario(scenario);
      
      // Verify review page is loaded
      console.log('  - Verifying review page elements...');
      await app.step7.waitForReviewPageToLoad();
      
      const reviewTitle = app.page.getByText('入力内容を確認して下さい。');
      await expect(reviewTitle).toBeVisible({ timeout: 10000 });
      console.log('    ✓ Review page title displayed');
      
      // Verify all answers match the scenario data
      console.log('  - Verifying scenario answers...');
      
      // Step 1 verification
      const step1Answer = app.page.locator('span.notel').getByText(scenario.step1Expected);
      await expect(step1Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 1: ${scenario.step1Expected}`);
      
      // Step 2 verification (postal code)
      const postalCodePart = scenario.step2Expected.split('（')[0]; // Get postal code part
      const step2Answer = app.page.locator('p').getByText(new RegExp(postalCodePart));
      await expect(step2Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 2: Postal code verified`);
      
      // Step 3 verification (age)
      const step3Answer = app.page.locator('span.notel').getByText(scenario.step3Expected);
      await expect(step3Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 3: ${scenario.step3Expected}`);
      
      // Step 4 verification (living environment)
      const step4Answer = app.page.locator('span.notel').getByText(scenario.step4Expected);
      await expect(step4Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 4: ${scenario.step4Expected}`);
      
      // Step 5 verification (certification status)
      const step5Answer = app.page.locator('span.notel').getByText(scenario.step5Expected);
      await expect(step5Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 5: ${scenario.step5Expected}`);
      
      // Step 6 verification (care level) - only for approved scenarios
      const step6Answer = app.page.locator('span.notel').getByText(scenario.step6Expected);
      await expect(step6Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 6: ${scenario.step6Expected}`);
      
      // Verify completion message
      const completionMessage = app.page.getByText('おつかれさまでした！');
      await expect(completionMessage).toBeVisible({ timeout: 10000 });
      console.log('    ✓ Completion message displayed');
      
      console.log(`✅ Scenario completed successfully!\n`);
    });
  }

  // Test not-applied scenarios (those that skip Step 6)
  const notAppliedScenarios = getNotAppliedScenarios(TEST_SCENARIOS);
  
  for (const scenario of notAppliedScenarios) {
    test(`Review Page (Not Applied): ${scenario.scenarioName}`, async () => {
      console.log(`\n=== Testing Not Applied: ${scenario.scenarioName} ===`);
      console.log(`Description: ${scenario.description}`);
      
      // Execute the complete workflow with scenario data
      await app.completeWorkflowWithScenario(scenario);
      
      // Verify review page is loaded
      console.log('  - Verifying review page elements...');
      const reviewTitle = app.page.getByText('入力内容を確認して下さい。');
      await expect(reviewTitle).toBeVisible({ timeout: 10000 });
      console.log('    ✓ Review page title displayed');
      
      // Verify answers for Steps 1-5 only (no Step 6 for not-applied)
      console.log('  - Verifying scenario answers (Steps 1-5 only)...');
      
      // Step 1 verification
      const step1Answer = app.page.locator('span.notel').getByText(scenario.step1Expected);
      await expect(step1Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 1: ${scenario.step1Expected}`);
      
      // Step 2 verification (postal code)
      const postalCodePart = scenario.step2Expected.split('（')[0]; // Get postal code part
      const step2Answer = app.page.locator('p').getByText(new RegExp(postalCodePart));
      await expect(step2Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 2: Postal code verified`);
      
      // Step 3 verification (age)
      const step3Answer = app.page.locator('span.notel').getByText(scenario.step3Expected);
      await expect(step3Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 3: ${scenario.step3Expected}`);
      
      // Step 4 verification (living environment)
      const step4Answer = app.page.locator('span.notel').getByText(scenario.step4Expected);
      await expect(step4Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 4: ${scenario.step4Expected}`);
      
      // Step 5 verification (certification status)
      const step5Answer = app.page.locator('span.notel').getByText(scenario.step5Expected);
      await expect(step5Answer).toBeVisible({ timeout: 5000 });
      console.log(`    ✓ Step 5: ${scenario.step5Expected}`);
      
      // Verify NO Step 6 question/answer appears for not-applied scenarios
      console.log('  - Verifying Step 6 is NOT displayed for not-applied scenarios...');
      const step6Question = app.page.getByText('介護度を教えて下さい。');
      await expect(step6Question).not.toBeVisible();
      console.log('    ✓ Step 6 question correctly hidden for not-applied');
      
      // Verify completion message
      const completionMessage = app.page.getByText('おつかれさまでした！');
      await expect(completionMessage).toBeVisible({ timeout: 10000 });
      console.log('    ✓ Completion message displayed');
      
      console.log(`✅ Not-applied scenario completed successfully!\n`);
    });
  }

  // Summary test to show all data variations
  test('Data Coverage Summary', async () => {
    console.log('\n=== Test Data Coverage Summary ===');
    
    const allScenarios = TEST_SCENARIOS;
    const approvedCount = getApprovedScenarios(TEST_SCENARIOS).length;
    const notAppliedCount = getNotAppliedScenarios(TEST_SCENARIOS).length;
    
    console.log(`Total scenarios: ${allScenarios.length}`);
    console.log(`  - Approved (reach Step 6): ${approvedCount}`);
    console.log(`  - Not Applied (skip Step 6): ${notAppliedCount}`);
    
    // Show coverage breakdown
    const step1Coverage = [...new Set(allScenarios.map(s => s.step1Expected))];
    const step4Coverage = [...new Set(allScenarios.map(s => s.step4Expected))];
    const step5Coverage = [...new Set(allScenarios.map(s => s.step5Expected))];
    
    console.log('\nStep 1 (User Type) Coverage:');
    step1Coverage.forEach(type => console.log(`  - ${type}`));
    
    console.log('\nStep 4 (Living Environment) Coverage:');
    step4Coverage.forEach(env => console.log(`  - ${env}`));
    
    console.log('\nStep 5 (Certification Status) Coverage:');
    step5Coverage.forEach(status => console.log(`  - ${status}`));
    
    const approvedScenarios = getApprovedScenarios(TEST_SCENARIOS);
    if (approvedScenarios.length > 0) {
      const step6Coverage = [...new Set(approvedScenarios.map(s => s.step6Expected))];
      console.log('\nStep 6 (Care Level) Coverage (Approved only):');
      step6Coverage.forEach(level => console.log(`  - ${level}`));
    }
    
    console.log('\nPostal Codes Tested:');
    allScenarios.forEach((scenario, index) => {
      console.log(`  ${index + 1}. ${scenario.step2PostalCode} - ${scenario.step2Expected.split('（')[1]?.replace('）', '') || 'Unknown location'}`);
    });
    
    console.log('\n✅ Data coverage analysis completed!\n');
    
    // This test doesn't actually interact with the UI, just shows coverage
    expect(allScenarios.length).toBeGreaterThan(0);
    expect(approvedCount).toBeGreaterThan(0);
    expect(notAppliedCount).toBeGreaterThan(0);
  });
});
