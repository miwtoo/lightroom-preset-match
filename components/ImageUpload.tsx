'use client'

import { useRef, useState } from 'react'
import { analyzeImage, type ImageAnalysis } from '@/lib/preset-generator'

interface ImageData {
  src: string
  file: File
  width: number
  height: number
  analysis: ImageAnalysis
}

interface ImageUploadProps {
  onImageUpload: (data: ImageData) => void
  onError: (error: string) => void
  onProcessingChange?: (isProcessing: boolean) => void
}

export type { ImageData }

const MAX_WORKING_DIMENSION = 1200

function processImage(img: HTMLImageElement): { src: string; width: number; height: number; analysis: ImageAnalysis } {
  let { width, height } = img
  let src = img.src

  const needsDownscale = width > MAX_WORKING_DIMENSION || height > MAX_WORKING_DIMENSION

  if (needsDownscale) {
    if (width > height) {
      height = Math.round((height / width) * MAX_WORKING_DIMENSION)
      width = MAX_WORKING_DIMENSION
    } else {
      width = Math.round((width / height) * MAX_WORKING_DIMENSION)
      height = MAX_WORKING_DIMENSION
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Could not get canvas context')

  if (needsDownscale) {
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, width, height)
    src = canvas.toDataURL('image/jpeg', 0.85)
  } else {
    ctx.drawImage(img, 0, 0)
  }

  const pixels = ctx.getImageData(0, 0, width, height)
  const analysis = analyzeImage(pixels)

  return { src, width, height, analysis }
}

export default function ImageUpload({ onImageUpload, onError, onProcessingChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Unsupported file type. Please upload JPEG, PNG, or WebP.')
      return
    }

    onProcessingChange?.(true)
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      try {
        const result = processImage(img)
        onImageUpload({
          ...result,
          file,
        })
      } catch (err) {
        onError('Failed to process image. It might be too large or corrupt.')
        onProcessingChange?.(false)
      } finally {
        URL.revokeObjectURL(objectUrl)
      }
    }

    img.onerror = () => {
      onError('Failed to load image. The file might be corrupt.')
      onProcessingChange?.(false)
      URL.revokeObjectURL(objectUrl)
    }

    img.src = objectUrl
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Upload image"
      />
      <button
        type="button"
        className={`upload-zone p-6 text-center w-full ${isDragging ? 'upload-zone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        aria-label="Upload reference image"
      >
        <p className="text-sm text-[var(--muted)]">Drag and drop an image here, or</p>
        <span className="inline-flex button-ghost px-5 py-2 mt-4 text-[11px] tracking-[0.2em]">
          Choose File
        </span>
        <p className="text-xs text-[var(--muted)] mt-3">Supports JPEG, PNG, WebP</p>
      </button>
    </div>
  )
}
