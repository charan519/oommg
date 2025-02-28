import React from 'react';
import { X, Facebook, Instagram, Twitter, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    name: string;
    description: string;
    image?: string;
  };
}

export function SocialShareModal({ isOpen, onClose, location }: SocialShareModalProps) {
  const shareUrl = window.location.href;
  const title = `Exploring ${location.name} with TravelAI! 🌍✨`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] md:w-96 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden z-[1100] shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Share Your Journey</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {location.image && (
                <div className="mb-4 rounded-xl overflow-hidden">
                  <img src={location.image} alt={location.name} className="w-full h-48 object-cover" />
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">{location.name}</h3>
                <p className="text-white/70 text-sm">{location.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FacebookShareButton url={shareUrl} quote={title} className="w-full">
                  <div className="p-4 bg-blue-500/30 hover:bg-blue-500/50 rounded-xl transition-colors flex flex-col items-center space-y-2">
                    <Facebook className="w-6 h-6 text-blue-400" />
                    <span className="text-white text-sm">Facebook</span>
                  </div>
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={title} className="w-full">
                  <div className="p-4 bg-blue-500/30 hover:bg-blue-500/50 rounded-xl transition-colors flex flex-col items-center space-y-2">
                    <Twitter className="w-6 h-6 text-blue-400" />
                    <span className="text-white text-sm">Twitter</span>
                  </div>
                </TwitterShareButton>

                <WhatsappShareButton url={shareUrl} title={title} className="w-full">
                  <div className="p-4 bg-green-600/80 hover:bg-green-700/80 rounded-xl transition-colors flex flex-col items-center space-y-2">
                    <Share2 className="w-6 h-6 text-white" />
                    <span className="text-white text-sm">WhatsApp</span>
                  </div>
                </WhatsappShareButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}