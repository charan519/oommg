import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, Globe, MapPin, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroPageProps {
  onGetStarted: () => void;
}

export function HeroPage({ onGetStarted }: HeroPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Compass className="w-16 h-16 text-blue-400 animate-spin" />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 0 0px rgba(59, 130, 246, 0.3)",
                  "0 0 0 20px rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>
          <p className="mt-4 text-white text-xl font-medium">Loading GeoGuide AI...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full filter blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Compass className="w-8 h-8 text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">GeoGuide AI</h1>
        </div>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
        >
          Login
        </button>
      </header>
      
      {/* Hero section */}
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Explore the World with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"> AI-Powered </span>
            Navigation
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Discover new places, get real-time traffic updates, and navigate with confidence using our advanced AI travel companion.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </motion.div>
        
        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Navigation</h3>
            <p className="text-white/70">
              Get accurate directions with real-time traffic updates and alternative routes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Personalized Recommendations</h3>
            <p className="text-white/70">
              Discover new places tailored to your preferences and interests.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Travel Assistant</h3>
            <p className="text-white/70">
              Get instant answers to your travel questions and local insights.
            </p>
          </motion.div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-24 w-full max-w-5xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400" fill="#facc15" />
                ))}
              </div>
              <p className="text-white/80 mb-4">
                "GeoGuide AI transformed my travel experience. The real-time traffic updates saved me hours on my road trip!"
              </p>
              <p className="text-white font-medium">- Sarah Johnson</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400" fill="#facc15" />
                ))}
              </div>
              <p className="text-white/80 mb-4">
                "The AI assistant is incredibly helpful. It suggested amazing local spots that weren't on any tourist maps!"
              </p>
              <p className="text-white font-medium">- Michael Chen</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}