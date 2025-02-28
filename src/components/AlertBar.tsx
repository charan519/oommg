import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'emergency' | 'info';
}

interface AlertBarProps {
  alerts: Alert[];
}

export function AlertBar({ alerts }: AlertBarProps) {
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (alerts.length > 0) {
      setCurrentAlert(alerts[0]);
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alerts]);

  if (!currentAlert || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-[1100] bg-red-500/90 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-white" />
            <p className="text-white font-medium">{currentAlert.message}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}