import { expect, test } from '@playwright/test';
import { DatepickerPage, FormLayoutsPage } from './support/app-locators';

test.describe('Forms / Form Layouts', () => {
  let forms: FormLayoutsPage;

  test.beforeEach(async ({ page }) => {
    forms = new FormLayoutsPage(page);
    await forms.open();
  });

  test('condition: all form layout cards render expected controls', async ({ page }) => {
    await expect(page.locator('nb-card-header')).toContainText([
      'Inline form',
      'Using the Grid',
      'Form without labels',
      'Basic form',
      'Block form',
      'Horizontal form',
    ]);

    await expect(page.getByPlaceholder('Email')).toHaveCount(5);
    await expect(page.getByRole('button', { name: 'Submit' })).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Sign in' })).toHaveCount(2);
  });

  test('condition: inline form accepts name, email, and remember-me state', async () => {
    const card = forms.card('Inline form');

    await card.getByPlaceholder('Jane Doe').fill('Jane Automation');
    await card.getByPlaceholder('Email').fill('jane.automation@example.com');
    await card.locator('nb-checkbox').click();

    await expect(card.getByPlaceholder('Jane Doe')).toHaveValue('Jane Automation');
    await expect(card.getByPlaceholder('Email')).toHaveValue('jane.automation@example.com');
    await expect(card.locator('nb-checkbox input[type="checkbox"]')).toBeChecked();
    await expect(card.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  test('condition: grid form radio group exposes enabled and disabled options', async () => {
    const card = forms.card('Using the Grid');
    const option1 = card.locator('nb-radio').filter({ hasText: 'Option 1' });
    const option2 = card.locator('nb-radio').filter({ hasText: 'Option 2' });
    const disabledOption = card.locator('nb-radio').filter({ hasText: 'Disabled Option' });

    await option1.click();
    await option2.click();

    await expect(option1.locator('input[type="radio"]')).toBeEnabled();
    await expect(option2.locator('input[type="radio"]')).toBeEnabled();
    await expect(disabledOption.locator('input[type="radio"]')).toBeDisabled();
    await expect(card.locator('nb-radio')).toContainText(['Option 1', 'Option 2', 'Disabled Option']);
  });

  test('condition: message form preserves recipients, subject, and body text', async () => {
    const card = forms.card('Form without labels');

    await card.getByPlaceholder('Recipients').fill('qa@example.com');
    await card.getByPlaceholder('Subject').fill('Nightly report');
    await card.getByPlaceholder('Message').fill('All smoke checks passed.');

    await expect(card.getByPlaceholder('Recipients')).toHaveValue('qa@example.com');
    await expect(card.getByPlaceholder('Subject')).toHaveValue('Nightly report');
    await expect(card.getByPlaceholder('Message')).toHaveValue('All smoke checks passed.');
    await expect(card.getByRole('button', { name: 'Send' })).toHaveClass(/success/);
  });

  test('condition: block form accepts identity and website fields', async () => {
    const card = forms.card('Block form');

    await card.locator('#inputFirstName').fill('Mona');
    await card.locator('#inputLastName').fill('Youssef');
    await card.locator('#inputEmail').fill('mona@example.com');
    await card.locator('#inputWebsite').fill('https://example.com');

    await expect(card.locator('#inputFirstName')).toHaveValue('Mona');
    await expect(card.locator('#inputLastName')).toHaveValue('Youssef');
    await expect(card.locator('#inputEmail')).toHaveValue('mona@example.com');
    await expect(card.locator('#inputWebsite')).toHaveValue('https://example.com');
  });
});

test.describe('Forms / Datepicker', () => {
  let datepicker: DatepickerPage;

  test.beforeEach(async ({ page }) => {
    datepicker = new DatepickerPage(page);
    await datepicker.open();
  });

  test('condition: datepicker page exposes all enabled picker variants', async ({ page }) => {
    await expect(page.locator('nb-card-header')).toContainText([
      'Common Datepicker',
      'Datepicker With Range',
      'Datepicker With Disabled Min Max Values',
    ]);

    await expect(datepicker.input('Form Picker')).toBeEditable();
    await expect(datepicker.input('Range Picker')).toBeEditable();
    await expect(datepicker.input('Min Max Picker')).toBeEditable();
  });

  test('condition: common datepicker writes selected day into the input', async ({ page }) => {
    await datepicker.input('Form Picker').click();
    await expect(page.locator('nb-calendar')).toBeVisible();

    await datepicker.pickerDay('15').click();

    await expect(datepicker.input('Form Picker')).toHaveValue(/\w{3} \d{1,2}, \d{4}/);
    await expect(page.locator('nb-calendar')).toBeHidden();
  });

  test('condition: range picker writes start and end dates', async ({ page }) => {
    await datepicker.input('Range Picker').click();
    await expect(page.locator('nb-calendar-range')).toBeVisible();

    await datepicker.pickerDay('10').click();
    await datepicker.pickerDay('12').click();

    await expect(datepicker.input('Range Picker')).toHaveValue(/\w{3} \d{1,2}, \d{4} - \w{3} \d{1,2}, \d{4}/);
  });
});
