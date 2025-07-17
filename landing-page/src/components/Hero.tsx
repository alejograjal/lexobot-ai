import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import { DemoButtons } from './Button/DemoButtons'

export const Hero = () => {
    return (
        <section id='home' className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center overflow-hidden text-white">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="container mx-auto px-6 py-32 relative z-10 max-w-6xl">
                <div className="text-center space-y-12">
                    <div className="inline-flex items-center px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-blue-400 font-medium mb-8">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                        Powered by Advanced AI
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white-900 leading-[0.9] tracking-tight">
                            Revoluciona la gestión
                            <br />
                            <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                de condominios
                            </span>
                            <br />
                            <span className="text-3xl md:text-4xl lg:text-5xl text-white-600">
                                con IA
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white-900 font-light max-w-3xl mx-auto leading-relaxed">
                            Para empresas administradoras: Automatiza consultas, reduce carga operativa
                            y mejora la satisfacción de tus clientes condóminos con nuestro asistente virtual inteligente.
                        </p>
                    </div>

                    <DemoButtons />

                    <div className="pt-16">
                        <div className="relative max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl transform rotate-6"></div>
                            <Image
                                src="/LexoBot-AI.png"
                                alt="LexoBot-AI Dashboard - Asistente Virtual para Condominios"
                                width={1600}
                                height={1200}
                                className="relative w-full h-auto drop-shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
