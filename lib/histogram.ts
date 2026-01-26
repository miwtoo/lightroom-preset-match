export type HistogramData = {
  r: number[]
  g: number[]
  b: number[]
}

export function computeHistogram(imageData: ImageData): HistogramData {
  const r = new Array(256).fill(0)
  const g = new Array(256).fill(0)
  const b = new Array(256).fill(0)

  const data = imageData.data
  const pixelCount = data.length / 4
  const sampleEvery = Math.max(1, Math.floor(pixelCount / 150000))

  for (let i = 0; i < pixelCount; i += sampleEvery) {
    const idx = i * 4
    r[data[idx]] += 1
    g[data[idx + 1]] += 1
    b[data[idx + 2]] += 1
  }

  return { r, g, b }
}
