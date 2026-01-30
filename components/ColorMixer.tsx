'use client'

import type { HslChannel } from '@/lib/preset-generator'

const HSL_CHANNELS: HslChannel[] = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta']

const CHANNEL_COLORS: Record<HslChannel, string> = {
  Red: '#ef4444',
  Orange: '#f97316',
  Yellow: '#eab308',
  Green: '#22c55e',
  Aqua: '#06b6d4',
  Blue: '#3b82f6',
  Purple: '#a855f7',
  Magenta: '#d946ef',
}

interface ColorMixerProps {
  hue: Partial<Record<HslChannel, number>>
  saturation: Partial<Record<HslChannel, number>>
  luminance: Partial<Record<HslChannel, number>>
}

export default function ColorMixer({ hue, saturation, luminance }: ColorMixerProps) {
  const hasValues = Object.keys(hue).length > 0 || Object.keys(saturation).length > 0 || Object.keys(luminance).length > 0

  if (!hasValues) {
    return (
      <div className="space-y-3">
        <span className="panel-title">Color Mixer</span>
        <p className="text-xs text-[var(--muted)]">Generate a preset to see HSL values.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <span className="panel-title">Color Mixer</span>
      <div className="space-y-4">
        {HSL_CHANNELS.map((channel) => {
          const hueValue = hue[channel] ?? 0
          const satValue = saturation[channel] ?? 0
          const lumValue = luminance[channel] ?? 0
          const hasChannelValues = hue[channel] !== undefined || saturation[channel] !== undefined || luminance[channel] !== undefined

          if (!hasChannelValues) return null

          return (
            <div key={channel} className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CHANNEL_COLORS[channel] }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-[var(--text)]">{channel}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor={`${channel}-hue`}>
                    Hue
                  </label>
                  <input
                    id={`${channel}-hue`}
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={hueValue}
                    className="range-track"
                    disabled
                    aria-disabled="true"
                    aria-label={`${channel} hue`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor={`${channel}-sat`}>
                    Sat
                  </label>
                  <input
                    id={`${channel}-sat`}
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={satValue}
                    className="range-track"
                    disabled
                    aria-disabled="true"
                    aria-label={`${channel} saturation`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor={`${channel}-lum`}>
                    Lum
                  </label>
                  <input
                    id={`${channel}-lum`}
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={lumValue}
                    className="range-track"
                    disabled
                    aria-disabled="true"
                    aria-label={`${channel} luminance`}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
