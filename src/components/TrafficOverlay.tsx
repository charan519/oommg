import React from 'react';
import { Car, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrafficOverlayProps {
  congestionLevel: 'low' | 'moderate' | 'high';
  incidents: Array<{
    type: string;
    description: string;
  }>;
}

export function TrafficOverlay({ congestionLevel, incidents }: TrafficOverlayProps) {
  const getStatusColor = () => {
    switch (congestionLevel) {
      case 'high': return 'bg-red-500/80';
      case 'moderate': return 'bg-yellow-400/80';
      default: return 'bg-green-600/80';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-20 left-8 z-[900] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-lg"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-xl ${getStatusColor()}`}>
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Traffic Status</p>
            <p className="text-white/70 text-sm capitalize">{congestionLevel} congestion</p>
          </div>
        </div>

        {incidents.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-white/80 text-sm mb-2">Recent Incidents:</p>
            {incidents.slice(0, 3).map((incident, index) => (
              <div key={index} className="flex items-start space-x-2 mb-2 last:mb-0">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm">{incident.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}