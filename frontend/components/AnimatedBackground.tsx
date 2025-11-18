'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function AnimatedBackground({ opacity = 0.7 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Laptop positions with perspective
    const laptops = [
      { x: 0.2, y: 0.3, size: 1, rotation: -15, delay: 0 },
      { x: 0.5, y: 0.5, size: 1.2, rotation: 0, delay: 0.5 },
      { x: 0.8, y: 0.4, size: 0.9, rotation: 15, delay: 1 },
    ]

    let animationFrame: number
    let time = 0

    const draw Laptop = (laptop: typeof laptops[0], t: number) => {
      const centerX = canvas.width * laptop.x
      const centerY = canvas.height * laptop.y
      const baseSize = Math.min(canvas.width, canvas.height) * 0.15 * laptop.size

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate((laptop.rotation * Math.PI) / 180)

      // Floating animation
      const float = Math.sin(t + laptop.delay) * 10

      ctx.translate(0, float)

      // Laptop base (keyboard)
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.6 * opacity})` // Blue
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      ctx.beginPath()
      ctx.moveTo(-baseSize, 0)
      ctx.lineTo(baseSize, 0)
      ctx.lineTo(baseSize * 0.8, baseSize * 0.3)
      ctx.lineTo(-baseSize * 0.8, baseSize * 0.3)
      ctx.closePath()
      ctx.stroke()

      // Laptop screen
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * opacity})`
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])

      ctx.beginPath()
      ctx.moveTo(-baseSize * 0.7, 0)
      ctx.lineTo(baseSize * 0.7, 0)
      ctx.lineTo(baseSize * 0.6, -baseSize * 0.8)
      ctx.lineTo(-baseSize * 0.6, -baseSize * 0.8)
      ctx.closePath()
      ctx.stroke()

      // Screen inner glow
      ctx.fillStyle = `rgba(59, 130, 246, ${0.1 * opacity})`
      ctx.fill()

      // Screen lines (code-like)
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.4 * opacity})` // Orange
      ctx.lineWidth = 1
      ctx.setLineDash([2, 4])

      for (let i = 0; i < 4; i++) {
        const y = -baseSize * 0.7 + i * (baseSize * 0.3)
        ctx.beginPath()
        ctx.moveTo(-baseSize * 0.5, y)
        ctx.lineTo(baseSize * 0.5, y)
        ctx.stroke()
      }

      ctx.restore()
    }

    const drawConnectionLines = (t: number) => {
      ctx.setLineDash([])

      for (let i = 0; i < laptops.length - 1; i++) {
        const laptop1 = laptops[i]
        const laptop2 = laptops[i + 1]

        const x1 = canvas.width * laptop1.x
        const y1 = canvas.height * laptop1.y + Math.sin(t + laptop1.delay) * 10
        const x2 = canvas.width * laptop2.x
        const y2 = canvas.height * laptop2.y + Math.sin(t + laptop2.delay) * 10

        // Animated dash offset for moving effect
        const dashOffset = (t * 50) % 20

        // Main connection line
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * opacity})`
        ctx.lineWidth = 2
        ctx.setLineDash([10, 10])
        ctx.lineDashOffset = dashOffset

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        // Glow effect
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * opacity})`
        ctx.lineWidth = 4
        ctx.setLineDash([8, 12])
        ctx.lineDashOffset = dashOffset

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        // Data particles moving along the line
        const progress = (Math.sin(t + laptop1.delay) + 1) / 2
        const particleX = x1 + (x2 - x1) * progress
        const particleY = y1 + (y2 - y1) * progress

        ctx.fillStyle = `rgba(249, 115, 22, ${0.8 * opacity})`
        ctx.beginPath()
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
        ctx.fill()

        // Particle glow
        const gradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 10)
        gradient.addColorStop(0, `rgba(249, 115, 22, ${0.6 * opacity})`)
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particleX, particleY, 10, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.02

      // Draw connection lines first (behind laptops)
      drawConnectionLines(time)

      // Draw laptops
      laptops.forEach(laptop => drawLaptop(laptop, time))

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrame)
    }
  }, [opacity])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity }}
    />
  )
}
