import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { MikaCharacter } from '@/components/mika-character'
import {
  Sparkles,
  BookOpen,
  Brain,
  Heart,
  MessageCircle,
  Lightbulb,
  GraduationCap,
  ArrowRight,
  Check,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'Smart Explanations',
    description: 'Mika breaks down complex topics into digestible pieces, adapting to your learning style.',
  },
  {
    icon: Heart,
    title: 'Patient & Supportive',
    description: 'Never feel judged for asking questions. Mika celebrates your progress and encourages you.',
  },
  {
    icon: MessageCircle,
    title: 'Natural Conversation',
    description: 'Chat naturally like you would with a friend who happens to be great at every subject.',
  },
  {
    icon: Lightbulb,
    title: 'Guided Discovery',
    description: 'Rather than just giving answers, Mika helps you understand the "why" behind concepts.',
  },
]

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Programming',
  'Writing',
  'History',
  'Languages',
]

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header showStudyLink />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Your AI-powered study buddy
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                  Meet <span className="text-primary">Mika</span>, your personal study companion
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty">
                  Learning doesn&apos;t have to be lonely. Mika is here to help you understand any subject, 
                  answer your questions, and keep you motivated on your educational journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="gap-2 text-base px-6">
                  <Link href="/study">
                    <GraduationCap className="w-5 h-5" />
                    Start Learning Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 text-base px-6">
                  <a href="#features">
                    <BookOpen className="w-5 h-5" />
                    Learn More
                  </a>
                </Button>
              </div>

              {/* Subject tags */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {SUBJECTS.map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Character Showcase */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-3xl blur-3xl scale-110" />
                
                {/* Character Card */}
                <div className="relative bg-card border border-border rounded-3xl p-8 shadow-xl max-w-sm">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 mika-glow animate-float">
                        <Image
                          src="/mika-avatar.jpg"
                          alt="Mika - Your AI Study Companion"
                          width={128}
                          height={128}
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-card" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Hi, I&apos;m Mika!</h3>
                      <p className="text-muted-foreground text-sm">Your AI Study Companion</p>
                    </div>

                    {/* Sample conversation */}
                    <div className="w-full space-y-3 pt-4 border-t border-border">
                      <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-left">
                        <p className="text-secondary-foreground">
                          I&apos;m struggling with quadratic equations...
                        </p>
                      </div>
                      <div className="bg-primary/10 rounded-2xl rounded-br-sm px-4 py-2 text-sm text-left">
                        <p className="text-foreground">
                          No worries! Let&apos;s break it down step by step. Think of a quadratic like a special recipe with three ingredients... ✨
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why study with Mika?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mika isn&apos;t just another AI chatbot. She&apos;s designed specifically to help you learn and grow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-primary/20">
            <div className="flex justify-center mb-6">
              <MikaCharacter size="lg" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to make studying more enjoyable?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of students who&apos;ve discovered the joy of learning with a companion who truly cares about your success.
            </p>
            <Button asChild size="lg" className="gap-2 text-base px-8">
              <Link href="/study">
                <Sparkles className="w-5 h-5" />
                Chat with Mika
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden relative">
              <Image
                src="/mika-logo.jpg"
                alt="Mika Logo"
                fill
                className="object-cover"
              />
            </div>
            <span>Mika - AI Study Companion</span>
          </div>
          <p>Making learning more human, one conversation at a time.</p>
        </div>
      </footer>
    </div>
  )
}
