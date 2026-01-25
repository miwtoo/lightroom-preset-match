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
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Upload image"
      />
      <p className="text-gray-600 mb-4">Drag and drop an image here, or</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
      >
        Choose File
      </button>
      <p className="text-sm text-gray-500 mt-4">Supports JPEG, PNG, WebP</p>
    </div>
  )
}
