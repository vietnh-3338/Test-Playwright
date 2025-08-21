import { Page } from '@playwright/test';

export class ShindangoNaviToolPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://dev-theotol.soudan-e65.com/shindango-navi/tool');
  }

  // Thêm các locator và method cho các thao tác trên page ở đây
  get title() {
    return this.page.locator('h1');
  }
}
