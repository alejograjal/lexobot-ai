/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useRef, useEffect } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { sendQuestion } from '@/lib/api'
import { Message } from '@/types/message'

const tenant_id = '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const handleSend = async (question: string) => {
    const userMessage: Message = { role: 'user', text: question }
    setMessages(prev => [...prev, userMessage])
    try {
      const response = await sendQuestion(question, tenant_id)
      const aiMessage: Message = { role: 'ai', text: response.answer }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error al obtener respuesta.' }])
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const messagesAreaClass = messages.length === 0
    ? 'h-0 overflow-hidden'
    : 'max-h-[50vh] md:max-h-[45vh] h-auto overflow-y-auto'

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
            <ChatMessage key={idx} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </>
  )
}
