import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Camera, Mic, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceSearch } from './VoiceSearch';

interface SearchBarProps {
  onSearch: (query: string) => void;
  results: any[];
  onSelect: (location: any) => void;
  onVoiceSearch?: (text: string) => void;
}

export function SearchBar({ onSearch, results, onSelect, onVoiceSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (value.length > 2) {
      setIsSearching(true);
      
      // Set a new timeout to delay the search
      const timeout = setTimeout(() => {
        onSearch(value);
        setIsSearching(false);
      }, 500);
      
      setSearchTimeout(timeout);
    }
  };

  const handleSelect = (result: any) => {
    onSelect(result);
    setQuery('');
    setIsExpanded(false);
  };

  const handleVoiceResult = (text: string) => {
    setQuery(text);
    setIsSearching(true);
    
    // Set a timeout to simulate processing
    setTimeout(() => {
      onSearch(text);
      setIsSearching(false);
      if (onVoiceSearch) {
        onVoiceSearch(text);
      }
    }, 500);
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="absolute top-20 left-8 z-[1000]">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ width: 48, opacity: 0 }}
            animate={{ width: 480, opacity: 1 }}
            exit={{ width: 48, opacity: 0 }}
            className="relative"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search for places, addresses, or coordinates"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-6 py-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              />
              <div className="absolute right-3 flex items-center space-x-2">
                {isSearching ? (
                  <Loader className="w-5 h-5 text-white/70 animate-spin" />
                ) : query ? (
                  <button 
                    onClick={handleClearSearch}
                    className="p-3 rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                ) : (
                  <VoiceSearch onVoiceResult={handleVoiceResult} />
                )}
                <button className="p-3 rounded-full hover:bg-white/10 transition-all duration-300">
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="p-3 rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-lg"
                >
                  {results.map((result, index) => (
                    <motion.button
                      key={index}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 transition-all duration-200 border-b border-white/10 last:border-none"
                      onClick={() => handleSelect(result)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <p className="font-medium text-white">{result.display_name.split(',')[0]}</p>
                      <p className="text-sm text-white/60 truncate">{result.display_name}</p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={toggleSearch}
            className="p-4 bg-blue-600/80 backdrop-blur-md rounded-full text-white hover:bg-blue-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Search className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}