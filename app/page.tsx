import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { MikaCharacter } from '@/components/mika-character'
import {
  Brain,
  BookOpen,
  CheckCircle,
  Zap,
  MessageCircle,
  Lightbulb,
  Trophy,
  ArrowRight,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'Smart Quiz Generation',
    description: 'AI generates custom intermediate English questions covering grammar, vocabulary, and comprehension.',
  },
  {
    icon: CheckCircle,
    title: 'Detailed Explanations',
    description: 'Get clear, personalized feedback for every wrong answer to understand your mistakes.',
  },
  {
    icon: Zap,
    title: 'Learn Faster',
    description: 'Targeted learning identifies weak areas and helps you focus on what matters most.',
  },
  {
    icon: Lightbulb,
    title: 'Real Understanding',
    description: 'No just memorization—AI explains the "why" behind grammar rules and vocabulary usage.',
  },
]

const LEVELS = [
  'Grammar Mastery',
  'Vocabulary Building',
  'Reading Comprehension',
  'Writing Skills',
  'Listening Practice',
  'Speaking Confidence',
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
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20">
                  <Zap className="w-4 h-4" />
                  Master English with AI
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                  Learn <span className="text-primary">Intermediate English</span> with Instant Feedback
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty">
                  Get AI-generated English quizzes with clear explanations for every wrong answer. Perfect for intermediate learners who want to improve faster.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="lg" className="gap-2 text-base px-6">
                  <Link href="/study">
                    <Trophy className="w-5 h-5" />
                    Start Quiz Now
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

              {/* Learning areas */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {LEVELS.map((level) => (
                  <span
                    key={level}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full border border-border"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Character Showcase */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-3xl blur-3xl scale-110" />
                
                {/* Character Card */}
                <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl max-w-sm">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 mika-glow animate-float">
                        <Image
                          src="/mika-avatar.jpg"
                          alt="English Quiz AI Agent"
                          width={128}
                          height={128}
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-card" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground">English Quiz Agent</h3>
                      <p className="text-muted-foreground text-sm">AI-Powered Learning</p>
                    </div>

                    {/* Sample quiz preview */}
                    <div className="w-full space-y-3 pt-4 border-t border-border">
                      <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-2 text-sm text-left border border-border">
                        <p className="text-secondary-foreground">
                          <strong>Q:</strong> Which is correct?
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">A) He go to school B) He goes to school</p>
                      </div>
                      <div className="bg-primary/10 rounded-2xl rounded-br-sm px-4 py-2 text-sm text-left border border-primary/20">
                        <p className="text-foreground">
                          <strong>Correct!</strong> "He goes to school" uses the right verb form for third person singular.
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
      <section id="features" className="py-16 md:py-24 px-4 bg-card/30 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why learn English with AI quizzes?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered quiz system is designed specifically for intermediate learners who want real improvement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
              Ready to master intermediate English?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Take structured quizzes, get instant feedback, and truly understand your mistakes. Start learning smarter today.
            </p>
            <Button asChild size="lg" className="gap-2 text-base px-8">
              <Link href="/study">
                <Trophy className="w-5 h-5" />
                Start Your First Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md overflow-hidden relative">
                <Image
                  src="/mika-logo.jpg"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span>AI English Quiz Agent</span>
            </div>
            <p>Master intermediate English with AI-powered quizzes and clear explanations.</p>
          </div>
          <div className="border-t border-border w-full pt-4 text-center">
            <p>&copy; {new Date().getFullYear()} AI English Quiz. Created by{' '}
              <a href="mailto:maulana.rachmat@gmail.com" className="text-primary hover:underline">
                maulana.rachmat@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
