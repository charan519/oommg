import React from 'react';
import { Clock, MapPin, X, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface RouteStep {
  instruction: string;
  distance: number;
}

interface Route {
  duration: number;
  distance: number;
  steps: RouteStep[];
}

interface DirectionsPanelProps {
  route: Route | null;
  onClose: () => void;
  isLoading?: boolean;
}

export function DirectionsPanel({ route, onClose, isLoading = false }: DirectionsPanelProps) {
  if (!route?.steps?.length && !isLoading) return null;

  const formatDistance = (meters: number) => {
    return meters >= 1000 
      ? `${(meters / 1000).toFixed(1)} km`
      : `${Math.round(meters)} m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-20 right-8 z-[1000] w-96 max-h-[calc(100vh-160px)] bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Directions</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-400 animate-spin mb-4" />
            <p className="text-white/70">Calculating best route...</p>
          </div>
        ) : (
          <>
            {/* Overview */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{route.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{formatDistance(route.distance * 1000)}</span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-2">
              {route.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <p className="text-white font-medium mb-2">{step.instruction}</p>
                  <p className="text-sm text-white/60">{formatDistance(step.distance)}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}