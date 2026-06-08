import { test, expect } from '@playwright/test';

test.describe('SecureGen E2E', () => {
  test('should load the app and navigate to generator', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1.text-gradient')).toHaveText('SecureGen');
    await expect(page.locator('h2.page-title').first()).toContainText('Generator');
  });

  test('should navigate to all pages via sidebar', async ({ page }) => {
    await page.goto('/');
    const navLinks = [
      { text: 'Generator', url: '/generator' },
      { text: 'Strength', url: '/strength' },
      { text: 'Hack Sim', url: '/hacking-sim' },
      { text: 'Passphrase', url: '/passphrase' },
      { text: 'History', url: '/history' },
      { text: 'Dashboard', url: '/dashboard' },
    ];

    for (const link of navLinks) {
      await page.locator('.sidebar-nav').getByText(link.text).click();
      await expect(page).toHaveURL(new RegExp(link.url));
    }
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const initial = await html.getAttribute('data-theme');
    await page.locator('app-theme-toggle button').click();
    const toggled = await html.getAttribute('data-theme');
    expect(toggled).not.toBe(initial);
  });

  test('should generate a password', async ({ page }) => {
    await page.goto('/generator');
    await page.locator('.context-card').first().click();
    await page.locator('.btn-generate').click({ force: true });
    await expect(page.locator('.result-password code')).toBeVisible();
  });

  test('should analyze password strength', async ({ page }) => {
    await page.goto('/strength');
    const input = page.locator('.password-input');
    await input.fill('TestPassword123!');
    await expect(page.locator('.results-grid')).toBeVisible();
    await expect(page.locator('.score-value')).toHaveText(/\d+/);
  });

  test('should show privacy and terms links in sidebar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.legal-links')).toBeVisible();
    await expect(page.locator('.legal-link').first()).toContainText('Privacy');
    await expect(page.locator('.legal-link').last()).toContainText('Terms');
  });

  test('should navigate to privacy page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.legal-link').first().click();
    await expect(page).toHaveURL('/privacy');
    await expect(page.locator('.legal-header h1')).toContainText('Privacy Policy');
  });

  test('should navigate to terms page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.legal-link').last().click();
    await expect(page).toHaveURL('/terms');
    await expect(page.locator('.legal-header h1')).toContainText('Terms of Service');
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/');
    await page.locator('app-language-selector .lang-selector').click();
    await page.locator('.lang-dropdown .lang-option').nth(1).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});
