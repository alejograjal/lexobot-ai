
import { MessageCircle, Zap, TrendingDown, Eye, Users } from "lucide-react";

export const BenefitsSection = () => {
    const benefits = [
        {
            icon: MessageCircle,
            title: "Mayor Satisfacción de Clientes",
            description: "Condóminos satisfechos con respuestas inmediatas y precisas las 24 horas",
            stats: "95% de satisfacción",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Zap,
            title: "Respuestas Instantáneas",
            description: "Elimina tiempos de espera y mejora la experiencia del cliente condómino",
            stats: "< 5 segundos promedio",
            color: "from-yellow-500 to-yellow-600"
        },
        {
            icon: TrendingDown,
            title: "Reducción de Costos Operativos",
            description: "Menor carga de trabajo para tu equipo, mayor eficiencia en recursos",
            stats: "70% menos consultas manuales",
            color: "from-green-500 to-green-600"
        },
        {
            icon: Eye,
            title: "Transparencia y Confianza",
            description: "Información oficial siempre disponible aumenta la confianza en tu gestión",
            stats: "100% información verificada",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Users,
            title: "Escalabilidad sin Límites",
            description: "Atiende múltiples condominios simultáneamente sin aumentar personal",
            stats: "Para todas las edades",
            color: "from-indigo-500 to-indigo-600"
        }
    ];

    return (
        <section id="benefits" className="py-32 bg-gradient-to-br from-white via-gray-50 to-white relative">
            <div className="absolute inset-0">
                <div className="absolute top-40 left-10 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                        Resultados Comprobados
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                        Impacto real para tu{" "}
                        <span className="font-medium bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            empresa
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
                        Resultados medibles que transforman la gestión de condominios.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="group h-full">
                            <div className="h-full p-6 md:p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 relative overflow-hidden flex flex-col">
                                {/* Background gradient */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${benefit.color} opacity-10 rounded-full blur-2xl`}></div>

                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 flex-shrink-0`}>
                                    <benefit.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 flex flex-col relative z-10">
                                    <h3 className="font-medium text-gray-900 mb-3 text-base md:text-lg leading-tight">{benefit.title}</h3>
                                    <p className="text-gray-600 font-light mb-6 leading-relaxed text-sm md:text-base flex-1">{benefit.description}</p>
                                    <div className="inline-block">
                                        <span className={`text-sm font-medium text-white bg-gradient-to-r ${benefit.color} px-4 py-2 rounded-full shadow-lg`}>
                                            {benefit.stats}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
