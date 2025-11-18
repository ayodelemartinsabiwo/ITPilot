'use client'

import { useEffect, useRef } from 'react'

export function AnimatedBackground({ opacity = 0.6 }: { opacity?: number }) {
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

    // Laptop positions with perspective - center laptop moved down by 252px (3.5 inches)
    const laptops = [
      { x: 0.2, y: 0.25, size: 1.1, rotation: -15, delay: 0 },
      { x: 0.5, y: 0.6, size: 1.4, rotation: 0, delay: 0.5 }, // Moved down and made bigger
      { x: 0.8, y: 0.35, size: 1, rotation: 15, delay: 1 },
    ]

    // Floating constellation particles
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = []
    const particleCount = 40

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      })
    }

    let animationFrame: number
    let time = 0

    const drawLaptop = (laptop: typeof laptops[0], t: number) => {
      const centerX = canvas.width * laptop.x
      const centerY = canvas.height * laptop.y
      const baseSize = Math.min(canvas.width, canvas.height) * 0.25 * laptop.size // Bigger laptops

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate((laptop.rotation * Math.PI) / 180)

      // Floating animation
      const float = Math.sin(t + laptop.delay) * 10

      ctx.translate(0, float)

      // Add glow effect to wireframes
      ctx.shadowBlur = 15
      ctx.shadowColor = 'rgba(59, 130, 246, 0.6)'

      // Laptop base (keyboard)
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.7 * opacity})` // Light blue with glow
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3]) // Smaller dashes

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
      ctx.setLineDash([2, 2]) // Smaller dashes

      ctx.beginPath()
      ctx.moveTo(-baseSize * 0.7, 0)
      ctx.lineTo(baseSize * 0.7, 0)
      ctx.lineTo(baseSize * 0.6, -baseSize * 0.8)
      ctx.lineTo(-baseSize * 0.6, -baseSize * 0.8)
      ctx.closePath()
      ctx.stroke()

      // Screen inner glow
      ctx.shadowBlur = 20
      ctx.fillStyle = `rgba(59, 130, 246, ${0.15 * opacity})`
      ctx.fill()

      // Screen lines (code-like)
      ctx.shadowBlur = 8
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.4 * opacity})` // Orange
      ctx.lineWidth = 1
      ctx.setLineDash([2, 3]) // Smaller dashes

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
      ctx.shadowBlur = 0

      for (let i = 0; i < laptops.length - 1; i++) {
        const laptop1 = laptops[i]
        const laptop2 = laptops[i + 1]

        const x1 = canvas.width * laptop1.x
        const y1 = canvas.height * laptop1.y + Math.sin(t + laptop1.delay) * 10
        const x2 = canvas.width * laptop2.x
        const y2 = canvas.height * laptop2.y + Math.sin(t + laptop2.delay) * 10

        // Animated dash offset for moving effect
        const dashOffset = (t * 50) % 20

        // Main connection line with smaller dashes
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 * opacity})`
        ctx.lineWidth = 2
        ctx.setLineDash([6, 6]) // Smaller dashes
        ctx.lineDashOffset = dashOffset

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        // Glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)'
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * opacity})`
        ctx.lineWidth = 4
        ctx.setLineDash([5, 8]) // Smaller dashes
        ctx.lineDashOffset = dashOffset

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        ctx.shadowBlur = 0

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

    const drawConstellationParticles = () => {
      ctx.shadowBlur = 0

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle with glow
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)'
        ctx.fillStyle = `rgba(59, 130, 246, ${0.6 * opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections to nearby particles (constellation effect)
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Only connect particles within 150px
          if (distance < 150) {
            const alpha = (1 - distance / 150) * 0.3 * opacity
            ctx.shadowBlur = 0
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
            ctx.lineWidth = 1
            ctx.setLineDash([])

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }
      })

      ctx.shadowBlur = 0
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      time += 0.02

      // Draw constellation particles (background)
      drawConstellationParticles()

      // Draw connection lines (behind laptops)
      drawConnectionLines(time)

      // Draw laptops (foreground)
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
