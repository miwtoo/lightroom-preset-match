'use client'

import { useEffect, useRef } from 'react'
import type { HistogramData } from '@/lib/histogram'

interface HistogramProps {
  data?: HistogramData | null
  label?: string
}

const CHANNEL_STYLES = [
  { stroke: 'rgba(255, 78, 78, 0.7)' },
  { stroke: 'rgba(105, 255, 131, 0.7)' },
  { stroke: 'rgba(90, 160, 255, 0.7)' },
]

export default function Histogram({ data, label }: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data) return

    const width = 320
    const height = 120
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 1.5

    const maxVal = Math.max(
      ...data.r,
      ...data.g,
      ...data.b,
      1
    )

    const drawChannel = (channel: number[], style: { stroke: string }) => {
      ctx.beginPath()
      ctx.strokeStyle = style.stroke
      channel.forEach((value, index) => {
        const x = (index / 255) * width
        const y = height - (value / maxVal) * (height - 4) - 2
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    }

    drawChannel(data.r, CHANNEL_STYLES[0])
    drawChannel(data.g, CHANNEL_STYLES[1])
    drawChannel(data.b, CHANNEL_STYLES[2])
  }, [data])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="panel-title">Live Histogram</span>
        {label ? (
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#f1c18a]">
            {label}
          </span>
        ) : null}
      </div>
      <div className="panel-inset p-3">
        {data ? (
          <canvas ref={canvasRef} className="w-full h-28" />
        ) : (
          <div className="h-28 flex items-center justify-center text-xs text-[var(--muted)]">
            Upload a reference image to see the histogram.
          </div>
        )}
      </div>
    </div>
  )
}
