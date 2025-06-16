import ChatContainer from '@/components/Chat/ChatContainer'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between h-full w-full">
      <div className="w-full max-w-4xl h-full flex flex-col overflow-hidden">
        <div className="mb-2 px-2 sm:px-0 flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold mb-1">
            Bienvenido a LexoBot-AI
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed text-justify">
            Aquí puedes consultar cualquier duda sobre los reglamentos internos del condominio.
            LexoBot está diseñado para ayudarte a conocer las reglas de convivencia.
          </p>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatContainer />
        </div>
      </div>
    </main>
  )
}