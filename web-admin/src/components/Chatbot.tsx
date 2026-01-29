"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([
        { text: "Hello! I am Ultron, your AI assistant. How can I help you today?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useSettings();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const newMessages = [...messages, { text: inputValue, sender: "user" as const }];
        setMessages(newMessages);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(inputValue);
            setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
        }, 1000);
    };

    const getBotResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes("grievance") || lowerInput.includes("complain")) {
            return t("You can file a new grievance from the 'Grievances' tab in the sidebar.");
        }
        if (lowerInput.includes("status")) {
            return t("To check the status of your grievance, go to 'My Grievances'.");
        }
        if (lowerInput.includes("contact") || lowerInput.includes("support")) {
            return t("You can contact our support team at support@janpath.gov.in");
        }
        if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
            return t("Hello! How can I assist you with your civic issues today?");
        }
        return t("I'm not sure how to help with that. Please try asking about grievances or status.");
    };

    return (
        <>
            {/* Floating Trigger Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 p-4 bg-purple-600 text-white rounded-full shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-colors"
                >
                    <MessageSquare size={24} />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
                        style={{ height: "500px", maxHeight: "80vh" }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-purple-600/10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Ultron AI</h3>
                                    <p className="text-xs text-purple-300">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#050505]">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                            msg.sender === "user"
                                                ? "bg-purple-600 text-white rounded-br-none"
                                                : "bg-white/10 text-slate-200 rounded-bl-none"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-white/10 bg-[#0a0a0a]">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={t("Type a message...")}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="p-2.5 rounded-xl bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
