import React, { useEffect, useState } from 'react';
import { X, Clock, MapPin, Coffee, Sun, Moon, Utensils, Camera, Bus } from 'lucide-react';

interface ItineraryPanelProps {
  onClose: () => void;
  userLocation?: [number, number];
}

interface ItineraryItem {
  id: number;
  time: string;
  activity: string;
  duration: string;
  type: string;
  icon: any;
  location?: string;
}

export function ItineraryPanel({ onClose, userLocation }: ItineraryPanelProps) {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [currentTime] = useState(new Date());

  useEffect(() => {
    // Generate dynamic itinerary based on current time
    const hour = currentTime.getHours();
    let dynamicItinerary: ItineraryItem[] = [];

    // Morning activities
    if (hour <= 10) {
      dynamicItinerary.push({
        id: 1,
        time: "08:00 AM",
        activity: "Breakfast at Local Cafe",
        duration: "1 hour",
        type: "dining",
        icon: Coffee,
      });
    }

    // Late morning activities
    if (hour <= 12) {
      dynamicItinerary.push({
        id: 2,
        time: "10:00 AM",
        activity: "Visit Historical Sites",
        duration: "2 hours",
        type: "sightseeing",
        icon: Camera,
      });
    }

    // Afternoon activities
    if (hour <= 15) {
      dynamicItinerary.push({
        id: 3,
        time: "12:30 PM",
        activity: "Lunch at Popular Restaurant",
        duration: "1.5 hours",
        type: "dining",
        icon: Utensils,
      });
    }

    // Late afternoon activities
    if (hour <= 18) {
      dynamicItinerary.push({
        id: 4,
        time: "03:00 PM",
        activity: "Local Market Tour",
        duration: "2 hours",
        type: "shopping",
        icon: MapPin,
      });
    }

    // Evening activities
    if (hour <= 22) {
      dynamicItinerary.push({
        id: 5,
        time: "06:00 PM",
        activity: "Evening City Tour",
        duration: "2 hours",
        type: "tour",
        icon: Bus,
      });
    }

    // If it's past certain activities, show tomorrow's schedule
    if (hour >= 22) {
      dynamicItinerary = [
        {
          id: 1,
          time: "Tomorrow 08:00 AM",
          activity: "Breakfast at Local Cafe",
          duration: "1 hour",
          type: "dining",
          icon: Coffee,
        },
        // Add more tomorrow activities...
      ];
    }

    // If we have user location, fetch nearby places for activities
    if (userLocation) {
      fetchNearbyPlaces(userLocation[0], userLocation[1])
        .then(places => {
          const updatedItinerary = dynamicItinerary.map(item => {
            const matchingPlace = places.find(place => 
              place.type.toLowerCase().includes(item.type.toLowerCase())
            );
            if (matchingPlace) {
              return {
                ...item,
                activity: `${item.activity} at ${matchingPlace.name}`,
                location: matchingPlace.location
              };
            }
            return item;
          });
          setItinerary(updatedItinerary);
        });
    } else {
      setItinerary(dynamicItinerary);
    }
  }, [currentTime, userLocation]);

  const fetchNearbyPlaces = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=tourist+attraction&lat=${lat}&lon=${lon}&radius=5000`
      );
      const data = await response.json();
      return data.map((place: any) => ({
        name: place.display_name.split(',')[0],
        type: place.type || 'attraction',
        location: place.display_name
      }));
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      return [];
    }
  };

  return (
    <div className="absolute top-20 right-8 z-[1000] w-96 max-h-[calc(100vh-160px)] bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Today's Itinerary</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
          {itinerary.map((item, index) => {
            const Icon = item.icon;
            const isPast = new Date(`${currentTime.toDateString()} ${item.time}`) < currentTime;

            return (
              <div
                key={item.id}
                className={`relative flex items-start space-x-4 bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group ${
                  isPast ? 'opacity-50' : ''
                }`}
              >
                {index !== itinerary.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-12 bg-white/20 group-hover:bg-white/30 transition-colors" />
                )}
                
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center group-hover:bg-blue-500/50 transition-colors">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-sm">{item.time}</span>
                    <div className="flex items-center space-x-1 text-white/50 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    {item.activity}
                  </h3>
                  {item.location && (
                    <p className="text-white/60 text-sm mt-1">{item.location}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-6 w-full py-3 bg-blue-600/80 hover:bg-blue-700/80 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105">
          Optimize Schedule
        </button>
      </div>
    </div>
  );
}