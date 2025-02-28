import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users, 
  Navigation2, 
  MapPin, 
  Calendar, 
  Phone, 
  Globe, 
  Share2, 
  Heart, 
  MessageSquare, 
  Camera, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Compass
} from 'lucide-react';

interface PlaceDetails {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  images: string[];
  rating: number;
  reviews: number;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  popularity: 'Trending' | 'Popular' | 'Hidden Gem';
  distance: number;
  travelTime: number;
  category: string;
  address: string;
  phone: string;
  website: string;
  openingHours: {
    [key: string]: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
  reviews_data: {
    id: string;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export function PlaceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllHours, setShowAllHours] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Simulate fetching place details
    setTimeout(() => {
      const mockPlace: PlaceDetails = {
        id: id || '1',
        name: 'Golden Gate Bridge',
        description: 'Iconic suspension bridge with stunning views of the bay and city skyline.',
        longDescription: 'The Golden Gate Bridge is a suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay and the Pacific Ocean. The structure links the U.S. city of San Francisco, California—the northern tip of the San Francisco Peninsula—to Marin County, carrying both U.S. Route 101 and California State Route 1 across the strait. It also carries pedestrian and bicycle traffic, and is designated as part of U.S. Bicycle Route 95. Being declared one of the Wonders of the Modern World by the American Society of Civil Engineers, the bridge is one of the most internationally recognized symbols of San Francisco and California.',
        images: [
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1474302694023-9711af8045cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1526404423292-15c341815d5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        ],
        rating: 4.8,
        reviews: 12453,
        crowdLevel: 'High',
        popularity: 'Trending',
        distance: 3.2,
        travelTime: 15,
        category: 'Landmark',
        address: 'Golden Gate Bridge, San Francisco, CA 94129',
        phone: '+1 (415) 921-5858',
        website: 'https://www.goldengate.org/',
        openingHours: {
          'Monday': '24 hours',
          'Tuesday': '24 hours',
          'Wednesday': '24 hours',
          'Thursday': '24 hours',
          'Friday': '24 hours',
          'Saturday': '24 hours',
          'Sunday': '24 hours'
        },
        coordinates: { lat: 37.8199, lng: -122.4783 },
        features: [
          'Pedestrian Walkway',
          'Bicycle Lane',
          'Vista Points',
          'Gift Shop',
          'Parking',
          'Restrooms'
        ],
        reviews_data: [
          {
            id: '1',
            user: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 5,
            date: '2 weeks ago',
            comment: 'Absolutely breathtaking views! The bridge is even more impressive in person. Make sure to walk across if the weather is nice.'
          },
          {
            id: '2',
            user: 'Michael Chen',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 4,
            date: '1 month ago',
            comment: 'Great experience but very crowded during weekends. I recommend visiting early in the morning for the best photos.'
          },
          {
            id: '3',
            user: 'Emma Wilson',
            avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
            rating: 5,
            date: '3 months ago',
            comment: 'One of the most iconic landmarks in the world. The engineering is impressive and the views of the city are unmatched.'
          }
        ]
      };
      
      setPlace(mockPlace);
      setIsLoading(false);
    }, 1500);
  }, [id]);

  const handlePrevImage = () => {
    if (!place) return;
    setActiveImageIndex((prev) => (prev === 0 ? place.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!place) return;
    setActiveImageIndex((prev) => (prev === place.images.length - 1 ? 0 : prev + 1));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-600/80 text-white';
      case 'Moderate': return 'bg-yellow-400/80 text-white';
      case 'High': return 'bg-red-500/80 text-white';
      default: return 'bg-blue-500/50 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center">
          <Compass className="w-8 h-8 text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">GeoGuide AI</h1>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
        >
          Explore Map
        </button>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to recommendations</span>
        </button>

        {isLoading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-80 bg-white/10 rounded-2xl" />
            <div className="h-12 bg-white/10 rounded-xl w-3/4" />
            <div className="h-6 bg-white/10 rounded-lg w-full" />
            <div className="h-6 bg-white/10 rounded-lg w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-white/10 rounded-xl" />
              <div className="h-32 bg-white/10 rounded-xl" />
            </div>
          </div>
        ) : place ? (
          <div className="space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden h-[500px] group">
              <motion.img
                key={activeImageIndex}
                src={place.images[activeImageIndex]}
                alt={place.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl font-bold text-white mb-2">{place.name}</h1>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400" fill="#facc15" />
                    <span className="font-medium">{place.rating}</span>
                    <span className="text-white/60">({place.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>{place.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleFavorite}
                  className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              
              <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevImage}
                  className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.button>
              </div>
              
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextImage}
                  className="p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              </div>
              
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex space-x-2">
                {place.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeImageIndex ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-4">About</h2>
                  <p className="text-white/80 leading-relaxed">{place.longDescription}</p>
                </motion.div>
                
                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Features</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {place.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Reviews */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Reviews</h2>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400" fill="#facc15" />
                      <span className="text-white font-medium">{place.rating}</span>
                      <span className="text-white/60">({place.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {place.reviews_data.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="border-b border-white/10 pb-6 last:border-none last:pb-0"
                      >
                        <div className="flex items-start space-x-4">
                          <img 
                            src={review.avatar} 
                            alt={review.user} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-white">{review.user}</h3>
                              <span className="text-white/60 text-sm">{review.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-white/30'}`}
                                  fill={i < review.rating ? '#facc15' : 'none'}
                                />
                              ))}
                            </div>
                            <p className="text-white/80">{review.comment}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Write a Review</span>
                  </motion.button>
                </motion.div>
              </div>
              
              {/* Right Column - Info & Actions */}
              <div className="space-y-6">
                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6"
                >
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                      <div className="flex items-center space-x-1 text-white/80 text-sm mb-1">
                        <Navigation2 className="w-4 h-4 text-blue-400" />
                        <span>Distance</span>
                      </div>
                      <p className="text-white font-medium">{place.distance} km</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                      <div className="flex items-center space-x-1 text-white/80 text-sm mb-1">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>Travel Time</span>
                      </div>
                      <p className="text-white font-medium">{place.travelTime} min</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCrowdLevelColor(place.crowdLevel)}`}>
                        <Users className="w-3 h-3" />
                        <span>{place.crowdLevel} Crowd</span>
                      </div>
                      <div className="px-3 py-1 bg-purple-500/50 rounded-full text-xs font-medium text-white">
                        {place.popularity}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Navigation2 className="w-5 h-5" />
                      <span>Get Directions</span>
                    </motion.button>
                  </div>
                </motion.div>
                
                {/* Contact & Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/80 text-sm mb-1">Address</p>
                        <p className="text-white">{place.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/80 text-sm mb-1">Phone</p>
                        <a href={`tel:${place.phone}`} className="text-white hover:text-blue-400 transition-colors">
                          {place.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/80 text-sm mb-1">Website</p>
                        <a 
                          href={place.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-white hover:text-blue-400 transition-colors"
                        >
                          {place.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white/80 text-sm">Opening Hours</p>
                          <button 
                            onClick={() => setShowAllHours(!showAllHours)}
                            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                          >
                            {showAllHours ? 'Show Less' : 'Show All'}
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {showAllHours ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-1"
                            >
                              {Object.entries(place.openingHours).map(([day, hours]) => (
                                <div key={day} className="flex justify-between text-sm">
                                  <span className="text-white/70">{day}</span>
                                  <span className="text-white">{hours}</span>
                                </div>
                              ))}
                            </motion.div>
                          ) : (
                            <p className="text-white">
                              {place.openingHours['Monday']}
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Weather & Best Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-6"
                >
                  <h2 className="text-xl font-bold text-white mb-4">Best Time to Visit</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Recommended Time</span>
                      </div>
                      <span className="text-white font-medium">Morning</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Least Crowded</span>
                      </div>
                      <span className="text-white font-medium">Weekdays</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-5 h-5 text-purple-400" />
                        <span className="text-white">Best for Photos</span>
                      </div>
                      <span className="text-white font-medium">Sunset</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Info className="w-16 h-16 text-white/50 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Place Not Found</h2>
            <p className="text-white/70 text-center">
              The place you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={handleGoBack}
              className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}