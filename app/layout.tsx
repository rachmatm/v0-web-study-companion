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
  title: 'Mika - Your AI Study Companion',
  description: 'Meet Mika, your friendly AI tutor who makes learning fun and personalized. Get help with any subject, anytime.',
  generator: 'v0.app',
  keywords: ['AI tutor', 'study companion', 'learning', 'education', 'homework help'],
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
