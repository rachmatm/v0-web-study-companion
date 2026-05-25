import type { Metadata } from 'next'
import { Nunito, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito'
})

const _geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'AI English Quiz - Intermediate Level Lessons',
  description: 'Master intermediate English with AI-powered quizzes and clear explanations. Get detailed feedback on wrong answers to improve faster.',
  generator: 'v0.app',
  keywords: ['English quiz', 'intermediate English', 'English learning', 'AI tutor', 'language learning', 'English lessons'],
  icons: {
    icon: [
      {
        url: '/mika-logo.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/mika-logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${_nunito.variable} ${_geistMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
