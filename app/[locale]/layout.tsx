import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers/ThemeProvider'
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher'
import { LocaleSwitcher } from '@/app/components/LocaleSwitcher'
import { Header } from '@/app/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reading App',
  description: 'A modern reading application with internationalization and theme support',
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">
            {/* Navigation Controls */}
            <div className="fixed top-4 right-4 flex gap-2 z-50">
              <LocaleSwitcher />
              <ThemeSwitcher />
            </div>
            
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
} 