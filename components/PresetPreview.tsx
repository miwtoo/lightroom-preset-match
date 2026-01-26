'use client'

import { useEffect, useRef } from 'react'
import type { PresetAdjustments } from '@/lib/preset-generator'
import type { ImageData } from '@/components/ImageUpload'
import { computeHistogram } from '@/lib/histogram'
import type { HistogramData } from '@/lib/histogram'

interface PresetPreviewProps {
  imageData: ImageData
  adjustments?: PresetAdjustments | null
  intensity: number
  onHistogramUpdate?: (histogram: HistogramData, target: 'before' | 'after') => void
}

const EMPTY_ADJUSTMENTS: PresetAdjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  hue: {},
  saturation: {},
  luminance: {},
}

export default function PresetPreview({
  imageData,
  adjustments,
  intensity,
  onHistogramUpdate,
}: PresetPreviewProps) {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null)
  const afterCanvasRef = useRef<HTMLCanvasElement>(null)
  const splitPosition = 50

  const safeAdjustments = adjustments ?? EMPTY_ADJUSTMENTS

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (beforeCanvasRef.current) {
        const ctx = beforeCanvasRef.current.getContext('2d')
        if (ctx) {
          beforeCanvasRef.current.width = img.width
          beforeCanvasRef.current.height = img.height
          ctx.drawImage(img, 0, 0)

          const pixels = ctx.getImageData(0, 0, img.width, img.height)
          onHistogramUpdate?.(computeHistogram(pixels), 'before')
        }
      }
    }
    img.src = imageData.src
  }, [imageData.src, onHistogramUpdate])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (afterCanvasRef.current) {
        const ctx = afterCanvasRef.current.getContext('2d')
        if (ctx) {
          afterCanvasRef.current.width = img.width
          afterCanvasRef.current.height = img.height
          ctx.drawImage(img, 0, 0)

          const pixels = ctx.getImageData(0, 0, img.width, img.height)
          const data = pixels.data

          const factor = intensity / 100
          const exposureAdj = safeAdjustments.exposure * factor
          const contrastAdj = safeAdjustments.contrast * factor

          if (exposureAdj !== 0 || contrastAdj !== 0) {
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, Math.max(0, data[i] + exposureAdj * 25.5))
              data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + exposureAdj * 25.5))
              data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + exposureAdj * 25.5))

              const contrastFactor = (259 * (contrastAdj + 255)) / (255 * (259 - contrastAdj))
              data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128))
              data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128))
              data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128))
            }
          }

          ctx.putImageData(pixels, 0, 0)
          onHistogramUpdate?.(computeHistogram(pixels), 'after')
        }
      }
    }
    img.src = imageData.src
  }, [imageData.src, safeAdjustments, intensity, onHistogramUpdate])

  return (
    <div className="preview-frame bg-[#0f0f0f]" role="img" aria-label="Before and after preview">
      <div className="relative">
        <canvas ref={beforeCanvasRef} className="block w-full h-auto" />
        <canvas
          ref={afterCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
        />
        <span className="preview-label left-3">Before</span>
        <span className="preview-label right-3">After</span>
        <span className="preview-divider" style={{ left: `${splitPosition}%` }} />
      </div>
    </div>
  )
}
