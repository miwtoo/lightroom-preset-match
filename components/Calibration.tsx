'use client'

import type { CalibrationAdjustments } from '@/lib/preset-generator'

interface CalibrationProps {
  calibration: CalibrationAdjustments
}

export default function Calibration({ calibration }: CalibrationProps) {
  const hasValues =
    calibration.shadowTint !== 0 ||
    calibration.redPrimary.hue !== 0 ||
    calibration.redPrimary.saturation !== 0 ||
    calibration.greenPrimary.hue !== 0 ||
    calibration.greenPrimary.saturation !== 0 ||
    calibration.bluePrimary.hue !== 0 ||
    calibration.bluePrimary.saturation !== 0

  if (!hasValues) {
    return (
      <div className="space-y-3">
        <span className="panel-title">Camera Calibration</span>
        <p className="text-xs text-[var(--muted)]">Generate a preset to see calibration values.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <span className="panel-title">Camera Calibration</span>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor="shadow-tint">
            Shadow Tint
          </label>
          <input
            id="shadow-tint"
            type="range"
            min="-100"
            max="100"
            step="1"
            value={Math.round(calibration.shadowTint)}
            className="range-track"
            disabled
            aria-disabled="true"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" aria-hidden="true" />
            <span className="text-xs font-medium text-[var(--text)]">Red Primary</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor="red-hue">
                Hue
              </label>
              <input
                id="red-hue"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={Math.round(calibration.redPrimary.hue)}
                className="range-track"
                disabled
                aria-disabled="true"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor="red-sat">
                Sat
              </label>
              <input
                id="red-sat"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={Math.round(calibration.redPrimary.saturation)}
                className="range-track"
                disabled
                aria-disabled="true"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]" aria-hidden="true" />
            <span className="text-xs font-medium text-[var(--text)]">Green Primary</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor="green-hue">
                Hue
              </label>
              <input
                id="green-hue"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={Math.round(calibration.greenPrimary.hue)}
                className="range-track"
                disabled
                aria-disabled="true"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor="green-sat">
                Sat
              </label>
              <input
                id="green-sat"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={Math.round(calibration.greenPrimary.saturation)}
                className="range-track"
                disabled
                aria-disabled="true"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]" aria-hidden="true" />
            <span className="text-xs font-medium text-[var(--text)]">Blue Primary</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor="blue-hue">
                Hue
              </label>
              <input
                id="blue-hue"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={Math.round(calibration.bluePrimary.hue)}
                className="range-track"
                disabled
                aria-disabled="true"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-wider" htmlFor="blue-sat">
                Sat
              </label>
              <input
                id="blue-sat"
                type="range"
                min="-100"
                max="100"
                step="1"
                value={Math.round(calibration.bluePrimary.saturation)}
                className="range-track"
                disabled
                aria-disabled="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
