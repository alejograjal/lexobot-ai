
import { Palette, Brain, HeadphonesIcon, Settings, Link } from "lucide-react";

export const WhatIncludes = () => {
    const includes = [
        {
            icon: Palette,
            title: "Personalización Completa",
            description: "Bot adaptado con los colores, logo y branding de tu empresa administradora",
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: Brain,
            title: "Entrenamiento Especializado",
            description: "IA entrenada específicamente con documentos y reglamentos de cada condominio",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: HeadphonesIcon,
            title: "Soporte Técnico Dedicado",
            description: "Asistencia continua para tu equipo y actualizaciones automáticas",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Settings,
            title: "Panel de Administración",
            description: "Dashboard completo para gestionar múltiples condominios desde un lugar",
            color: "from-gray-500 to-gray-600"
        },
        {
            icon: Link,
            title: "Integraciones Empresariales",
            description: "Conecta con tus sistemas existentes de gestión",
            color: "from-green-500 to-green-600"
        }
    ];

    return (
        <section id="components" className="py-32 bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 transform rotate-45 rounded-3xl"></div>
                <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-200/20 transform -rotate-12 rounded-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-200/20 rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                        Solución Completa
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                        ¿Qué incluye{" "}
                        <span className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            tu inversión?
                        </span>
                        ?
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
                        Todo lo que necesitas para revolucionar la administración de condominios.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {includes.map((item, index) => (
                        <div key={index} className="group h-full">
                            <div className="h-full flex items-start space-x-6 p-6 md:p-8 rounded-3xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border border-gray-100">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-3 text-base md:text-lg leading-tight">{item.title}</h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-sm md:text-base">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
