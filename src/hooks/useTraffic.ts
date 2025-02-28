import { useState, useEffect } from 'react';
import axios from 'axios';

interface TrafficData {
  congestionLevel: 'low' | 'moderate' | 'high';
  incidents: Array<{
    id: string;
    type: string;
    description: string;
    location: [number, number];
  }>;
}

export function useTraffic(bounds?: [[number, number], [number, number]]) {
  const [traffic, setTraffic] = useState<TrafficData>({
    congestionLevel: 'low',
    incidents: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bounds) {
      fetchTrafficData(bounds);
      const interval = setInterval(() => fetchTrafficData(bounds), 30000);
      return () => clearInterval(interval);
    }
  }, [bounds]);

  const fetchTrafficData = async (mapBounds: [[number, number], [number, number]]) => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch from a traffic API
      // For now, we'll simulate traffic data
      simulateTrafficData(mapBounds);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateTrafficData = (mapBounds: [[number, number], [number, number]]) => {
    const [[south, west], [north, east]] = mapBounds;
    
    const randomIncidents = Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
      id: `incident-${Date.now()}-${i}`,
      type: ['accident', 'construction', 'roadwork'][Math.floor(Math.random() * 3)],
      description: 'Traffic incident reported',
      location: [
        south + Math.random() * (north - south),
        west + Math.random() * (east - west)
      ] as [number, number]
    }));

    setTraffic({
      congestionLevel: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'moderate' | 'high',
      incidents: randomIncidents
    });
  };

  return { traffic, loading };
}