import { Send } from 'lucide-react';
import React, { useState } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1">
            <div className="relative">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Por favor, haz tu pregunta..."
                    disabled={disabled}
                    className="w-full resize-none pr-12 min-h-[44px] max-h-32 px-3 py-2 text-sm rounded-md
                        border border-gray-300 dark:border-zinc-600
                        bg-white dark:bg-zinc-700
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={2}
                />
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="absolute right-2 top-2 h-8 w-8 p-0 
                        bg-blue-900 dark:bg-white 
                        hover:bg-blue-700 dark:hover:bg-gray-200 
                        rounded-full disabled:opacity-50 disabled:cursor-not-allowed 
                        flex items-center justify-center 
                        text-white dark:text-black transition-colors"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;