import './globals.css'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { Providers } from './Providers'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LexoBot AI | Centro de Administración',
  description: 'Centro de Administración de LexoBot AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <Toaster position="bottom-center" richColors closeButton />
          {children}
        </body>
      </Providers>
    </html>
  )
}
