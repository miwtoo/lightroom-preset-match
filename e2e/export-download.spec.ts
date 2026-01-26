import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='

test('export download flow: valid preset name triggers .xmp download and shows iPad import guidance', async ({ page }) => {
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

  await test.step('And Generate Preset is clicked', async () => {
    await page.getByRole('button', { name: 'Generate Preset' }).click()
  })

  await test.step('Then the export panel is visible', async () => {
    await expect(page.getByRole('heading', { name: 'Export Preset' })).toBeVisible()
  })

  await test.step('When a valid preset name is set', async () => {
    await page.getByLabel('Preset Name').fill('Test Preset')
  })

  await test.step('And Export Preset is clicked', async () => {
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export Preset' }).click()
    const download = await downloadPromise

    await test.step('Then a .xmp download is triggered', async () => {
      expect(download.suggestedFilename()).toMatch(/\.xmp$/)
    })
  })

  await test.step('And the iPad import guidance panel is visible', async () => {
    await expect(page.getByRole('heading', { name: 'How to Import on iPad' })).toBeVisible()
    await expect(page.getByText('Open Lightroom on iPad and open any photo')).toBeVisible()
    await expect(page.getByText('Tap Presets')).toBeVisible()
    await expect(page.getByText('Tap Yours')).toBeVisible()
    await expect(page.getByText('Tap the ... menu')).toBeVisible()
    await expect(page.getByText('Choose Import Presets')).toBeVisible()
    await expect(page.getByText('In Files, select the downloaded .xmp file')).toBeVisible()
  })
})

test('export download flow: invalid preset name blocks download and shows validation error', async ({ page }) => {
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

  await test.step('And Generate Preset is clicked', async () => {
    await page.getByRole('button', { name: 'Generate Preset' }).click()
  })

  await test.step('Then the export panel is visible', async () => {
    await expect(page.getByRole('heading', { name: 'Export Preset' })).toBeVisible()
  })

  await test.step('When an invalid preset name is set', async () => {
    await page.getByLabel('Preset Name').fill('Bad/Name')
  })

  await test.step('And Export Preset is clicked', async () => {
    const downloadPromise = page.waitForEvent('download', { timeout: 500 })
    await page.getByRole('button', { name: 'Export Preset' }).click()

    await test.step('Then no download is triggered', async () => {
      await expect(downloadPromise).rejects.toThrow()
    })
  })

  await test.step('And a validation error is displayed', async () => {
    await expect(page.getByText('Use only letters, numbers, spaces, -, _, .')).toBeVisible()
  })
})

test('export download flow: intensity scales exported adjustments', async ({ page }) => {
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

  await test.step('And Generate Preset is clicked', async () => {
    await page.getByRole('button', { name: 'Generate Preset' }).click()
  })

  await test.step('And intensity is reduced to 50%', async () => {
    await page.getByLabel('Lift Intensity').fill('50')
  })

  await test.step('And a valid preset name is set', async () => {
    await page.getByLabel('Preset Name').fill('Scaled Export')
  })

  await test.step('When Export Preset is clicked', async () => {
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export Preset' }).click()
    const download = await downloadPromise

    await test.step('Then exported XMP reflects the scaled intensity', async () => {
      const path = await download.path()
      expect(path).toBeTruthy()
      const xmp = await readFile(path!, 'utf8')
      expect(xmp).toContain('crs:Exposure2012="+0.20"')
      expect(xmp).toContain('crs:Contrast2012="+10"')
      expect(xmp).toContain('crs:Highlights2012="-6"')
      expect(xmp).toContain('crs:HueAdjustmentRed="+3"')
    })
  })
})
