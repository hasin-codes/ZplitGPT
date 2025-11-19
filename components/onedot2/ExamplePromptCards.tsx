'use client'

import { Lightbulb, Database, Code } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExamplePromptCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  glowColor: 'orange' | 'blue' | 'green'
}

function ExamplePromptCard({ icon, title, description, onClick, glowColor }: ExamplePromptCardProps) {
  const glowStyles = {
    orange: {
      bottomGlow: 'linear-gradient(to top, rgba(255, 107, 53, 0.15) 0%, rgba(255, 107, 53, 0.08) 30%, transparent 60%)',
      insetShadow: 'inset 0 -2px 10px rgba(255, 107, 53, 0.2), inset 0 -1px 3px rgba(255, 107, 53, 0.3)'
    },
    blue: {
      bottomGlow: 'linear-gradient(to top, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 30%, transparent 60%)',
      insetShadow: 'inset 0 -2px 10px rgba(59, 130, 246, 0.2), inset 0 -1px 3px rgba(59, 130, 246, 0.3)'
    },
    green: {
      bottomGlow: 'linear-gradient(to top, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 30%, transparent 60%)',
      insetShadow: 'inset 0 -2px 10px rgba(34, 197, 94, 0.2), inset 0 -1px 3px rgba(34, 197, 94, 0.3)'
    }
  }

  const currentGlow = glowStyles[glowColor]

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start rounded-lg h-full",
        "bg-card/40 backdrop-blur-md border border-white/5",
        "hover:bg-card/60 hover:border-white/10 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300 ease-in-out",
        "text-left cursor-pointer",
        "w-full overflow-hidden",
        "p-2 sm:p-4",
        "min-h-[120px] sm:min-h-[160px]"
      )}
      style={{
        boxShadow: currentGlow.insetShadow,
        fontSize: 'clamp(0.875rem, 0.8vw + 0.5rem, 1rem)',
      }}
    >
      {/* Internal glow effect at bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none rounded-lg opacity-100 group-hover:opacity-120 transition-opacity duration-300"
        style={{
          height: 'clamp(2.5rem, 4vw, 4rem)',
          background: currentGlow.bottomGlow,
        }}
      />

      <div className="flex flex-col gap-1.5 sm:gap-3 w-full h-full relative z-10">
        <div className="flex-shrink-0">
          <div
            className="rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 flex items-center justify-center transition-all duration-300"
            style={{
              width: 'clamp(1.75rem, 2.5vw + 1.5rem, 2.5rem)',
              height: 'clamp(1.75rem, 2.5vw + 1.5rem, 2.5rem)',
            }}
          >
            <div className="text-white" style={{ fontSize: 'clamp(0.875rem, 1.2vw + 0.5rem, 1.25rem)' }}>
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start min-w-0">
          <h3
            className="text-white font-medium mb-1 sm:mb-2 group-hover:text-white transition-colors line-clamp-2"
            style={{ fontSize: 'clamp(0.75rem, 1vw + 0.5rem, 1rem)' }}
          >
            {title}
          </h3>
          <p
            className="text-[#b3b3b3] leading-relaxed group-hover:text-[#d3d3d3] transition-colors mb-1.5 sm:mb-3 line-clamp-2"
            style={{ fontSize: 'clamp(0.625rem, 0.8vw + 0.4rem, 0.875rem)' }}
          >
            {description}
          </p>
          <div
            className="flex items-center gap-0.5 sm:gap-1 text-[#b3b3b3] group-hover:text-[#d3d3d3] transition-colors mt-auto"
            style={{ fontSize: 'clamp(0.625rem, 0.8vw + 0.4rem, 0.875rem)' }}
          >
            <span className="hidden sm:inline">Get started</span>
            <ArrowRight style={{ width: 'clamp(0.75rem, 1vw + 0.5rem, 1rem)', height: 'clamp(0.75rem, 1vw + 0.5rem, 1rem)' }} />
          </div>
        </div>
      </div>
    </button>
  )
}

interface ExamplePromptCardsProps {
  onCardClick: (prompt: string) => void
}

export function ExamplePromptCards({ onCardClick }: ExamplePromptCardsProps) {
  const cards = [
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Explain quantum computing",
      description: "Explain quantum computing in simple terms",
      prompt: "Explain quantum computing in simple terms",
      glowColor: 'orange' as const
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Write a SQL query",
      description: "Write a SQL query to find all users who joined in the last 30 days",
      prompt: "Write a SQL query to find all users who joined in the last 30 days",
      glowColor: 'blue' as const
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Design a REST API",
      description: "Design a REST API for a blog application with authentication",
      prompt: "Design a REST API for a blog application with authentication",
      glowColor: 'green' as const
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 relative" style={{ maxWidth: 'min(95vw, 56rem)' }}>
      {/* Progressive glass blur gradient overlay - extends more on top/bottom */}
      <div
        className="absolute pointer-events-none rounded-xl"
        style={{
          top: 'clamp(-40px, -4vw, -60px)',
          bottom: 'clamp(-40px, -4vw, -60px)',
          left: 'clamp(-15px, -2vw, -20px)',
          right: 'clamp(-15px, -2vw, -20px)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'transparent',
          maskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 30%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0.3) 95%, rgba(0, 0, 0, 0) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 30%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0.3) 95%, rgba(0, 0, 0, 0) 100%)',
          zIndex: -1
        }}
      />
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 items-stretch relative z-10">
        {cards.map((card, index) => (
          <ExamplePromptCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            onClick={() => onCardClick(card.prompt)}
            glowColor={card.glowColor}
          />
        ))}
      </div>
    </div>
  )
}

