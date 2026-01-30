import { describe, it, expect } from 'bun:test'
import { render } from '@testing-library/react'
import ColorMixer from './ColorMixer'

describe('ColorMixer', () => {
  it('should show placeholder when no HSL values exist', () => {
    const { getByText } = render(<ColorMixer hue={{}} saturation={{}} luminance={{}} />)
    expect(getByText('Generate a preset to see HSL values.')).toBeDefined()
  })

  it('should render channels with values', () => {
    const { getByLabelText, container } = render(
      <ColorMixer
        hue={{ Orange: 10 }}
        saturation={{ Orange: 15 }}
        luminance={{ Orange: 5 }}
      />
    )

    expect(getByLabelText('Orange hue')).toBeDefined()
    expect(getByLabelText('Orange saturation')).toBeDefined()
    expect(getByLabelText('Orange luminance')).toBeDefined()

    const hueSlider = container.querySelector('#Orange-hue') as HTMLInputElement
    expect(hueSlider.value).toBe('10')
  })

  it('should render multiple channels', () => {
    const { getByLabelText } = render(
      <ColorMixer
        hue={{ Red: 5, Blue: -10 }}
        saturation={{ Red: 10, Blue: 20 }}
        luminance={{}}
      />
    )

    expect(getByLabelText('Red hue')).toBeDefined()
    expect(getByLabelText('Blue hue')).toBeDefined()
  })

  it('should default missing values to 0', () => {
    const { container } = render(
      <ColorMixer
        hue={{ Red: 25 }}
        saturation={{}}
        luminance={{}}
      />
    )

    const hueSlider = container.querySelector('#Red-hue') as HTMLInputElement
    const satSlider = container.querySelector('#Red-sat') as HTMLInputElement
    const lumSlider = container.querySelector('#Red-lum') as HTMLInputElement

    expect(hueSlider.value).toBe('25')
    expect(satSlider.value).toBe('0')
    expect(lumSlider.value).toBe('0')
  })
})
