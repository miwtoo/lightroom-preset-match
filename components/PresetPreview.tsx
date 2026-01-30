'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { PresetAdjustments, ImageAnalysis } from '@/lib/preset-generator'
import { analyzeImage } from '@/lib/preset-generator'
import type { ImageData as UploadImageData } from '@/components/ImageUpload'
import { computeHistogram } from '@/lib/histogram'
import type { HistogramData } from '@/lib/histogram'

interface PresetPreviewProps {
  imageData: UploadImageData
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
  calibration: {
    shadowTint: 0,
    redPrimary: { hue: 0, saturation: 0 },
    greenPrimary: { hue: 0, saturation: 0 },
    bluePrimary: { hue: 0, saturation: 0 },
  },
}

export default function PresetPreview({
  imageData,
  adjustments,
  intensity,
  onHistogramUpdate,
}: PresetPreviewProps) {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null)
  const afterCanvasRef = useRef<HTMLCanvasElement>(null)
  const [splitPosition, setSplitPosition] = useState(50)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSplitPosition(position)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    handleMove(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current) handleMove(e.touches[0].clientX)
    }
    const onEnd = () => {
      isDragging.current = false
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [handleMove])

  const safeAdjustments = adjustments ?? EMPTY_ADJUSTMENTS

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      try {
        if (beforeCanvasRef.current) {
          const ctx = beforeCanvasRef.current.getContext('2d', { willReadFrequently: true })
          if (ctx) {
            beforeCanvasRef.current.width = img.width
            beforeCanvasRef.current.height = img.height
            ctx.drawImage(img, 0, 0)

            const pixels = ctx.getImageData(0, 0, img.width, img.height)
            onHistogramUpdate?.(computeHistogram(pixels), 'before')
          }
        }
      } catch (err) {
        console.error('Analysis failed', err)
      }
    }
    img.onerror = (err) => {
      console.error('Image load failed in PresetPreview', err)
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
    <div
      ref={containerRef}
      className="preview-frame bg-[#0f0f0f] cursor-crosshair select-none touch-none"
      role="img"
      aria-label="Before and after preview"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      data-testid="preview-frame"
    >
      <div className="relative pointer-events-none">
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
