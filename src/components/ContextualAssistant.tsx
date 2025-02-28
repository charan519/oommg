import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Mic, Camera, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Using a placeholder API key - in production, this should be in environment variables
const API_KEY = "YOUR_GEMINI_API_KEY";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ContextualAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (prompt: string) => {
    try {
      // Simulate AI response since we don't have a valid API key
      const responses = [
        "I found several interesting attractions nearby. Would you like me to show them on the map?",
        "Based on your location, I recommend visiting the local museum which is highly rated by travelers.",
        "The weather looks great for outdoor activities today! Would you like some hiking trail recommendations?",
        "There's a popular local restaurant just 2 kilometers from your location. They're known for their authentic cuisine.",
        "I notice you're in a historic district. There are several architectural landmarks within walking distance."
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return responses[Math.floor(Math.random() * responses.length)];
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request at the moment. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await generateResponse(inputText);
      const aiMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[1000]">
      <div
        className={`bg-black/40 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg transition-all duration-300 overflow-hidden ${
          isExpanded ? "w-80 h-[500px]" : "w-12"
        }`}
      >
        {isExpanded && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <p className="text-white/70 text-sm">AI Travel Assistant</p>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.isUser
                        ? "bg-blue-500/30 text-white"
                        : "bg-white/10 text-white/90"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-xl p-3 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full px-4 py-2 bg-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={1}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-white/70" />
                  </button>
                  <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                    <Mic className="w-4 h-4 text-white/70" />
                  </button>
                  <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                    <Camera className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 flex items-center justify-center hover:bg-white/10 transition-colors rounded-2xl w-full"
          aria-label="Toggle Assistant"
        >
          <MessageSquare className="w-6 h-6 text-blue-400 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}