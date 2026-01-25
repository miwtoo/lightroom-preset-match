import { test, expect } from '@playwright/test'

test('smoke: home page loads and renders main heading', async ({ page }) => {
  await test.step('Given the user navigates to the home page', async () => {
    await page.goto('/')
  })

  await test.step('When the page loads', async () => {
    await page.waitForLoadState('networkidle')
  })

  await test.step('Then the main heading is visible', async () => {
    const heading = page.getByRole('heading', { name: 'Lightroom Preset Generator' })
    await expect(heading).toBeVisible()
  })

  await test.step('And the subtitle is displayed', async () => {
    const subtitle = page.getByText('Generate Lightroom presets from reference images')
    await expect(subtitle).toBeVisible()
  })
})
