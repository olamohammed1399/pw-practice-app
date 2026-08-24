import { expect, test } from '@playwright/test';
import { AppLayout } from './support/app-locators';

test.describe('Charts / Echarts', () => {
  test('condition: all enabled echarts cards render chart canvases', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');
    await app.navigate('Charts', 'Echarts');

    await expect(page.locator('nb-card-header')).toContainText([
      'Pie',
      'Bar',
      'Line',
      'Multiple x-axis',
      'Area Stack',
      'Bar Animation',
      'Radar',
    ]);

    await expect(page.locator('.echart')).toHaveCount(7);
    await expect(page.locator('.echart canvas')).toHaveCount(7);
    await expect(page.locator('.echart canvas').first()).toBeVisible();
  });

  test('condition: chart route stays stable after theme change', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/pages/charts/echarts');

    await app.selectTheme('Cosmic');

    await expect(page).toHaveURL(/\/pages\/charts\/echarts$/);
    await expect(app.themeSelect).toContainText('Cosmic');
    await expect(page.locator('.echart canvas')).toHaveCount(7);
  });
});
