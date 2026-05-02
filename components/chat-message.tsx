'use client'

import { cn } from '@/lib/utils'
import { MikaCharacter } from './mika-character'
import { User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  onSuggestionClick?: (suggestion: string) => void
}

function parseSuggestions(content: string): { mainContent: string; suggestions: string[] } {
  const suggestionRegex = /\[\[([^\]]+)\]\]/g
  const suggestions: string[] = []
  let match

  while ((match = suggestionRegex.exec(content)) !== null) {
    suggestions.push(match[1].trim())
  }

  // Remove suggestion brackets from content and clean up extra whitespace
  const mainContent = content
    .replace(suggestionRegex, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { mainContent, suggestions }
}

export function ChatMessage({ role, content, isStreaming = false, onSuggestionClick }: ChatMessageProps) {
  const isAssistant = role === 'assistant'
  const { mainContent, suggestions } = isAssistant ? parseSuggestions(content) : { mainContent: content, suggestions: [] }

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
        {content ? (
          <div className={cn(
            'prose prose-sm max-w-none',
            isAssistant 
              ? 'prose-neutral dark:prose-invert' 
              : 'prose-invert'
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Filter out empty paragraphs that may result from suggestion removal
                p: ({ children }) => {
                  const hasContent = children && (
                    typeof children === 'string' 
                      ? children.trim().length > 0 
                      : true
                  )
                  return hasContent ? (
                    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                  ) : null
                },
                // Custom styling for code blocks
                pre: ({ children }) => (
                  <pre className="bg-secondary/50 rounded-lg p-3 overflow-x-auto text-sm my-2">
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className
                  return isInline ? (
                    <code 
                      className="bg-secondary/50 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className="font-mono text-sm" {...props}>
                      {children}
                    </code>
                  )
                },
                // List styling
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                // Heading styling
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold mb-1">{children}</h3>
                ),
                // Link styling
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    {children}
                  </a>
                ),
                // Table styling
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-secondary/30 px-3 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-3 py-2">{children}</td>
                ),
                // Blockquote styling
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {mainContent}
            </ReactMarkdown>
            
            {/* Clickable suggestion buttons */}
            {suggestions.length > 0 && !isStreaming && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="flex gap-1 py-1">
            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full typing-dot" />
          </span>
        )}
      </div>
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  )
}
