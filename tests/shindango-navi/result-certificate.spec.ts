import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/pages';
import { 
  getServiceData, 
  ServiceData,
  CARE_LEVEL_5_HOME,
  CARE_LEVEL_5_FACILITY,
  CARE_LEVEL_4_HOME,
  CARE_LEVEL_4_FACILITY,
  CARE_LEVEL_3_HOME,
  CARE_LEVEL_3_FACILITY,
  CARE_LEVEL_2_HOME,
  CARE_LEVEL_2_FACILITY,
  CARE_LEVEL_1_HOME,
  CARE_LEVEL_1_FACILITY,
  CARE_SUPPORT_2_HOME,
  CARE_SUPPORT_2_FACILITY,
  CARE_SUPPORT_1_HOME,
  CARE_SUPPORT_1_FACILITY,
  SERVICE_TEST_CONFIGS
} from '../../utils/serviceTestData';
import { ServiceVerificationHelpers } from '../../utils/serviceVerificationHelpers';
import { APP_CONFIG } from '../../utils/constants';

/**
 * Step 7 Results Page Testing - Certificate Scenario
 * 
 * This test suite validates the services list display and accordion behavior
 * based on the combination of user answers from steps 4 and 6:
 * 
 * - Step 4 (Living Environment): 自宅 (home) vs 施設 (facility)
 * - Step 6 (Care Level): 要介護1~5, 要支援1~2
 * 
 * Test Coverage:
 * - Service details verification (overview, pricing, reference links)
 * - Accordion behavior based on service count
 * - All 14 care level + environment combinations
 */
test.describe('Step 7: Results Page Testing', () => {
  let app: ShindangoNaviApp;
  let serviceHelpers: ServiceVerificationHelpers;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
    serviceHelpers = new ServiceVerificationHelpers(page);
  });

  // Test all 14 care level + living environment combinations
  SERVICE_TEST_CONFIGS.forEach((config) => {
    test(`Complete service validation: ${config.careLevel} + ${config.livingEnvironment}`, async () => {
      test.setTimeout(60000); // 60 seconds for dropdown-heavy tests

      // Setup: Complete flow up to Step 7
      await app.completeToStep7(config.careLevel, config.livingEnvironment);
      await app.step7.clickResult();
      
      // Wait for services page to load
      await serviceHelpers.waitForServicesPageLoad(APP_CONFIG.TIMEOUTS.LONG);
      await app.page.waitForTimeout(2000);

      // Verify page loaded with correct care level and environment
      const heading = await serviceHelpers.page.locator('h2').first().textContent();
      
      // Get actual service count
      const serviceCount = await serviceHelpers.getServiceCount();
      
      // Verify at least some services are displayed
      expect(serviceCount).toBeGreaterThan(0);
      
      // Verify the heading contains the care level
      expect(heading).toContain(config.careLevel);
      
      // Verify the environment type is reflected
      if (config.livingEnvironment === 'home') {
        expect(heading).toContain('自宅');
      } else {
        expect(heading).toContain('施設');
      }

      // Validate all expected services content
      await validateAllServices(serviceHelpers, config.expectedServices);
    });
  });
});

/**
 * Helper Functions
 */

/**
 * Validate all expected services against the service data
 */
async function validateAllServices(helpers: ServiceVerificationHelpers, expectedServices: ServiceData[]): Promise<void> {
  // Detect the service display type
  const displayType = await helpers.detectServiceDisplayType();

  for (const serviceData of expectedServices) {
    const serviceName = serviceData.service;

    if (displayType === 'accordion') {
      // Handle accordion-style services (with clickable headers)
      const header = helpers.getServiceHeader(serviceName);
      await expect(header).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });
      
      // Expand the service to see content
      await helpers.expandServiceIfNeeded(serviceName);
      
      const content = helpers.getServiceContent(header);
      await expect(content).toBeVisible({ timeout: APP_CONFIG.TIMEOUTS.MEDIUM });

      // Validate service details
      await validateServiceDetails(content, serviceData);

    } else {
      // Handle static content services
      const result = await helpers.validateStaticService(
        serviceName,
        serviceData.overviewSnippet,
        serviceData.priceSnippet,
        serviceData.referenceText,
        serviceData.referenceHrefContains
      );

      expect(result.success, `${serviceName} - Static validation failed: ${result.error}`).toBe(true);
    }
  }
}

/**
 * Validate individual service details
 */
async function validateServiceDetails(content: any, serviceData: ServiceData): Promise<void> {
  // Validate overview text
  await validateOverviewText(content, serviceData);

  // Validate category badge
  if (serviceData.category) {
    await validateCategoryBadge(content, serviceData);
  }

  // Validate price information
  await validatePriceInfo(content, serviceData);

  // Validate reference link
  if (serviceData.referenceText && serviceData.referenceHrefContains) {
    await validateReferenceLink(content, serviceData);
  }
}

/**
 * Validate overview text
 */
async function validateOverviewText(content: any, serviceData: ServiceData): Promise<void> {
  const serviceName = serviceData.service;
  
  // Primary check: look for overview text in content
  const overviewVisible = await content.locator('.space-y-4 .mb-6 p.mb-4')
    .getByText(serviceData.overviewSnippet, { exact: false })
    .isVisible({ timeout: 3000 });
  
  if (overviewVisible) return;

  // Fallback: if overview snippet matches service name, check title/category
  if (serviceData.overviewSnippet === serviceName) {
    const titleFallback = await content.locator('.text-lg.font-bold')
      .filter({ hasText: serviceName })
      .first()
      .isVisible({ timeout: 1000 });
    
    expect(titleFallback, `${serviceName} - overview/title not found`).toBe(true);
    return;
  }

  throw new Error(`${serviceName} - overview not found (${serviceData.overviewSnippet})`);
}

/**
 * Validate category badge
 */
async function validateCategoryBadge(content: any, serviceData: ServiceData): Promise<void> {
  const categoryVisible = await content.locator('.space-y-4 .mb-6 span.rounded-xl')
    .filter({ hasText: serviceData.category })
    .first()
    .isVisible({ timeout: 3000 });
  
  expect(categoryVisible, `${serviceData.service} - category badge not found (${serviceData.category})`).toBe(true);
}

/**
 * Validate price information
 */
async function validatePriceInfo(content: any, serviceData: ServiceData): Promise<void> {
  const priceVisible = await content.locator('.mt-2.text-right span.text-base')
    .getByText(serviceData.priceSnippet, { exact: false })
    .isVisible({ timeout: 2000 });
  
  expect(priceVisible, `${serviceData.service} - price not found (${serviceData.priceSnippet})`).toBe(true);
}

/**
 * Validate reference link and href
 */
async function validateReferenceLink(content: any, serviceData: ServiceData): Promise<void> {
  const refLink = content.locator('a.text-lg.font-medium.text-afterNavi-secondary06')
    .filter({ hasText: serviceData.referenceText });
  
  await expect(refLink, `${serviceData.service} - reference link not found`).toBeVisible({ timeout: 2000 });

  const href = await refLink.getAttribute('href');
  expect(href?.includes(serviceData.referenceHrefContains), `${serviceData.service} - reference link href mismatch`).toBe(true);
}
