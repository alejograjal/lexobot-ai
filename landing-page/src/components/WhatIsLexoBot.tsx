
import { Bot, MessageSquare, Clock, Shield } from "lucide-react";

export const WhatIsLexoBot = () => {
    return (
        <section id="overview" className="py-32 bg-gradient-to-b from-white to-gray-50 relative">
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                        Tecnología Revolucionaria
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                        ¿Qué es{" "}
                        <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            LexoBot-AI
                        </span>
                        ?
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
                        La plataforma de IA que transforma la comunicación en condominios, brindando respuestas inmediatas 24/7 sobre reglamentos, comunicados y documentos internos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        {
                            icon: Bot,
                            title: "IA Especializada",
                            description: "Entrenada específicamente para responder consultas sobre administración de condominios",
                            color: "from-blue-500 to-blue-600"
                        },
                        {
                            icon: MessageSquare,
                            title: "Gestión Eficiente",
                            description: "Reduce hasta 80% las consultas manuales de tu equipo administrativo",
                            color: "from-purple-500 to-purple-600"
                        },
                        {
                            icon: Clock,
                            title: "Servicio 24/7",
                            description: "Tus condóminos reciben respuestas inmediatas en cualquier momento",
                            color: "from-green-500 to-green-600"
                        },
                        {
                            icon: Shield,
                            title: "Información Oficial",
                            description: "Basado en reglamentos y documentos oficiales de cada condominio",
                            color: "from-orange-500 to-orange-600"
                        }
                    ].map((item, index) => (
                        <div key={index} className="text-center group h-full">
                            <div className="h-full flex flex-col bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 flex-shrink-0`}>
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-medium text-gray-900 mb-3 text-lg">{item.title}</h3>
                                    <p className="text-gray-600 font-light leading-relaxed flex-1">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
