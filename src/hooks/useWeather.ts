import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'windy';
  description: string;
}

export function useWeather(lat?: number, lon?: number) {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 25,
    condition: 'clear',
    description: 'Sunny day'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat && lon) {
      fetchWeather(lat, lon);
    }
  }, [lat, lon]);

  const fetchWeather = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      // Since we don't have a valid API key, we'll simulate the weather data
      simulateWeather();
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data');
      // Fallback to simulated weather
      simulateWeather();
    } finally {
      setLoading(false);
    }
  };

  const simulateWeather = () => {
    const conditions = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'windy'] as const;
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 30) + 10;

    setWeather({
      temperature: randomTemp,
      condition: randomCondition,
      description: getWeatherDescription(randomCondition)
    });
  };

  const mapWeatherCondition = (condition: string): WeatherData['condition'] => {
    const mapping: { [key: string]: WeatherData['condition'] } = {
      'Clear': 'clear',
      'Clouds': 'cloudy',
      'Rain': 'rain',
      'Snow': 'snow',
      'Thunderstorm': 'storm',
      'Squall': 'windy',
      'Tornado': 'windy'
    };
    return mapping[condition] || 'clear';
  };

  const getWeatherDescription = (condition: WeatherData['condition']) => {
    const descriptions = {
      clear: 'Sunny day',
      cloudy: 'Partly cloudy',
      rain: 'Light rain',
      snow: 'Light snow',
      storm: 'Thunderstorm',
      windy: 'Strong winds'
    };
    return descriptions[condition];
  };

  return { weather, loading, error };
}