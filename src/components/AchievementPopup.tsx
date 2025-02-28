import React from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface AchievementPopupProps {
  title: string;
  description: string;
  points: number;
  onClose: () => void;
}

export function AchievementPopup({ title, description, points, onClose }: AchievementPopupProps) {
  React.useEffect(() => {
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Auto close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed bottom-24 right-8 z-[1000] w-80 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold mb-1">{title}</h3>
            <p className="text-white/70 text-sm">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-purple-400 font-medium">+{points} points</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-xl text-white text-sm transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </motion.div>
  );
}