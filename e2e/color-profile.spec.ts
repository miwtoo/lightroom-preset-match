import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='

test('color profile selection: selecting a profile reflects in the exported XMP', async ({ page }) => {
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
    await expect(page.getByTestId('preview-frame')).toBeVisible()
  })

  await test.step('And Generate Preset is clicked', async () => {
    const generateBtn = page.getByTestId('generate-preset')
    await expect(generateBtn).toHaveAttribute('data-analysis-ready', 'true')
    await generateBtn.click()
  })

  await test.step('And a different color profile is selected', async () => {
    await page.getByLabel('Color Profile').selectOption('Adobe Portrait')
  })

  await test.step('And a valid preset name is set', async () => {
    await page.getByLabel('Preset Name').fill('Profile Export')
  })

  await test.step('When Export Preset is clicked', async () => {
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export Preset' }).click()
    const download = await downloadPromise

    await test.step('Then exported XMP contains the selected profile', async () => {
      const path = await download.path()
      expect(path).toBeTruthy()
      const xmp = await readFile(path!, 'utf8')
      expect(xmp).toContain('crs:LookName="Adobe Portrait"')
    })
  })
})
