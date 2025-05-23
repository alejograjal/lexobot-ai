import { cn } from '@/lib/utils'
import { Message } from '@/types/message'

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

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
        {message.text}
      </div>
    </div>
  )
}
