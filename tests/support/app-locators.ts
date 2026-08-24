import { expect, type Locator, type Page } from '@playwright/test';

export class AppLayout {
  readonly page: Page;
  readonly header: Locator;
  readonly sidebar: Locator;
  readonly content: Locator;
  readonly themeSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('nb-layout-header');
    this.sidebar = page.locator('nb-sidebar.menu-sidebar');
    this.content = page.locator('nb-layout-column');
    this.themeSelect = this.header.locator('nb-select');
  }

  async open(path = '/') {
    await this.page.goto(path);
    await expect(this.header).toBeVisible();
  }

  menuItem(title: string) {
    return this.sidebar.locator('nb-menu li a, nb-menu li span').filter({ hasText: title }).first();
  }

  async navigate(parent: string, child?: string) {
    const parentItem = this.menuItem(parent);
    await parentItem.scrollIntoViewIfNeeded();
    await parentItem.click();

    if (child) {
      const childItem = this.menuItem(child);
      await childItem.scrollIntoViewIfNeeded();
      await childItem.click();
    }
  }

  card(header: string) {
    return this.page.locator('nb-card').filter({
      has: this.page.locator('nb-card-header', { hasText: header }),
    }).first();
  }

  async selectTheme(themeName: string) {
    await this.themeSelect.click();
    await this.page.locator('nb-option').filter({ hasText: themeName }).click();
  }
}

export class FormLayoutsPage {
  readonly app: AppLayout;

  constructor(readonly page: Page) {
    this.app = new AppLayout(page);
  }

  async open() {
    await this.app.open('/');
    await this.app.navigate('Forms', 'Form Layouts');
    await expect(this.page).toHaveURL(/\/pages\/forms\/layouts$/);
  }

  card(name: string) {
    return this.app.card(name);
  }
}

export class DatepickerPage {
  readonly app: AppLayout;

  constructor(readonly page: Page) {
    this.app = new AppLayout(page);
  }

  async open() {
    await this.app.open('/');
    await this.app.navigate('Forms', 'Datepicker');
    await expect(this.page).toHaveURL(/\/pages\/forms\/datepicker$/);
  }

  input(placeholder: string) {
    return this.page.getByPlaceholder(placeholder);
  }

  pickerDay(day: string) {
    return this.page
      .locator('nb-calendar-day-cell:not(.bounding-month), nb-calendar-range-day-cell:not(.bounding-month)')
      .filter({ hasText: new RegExp(`^\\s*${day}\\s*$`) })
      .first();
  }
}

export class SmartTablePage {
  readonly page: Page;
  readonly app: AppLayout;
  readonly table: Locator;
  readonly headers: Locator;
  readonly dataRows: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.app = new AppLayout(page);
    this.table = page.locator('ng2-smart-table table');
    this.headers = this.table.locator('thead tr').first().locator('th');
    this.dataRows = this.table.locator('tbody tr');
    this.addButton = this.table.locator('a.ng2-smart-action-add-add');
  }

  async open() {
    await this.app.open('/');
    await this.app.navigate('Tables & Data', 'Smart Table');
    await expect(this.page).toHaveURL(/\/pages\/tables\/smart-table$/);
  }

  filter(columnIndex: number) {
    return this.table.locator('thead tr').nth(1).locator('th').nth(columnIndex).getByRole('textbox');
  }

  rowByText(text: string) {
    return this.dataRows.filter({ hasText: text }).first();
  }
}

export class TreeGridPage {
  readonly app: AppLayout;
  readonly table: Locator;
  readonly rows: Locator;

  constructor(readonly page: Page) {
    this.app = new AppLayout(page);
    this.table = page.locator('table[nbtreegrid]');
    this.rows = this.table.locator('tr[nbtreegridrow]');
  }

  async open() {
    await this.app.open('/');
    await this.app.navigate('Tables & Data', 'Tree Grid');
    await expect(this.page).toHaveURL(/\/pages\/tables\/tree-grid$/);
  }

  search() {
    return this.page.locator('#search');
  }

  row(name: string) {
    return this.rows.filter({ hasText: name }).first();
  }
}

export function overlayPane(page: Page) {
  return page.locator('.cdk-overlay-container');
}
