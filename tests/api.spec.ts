import { expect, test } from '@playwright/test';

test.describe('Application HTTP/API checks', () => {
  test('condition: root route serves the Angular application shell', async ({ request }) => {
    const response = await request.get('/');
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(body).toContain('<ngx-app>');
  });

  test('condition: stylesheet asset is served successfully', async ({ request }) => {
    const response = await request.get('/styles.css');
    const body = await response.text();

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('text/css');
    expect(body.length).toBeGreaterThan(1000);
  });

  test('condition: news data API returns valid JSON collection', async ({ request }) => {
    const response = await request.get('/assets/data/news.json');
    const news = await response.json();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(Array.isArray(news)).toBeTruthy();
    expect(news.length).toBeGreaterThan(50);
    expect(news[0]).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        link: expect.stringMatching(/^https:\/\//),
        text: expect.any(String),
      }),
    );
  });

  test('condition: image asset is available with image content type', async ({ request }) => {
    const response = await request.get('/assets/images/cover1.jpg');
    const image = await response.body();

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('image/jpeg');
    expect(image.length).toBeGreaterThan(1000);
  });

  test('condition: missing asset returns not found', async ({ request }) => {
    const response = await request.get('/assets/data/does-not-exist.json');

    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
  });
});
