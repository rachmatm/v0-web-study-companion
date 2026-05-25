import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const MIKA_SYSTEM_PROMPT = `You are an AI English quiz master designed to help intermediate English learners improve through targeted quizzes.

## Core Responsibility
Generate intermediate English quiz questions that test grammar, vocabulary, and comprehension. Provide clear explanations for answers.

## Question Generation Format
When asked to generate a quiz question, ALWAYS respond with ONLY valid JSON in this exact format:
{
  "question": "Clear, single question about English",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Clear explanation of why the correct answer is right and what learners should understand"
}

## Content Guidelines
- Focus on intermediate English level (B1-B2)
- Cover: grammar tenses, prepositions, phrasal verbs, vocabulary, sentence structure, reading comprehension
- Questions should be practical and relevant to everyday English
- Explanations should be educational and help understanding, not just confirm the answer

## Important Rules
- ONLY output valid JSON when generating questions
- Include no markdown formatting (no backticks, no asterisks)
- Ensure options are grammatically plausible but clearly different
- Make explanations specific to the question, mentioning grammar rules or vocabulary nuances
- Vary question types: grammar corrections, word choice, phrase usage, comprehension

## When answering about questions
If user asks for clarification about a question or wants to discuss an answer further, respond naturally and helpfully. You can:
- Provide additional examples
- Explain grammar rules in more detail
- Suggest ways to remember the rule
- Ask follow-up questions to check understanding`

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
