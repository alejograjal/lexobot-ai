
import { AlertTriangle, Users, MessageCircleX, FileX, Phone, Frown } from "lucide-react";

export const ProblemsSection = () => {
    const problems = [
        {
            icon: MessageCircleX,
            title: "Consultas repetitivas saturan a tu equipo",
            description: "El personal administrativo pierde tiempo respondiendo las mismas preguntas una y otra vez"
        },
        {
            icon: Users,
            title: "Recursos humanos sobrecargados",
            description: "Tu equipo se agota con tareas rutinarias que podrían automatizarse"
        },
        {
            icon: AlertTriangle,
            title: "Información inconsistente genera conflictos",
            description: "Diferentes respuestas del equipo crean confusión y quejas de condóminos"
        },
        {
            icon: FileX,
            title: "Dificultad de acceso a documentos",
            description: "Condóminos no encuentran reglamentos y documentos importantes fácilmente"
        },
        {
            icon: Phone,
            title: "Rumores y desinformación",
            description: "Falta de información oficial genera especulaciones y conflictos"
        },
        {
            icon: Frown,
            title: "Insatisfacción de clientes condóminos",
            description: "Quejas por demoras en respuestas y falta de disponibilidad fuera de horario"
        }
    ];

    return (
        <section id="challenges" className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-900/10 to-orange-900/10"></div>
                <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
                        Desafíos Actuales
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
                        Problemas que enfrentan{" "}
                        <span className="font-medium bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            las administradoras
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto">
                        ¿Te suenan familiares estos desafíos diarios en la gestión de condominios?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {problems.map((problem, index) => (
                        <div key={index} className="group h-full">
                            <div className="h-full flex items-start space-x-4 p-6 md:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <problem.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-white mb-2 text-base md:text-lg leading-tight">{problem.title}</h3>
                                    <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">{problem.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
