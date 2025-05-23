import './globals.css'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import ThemeToggle from '@/components/Theme/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LexoBot-AI',
  description: 'Interfaz moderna para hacer preguntas a tu IA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'min-h-screen antialiased transition-colors duration-300 bg-gradient-to-br from-white via-slate-100 to-white text-black dark:from-black dark:to-zinc-900 dark:text-white'
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="relative flex flex-col items-center justify-center w-full min-h-screen p-1 sm:px-6 lg:px-8">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent blur-2xl" />
            <div className="absolute top-4 right-4 z-20">
              <ThemeToggle />
            </div>
            <div className="relative w-48 h-36 sm:w-64 sm:h-48 md:w-[30vw] md:h-[10rem]">
              <Image
                src="/LexoBot-AI.png"
                alt="LexoBot-AI Logo"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-2 pt-14 md:p-6 shadow-xl ring-1 ring-black/10 backdrop-blur dark:bg-black/30 dark:ring-white/10">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}