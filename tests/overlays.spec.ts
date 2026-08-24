import { expect, test } from '@playwright/test';
import { AppLayout, overlayPane } from './support/app-locators';

test.describe('Modal & Overlays / Dialog', () => {
  test('condition: component dialog opens with title and closes from its action', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Dialog');

    await app.card('Open Dialog').getByRole('button', { name: 'Open Dialog with component' }).click();

    const dialog = page.locator('nb-dialog-container nb-card');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('nb-card-header')).toHaveText('This is a title passed to the dialog component');
    await expect(dialog.locator('nb-card-body')).toContainText('Lorem ipsum dolor sit amet');

    await dialog.getByRole('button', { name: 'Dismiss Dialog' }).click();
    await expect(dialog).toBeHidden();
  });

  test('condition: template dialog shows configured content and can be closed', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Dialog');

    await app.card('Open Dialog').getByRole('button', { name: 'Open Dialog with template' }).click();

    const dialog = page.locator('nb-dialog-container nb-card');
    await expect(dialog.locator('nb-card-header')).toHaveText('Template Dialog');
    await expect(dialog.locator('nb-card-body')).toHaveText('this is some additional data passed to dialog');

    await dialog.getByRole('button', { name: 'Close Dialog' }).click();
    await expect(dialog).toBeHidden();
  });

  test('condition: name prompt returns submitted value to the dialog page', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Dialog');

    await app.card('Return Result From Dialog').getByRole('button', { name: 'Enter Name' }).click();
    const dialog = page.locator('nb-dialog-container nb-card');

    await dialog.getByPlaceholder('Name').fill('Playwright User');
    await dialog.getByRole('button', { name: 'Submit' }).click();

    await expect(dialog).toBeHidden();
    await expect(app.card('Return Result From Dialog').locator('li')).toHaveText('Playwright User');
  });
});

test.describe('Modal & Overlays / Window', () => {
  test('condition: window form opens and accepts subject and body text', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Window');

    await app.card('Window Form').getByRole('button', { name: 'Open window form' }).click();
    const window = page.locator('nb-window').first();

    await expect(window).toBeVisible();
    await window.locator('#subject').fill('Window subject');
    await window.locator('#text').fill('Window body');

    await expect(window.locator('#subject')).toHaveValue('Window subject');
    await expect(window.locator('#text')).toHaveValue('Window body');
  });

  test('condition: template window displays configured text', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Window');

    await app.card('Window Form').getByRole('button', { name: 'Open window with template' }).click();

    const window = page.locator('nb-window').first();
    await expect(window).toBeVisible();
    await expect(window).toContainText('Here is the text provided via config: "some text to pass into template"');
  });
});

test.describe('Modal & Overlays / Toastr', () => {
  test('condition: custom toast renders title, content, and status class', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Toastr');

    const card = app.card('Toaster configuration');
    await card.locator('input[name="title"]').fill('Automation notice');
    await card.locator('input[name="content"]').fill('Toast body from Playwright');
    await card.locator('input[name="timeout"]').fill('0');
    await card.getByRole('button', { name: 'Show toast' }).click();

    const toast = page.locator('nb-toast').first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Automation notice');
    await expect(toast).toContainText('Toast body from Playwright');
    await expect(toast).toHaveClass(/primary/);
  });

  test('condition: random toast produces one of the known messages', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Toastr');

    await app.card('Toaster configuration').getByRole('button', { name: 'Random toast' }).click();

    const toast = page.locator('nb-toast').first();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/We rock at Angular|Titles are not always needed|Toastr rock!/);
  });
});

test.describe('Modal & Overlays / Popover', () => {
  test('condition: click popover opens text content and toggles closed', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Popover');

    const card = app.card('Simple Popovers');
    const trigger = card.getByRole('button', { name: 'on click' });
    await trigger.click();

    const popover = page.locator('nb-popover');
    await expect(popover).toBeVisible();
    await expect(popover).toContainText('Hello, how are you today?');

    await trigger.click();
    await expect(popover).toBeHidden();
  });

  test('condition: template popover exposes tabs and switches tab content', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Popover');

    await app.card('Template Popovers').getByRole('button', { name: 'With tabs' }).click();

    const popover = page.locator('nb-popover');
    await expect(popover.locator('.tab-text').filter({ hasText: "What's up?" })).toBeVisible();
    await expect(popover).toContainText('Such a wonderful day!');

    await popover.locator('.tab').filter({ hasText: 'Second Tab' }).click();
    await expect(popover).toContainText('Indeed!');
  });

  test('condition: template form popover accepts field values', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Popover');

    await app.card('Template Popovers').getByRole('button', { name: 'With form' }).click();
    const popover = page.locator('nb-popover');

    await popover.getByPlaceholder('Recipients').fill('team@example.com');
    await popover.getByPlaceholder('Subject').fill('Popover subject');
    await popover.getByPlaceholder('Message').fill('Popover message');

    await expect(popover.getByPlaceholder('Recipients')).toHaveValue('team@example.com');
    await expect(popover.getByPlaceholder('Subject')).toHaveValue('Popover subject');
    await expect(popover.getByPlaceholder('Message')).toHaveValue('Popover message');
    await expect(popover.getByRole('button', { name: 'Send' })).toBeEnabled();
  });
});

test.describe('Modal & Overlays / Tooltip', () => {
  test('condition: icon tooltip appears on hover with expected text', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Tooltip');

    await app.card('Tooltip With Icon').getByRole('button', { name: 'Show Tooltip' }).first().hover();

    const tooltip = overlayPane(page).locator('nb-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('This is a tooltip');
    await expect(tooltip.locator('nb-icon')).toBeVisible();
  });

  test('condition: colored tooltip applies requested status class', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Modal & Overlays', 'Tooltip');

    await app.card('Colored Tooltips').getByRole('button', { name: 'Danger' }).hover();

    const tooltip = overlayPane(page).locator('nb-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('This is a tooltip');
    await expect(tooltip).toHaveClass(/status-danger/);
  });
});
