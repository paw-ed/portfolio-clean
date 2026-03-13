import type { Metadata, Viewport } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { FloatingBackground } from '@/components/floating-background'
import { LumiAssistant } from '@/components/lumi/lumi-assistant'

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portfolyo | Tasarımcı & Geliştirici',
  description: 'Anadolu Üniversitesi öğrencisi, mobil oyun geliştiricisi ve dijital yaratıcı. Kod ve ekonomi tasarımcısı.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-white overflow-x-hidden">
        <FloatingBackground />
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
        <LumiAssistant />
        <Analytics />
      </body>
    </html>
  )
}
