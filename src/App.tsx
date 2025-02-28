import React, { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { WeatherWidget } from './components/WeatherWidget';
import { AlertBar } from './components/AlertBar';
import { useLanguage } from './hooks/useLanguage';
import { SettingsPanel } from './components/SettingsPanel';
import { HeroPage } from './components/HeroPage';
import { LoginPage } from './components/LoginPage';
import { RecommendationPage } from './components/RecommendationPage';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'emergency' | 'info';
}

function AppContent() {
  const { language, changeLanguage } = useLanguage();
  const [weather, setWeather] = useState({
    temperature: 25,
    condition: 'clear' as const,
    description: 'Sunny day'
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;

  useEffect(() => {
    // Simulated weather update every 5 minutes
    const weatherInterval = setInterval(() => {
      fetchWeatherData();
    }, 300000);

    // Simulated emergency alerts check every minute
    const alertsInterval = setInterval(() => {
      checkEmergencyAlerts();
    }, 60000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(alertsInterval);
    };
  }, []);

  const fetchWeatherData = async () => {
    try {
      const conditions = ['clear', 'cloudy', 'rain', 'snow', 'storm', 'windy'] as const;
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 30) + 10;

      setWeather({
        temperature: randomTemp,
        condition: randomCondition,
        description: getWeatherDescription(randomCondition)
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const checkEmergencyAlerts = async () => {
    try {
      if (Math.random() < 0.3) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          message: "Heavy traffic reported on Main Street due to construction work",
          type: "warning"
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    } catch (error) {
      console.error('Error checking emergency alerts:', error);
    }
  };

  const getWeatherDescription = (condition: typeof weather.condition) => {
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

  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleGetStarted = () => {
    navigate('/recommendations');
  };

  return (
    <Routes>
      <Route path="/" element={
        <HeroPage onGetStarted={handleGetStarted} />
      } />
      <Route path="/login" element={
        <LoginPage />
      } />
      <Route path="/recommendations" element={
        <RecommendationPage />
      } />
      <Route path="/map" element={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
          <div className="relative w-full h-screen">
            <AlertBar alerts={alerts} language={language} />
            <Map 
              language={language} 
              initialSelectedPlace={locationState?.selectedPlace}
              initialUserLocation={locationState?.userLocation}
            />
            <WeatherWidget weather={weather} language={language} />
            {showSettings && (
              <SettingsPanel 
                onClose={() => setShowSettings(false)}
                theme={theme}
                onThemeChange={toggleTheme}
                language={language}
                onLanguageChange={handleLanguageChange}
              />
            )}
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;