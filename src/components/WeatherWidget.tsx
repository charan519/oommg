import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  temperature: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'windy';
  description: string;
}

interface WeatherWidgetProps {
  weather: WeatherData;
}

const weatherIcons = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
  windy: Wind,
};

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  const WeatherIcon = weatherIcons[weather.condition];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-8 left-24 z-[900] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-lg"
    >
      <div className="p-4 flex items-center space-x-3">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="p-2 bg-white/10 rounded-xl"
        >
          <WeatherIcon className="w-6 h-6 text-blue-400" />
        </motion.div>
        <div>
          <p className="text-white font-medium">{weather.temperature}°C</p>
          <p className="text-white/70 text-sm">{weather.description}</p>
        </div>
      </div>
    </motion.div>
  );
}