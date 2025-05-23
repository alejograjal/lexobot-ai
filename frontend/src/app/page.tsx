import ChatContainer from '@/components/Chat/ChatContainer'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 px-2 sm:px-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Bienvenido a LexoBot-AI</h1>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed text-justify">
            Aquí puedes consultar cualquier duda sobre los reglamentos internos del condominio.
            LexoBot está diseñado para ayudarte a conocer las reglas de convivencia y evacuar tus dudas de forma rápida y confiable.
          </p>
        </div>
        <ChatContainer />
      </div>
    </main>
  )
}