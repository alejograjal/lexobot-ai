import './globals.css'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { ThemeProvider } from '@/components/ThemeProvider'
import TenantBannerWrapper from '@/components/Branding/TenantBannerWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LexoBot-AI | Chat',
  description: 'Interactúa con tu IA de forma sencilla y rápida mediante una interfaz moderna y amigable. Obtén respuestas inteligentes basadas en documentos y datos específicos de tu condominio.'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          inter.className,
          'h-full antialiased transition-colors duration-300 bg-gradient-to-br from-white via-slate-100 to-white text-black dark:from-black dark:to-zinc-900 dark:text-white',
          'fixed w-full overflow-hidden'
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="relative flex flex-col md:justify-center items-center w-full h-full min-h-0 overflow-hidden p-1 sm:px-6 lg:px-8">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent blur-2xl" />
            <div className="absolute top-4 right-4 z-20">
              <ThemeToggle />
            </div>

            <TenantBannerWrapper />

            <div className={cn(
              "relative z-10 w-full max-w-3xl rounded-2xl bg-white p-2 pt-5 md:p-6 shadow-xl ring-1 ring-black/10 backdrop-blur dark:bg-black/30 dark:ring-white/10",
              "flex min-h-0",
              "mt-auto md:mt-8",
              "mb-4 md:mb-0"
            )}>
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}