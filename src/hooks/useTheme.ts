import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('map-theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('map-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Update the map tiles class
    const mapTiles = document.querySelector('.map-tiles');
    if (mapTiles) {
      mapTiles.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}