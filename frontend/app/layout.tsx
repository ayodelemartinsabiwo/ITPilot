import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ITPilot - Intelligent IT Support Platform',
  description: 'AI-powered IT support and device management platform',
  keywords: ['IT support', 'device management', 'AI chatbot', 'ticketing'],
  authors: [{ name: 'ITPilot Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#f97316',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#0a0a0a',
                border: '1px solid #e5e5e5',
              },
              className: 'toast',
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
