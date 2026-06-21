/**
 * 이미지 유틸리티
 *
 * extractDimensions: File → { width, height } 추출
 * compressImage: File → Blob 압축 (3MB 초과 시 품질 조절)
 */

const MAX_SIZE_BYTES = 3 * 1024 * 1024 // 3MB
const MAX_DIMENSION = 2048 // 최대 해상도

/**
 * 이미지 파일에서 width/height를 추출한다.
 */
export function extractDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지 정보를 읽을 수 없습니다.'))
    }
    img.src = url
  })
}

/**
 * 이미지 파일을 압축한다.
 *
 * - 3MB 이하면 원본 Blob 반환
 * - MAX_DIMENSION(2048px)을 초과하면 비율 유지 리사이즈
 * - 이후에도 3MB 초과면 품질을 0.05씩 낮추며 재시도 (최저 0.5)
 */
export async function compressImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const dims = await extractDimensions(file)

  // 3MB 이하 + 해상도 기준 이하 → 원본 그대로
  if (file.size <= MAX_SIZE_BYTES && dims.width <= MAX_DIMENSION && dims.height <= MAX_DIMENSION) {
    return { blob: file, width: dims.width, height: dims.height }
  }

  // 리사이즈 목표 크기 계산
  let targetWidth = dims.width
  let targetHeight = dims.height

  if (dims.width > MAX_DIMENSION || dims.height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / dims.width, MAX_DIMENSION / dims.height)
    targetWidth = Math.round(dims.width * ratio)
    targetHeight = Math.round(dims.height * ratio)
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 컨텍스트를 생성할 수 없습니다.')

  // 원본 이미지를 canvas에 그리기
  const bitmap = await createImageBitmap(file)
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)

  // 품질 조절 루프
  let quality = 0.85
  let blob: Blob | null = null

  while (quality >= 0.5) {
    blob = await new Promise<Blob | null>((res) => {
      canvas.toBlob((b) => res(b), 'image/jpeg', quality)
    })
    if (!blob || blob.size <= MAX_SIZE_BYTES) break
    quality -= 0.05
  }

  if (!blob) throw new Error('이미지 압축에 실패했습니다.')

  return { blob, width: targetWidth, height: targetHeight }
}
