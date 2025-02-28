import React, { useState, useEffect } from 'react';
import { MapPin, Navigation2, Info, X, Share2, Clock, Users, Star, ExternalLink, Camera, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocialShareModal } from './SocialShareModal';
import { format } from 'date-fns';

interface LocationDetails {
  photos?: string[];
  openingHours?: {
    [key: string]: string;
  };
  rating?: number;
  reviews?: number;
  website?: string;
  phoneNumber?: string;
  crowdLevel?: 'Low' | 'Moderate' | 'High';
}

interface LocationInfoBoxProps {
  location: any;
  onGetDirections: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function LocationInfoBox({ location, onGetDirections, onClose, isLoading = false }: LocationInfoBoxProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [details, setDetails] = useState<LocationDetails | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (location) {
      // Simulate fetching additional details
      // In a real app, this would be an API call
      fetchLocationDetails();
    }
  }, [location]);

  const fetchLocationDetails = async () => {
    // Simulated API response
    const mockDetails: LocationDetails = {
      photos: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1564507592168-c60657eea523?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1564507592432-c60657eea523?auto=format&fit=crop&q=80&w=800'
      ],
      openingHours: {
        'Monday': '9:00 AM - 6:00 PM',
        'Tuesday': '9:00 AM - 6:00 PM',
        'Wednesday': '9:00 AM - 6:00 PM',
        'Thursday': '9:00 AM - 6:00 PM',
        'Friday': '9:00 AM - 8:00 PM',
        'Saturday': '10:00 AM - 6:00 PM',
        'Sunday': 'Closed'
      },
      rating: 4.5,
      reviews: 128,
      website: 'https://example.com',
      phoneNumber: '+1 (555) 123-4567',
      crowdLevel: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Moderate' | 'High'
    };

    setDetails(mockDetails);
  };

  if (!location) return null;

  const locationName = location.display_name.split(',')[0];
  const fullAddress = location.display_name;

  const handlePhotoNavigation = (direction: 'prev' | 'next') => {
    if (!details?.photos) return;
    
    if (direction === 'prev') {
      setActivePhotoIndex(prev => 
        prev === 0 ? details.photos!.length - 1 : prev - 1
      );
    } else {
      setActivePhotoIndex(prev => 
        prev === details.photos!.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`absolute bottom-24 left-8 z-[1000] w-80 md:w-96 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl transition-all duration-300 ${
          isExpanded ? 'h-[80vh]' : ''
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{locationName}</h3>
              <p className="text-white/70 text-sm line-clamp-2">{fullAddress}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Photo Gallery */}
          {details?.photos && (
            <div className="relative mb-4 rounded-xl overflow-hidden">
              <motion.img
                key={activePhotoIndex}
                src={details.photos[activePhotoIndex]}
                alt={`${locationName} photo ${activePhotoIndex + 1}`}
                className="w-full h-48 object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Photo Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {details.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePhotoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activePhotoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Add Photo Button */}
              <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all duration-300">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Rating and Reviews */}
          {details?.rating && (
            <div className="flex items-center space-x-4 mb-4 bg-white/5 rounded-xl p-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">{details.rating}</span>
              </div>
              <span className="text-white/60 text-sm">{details.reviews} reviews</span>
              {details.crowdLevel && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">{details.crowdLevel}</span>
                </div>
              )}
            </div>
          )}

          {/* Opening Hours */}
          {details?.openingHours && (
            <div className="mb-4 bg-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Opening Hours</span>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>
              
              <AnimatePresence>
                {isExpanded ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-1"
                  >
                    {Object.entries(details.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-white/70">{day}</span>
                        <span className="text-white">{hours}</span>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-white/70 text-sm">
                    {details.openingHours[format(new Date(), 'EEEE')]}
                  </p>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Contact Information */}
          {(details?.website || details?.phoneNumber) && (
            <div className="mb-4 space-y-2">
              {details.website && (
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Visit Website</span>
                </a>
              )}
              {details.phoneNumber && (
                <a
                  href={`tel:${details.phoneNumber}`}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{details.phoneNumber}</span>
                </a>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={onGetDirections}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 bg-blue-600/80 hover:bg-blue-700/80 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
              }`}
            >
              <Navigation2 className="w-4 h-4" />
              <span>{isLoading ? 'Loading...' : 'Get Directions'}</span>
            </button>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 transform hover:scale-105">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        location={{
          name: locationName,
          description: fullAddress,
          image: details?.photos?.[0]
        }}
      />
    </>
  );
}