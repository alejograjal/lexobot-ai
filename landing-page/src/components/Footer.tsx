import { Bot, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold">LexoBot-AI</span>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                            Asistente virtual inteligente para condominios, siempre disponible para responder tus preguntas con precisión y claridad.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Mail className="h-4 w-4" />
                                <span>alejandro.grajal.s@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Phone className="h-4 w-4" />
                                <span>
                                    <a href="tel:+50664705196" className="hover:underline">
                                        +506 6470-5196
                                    </a>
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <MapPin className="h-4 w-4" />
                                <span>Alajuela, Costa Rica</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Producto</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#home" className="hover:text-white transition-colors">Inicio</a></li>
                            <li><a href="#overview" className="hover:text-white transition-colors">Visión General</a></li>
                            <li><a href="#challenges" className="hover:text-white transition-colors">Desafíos</a></li>
                            <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                            <li><a href="#benefits" className="hover:text-white transition-colors">Beneficios</a></li>
                            <li><a href="#components" className="hover:text-white transition-colors">Componentes</a></li>
                            <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Empresa</h3>
                        <ul className="space-y-2 text-gray-300">
                            {/* <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Casos de éxito</a></li> */}
                            <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} LexoBot-AI. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};