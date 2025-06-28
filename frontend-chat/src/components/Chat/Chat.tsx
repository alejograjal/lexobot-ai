"use client";

import ChatInput from './ChatInput';
import { ChatBody } from './ChatBody';
import ChatHeader from './ChatHeader';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { sendQuestion } from '@/lib/api';
import { Message } from '@/types/message';
import { useSessionId } from '@/hooks/useSessionId';
import { useTenantBranding } from '@/hooks/useTenantBranding';

const getInitialMessages = (isValidTenant: boolean) => {
    return [
        {
            id: '1',
            text: isValidTenant ? '¡Hola! ¿Cómo puedo ayudarte hoy?' : 'Error: Identificador de tenant inválido o faltante en la URL. Por favor, accede a través del enlace correcto.',
            isUser: false,
            timestamp: new Date(),
        }
    ]
}

const Chat = () => {
    const { isValidTenant, tenantId } = useTenantBranding();
    const [isTyping, setIsTyping] = useState(false);
    const { sessionId, resetSession } = useSessionId()
    const [messages, setMessages] = useState<Message[]>(getInitialMessages(isValidTenant));

    const askLexoBot = async (question: string) => {
        setIsTyping(true);
        let aiMessage: Message;

        try {
            const response = await sendQuestion(question, tenantId, sessionId)

            aiMessage = {
                id: Date.now().toString() + '_ai',
                text: response.answer,
                isUser: false,
                timestamp: new Date(),
            };
        } catch {
            aiMessage = {
                id: Date.now().toString() + '_ai',
                text: 'Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.',
                isUser: false,
                timestamp: new Date(),
            }
        }

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
    };

    const handleSendMessage = (text: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        askLexoBot(text);
    };

    const handleClearChat = () => {
        resetSession();
        setMessages(getInitialMessages(isValidTenant));
    };

    return (
        <div className="flex flex-col bg-gray-50 dark:bg-zinc-900 md:rounded-2xl h-full overflow-hidden">
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="flex flex-col bg-gray-300 dark:bg-zinc-900 md:rounded-2xl h-full overflow-hidden"
            >
                <ChatHeader handleClearChat={handleClearChat} />
                <ChatBody isTyping={isTyping} messages={messages} />
                <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            </motion.div>
        </div >
    );
};

export default Chat;