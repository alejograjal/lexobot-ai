import ChatContainer from '@/components/Chat/ChatContainer'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between h-full w-full">
      <div className="w-full max-w-4xl h-full flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatContainer />
        </div>
      </div>
    </main>
  )
}