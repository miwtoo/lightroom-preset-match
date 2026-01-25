'use client'

import { useEffect, useRef, useState } from 'react'
import type { PresetAdjustments } from '@/lib/preset-generator'

interface ImageData {
  src: string
  file: File
  width: number
  height: number
}

interface PresetPreviewProps {
  imageData: ImageData
  adjustments: PresetAdjustments
  intensity: number
  comparisonMode: 'split' | 'side-by-side'
}

export default function PresetPreview({
  imageData,
  adjustments,
  intensity,
  comparisonMode,
}: PresetPreviewProps) {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null)
  const afterCanvasRef = useRef<HTMLCanvasElement>(null)
  const [showBefore, setShowBefore] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (beforeCanvasRef.current) {
        const ctx = beforeCanvasRef.current.getContext('2d')
        if (ctx) {
          beforeCanvasRef.current.width = img.width
          beforeCanvasRef.current.height = img.height
          ctx.drawImage(img, 0, 0)
        }
      }
    }
    img.src = imageData.src
  }, [imageData.src])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (afterCanvasRef.current) {
        const ctx = afterCanvasRef.current.getContext('2d')
        if (ctx) {
          afterCanvasRef.current.width = img.width
          afterCanvasRef.current.height = img.height
          ctx.drawImage(img, 0, 0)

          const imageData = ctx.getImageData(0, 0, img.width, img.height)
          const data = imageData.data

          const factor = intensity / 100
          const exposureAdj = adjustments.exposure * factor
          const contrastAdj = adjustments.contrast * factor

          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + exposureAdj * 25.5))
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + exposureAdj * 25.5))
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + exposureAdj * 25.5))

            const contrastFactor = (259 * (contrastAdj + 255)) / (255 * (259 - contrastAdj))
            data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128))
            data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128))
            data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128))
          }

          ctx.putImageData(imageData, 0, 0)
        }
      }
    }
    img.src = imageData.src
  }, [imageData.src, adjustments, intensity])

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        <button
          type="button"
          onClick={() => setShowBefore(!showBefore)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {showBefore ? 'Show After' : 'Show Before'}
        </button>
      </div>

      {comparisonMode === 'split' ? (
        <div className="relative">
          <canvas
            ref={showBefore ? beforeCanvasRef : afterCanvasRef}
            className="w-full h-auto"
            style={{ maxHeight: '600px' }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Before</p>
            <canvas
              ref={beforeCanvasRef}
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">After</p>
            <canvas
              ref={afterCanvasRef}
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
