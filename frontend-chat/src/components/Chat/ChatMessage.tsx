/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Share } from 'lucide-react';
import { UseSnackbar } from '@/stores/UseSnackbar';

interface ChatMessageProps {
    message: string;
    isUser: boolean;
    timestamp: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        setFormattedTime(timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, [timestamp]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message);
            setSnackbarMessage("Mensaje copiado", 'success');
        } catch (err) {
            setSnackbarMessage("Error al copiar el mensaje", 'error');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Chat Message',
                    text: message,
                });
            } catch (err) {
            }
        } else {
            handleCopy();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`group relative max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${isUser
                        ? 'bg-blue-600 text-white ml-4 border-transparent'
                        : 'bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-gray-100 dark:border-zinc-600 mr-4'
                        }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
                    <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {formattedTime}
                        </span>
                        {!isUser && (
                            <div className="flex gap-1">
                                <button
                                    onClick={handleCopy}
                                    className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-600 dark:text-gray-300 rounded flex items-center justify-center transition-colors"
                                >
                                    <Copy size={12} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-600 dark:text-gray-300 rounded flex items-center justify-center transition-colors"
                                >
                                    <Share size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;