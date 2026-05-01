'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MikaCharacterProps {
  isThinking?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MikaCharacter({ isThinking = false, className, size = 'md' }: MikaCharacterProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden border-2 border-primary/20 mika-glow',
          sizeClasses[size],
          isThinking && 'animate-float'
        )}
      >
        <Image
          src="/mika-avatar.jpg"
          alt="Mika - Your AI Study Companion"
          fill
          className="object-cover"
          priority
        />
      </div>
      {isThinking && (
        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
          <div className="flex gap-0.5">
            <span className="w-1 h-1 bg-primary-foreground rounded-full typing-dot" />
            <span className="w-1 h-1 bg-primary-foreground rounded-full typing-dot" />
            <span className="w-1 h-1 bg-primary-foreground rounded-full typing-dot" />
          </div>
        </div>
      )}
    </div>
  )
}
