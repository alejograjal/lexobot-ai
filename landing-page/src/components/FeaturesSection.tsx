
import { Bot, Clock, Globe, MessageCircle, FileText } from "lucide-react";

export const FeaturesSection = () => {
    const features = [
        {
            icon: Bot,
            title: "Asistente Virtual Personalizado",
            description: "Cada condominio tiene su propio bot entrenado con sus documentos específicos",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Clock,
            title: "Atención 24/7 para Condóminos",
            description: "Tus clientes reciben respuestas inmediatas sin saturar a tu equipo",
            color: "from-green-500 to-green-600"
        },
        {
            icon: Globe,
            title: "Acceso Web Multiplataforma",
            description: "Funciona desde cualquier dispositivo sin instalaciones adicionales",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: MessageCircle,
            title: "Comunicación Natural e Intuitiva",
            description: "Interfaz conversacional que cualquier condómino puede usar fácilmente",
            color: "from-indigo-500 to-indigo-600"
        },
        {
            icon: FileText,
            title: "Integración con Documentos Oficiales",
            description: "Respuestas basadas en reglamentos, actas y documentos verificados",
            color: "from-orange-500 to-orange-600"
        }
    ];

    return (
        <section id="features" className="py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), 
                           linear-gradient(-45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, rgba(59, 130, 246, 0.1) 75%), 
                           linear-gradient(-45deg, transparent 75%, rgba(59, 130, 246, 0.1) 75%)`,
                    backgroundSize: '60px 60px',
                    backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
                }}></div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="text-center mb-24">
                    <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                        Características Clave
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
                        Funcionalidades que{" "}
                        <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            transforman
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-4xl mx-auto">
                        Herramientas diseñadas para empresas administradoras modernas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group h-full">
                            <div className="h-full text-center p-6 md:p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 flex flex-col">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-medium text-gray-900 mb-4 text-base md:text-lg leading-tight">{feature.title}</h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-sm md:text-base flex-1">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
