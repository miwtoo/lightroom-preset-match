'use client'

import { useRef, useState } from 'react'

interface ImageData {
  src: string
  file: File
  width: number
  height: number
}

interface ImageUploadProps {
  onImageUpload: (data: ImageData) => void
  onError: (error: string) => void
}

export type { ImageData }

export default function ImageUpload({ onImageUpload, onError }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        onImageUpload({
          src: e.target?.result as string,
          file,
          width: img.width,
          height: img.height,
        })
      }
      img.onerror = () => onError('Failed to load image')
      img.src = e.target?.result as string
    }
    reader.onerror = () => onError('Failed to read file')
    reader.readAsDataURL(file)
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
