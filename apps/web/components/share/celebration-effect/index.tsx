"use client"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  velocityX: number
  velocityY: number
}

export default function CelebrationEffect() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleCelebration = (e: Event) => {
      const customEvent = e as CustomEvent
      const { x, y } = customEvent.detail

      setIsActive(true)

      const newParticles: Particle[] = []
      const colors = ["#00ff00", "#00cc00", "#00aa00", "#ffffff"]

      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: Date.now() + i,
          x,
          y,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 3,
          velocityX: (Math.random() - 0.5) * 8,
          velocityY: (Math.random() - 0.5) * 8 - 2,
        })
      }

      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
        setIsActive(false)
      }, 1000)
    }

    globalThis.addEventListener("celebrate", handleCelebration)

    return () => {
      globalThis.removeEventListener("celebrate", handleCelebration)
    }
  }, [])

  if (!isActive) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="animate-particle-float absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            animation: "particle-float 1s ease-out forwards",
            // @ts-expect-error this works perfectly fine :D
            "--velocity-x": `${particle.velocityX * 20}px`,
            "--velocity-y": `${particle.velocityY * 20}px`,
          }}
        />
      ))}
    </div>
  )
}
