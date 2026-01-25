'use client'

interface PresetControlsProps {
  intensity: number
  onIntensityChange: (value: number) => void
  onReset: () => void
  onClear: () => void
}

export default function PresetControls({
  intensity,
  onIntensityChange,
  onReset,
  onClear,
}: PresetControlsProps) {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Controls</h2>

      <div className="mb-4">
        <label htmlFor="intensity" className="block text-sm font-medium mb-2">
          Intensity: {intensity}%
        </label>
        <input
          type="range"
          id="intensity"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => onIntensityChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Reset Intensity
        </button>
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear Session
        </button>
      </div>
    </div>
  )
}
