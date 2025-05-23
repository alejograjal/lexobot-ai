import { cn } from '@/lib/utils'
import { Message } from '@/types/message'
import { useEffect, useState } from 'react'

export default function ChatMessage({ message, onTyping }: { message: Message, onTyping?: () => void }) {
  const isUser = message.role === 'user'
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const typingSpeed = 20

  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
  }, [message.text])

  useEffect(() => {
    if (currentIndex < message.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + message.text[currentIndex])
        setCurrentIndex(prev => prev + 1)

        if (onTyping && currentIndex % 5 === 0) { // Cada 5 caracteres para mejor performance
          onTyping()
        }
      }, typingSpeed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, message.text, onTyping])

  const textToDisplay = isUser ? message.text : displayedText

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'p-3 mt-2 rounded-lg whitespace-pre-wrap break-words inline-block max-w-[80%]',
          isUser
            ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 text-right'
            : 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200 text-left'
        )}
      >
        {textToDisplay}
        {!isUser && currentIndex < message.text.length && (
          <span className="ml-1 inline-block h-4 w-1 bg-gray-500 animate-blink" />
        )}
      </div>
    </div>
  )
}