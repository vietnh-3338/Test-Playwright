import { test, expect } from '@playwright/test';
import { ShindangoNaviToolPage } from './pages/shindangoNaviTool.page';

test.describe('Shindango Navi Tool Page', () => {
  test('should load page and display title', async ({ page }) => {
    const toolPage = new ShindangoNaviToolPage(page);
    await toolPage.goto();
    await expect(toolPage.title).toBeVisible();
  });

  // Thêm các test case đơn giản khác ở đây
});
