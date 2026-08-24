import { expect, test, type Locator } from '@playwright/test';
import { SmartTablePage, TreeGridPage } from './support/app-locators';

async function clickTableIcon(action: Locator) {
  await action.evaluate((element: HTMLElement) => element.click());
}

test.describe('Tables & Data / Smart Table', () => {
  let smartTable: SmartTablePage;

  test.beforeEach(async ({ page }) => {
    smartTable = new SmartTablePage(page);
    await smartTable.open();
  });

  test('condition: smart table renders expected columns and seeded records', async () => {
    await expect(smartTable.headers).toContainText([
      '',
      'ID',
      'First Name',
      'Last Name',
      'Username',
      'E-mail',
      'Age',
    ]);
    await expect(smartTable.dataRows).toHaveCount(10);
    await expect(smartTable.rowByText('Mark')).toContainText('mdo@gmail.com');
    await expect(smartTable.rowByText('Jacob')).toContainText('@fat');
  });

  test('condition: first-name filter narrows visible records', async () => {
    await smartTable.filter(2).fill('Larry');

    await expect(smartTable.dataRows).toHaveCount(1);
    await expect(smartTable.dataRows.first()).toContainText('Larry');
    await expect(smartTable.dataRows.first()).toContainText('Bird');
    await expect(smartTable.dataRows.first()).toContainText('twitter@outlook.com');
  });

  test('condition: email filter supports partial matching', async () => {
    await smartTable.filter(5).fill('gmail.com');

    await expect(smartTable.dataRows).toHaveCount(6);
    await expect(smartTable.dataRows).toContainText(['mdo@gmail.com', 'snow@gmail.com']);
    await expect(smartTable.rowByText('fat@yandex.ru')).toBeHidden();
  });

  test('condition: adding a row creates a visible table record', async () => {
    await clickTableIcon(smartTable.addButton);

    await expect(smartTable.table.locator('thead tr')).toHaveCount(3);
    const createRow = smartTable.table.locator('thead tr').nth(2);
    const inputs = createRow.getByRole('textbox');
    await inputs.nth(0).fill('101');
    await inputs.nth(1).fill('Mona');
    await inputs.nth(2).fill('Youssef');
    await inputs.nth(3).fill('@mona');
    await inputs.nth(4).fill('mona@example.com');
    await inputs.nth(5).fill('31');
    await clickTableIcon(createRow.locator('a.ng2-smart-action-add-create'));

    await expect(smartTable.rowByText('Mona')).toContainText('mona@example.com');
    await expect(smartTable.rowByText('@mona')).toContainText('31');
  });

  test('condition: editing a row updates the selected record only', async () => {
    const row = smartTable.rowByText('Ann');
    await clickTableIcon(row.locator('a.ng2-smart-action-edit-edit'));

    const editRow = smartTable.dataRows.nth(5);
    await expect(editRow.locator('input[placeholder="First Name"]')).toHaveValue('Ann');
    await editRow.locator('input[placeholder="First Name"]').fill('Anna');
    await editRow.locator('input[placeholder="E-mail"]').fill('anna@example.com');
    await clickTableIcon(editRow.locator('a.ng2-smart-action-edit-save'));

    await expect(smartTable.rowByText('Anna')).toContainText('anna@example.com');
    await expect(smartTable.rowByText('Barbara')).toContainText('barbara@yandex.ru');
  });

  test('condition: delete confirmation removes the selected row when accepted', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());

    const row = smartTable.rowByText('Jack');
    await expect(row).toContainText('Sparrow');
    await clickTableIcon(row.locator('a.ng2-smart-action-delete-delete'));

    await expect(smartTable.rowByText('Jack')).toBeHidden();
    await expect(smartTable.dataRows).toHaveCount(10);
  });
});

test.describe('Tables & Data / Tree Grid', () => {
  let treeGrid: TreeGridPage;

  test.beforeEach(async ({ page }) => {
    treeGrid = new TreeGridPage(page);
    await treeGrid.open();
  });

  test('condition: tree grid renders headers and top-level folders', async () => {
    await expect(treeGrid.table.locator('th')).toContainText(['name', 'size', 'kind', 'items']);
    await expect(treeGrid.rows).toHaveCount(3);
    await expect(treeGrid.row('Projects')).toContainText('1.8 MB');
    await expect(treeGrid.row('Reports')).toContainText('400 KB');
    await expect(treeGrid.row('Other')).toContainText('109 MB');
  });

  test('condition: expanding a folder reveals child documents', async () => {
    await treeGrid.row('Projects').locator('nb-tree-grid-row-toggle').click();

    await expect(treeGrid.row('project-1.doc')).toContainText('240 KB');
    await expect(treeGrid.row('project-4.docx')).toContainText('900 KB');
    await expect(treeGrid.rows).toHaveCount(7);
  });

  test('condition: search filters visible file-system entries', async () => {
    await treeGrid.search().fill('report');

    await expect(treeGrid.rows).toHaveCount(1);
    await expect(treeGrid.row('Reports')).toBeVisible();
    await expect(treeGrid.row('Projects')).toBeHidden();
  });

  test('condition: clicking name header sorts folder rows', async () => {
    const nameHeader = treeGrid.table.locator('th').filter({ hasText: 'name' });

    await nameHeader.click();
    await expect(treeGrid.rows.first()).toContainText('Other');

    await nameHeader.click();
    await expect(treeGrid.rows.first()).toContainText('Reports');
  });
});
