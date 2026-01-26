import { test, expect } from '@playwright/test'

const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='

test('editor shell: desktop layout shows three panels', async ({ page }) => {
  await test.step('Given the home page is loaded at desktop size', async () => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  await test.step('Then the left, center, and right panel headings are visible', async () => {
    await expect(page.getByRole('heading', { name: 'Histogram & Curves' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Preset & Export' })).toBeVisible()
  })
})

test('editor shell: iPad layout retains all panels', async ({ page }) => {
  await test.step('Given the home page is loaded at iPad size', async () => {
    await page.setViewportSize({ width: 900, height: 1180 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  await test.step('Then panel headings remain visible', async () => {
    await expect(page.getByRole('heading', { name: 'Histogram & Curves' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Preview' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Preset & Export' })).toBeVisible()
  })
})

test('editor shell: upload reveals file info and preview', async ({ page }) => {
  await test.step('Given the home page is loaded', async () => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  await test.step('When a reference image is uploaded', async () => {
    const buffer = Buffer.from(TINY_PNG_BASE64, 'base64')
    await page.getByLabel('Upload image').setInputFiles({
      name: 'ref.png',
      mimeType: 'image/png',
      buffer,
    })
  })

  await test.step('Then the preview and basic file info are shown', async () => {
    await expect(page.getByRole('img', { name: 'Before and after preview' })).toBeVisible()
    await expect(page.getByText('Filename')).toBeVisible()
    await expect(page.locator('dd', { hasText: 'ref.png' }).first()).toBeVisible()
    await expect(page.getByText('Dimensions')).toBeVisible()
    await expect(page.getByText('1 x 1')).toBeVisible()
    await expect(page.getByText('image/png')).toBeVisible()
  })
})
