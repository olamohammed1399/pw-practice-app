import { expect, test } from '@playwright/test';

test.describe('Auth routes', () => {
  test('condition: login form validates required email and password then accepts valid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    const email = page.getByPlaceholder('Email address');
    const password = page.getByPlaceholder('Password');
    const submit = page.getByRole('button', { name: 'Log In' });

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(submit).toBeDisabled();

    await email.fill('not-an-email');
    await password.fill('123');
    await email.blur();
    await password.blur();
    await expect(page.getByText('Email should be the real one!')).toBeVisible();
    await expect(page.getByText(/Password should contain/)).toBeVisible();

    await email.fill('qa@example.com');
    await password.fill('correct-horse-battery');
    await expect(email).toHaveValue('qa@example.com');
    await expect(password).toHaveValue('correct-horse-battery');
    await expect(submit).toBeEnabled();
  });

  test('condition: login links navigate to registration and password request', async ({ page }) => {
    await page.goto('/auth/login');

    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
    await expect(forgotPasswordLink).toHaveAttribute('href', /\/auth\/request-password$/);
    await page.goto(await forgotPasswordLink.getAttribute('href') as string);
    await expect(page).toHaveURL(/\/auth\/request-password$/);
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();

    const registerLink = page.getByRole('link', { name: 'Register' });
    await expect(registerLink).toHaveAttribute('href', /\/auth\/register$/);
    await page.goto(await registerLink.getAttribute('href') as string);
    await expect(page).toHaveURL(/\/auth\/register$/);
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  test('condition: register form checks matching password confirmation', async ({ page }) => {
    await page.goto('/auth/register');

    await page.getByPlaceholder('Full name').fill('QA User');
    await page.getByPlaceholder('Email address').fill('qa@example.com');
    await page.getByRole('textbox', { name: 'Password:', exact: true }).fill('correct-horse-battery');
    await page.getByPlaceholder('Confirm Password').fill('different-password');
    await page.getByPlaceholder('Confirm Password').blur();

    await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();

    await page.getByPlaceholder('Confirm Password').fill('correct-horse-battery');
    await page.locator('nb-checkbox input[type="checkbox"]').check({ force: true });

    await expect(page.locator('nb-checkbox input[type="checkbox"]')).toBeChecked();
    await expect(page.getByRole('button', { name: 'Register' })).toBeEnabled();
  });

  test('condition: request and reset password forms expose expected controls', async ({ page }) => {
    await page.goto('/auth/request-password');
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    await page.getByPlaceholder('Email address').fill('qa@example.com');
    await expect(page.getByRole('button', { name: 'Request password' })).toBeEnabled();

    await page.goto('/auth/reset-password');
    await expect(page.getByRole('heading', { name: 'Change password' })).toBeVisible();
    await page.getByPlaceholder('New Password').fill('correct-horse-battery');
    await page.getByPlaceholder('Confirm Password').fill('correct-horse-battery');
    await expect(page.getByRole('button', { name: 'Change password' })).toBeEnabled();
  });
});
