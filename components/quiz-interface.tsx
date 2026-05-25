'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Square, Trophy, Trash2, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'quiz-session'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface UserAnswer {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function QuizInterface() {
  // Quiz state
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [quizLength, setQuizLength] = useState<5 | 10 | 20>(5)
  const [quizStarted, setQuizStarted] = useState(false)
  
  // Current question state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  
  // Quiz results
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [quizComplete, setQuizComplete] = useState(false)
  
  // Chat state for follow-up questions
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  const startQuiz = async () => {
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setMessages([])
    
    // Generate first question
    await generateNextQuestion(0)
  }

  const generateNextQuestion = async (index: number) => {
    try {
      setIsLoading(true)
      
      const prompt = index === 0
        ? `Generate an intermediate English quiz question (multiple choice A-D). Focus on grammar, vocabulary, or comprehension. Return as JSON with: {question, options: [A, B, C, D], correctAnswer: 0-3, explanation}`
        : `Generate the next intermediate English quiz question (multiple choice A-D). Different topic from before. Return as JSON with: {question, options: [A, B, C, D], correctAnswer: 0-3, explanation}`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        }),
      })

      if (!response.ok) throw new Error('Failed to generate question')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''

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
              fullContent += parsed.content
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      // Parse the JSON response
      const jsonMatch = fullContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const questionData = JSON.parse(jsonMatch[0])
        setCurrentQuestion({
          id: `q_${index}`,
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
        })
        setSelectedAnswer(null)
        setAnswered(false)
      }
    } catch (error) {
      console.error('Error generating question:', error)
      setCurrentQuestion({
        id: `q_${index}`,
        question: 'Which sentence is grammatically correct?',
        options: ['He go to school', 'He goes to school', 'He going to school', 'He gone to school'],
        correctAnswer: 1,
        explanation: 'The correct answer is "He goes to school" because we use the third person singular form (goes) with "he".',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (!answered) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null && currentQuestion) {
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer
      setAnswers(prev => [...prev, {
        questionId: currentQuestion.id,
        selectedIndex: selectedAnswer,
        isCorrect,
      }])
      setAnswered(true)

      // If correct, show feedback message
      if (isCorrect) {
        const newMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: `✓ Correct! ${currentQuestion.explanation}`,
        }
        setMessages(prev => [...prev, newMessage])
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizLength) {
      setCurrentQuestionIndex(prev => prev + 1)
      generateNextQuestion(currentQuestionIndex + 1)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setQuizComplete(false)
    setCurrentQuestionIndex(0)
    setCurrentQuestion(null)
    setSelectedAnswer(null)
    setAnswered(false)
    setAnswers([])
    setMessages([])
  }

  // Calculate score
  const correctCount = answers.filter(a => a.isCorrect).length
  const percentage = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0

  // Quiz not started - show settings
  if (!quizStarted) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center space-y-4">
              <Trophy className="w-16 h-16 mx-auto text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                English Quiz Challenge
              </h1>
              <p className="text-lg text-muted-foreground">
                Test your intermediate English skills and get detailed feedback on every answer.
              </p>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? 'default' : 'outline'}
                    onClick={() => setDifficulty(level)}
                    className="capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quiz Length Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">Number of Questions</label>
              <div className="grid grid-cols-3 gap-2">
                {([5, 10, 20] as const).map((length) => (
                  <Button
                    key={length}
                    variant={quizLength === length ? 'default' : 'outline'}
                    onClick={() => setQuizLength(length)}
                  >
                    {length} Questions
                  </Button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              onClick={startQuiz}
              disabled={isLoading}
              className="w-full gap-2 text-base"
            >
              <Trophy className="w-5 h-5" />
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz complete - show results
  if (quizComplete) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <div className="max-w-2xl w-full space-y-8 text-center">
            <div className="space-y-4">
              <Trophy className="w-20 h-20 mx-auto text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Quiz Complete!
              </h1>
              <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20">
                <p className="text-5xl font-bold text-primary mb-2">
                  {percentage}%
                </p>
                <p className="text-lg text-foreground">
                  You got {correctCount} out of {quizLength} questions correct
                </p>
              </div>
            </div>

            {/* Review answers */}
            <div className="space-y-3 text-left">
              <h2 className="text-xl font-semibold text-foreground">Review Your Answers</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {answers.map((answer, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-3 rounded-lg border',
                      answer.isCorrect
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    )}
                  >
                    <p className="text-sm font-medium">
                      Question {idx + 1}: {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              onClick={resetQuiz}
              className="w-full gap-2 text-base"
            >
              <Trophy className="w-5 h-5" />
              Try Another Quiz
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // In quiz - show question
  if (currentQuestion) {
    return (
      <div className="flex flex-col h-full">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Progress */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quizLength}
              </span>
              <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quizLength) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-card rounded-2xl p-8 border border-border space-y-6">
              <h2 className="text-2xl font-bold text-foreground leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answered}
                    className={cn(
                      'w-full p-4 rounded-xl border-2 transition-all text-left font-medium',
                      selectedAnswer === index && !answered
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/30 bg-card',
                      answered && index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500/10'
                        : answered && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer
                        ? 'border-red-500 bg-red-500/10'
                        : '',
                      answered ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:bg-primary/5'
                    )}
                  >
                    <span className="text-muted-foreground mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {answered && (
                <div className={cn(
                  'p-4 rounded-xl border-2',
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                )}>
                  <p className="font-semibold text-foreground mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                  </p>
                  <p className="text-sm text-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            {!answered && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full gap-2"
              >
                Check Answer
              </Button>
            )}
            {answered && (
              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="w-full gap-2"
              >
                {currentQuestionIndex + 1 === quizLength ? 'See Results' : 'Next Question'}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Loading quiz...</p>
    </div>
  )
}
