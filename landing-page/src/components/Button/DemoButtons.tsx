'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from '@radix-ui/react-dialog';

export const DemoButtons = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const scrollToDemoForm = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
                size="lg"
                onClick={scrollToDemoForm}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-base font-medium rounded-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
                Solicita una demo gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-white hover:text-blue-400 px-8 py-4 text-base font-medium rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 border border-white/20 cursor-pointer"
                        hidden
                    >
                        <Play className="mr-2 h-4 w-4 fill-current" />
                        Ver cómo funciona
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className="max-w-3xl p-0 overflow-hidden [&>button[data-slot=dialog-close]_svg]:text-white [&>button[data-slot=dialog-close]_svg]:stroke-white"
                >
                    <DialogTitle className="sr-only !text-white">Video explicativo</DialogTitle>

                    <div className="aspect-video w-full text-white">
                        <iframe
                            src="https://www.youtube.com/embed/VIDEO_ID"
                            title="Video explicativo"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full text-white"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
