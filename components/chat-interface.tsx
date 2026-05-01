'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatMessage } from './chat-message'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const SUGGESTED_TOPICS = [
  { label: 'Explain calculus', prompt: 'Can you explain the basics of calculus to me? I want to understand derivatives.' },
  { label: 'Help with essay', prompt: 'I need help structuring an argumentative essay. What are the key components?' },
  { label: 'Chemistry concepts', prompt: 'Can you explain the periodic table and how elements are organized?' },
  { label: 'Study tips', prompt: 'What are some effective study techniques for retaining information better?' },
]

export function ChatInterface() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSuggestionClick = (prompt: string) => {
    sendMessage({ text: prompt })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  What would you like to learn today?
                </h2>
                <p className="text-muted-foreground text-sm">
                  I can help with math, science, writing, programming, and more!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_TOPICS.map((topic) => (
                  <Button
                    key={topic.label}
                    variant="outline"
                    className="h-auto py-3 px-4 text-left justify-start text-sm hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => handleSuggestionClick(topic.prompt)}
                    disabled={isLoading}
                  >
                    <Sparkles className="w-3 h-3 mr-2 text-accent flex-shrink-0" />
                    <span className="truncate">{topic.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const textContent = message.parts
            ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
            .map((p) => p.text)
            .join('') || ''

          return (
            <ChatMessage
              key={message.id}
              role={message.role as 'user' | 'assistant'}
              content={textContent}
              isStreaming={
                isLoading &&
                index === messages.length - 1 &&
                message.role === 'assistant'
              }
            />
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Mika anything..."
              disabled={isLoading}
              className={cn(
                'min-h-[44px] max-h-[150px] resize-none pr-4 rounded-xl',
                'bg-background border-input focus:border-primary focus:ring-primary/20'
              )}
              rows={1}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 rounded-xl flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Mika can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  )
}
