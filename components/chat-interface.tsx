'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChatMessage } from './chat-message'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Square, Sparkles, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'mika-chat-history'

const SUGGESTED_TOPICS = [
  { label: 'Explain calculus', prompt: 'Can you explain the basics of calculus to me? I want to understand derivatives.' },
  { label: 'Help with essay', prompt: 'I need help structuring an argumentative essay. What are the key components?' },
  { label: 'Chemistry concepts', prompt: 'Can you explain the periodic table and how elements are organized?' },
  { label: 'Study tips', prompt: 'What are some effective study techniques for retaining information better?' },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setMessages(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }, [])

  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (error) {
      console.error('Failed to save chat history:', error)
    }
  }, [messages])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
    }

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsLoading(true)
    setIsStreaming(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue

          const data = trimmedLine.slice(5).trim()
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              setMessages(prev => {
                const updated = [...prev]
                const lastMessage = updated[updated.length - 1]
                if (lastMessage && lastMessage.role === 'assistant') {
                  lastMessage.content += parsed.content
                }
                return updated
              })
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User stopped the generation
        setMessages(prev => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
            lastMessage.content = '(Generation stopped)'
          }
          return updated
        })
      } else {
        console.error('Chat error:', error)
        setMessages(prev => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = 'Sorry, I encountered an error. Please try again.'
          }
          return updated
        })
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt)
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

        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            isStreaming={
              isStreaming &&
              index === messages.length - 1 &&
              message.role === 'assistant'
            }
            onSuggestionClick={sendMessage}
          />
        ))}
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
          
          {isStreaming ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={stopGeneration}
              className="h-11 w-11 rounded-xl flex-shrink-0"
            >
              <Square className="w-4 h-4" />
              <span className="sr-only">Stop generation</span>
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 rounded-xl flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Send message</span>
            </Button>
          )}

          {messages.length > 0 && !isLoading && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={clearChat}
              className="h-11 w-11 rounded-xl flex-shrink-0"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Clear chat</span>
            </Button>
          )}
        </form>
        <p className="text-center text-xs text-muted-foreground mt-2">
          {isStreaming ? 'Mika is typing...' : 'Mika can make mistakes. Always verify important information.'}
        </p>
      </div>
    </div>
  )
}
