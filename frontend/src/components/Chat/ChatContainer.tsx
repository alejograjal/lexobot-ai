/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useRef, useEffect } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { sendQuestion } from '@/lib/api'
import { Message } from '@/types/message'
import { useSearchParams } from 'next/navigation'

export default function ChatContainer() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const tenant_id = searchParams.get('tenant_id')
  const isValidTenant = tenant_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenant_id)

  useEffect(() => {
    if (!isValidTenant) {
      setMessages([{
        role: 'ai',
        text: 'Error: Identificador de tenant inválido o faltante en la URL. Por favor, accede a través del enlace correcto.'
      }])
    }
  }, [isValidTenant])


  const handleSend = async (question: string) => {
    if (!isValidTenant) return

    const userMessage: Message = { role: 'user', text: question }
    setMessages(prev => [...prev, userMessage])
    try {
      const response = await sendQuestion(question, tenant_id)
      const aiMessage: Message = { role: 'ai', text: response.answer }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error al enviar la pregunta:', error)
      setMessages(prev => [...prev, { role: 'ai', text: 'Error al obtener respuesta.' }])
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const messagesAreaClass = messages.length === 0
    ? 'h-0 overflow-hidden'
    : 'max-h-[50vh] md:max-h-[40vh] h-auto overflow-y-auto'

  const handleClear = () => {
    setMessages([])
  }

  return (
    <>
      <button
        onClick={handleClear}
        className="fixed top-5 right-5 z-50 bg-white/90 dark:bg-black/70 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg shadow-md hover:bg-white dark:hover:bg-black transition focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:top-6 sm:right-6"
        style={{ marginBottom: '10rem !important' }}
        type="button"
        aria-label="Limpiar chat"
        title="Limpiar chat"
      >
        🧹 Limpiar chat
      </button>

      <div className="flex flex-col border rounded-md overflow-hidden w-full max-w-4xl mx-auto">

        <div className="border-b md:px-4 md:py-2 bg-background">
          <ChatInput onSend={handleSend} />
        </div>

        <div className={`${messagesAreaClass} px-4 space-y-4 text-sm md:text-base`}>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} onTyping={idx === messages.length - 1 && msg.role === 'ai' ? scrollToBottom : undefined} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  )
}
