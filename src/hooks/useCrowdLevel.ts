import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface CrowdData {
  level: 'low' | 'moderate' | 'high';
  percentage: number;
  peakHours: string[];
  lastUpdated: string;
}

export function useCrowdLevel(placeId?: string) {
  const [crowdData, setCrowdData] = useState<CrowdData>({
    level: 'low',
    percentage: 0,
    peakHours: [],
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    if (placeId) {
      fetchCrowdData(placeId);
      const interval = setInterval(() => fetchCrowdData(placeId), 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [placeId]);

  const fetchCrowdData = async (id: string) => {
    try {
      // In a real implementation, you would fetch from a crowd monitoring API
      // For now, we'll simulate crowd data
      simulateCrowdData();
    } catch (error) {
      console.error('Error fetching crowd data:', error);
    }
  };

  const simulateCrowdData = () => {
    const currentHour = new Date().getHours();
    const percentage = Math.floor(Math.random() * 100);
    
    let level: CrowdData['level'] = 'low';
    if (percentage > 70) level = 'high';
    else if (percentage > 30) level = 'moderate';

    // Generate realistic peak hours based on time of day
    const peakHours = [
      format(new Date().setHours(11, 0), 'HH:mm'),
      format(new Date().setHours(15, 0), 'HH:mm'),
      format(new Date().setHours(18, 0), 'HH:mm')
    ];

    setCrowdData({
      level,
      percentage,
      peakHours,
      lastUpdated: new Date().toISOString()
    });
  };

  return crowdData;
}