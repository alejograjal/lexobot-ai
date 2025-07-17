
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Calendar, MessageCircle, Sparkles } from "lucide-react";
import { ContactForm } from "./Form/ContactForm";

export const CTASection = () => {
    return (
        <section id="contact" className="py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Únete a la Transformación
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-tight">
                        Revoluciona tu empresa{" "}
                        <span className="font-medium bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            hoy mismo
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 font-light mb-12 leading-relaxed">
                        Únete a las empresas administradoras que ya están liderando la transformación digital en Costa Rica.
                    </p>
                    {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                        <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600 px-8 py-4 text-base font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
                            <Calendar className="mr-2 h-4 w-4" />
                            Agenda tu demo gratuita
                        </Button>
                    </div> */}
                </div>

                <ContactForm />
            </div>
        </section>
    );
};
