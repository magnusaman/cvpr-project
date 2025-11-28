import { useEffect, useRef } from 'react'

export default function ImageWithBoxes({ imageUrl, detections, width, height }) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current || !detections || detections.length === 0) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imageRef.current

    // Wait for image to load
    const drawBoxes = () => {
      // Set canvas size to match displayed image
      const displayWidth = img.width
      const displayHeight = img.height

      canvas.width = displayWidth
      canvas.height = displayHeight

      // Calculate scaling factor (original image size vs displayed size)
      const scaleX = displayWidth / (width || displayWidth)
      const scaleY = displayHeight / (height || displayHeight)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Colors for different objects
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
      ]

      // Draw each detection
      detections.forEach((detection, index) => {
        const [x1, y1, x2, y2] = detection.box

        // Scale coordinates to displayed image size
        const scaledX1 = x1 * scaleX
        const scaledY1 = y1 * scaleY
        const scaledX2 = x2 * scaleX
        const scaledY2 = y2 * scaleY

        const boxWidth = scaledX2 - scaledX1
        const boxHeight = scaledY2 - scaledY1

        // Select color
        const color = colors[index % colors.length]

        // Draw bounding box
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight)

        // Draw label background
        const label = `${detection.class} ${Math.round(detection.confidence * 100)}%`
        ctx.font = 'bold 16px Arial'
        const textWidth = ctx.measureText(label).width
        const textHeight = 20

        ctx.fillStyle = color
        ctx.fillRect(scaledX1, scaledY1 - textHeight - 4, textWidth + 10, textHeight + 4)

        // Draw label text
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText(label, scaledX1 + 5, scaledY1 - 8)
      })
    }

    if (img.complete) {
      drawBoxes()
    } else {
      img.addEventListener('load', drawBoxes)
      return () => img.removeEventListener('load', drawBoxes)
    }
  }, [imageUrl, detections, width, height])

  return (
    <div className="relative inline-block">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Analyzed"
        className="w-full h-auto"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}
