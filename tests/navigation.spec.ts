import { expect, test } from '@playwright/test';
import { AppLayout } from './support/app-locators';

const routes = [
  { parent: 'IoT Dashboard', url: /\/pages\/iot-dashboard$/, heading: 'Light' },
  { parent: 'Forms', child: 'Form Layouts', url: /\/pages\/forms\/layouts$/, heading: 'Inline form' },
  { parent: 'Forms', child: 'Datepicker', url: /\/pages\/forms\/datepicker$/, heading: 'Common Datepicker' },
  { parent: 'Modal & Overlays', child: 'Dialog', url: /\/pages\/modal-overlays\/dialog$/, heading: 'Open Dialog' },
  { parent: 'Modal & Overlays', child: 'Window', url: /\/pages\/modal-overlays\/window$/, heading: 'Window Form' },
  { parent: 'Modal & Overlays', child: 'Popover', url: /\/pages\/modal-overlays\/popover$/, heading: 'Popover Position' },
  { parent: 'Modal & Overlays', child: 'Toastr', url: /\/pages\/modal-overlays\/toastr$/, heading: 'Toaster configuration' },
  { parent: 'Modal & Overlays', child: 'Tooltip', url: /\/pages\/modal-overlays\/tooltip$/, heading: 'Tooltip With Icon' },
  { parent: 'Extra Components', child: 'Calendar', url: /\/pages\/extra-components\/calendar$/, heading: 'Calendar' },
  { parent: 'Charts', child: 'Echarts', url: /\/pages\/charts\/echarts$/, heading: 'Line' },
  { parent: 'Tables & Data', child: 'Smart Table', url: /\/pages\/tables\/smart-table$/, heading: 'Smart Table' },
  { parent: 'Tables & Data', child: 'Tree Grid', url: /\/pages\/tables\/tree-grid$/, heading: 'Tree Grid' },
  { parent: 'Auth', child: 'Login', url: /\/auth\/login$/, heading: 'Login' },
  { parent: 'Auth', child: 'Register', url: /\/auth\/register$/, heading: 'Register' },
  { parent: 'Auth', child: 'Request Password', url: /\/auth\/request-password$/, heading: 'Request' },
  { parent: 'Auth', child: 'Reset Password', url: /\/auth\/reset-password$/, heading: 'Reset' },
];

test.describe('System navigation', () => {
  test('condition: application shell loads with expected menu groups', async ({ page }) => {
    const app = new AppLayout(page);
    await app.open('/');

    await expect(app.header).toBeVisible();
    await expect(app.sidebar).toBeVisible();
    await expect(app.menuItem('IoT Dashboard')).toBeVisible();
    await expect(app.menuItem('FEATURES')).toBeVisible();
    await expect(app.menuItem('Forms')).toBeVisible();
    await expect(app.menuItem('Tables & Data')).toBeVisible();
  });

  for (const route of routes) {
    test(`condition: ${route.parent} > ${route.child} opens the expected page`, async ({ page }) => {
      const app = new AppLayout(page);
      await app.open('/');

      await app.navigate(route.parent, route.child);

      await expect(page).toHaveURL(route.url);
      await expect(page.getByText(route.heading).first()).toBeVisible();
      await expect(page.locator('nb-card, nb-auth-block').first()).toBeVisible();
    });
  }
});
