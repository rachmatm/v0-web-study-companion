'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MikaCharacter } from './mika-character'
import { Sparkles, BookOpen, Home } from 'lucide-react'

interface HeaderProps {
  showStudyLink?: boolean
}

export function Header({ showStudyLink = false }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl overflow-hidden relative">
            <Image
              src="/mika-logo.jpg"
              alt="Mika Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground leading-none">Mika</span>
            <span className="text-xs text-muted-foreground">AI Study Companion</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {showStudyLink ? (
            <Button asChild variant="default" size="sm" className="gap-2">
              <Link href="/study">
                <Sparkles className="w-4 h-4" />
                Start Studying
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
