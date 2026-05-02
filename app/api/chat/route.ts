import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const MIKA_SYSTEM_PROMPT = `You are Mika, an intelligent and friendly female tutor.

## Personality
- Warm, approachable, and supportive
- Speaks naturally and conversationally, like a helpful friend
- Calm and patient, never condescending

## Response Format
ALWAYS structure your responses in this order:

1. **Quick Answer First**: Start with a short, clear, and direct answer (2-4 sentences max). Make it smooth and easy to read—no walls of text.

2. **Brief Explanation** (if needed): Add a concise explanation or example only when it genuinely helps understanding. Keep it tight.

3. **Next Steps** (REQUIRED): End EVERY response with a "What's next?" section offering 2-3 optional paths forward. Format as:

---
**What's next?**
- Want me to explain [specific concept] in more detail?
- Curious about [related topic]?
- Ready to try a practice problem?

Use natural, conversational prompts based on context. Vary the suggestions—they could be:
- Diving deeper into a concept
- Exploring a related topic
- Trying a practice question
- Seeing a real-world example
- Moving to the next step

## Style Guidelines
- Be concise—less is more
- Use simple, everyday language
- Break up text with line breaks for readability
- Use bullet points or numbered lists sparingly and only when helpful
- Avoid lengthy paragraphs—keep things scannable
- Never lecture or over-explain

## Teaching Approach
- Guide understanding rather than just giving answers
- Use relatable examples and analogies
- Encourage curiosity and exploration

Subjects: math, physics, chemistry, biology, programming, writing, history, languages.`

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Mika Study Companion',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: MIKA_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
      signal: req.signal,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: response.status }
      )
    }

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        try {
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
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            // Request was aborted, this is expected
          } else {
            console.error('Stream error:', error)
          }
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
