// app/layout.tsx
import './globals.css'
import { Metadata } from 'next'
import { Providers } from './Providers'

export const metadata: Metadata = {
  title: 'LexoBot-AI | Asistente Virtual para Condominios - Inteligencia Artificial',
  description:
    'LexoBot-AI es el asistente virtual con IA más avanzado para condominios. Mejora la comunicación, resuelve dudas 24/7 y simplifica la administración. Solicita tu demo gratuita.',
  keywords: [
    'asistente virtual',
    'condominios',
    'inteligencia artificial',
    'administración',
    'comunicación',
    'chatbot',
    'IA',
    'proptech',
  ],
  authors: [{ name: 'LexoBot-AI' }],
  openGraph: {
    type: 'website',
    url: 'https://lexobot-ai.com/',
    title: 'LexoBot-AI | Asistente Virtual para Condominios',
    description:
      'Transforma la gestión de tu condominio con IA. Respuestas instantáneas, comunicación eficaz y administración simplificada.',
    images: ['https://lexobot-ai.com/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://lexobot-ai.com/',
    title: 'LexoBot-AI | Asistente Virtual para Condominios',
    description:
      'Transforma la gestión de tu condominio con IA. Respuestas instantáneas, comunicación eficaz y administración simplificada.',
    images: ['https://lexobot-ai.com/og-image.jpg'],
  },
  metadataBase: new URL('https://lexobot-ai.com'),
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
