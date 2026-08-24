import { expect, test, type Page } from '@playwright/test';
import { AppLayout } from './support/app-locators';

function activeCalendarDay(page: Page, day: string) {
  return page.locator('nb-calendar-day-cell:not(.bounding-month)').filter({ hasText: new RegExp(`^${day}$`) }).first();
}

test.describe('Extra Components / Calendar', () => {
  test('condition: calendar page renders single, range, and custom day calendars', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Extra Components', 'Calendar');

    await expect(page.locator('nb-calendar')).toHaveCount(2);
    await expect(page.locator('nb-calendar-range')).toHaveCount(1);
    await expect(page.locator('.subtitle')).toContainText([
      'Selected date:',
      'Selected range:',
      'Selected date:',
    ]);
  });

  test('condition: selecting a date updates the single-calendar summary', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/pages/extra-components/calendar');

    const summary = page.locator('.calendar-container').first().locator('.subtitle');
    await activeCalendarDay(page, '15').click();

    await expect(summary).toContainText(/\b15,\s+\d{4}/);
    await expect(page.locator('nb-calendar').first().locator('.selected')).toContainText('15');
  });

  test('condition: selecting a range updates start and end summary values', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/pages/extra-components/calendar');

    const rangeCalendar = page.locator('nb-calendar-range');
    await rangeCalendar.locator('nb-calendar-day-cell:not(.bounding-month)').filter({ hasText: /^8$/ }).first().click();
    await rangeCalendar.locator('nb-calendar-day-cell:not(.bounding-month)').filter({ hasText: /^12$/ }).first().click();

    await expect(page.locator('.calendar-container').nth(1).locator('.subtitle')).toContainText(/\b8,\s+\d{4} - .*12,\s+\d{4}/);
  });
});
