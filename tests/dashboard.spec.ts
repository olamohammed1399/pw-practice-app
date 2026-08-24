import { expect, test } from '@playwright/test';
import { AppLayout } from './support/app-locators';

test.describe('IoT Dashboard', () => {
  test('condition: dashboard renders the expected smart-home cards and status toggles', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('IoT Dashboard');

    const lightCard = page.locator('ngx-status-card').filter({ hasText: 'Light' });
    await expect(page.locator('ngx-status-card')).toContainText([
      'Light',
      'Roller Shades',
      'Wireless Audio',
      'Coffee Maker',
    ]);
    await expect(lightCard).toContainText('ON');

    await lightCard.click();
    await expect(lightCard).toContainText('OFF');
    await expect(lightCard.locator('nb-card')).toHaveClass(/off/);
  });

  test('condition: dashboard widgets expose energy, weather, contacts, and camera data', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/pages/iot-dashboard');

    await expect(page.getByText('Electricity Consumption')).toBeVisible();
    await expect(page.getByText('Consumed')).toBeVisible();
    await expect(page.getByText('Solar Energy Consumption')).toBeVisible();
    await expect(page.getByText('New York')).toBeVisible();
    await expect(page.getByText('Security Cameras')).toBeVisible();
    await expect(page.locator('ngx-contacts nb-list-item')).toHaveCount(4);
  });

  test('condition: security cameras switch from single view to grid view', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/pages/iot-dashboard');

    const cameras = page.locator('ngx-security-cameras');
    await expect(cameras.locator('.grid-view .camera')).toHaveCount(4);

    await cameras.locator('.grid-view .camera').nth(2).click();
    await expect(cameras.locator('.single-view .camera-name')).toHaveText('Camera #3');

    await cameras.locator('.grid-view-button').click();
    await expect(cameras.locator('.grid-view .camera')).toHaveCount(4);
  });

  test('condition: theme selector changes selected theme and layout class', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');

    await app.selectTheme('Dark');

    await expect(app.themeSelect).toContainText('Dark');
    await expect(page.locator('nb-layout')).toHaveClass(/nb-theme-dark/);
  });
});
