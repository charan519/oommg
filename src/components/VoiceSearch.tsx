import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceSearchProps {
  onVoiceResult: (text: string) => void;
}

export function VoiceSearch({ onVoiceResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handleVoiceSearch = () => {
    if (!isSupported) {
      console.warn('Speech recognition is not supported in this browser');
      return;
    }

    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    setTranscript('');
    setIsListening(true);
    
    // Simulate voice recognition since we can't rely on browser support
    setTimeout(() => {
      const simulatedPhrases = [
        "Show me nearby restaurants",
        "Find historical landmarks",
        "Where are the best hiking trails",
        "Take me to the nearest museum",
        "Find coffee shops within walking distance"
      ];
      
      const result = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
      setTranscript(result);
      
      // Auto-stop after a few seconds
      setTimeout(() => {
        stopListening();
      }, 1500);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    if (transcript) {
      onVoiceResult(transcript);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleVoiceSearch}
        className={`p-3 rounded-full transition-all duration-300 ${
          isListening ? 'bg-red-500/80 hover:bg-red-600/80' : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        {isListening ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/60 backdrop-blur-xl rounded-xl px-4 py-2 min-w-[200px] text-center"
          >
            <p className="text-white text-sm">{transcript || "Listening..."}</p>
            <div className="flex justify-center space-x-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [1, 2, 1],
                    backgroundColor: ["rgb(59 130 246 / 0.5)", "rgb(59 130 246)", "rgb(59 130 246 / 0.5)"]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-1 h-4 bg-blue-500/50 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}