import { test, expect } from '@playwright/test';

test('Step 1: Kiểm tra hiển thị và hoạt động của câu hỏi, câu trả lời, nút Next', async ({ page }) => {
  // Mở trang web với URL chính xác
  await page.goto('https://dev-theotol.soudan-e65.com/special/shindango-navi/tool?ck=1', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  // Đợi thêm để trang load đầy đủ
  await page.waitForTimeout(3000);

  // Kiểm tra câu hỏi hiển thị đúng và đầy đủ text
  const questionFullText = `あなたは診断を受けたご本人ですか、
それともご家族・支援者ですか？`;
  const question = page.getByText(questionFullText);
  await expect(question).toBeVisible({ timeout: 15000 });

  // Kiểm tra các câu trả lời hiển thị đúng
  const answer1 = page.getByText('ご本人', { exact: true });
  const answer2 = page.getByText('ご家族または支援者', { exact: true });
  await expect(answer1).toBeVisible({ timeout: 10000 });
  await expect(answer2).toBeVisible({ timeout: 10000 });

  // Kiểm tra nút "Next" hiển thị
  const nextButton = page.getByRole('button', { name: '次へ進む' });
  await expect(nextButton).toBeVisible({ timeout: 10000 });

  // Chọn câu trả lời đầu tiên
  await answer1.click();
  
  // Đợi một chút để UI cập nhật
  await page.waitForTimeout(1000);
  
  // Kiểm tra nút "Next" vẫn có thể click được sau khi chọn
  await expect(nextButton).toBeEnabled({ timeout: 5000 });

  // Nhấn nút "Next" và kiểm tra chuyển sang bước tiếp theo
  await nextButton.click();
  
  // Đợi chuyển trang
  await page.waitForTimeout(2000);
  const step2 = page.getByText('お住まい', { exact: true }).first();
  await expect(step2).toBeVisible({ timeout: 10000 });
});
