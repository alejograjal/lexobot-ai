"use client"

import ChatMessage from "./ChatMessage";
import { Message } from "@/types/message"
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTenantBranding } from "@/hooks/useTenantBranding";

interface ChatBodyProps {
    isTyping: boolean,
    messages: Message[]
}

export function ChatBody({ isTyping, messages }: ChatBodyProps) {
    const { tenantImagePath } = useTenantBranding()

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollToBottom();
        }, 100);

        return () => clearTimeout(timeout);
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-1 flex flex-col relative">
            <div className="flex flex-col mt-auto" >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-no-repeat bg-center bg-contain pointer-events-none mobile-only md:hidden"
                    style={{ backgroundImage: `url(${tenantImagePath})`, zIndex: 0 }}
                />

                <AnimatePresence>
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message.text}
                            isUser={message.isUser}
                            timestamp={message.timestamp}
                        />
                    ))}
                </AnimatePresence>

                {
                    isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex justify-start"
                        >
                            <div className="bg-gray-100 dark:bg-zinc-700 rounded-2xl px-4 py-3 mr-4 border dark:border-zinc-600">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }

                <div ref={messagesEndRef} />
            </div >

        </div >
    )
}