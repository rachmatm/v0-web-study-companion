'use client'

import { cn } from '@/lib/utils'
import { MikaCharacter } from './mika-character'
import { User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isAssistant = role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in-up',
        isAssistant ? 'justify-start' : 'justify-end'
      )}
    >
      {isAssistant && (
        <MikaCharacter size="sm" isThinking={isStreaming && !content} />
      )}
      <div
        className={cn(
          'max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3',
          isAssistant
            ? 'bg-card border border-border text-card-foreground rounded-bl-sm'
            : 'bg-primary text-primary-foreground rounded-br-sm'
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content || (
            <span className="flex gap-1 py-1">
              <span className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
              <span className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
              <span className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
            </span>
          )}
        </div>
      </div>
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  )
}
