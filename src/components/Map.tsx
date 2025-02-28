import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import { Search, MapPin, Navigation2, Award, Calendar, Settings, Compass, Sun, Moon, Car, Bike, Wallet as Walk, Share2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RecommendationPanel } from './RecommendationPanel';
import { ItineraryPanel } from './ItineraryPanel';
import { ChallengesPanel } from './ChallengesPanel';
import { ContextualAssistant } from './ContextualAssistant';
import { SearchBar } from './SearchBar';
import { DirectionsPanel } from './DirectionsPanel';
import { LocationInfoBox } from './LocationInfoBox';
import { SettingsPanel } from './SettingsPanel';
import { AchievementPopup } from './AchievementPopup';
import { useTheme } from '../hooks/useTheme';
import { useMapZoom } from '../hooks/useMapZoom';
import { useTraffic } from '../hooks/useTraffic';
import { useCrowdLevel } from '../hooks/useCrowdLevel';
import { useWeather } from '../hooks/useWeather';

interface MapProps {
  language?: string;
  initialSelectedPlace?: any;
  initialUserLocation?: [number, number];
}

// Fix Leaflet icon issues
const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Fix default icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ onZoomEnd, onBoundsChange, onLocationClick }: { 
  onZoomEnd: (zoom: number) => void;
  onBoundsChange: (bounds: [[number, number], [number, number]]) => void;
  onLocationClick: (location: any) => void;
}) {
  const map = useMap();
  
  useEffect(() => {
    map.on('zoomend', () => {
      const zoom = map.getZoom();
      onZoomEnd(zoom);
    });

    map.on('moveend', () => {
      const bounds = map.getBounds();
      onBoundsChange([
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()]
      ]);
    });

    map.on('click', async (e) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data) {
          onLocationClick({
            ...data,
            lat: e.latlng.lat,
            lon: e.latlng.lng
          });
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    });

    // Cleanup event listeners on unmount
    return () => {
      map.off('zoomend');
      map.off('moveend');
      map.off('click');
    };
  }, [map, onZoomEnd, onBoundsChange, onLocationClick]);

  return null;
}

// Component to handle initial map setup with selected place
function InitialMapSetup({ selectedPlace, userLocation }: { 
  selectedPlace: any; 
  userLocation: [number, number] | null;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedPlace && userLocation) {
      // Create bounds that include both user location and selected place
      const bounds = L.latLngBounds(
        [userLocation[0], userLocation[1]],
        [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng]
      );
      
      // Fit map to these bounds
      map.fitBounds(bounds, { padding: [50, 50] });
      
      // Add a slight delay to ensure the map has rendered properly
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } else if (selectedPlace) {
      // If only selected place is available
      map.setView(
        [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng], 
        13
      );
    } else if (userLocation) {
      // If only user location is available
      map.setView(userLocation, 13);
    }
  }, [map, selectedPlace, userLocation]);
  
  return null;
}

export function Map({ language = 'en', initialSelectedPlace, initialUserLocation }: MapProps) {
  const [position, setPosition] = useState<[number, number]>([20.5937, 78.9629]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isGlobeView, setIsGlobeView } = useMapZoom();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [transportMode, setTransportMode] = useState('driving-car');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(initialUserLocation || null);
  const [recommendations, setRecommendations] = useState([]);
  const mapRef = useRef<any>(null);
  const [achievement, setAchievement] = useState<{
    title: string;
    description: string;
    points: number;
  } | null>(null);
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]]>([
    [0, 0],
    [0, 0]
  ]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { traffic, loading: trafficLoading } = useTraffic(mapBounds);
  const crowdData = useCrowdLevel(selectedLocation?.place_id);
  const { weather, loading: weatherLoading } = useWeather(
    selectedLocation?.lat ? parseFloat(selectedLocation.lat) : undefined,
    selectedLocation?.lon ? parseFloat(selectedLocation.lon) : undefined
  );

  // Set initial selected location from props if available
  useEffect(() => {
    if (initialSelectedPlace && isInitialLoad) {
      console.log("Setting initial selected place:", initialSelectedPlace);
      
      // Convert the place data to the format expected by the map
      const locationData = {
        place_id: initialSelectedPlace.id,
        display_name: initialSelectedPlace.name + ", " + initialSelectedPlace.description,
        lat: initialSelectedPlace.coordinates.lat.toString(),
        lon: initialSelectedPlace.coordinates.lng.toString()
      };
      
      setSelectedLocation(locationData);
      
      // If we have a route, clear it to prepare for new route calculation
      if (route) {
        setRoute(null);
      }
      
      // Set initial position to the selected place
      setPosition([initialSelectedPlace.coordinates.lat, initialSelectedPlace.coordinates.lng]);
      
      // After a short delay, calculate route to the selected place
      setTimeout(() => {
        if (userLocation) {
          handleGetDirections();
        }
      }, 1000);
      
      setIsInitialLoad(false);
    }
  }, [initialSelectedPlace, isInitialLoad, userLocation]);

  useEffect(() => {
    if (initialUserLocation) {
      setUserLocation(initialUserLocation);
    } else {
      getUserLocation();
    }
  }, [initialUserLocation]);

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newUserLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
          console.log("Got user location:", newUserLocation);
          setUserLocation(newUserLocation);
          if (!selectedLocation && !initialSelectedPlace) {
            setPosition(newUserLocation);
            if (mapRef.current) {
              const map = mapRef.current;
              if (map.setView) {
                map.setView(newUserLocation, 13);
              }
            }
          }
          setIsLoadingLocation(false);
          
          // Fetch nearby places once we have the location
          fetchNearbyPlaces(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(`Location error: ${error.message}. Please enable location services.`);
          setIsLoadingLocation(false);
          
          // Use a default location if we can't get the user's location
          const defaultLocation: [number, number] = [37.7749, -122.4194]; // San Francisco
          setUserLocation(defaultLocation);
          setPosition(defaultLocation);
          if (mapRef.current) {
            const map = mapRef.current;
            if (map.setView) {
              map.setView(defaultLocation, 13);
            }
          }
          
          // Fetch nearby places for the default location
          fetchNearbyPlaces(defaultLocation[0], defaultLocation[1]);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser");
      setIsLoadingLocation(false);
      
      // Use a default location if geolocation is not supported
      const defaultLocation: [number, number] = [37.7749, -122.4194]; // San Francisco
      setUserLocation(defaultLocation);
      setPosition(defaultLocation);
      
      // Fetch nearby places for the default location
      fetchNearbyPlaces(defaultLocation[0], defaultLocation[1]);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      fetchNearbyPlaces(parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon));
    }
  }, [selectedLocation]);

  const fetchNearbyPlaces = async (lat: number, lon: number) => {
    try {
      console.log(`Fetching nearby places for coordinates: ${lat}, ${lon}`);
      
      // Use Overpass API for more reliable POI data
      const radius = 5000; // 5km radius
      const overpassQuery = `
        [out:json];
        (
          node["tourism"](around:${radius},${lat},${lon});
          node["amenity"="restaurant"](around:${radius},${lat},${lon});
          node["amenity"="cafe"](around:${radius},${lat},${lon});
          node["historic"](around:${radius},${lat},${lon});
          node["leisure"="park"](around:${radius},${lat},${lon});
          way["tourism"](around:${radius},${lat},${lon});
          way["historic"](around:${radius},${lat},${lon});
          way["leisure"="park"](around:${radius},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
      );
      
      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.elements && data.elements.length > 0) {
        console.log(`Found ${data.elements.length} nearby places`);
        
        // Process the results
        const places = data.elements
          .filter((element: any) => element.tags && (element.tags.name || element.tags.tourism || element.tags.historic || element.tags.amenity))
          .slice(0, 10) // Limit to 10 places
          .map((element: any, index: number) => {
            const name = element.tags.name || 
                        (element.tags.tourism ? `${element.tags.tourism.charAt(0).toUpperCase() + element.tags.tourism.slice(1)}` : '') ||
                        (element.tags.historic ? `${element.tags.historic.charAt(0).toUpperCase() + element.tags.historic.slice(1)}` : '') ||
                        (element.tags.amenity ? `${element.tags.amenity.charAt(0).toUpperCase() + element.tags.amenity.slice(1)}` : '') ||
                        `Place ${index + 1}`;
            
            const category = element.tags.tourism || element.tags.historic || element.tags.amenity || 'Point of Interest';
            
            // Calculate distance from user location
            const distance = calculateDistance(
              lat, 
              lon, 
              element.lat || (element.center ? element.center.lat : lat), 
              element.lon || (element.center ? element.center.lon : lon)
            );
            
            return {
              id: element.id,
              name: name,
              description: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
              image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=300",
              rating: (Math.random() * 2 + 3).toFixed(1),
              crowdLevel: ["Less crowded", "Moderate", "Busy"][Math.floor(Math.random() * 3)],
              bestTime: ["Morning", "Afternoon", "Evening"][Math.floor(Math.random() * 3)],
              category: category.charAt(0).toUpperCase() + category.slice(1),
              location: {
                lat: element.lat || (element.center ? element.center.lat : lat),
                lon: element.lon || (element.center ? element.center.lon : lon)
              },
              distance: distance
            };
          });
        
        // Sort by distance
        places.sort((a: any, b: any) => a.distance - b.distance);
        
        setRecommendations(places);
        setShowRecommendations(true);
      } else {
        // Fallback to Nominatim if Overpass returns no results
        fallbackToNominatim(lat, lon);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      // Fallback to Nominatim
      fallbackToNominatim(lat, lon);
    }
  };

  const fallbackToNominatim = async (lat: number, lon: number) => {
    try {
      console.log("Falling back to Nominatim for nearby places");
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=tourist+attraction&lat=${lat}&lon=${lon}&radius=5000&limit=10`
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} nearby places with Nominatim`);
        
        const places = data.map((place: any) => {
          // Calculate distance from user location
          const distance = calculateDistance(
            lat, 
            lon, 
            parseFloat(place.lat), 
            parseFloat(place.lon)
          );
          
          return {
            id: place.place_id,
            name: place.display_name.split(',')[0],
            description: place.type || 'Tourist Attraction',
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=300",
            rating: (Math.random() * 2 + 3).toFixed(1),
            crowdLevel: ["Less crowded", "Moderate", "Busy"][Math.floor(Math.random() * 3)],
            bestTime: ["Morning", "Afternoon", "Evening"][Math.floor(Math.random() * 3)],
            category: ["Historical", "Cultural", "Nature"][Math.floor(Math.random() * 3)],
            location: {
              lat: parseFloat(place.lat),
              lon: parseFloat(place.lon)
            },
            distance: distance
          };
        });
        
        // Sort by distance
        places.sort((a: any, b: any) => a.distance - b.distance);
        
        setRecommendations(places);
        setShowRecommendations(true);
      } else {
        console.log("No nearby places found with Nominatim either");
        // Create some mock places around the user's location
        createMockPlaces(lat, lon);
      }
    } catch (error) {
      console.error('Error with Nominatim fallback:', error);
      // Create mock places as a last resort
      createMockPlaces(lat, lon);
    }
  };

  const createMockPlaces = (lat: number, lon: number) => {
    console.log("Creating mock places around the user's location");
    
    // Create 5 mock places at different distances and directions from the user
    const mockPlaces = [];
    
    for (let i = 0; i < 5; i++) {
      // Create a point at a random distance (0.5-5km) and direction from the user
      const distance = 0.5 + Math.random() * 4.5;
      const bearing = Math.random() * 360;
      
      // Calculate the new coordinates
      const point = turf.destination(
        turf.point([lon, lat]),
        distance,
        bearing,
        { units: 'kilometers' }
      );
      
      const coordinates = point.geometry.coordinates;
      
      mockPlaces.push({
        id: `mock-${i}`,
        name: ['Central Park', 'Museum of Art', 'Historic Tower', 'Botanical Garden', 'City Square'][i],
        description: ['Nature', 'Cultural', 'Historical', 'Nature', 'Entertainment'][i],
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=300",
        rating: (Math.random() * 2 + 3).toFixed(1),
        crowdLevel: ["Less crowded", "Moderate", "Busy"][Math.floor(Math.random() * 3)],
        bestTime: ["Morning", "Afternoon", "Evening"][Math.floor(Math.random() * 3)],
        category: ['Park', 'Museum', 'Monument', 'Garden', 'Plaza'][i],
        location: {
          lat: coordinates[1],
          lon: coordinates[0]
        },
        distance: distance
      });
    }
    
    setRecommendations(mockPlaces);
    setShowRecommendations(true);
  };

  const handleLocateMe = () => {
    if (userLocation) {
      setPosition(userLocation);
      if (mapRef.current) {
        const map = mapRef.current;
        if (map.setView) {
          map.setView(userLocation, 13);
        }
      }
    } else {
      getUserLocation();
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleGetDirections = async () => {
    if (!userLocation || !selectedLocation) return;

    try {
      const mode = transportMode === 'driving-car' ? 'car' : 
                   transportMode === 'cycling' ? 'bike' :
                   'foot';
                   
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${mode}/${userLocation[1]},${userLocation[0]};${selectedLocation.lon},${selectedLocation.lat}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;
        
        setRoute({
          coordinates: coordinates,
          duration: Math.round(route.duration / 60),
          distance: (route.distance / 1000).toFixed(1),
          steps: [{
            instruction: `Head to your destination`,
            distance: Math.round(route.distance)
          }]
        });

        if (mapRef.current) {
          const map = mapRef.current;
          if (map.fitBounds) {
            const bounds = L.latLngBounds(
              coordinates.map((coord: number[]) => [coord[1], coord[0]])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        }
        
        // Show achievement for route planning
        setAchievement({
          title: "Route Planner",
          description: "Successfully planned your first route!",
          points: 50
        });
      }
    } catch (error) {
      console.error('Directions error:', error);
      // Fallback to simulated route
      simulateRoute();
    }
  };

  const simulateRoute = () => {
    if (!userLocation || !selectedLocation) return;
    
    // Create a straight line between user location and destination
    const startPoint = [userLocation[1], userLocation[0]];
    const endPoint = [parseFloat(selectedLocation.lon), parseFloat(selectedLocation.lat)];
    
    // Generate some intermediate points for a more realistic route
    const line = turf.lineString([startPoint, endPoint]);
    const distance = turf.length(line, {units: 'kilometers'});
    const steps = Math.max(5, Math.floor(distance / 0.5)); // One point every 500m
    
    const coordinates = [];
    for (let i = 0; i <= steps; i++) {
      const segment = i / steps;
      const point = turf.along(line, distance * segment, {units: 'kilometers'});
      coordinates.push(point.geometry.coordinates);
    }
    
    setRoute({
      coordinates: coordinates,
      duration: Math.round(distance * 3), // Rough estimate: 3 min per km
      distance: distance.toFixed(1),
      steps: [{
        instruction: `Head to ${selectedLocation.display_name.split(',')[0]}`,
        distance: Math.round(distance * 1000)
      }]
    });
    
    if (mapRef.current) {
      const map = mapRef.current;
      if (map.fitBounds) {
        const bounds = L.latLngBounds(
          coordinates.map((coord: number[]) => [coord[1], coord[0]])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
    
    // Show achievement for route planning
    setAchievement({
      title: "Route Planner",
      description: "Successfully planned your first route!",
      points: 50
    });
  };

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    const newPosition: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];
    setPosition(newPosition);
    if (mapRef.current) {
      const map = mapRef.current;
      if (map.setView) {
        map.setView(newPosition, 13);
      }
    }
    setRoute(null);
  };

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    const newPosition: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];
    setPosition(newPosition);
    if (mapRef.current) {
      const map = mapRef.current;
      if (map.setView) {
        map.setView(newPosition, 13);
      }
    }
    setRoute(null);
  };

  const handleZoomEnd = (zoom: number) => {
    if (zoom < 3 && !isGlobeView) {
      setIsGlobeView(true);
    } else if (zoom >= 3 && isGlobeView) {
      setIsGlobeView(false);
    }
  };

  const handleBoundsChange = (bounds: [[number, number], [number, number]]) => {
    setMapBounds(bounds);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-blue-400" />
            <span className="text-white font-bold text-xl">GeoGuide AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={() => setShowChallenges(!showChallenges)}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              <Award className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} results={searchResults} onSelect={handleLocationSelect} />

      <div className="absolute top-20 right-8 z-[1000] bg-black/30 backdrop-blur-xl rounded-full p-2 flex space-x-2">
        <button
          onClick={() => setTransportMode('driving-car')}
          className={`p-2 rounded-full transition-all duration-300 ${
            transportMode === 'driving-car' ? 'bg-blue-500 text-white' : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <Car className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTransportMode('cycling')}
          className={`p-2 rounded-full transition-all duration-300 ${
            transportMode === 'cycling' ? 'bg-blue-500 text-white' : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <Bike className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTransportMode('foot-walking')}
          className={`p-2 rounded-full transition-all duration-300 ${
            transportMode === 'foot-walking' ? 'bg-blue-500 text-white' : 'text-white/70 hover:bg-white/10'
          }`}
        >
          <Walk className="w-5 h-5" />
        </button>
      </div>

      {locationError && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1100] bg-red-500/80 backdrop-blur-md rounded-xl px-4 py-2 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span className="text-white text-sm">{locationError}</span>
          <button 
            onClick={getUserLocation}
            className="ml-2 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="w-full h-full">
        <MapContainer
          center={position}
          zoom={13}
          className="w-full h-full"
          style={{ background: theme === 'dark' ? '#1a1a2e' : '#fff' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className={theme === 'dark' ? 'map-tiles dark' : 'map-tiles'}
          />
          
          {traffic.incidents.map((incident) => (
            <Circle
              key={incident.id}
              center={incident.location}
              radius={500}
              pathOptions={{
                color: incident.type === 'high' ? '#ef4444' : 
                       incident.type === 'moderate' ? '#f59e0b' : '#22c55e',
                fillColor: incident.type === 'high' ? '#ef4444' : 
                          incident.type === 'moderate' ? '#f59e0b' : '#22c55e',
                fillOpacity: 0.3
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h3 className="font-bold">{incident.type}</h3>
                  </div>
                  <p className="text-sm">{incident.description}</p>
                </div>
              </Popup>
            </Circle>
          ))}

          {selectedLocation && (
            <Marker 
              position={[parseFloat(selectedLocation.lat), parseFloat(selectedLocation.lon)]}
              icon={destinationIcon}
            >
              <Popup className="custom-popup">
                <div className="p-3">
                  <h3 className="font-bold text-lg">{selectedLocation.display_name}</h3>
                  {crowdData && (
                    <div className="mt-2 text-sm">
                      <p>Crowd Level: {crowdData.level}</p>
                      <p>Peak Hours: {crowdData.peakHours.join(', ')}</p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
          
          {userLocation && (
            <Marker position={userLocation}>
              <Popup className="custom-popup">
                <div className="p-3">
                  <h3 className="font-bold text-lg">Your Location</h3>
                  {weather && (
                    <div className="mt-2 text-sm">
                      <p>{weather.temperature}°C - {weather.description}</p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {route && (
            <Polyline
              positions={route.coordinates.map((coord: number[]) => [coord[1], coord[0]])}
              color="#3b82f6"
              weight={4}
              opacity={0.8}
            />
          )}

          <MapController 
            onZoomEnd={handleZoomEnd}
            onBoundsChange={handleBoundsChange}
            onLocationClick={handleLocationClick}
          />
          
          {initialSelectedPlace && userLocation && isInitialLoad && (
            <InitialMapSetup 
              selectedPlace={initialSelectedPlace} 
              userLocation={userLocation} 
            />
          )}
        </MapContainer>
      </div>

      <div className="absolute bottom-8 right-8 z-[1000] flex flex-col space-y-4">
        <button
          onClick={() => setShowRecommendations(!showRecommendations)}
          className="p-4 bg-blue-600/80 backdrop-blur-md rounded-full text-white hover:bg-blue-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <MapPin className="w-6 h-6 group-hover:animate-bounce" />
        </button>
        <button
          onClick={() => setShowItinerary(!showItinerary)}
          className="p-4 bg-purple-600/80 backdrop-blur-md rounded-full text-white hover:bg-purple-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <Calendar className="w-6 h-6 group-hover:animate-pulse" />
        </button>
        <button
          onClick={handleLocateMe}
          className="p-4 bg-green-600/80 backdrop-blur-md rounded-full text-white hover:bg-green-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <Navigation2 className="w-6 h-6 group-hover:animate-spin" />
        </button>
      </div>

      {showRecommendations && (
        <RecommendationPanel 
          onClose={() => setShowRecommendations(false)} 
          recommendations={recommendations}
          userLocation={userLocation}
          transportMode={transportMode}
          language={language}
        />
      )}
      {showItinerary && (
        <ItineraryPanel 
          onClose={() => setShowItinerary(false)} 
          userLocation={userLocation}
        />
      )}
      {showChallenges && <ChallengesPanel onClose={() => setShowChallenges(false)} />}
      {showSettings && (
        <SettingsPanel 
          onClose={() => setShowSettings(false)}
          theme={theme}
          onThemeChange={toggleTheme}
          language={language}
        />
      )}
      {route && <DirectionsPanel route={route} onClose={() => setRoute(null)} />}
      {selectedLocation && (
        <LocationInfoBox
          location={selectedLocation}
          onGetDirections={handleGetDirections}
          onClose={() => setSelectedLocation(null)}
        />
      )}

      <AnimatePresence>
        {achievement && (
          <AchievementPopup
            title={achievement.title}
            description={achievement.description}
            points={achievement.points}
            onClose={() => setAchievement(null)}
          />
        )}
      </AnimatePresence>

      <ContextualAssistant />
    </div>
  );
}