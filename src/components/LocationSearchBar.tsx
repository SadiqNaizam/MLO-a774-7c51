import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // For suggestions container
import { MapPin, Search } from 'lucide-react';

const MOCK_ADDRESSES: string[] = [
  "123 Main St, Anytown, USA",
  "456 Oak Ave, Anytown, USA",
  "789 Pine Ln, Anytown, USA",
  "101 Elm Rd, Otherville, USA",
  "202 Birch Dr, Otherville, USA",
  "303 Maple St, Anytown, USA",
  "404 Cedar Ave, YetAnotherCity, USA",
];

interface LocationSearchBarProps {
  currentLocation?: string;
  onLocationSet: (location: string) => void;
  placeholder?: string;
  className?: string;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  currentLocation,
  onLocationSet,
  placeholder = "Enter your delivery address",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(currentLocation || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  console.log('LocationSearchBar loaded');

  useEffect(() => {
    if (currentLocation && currentLocation !== searchTerm) {
      setSearchTerm(currentLocation);
    }
  }, [currentLocation, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 1) {
      const filteredSuggestions = MOCK_ADDRESSES.filter(address =>
        address.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onLocationSet(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      onLocationSet(searchTerm.trim());
    }
    setSuggestions([]);
    setShowSuggestions(false);
  }, [searchTerm, onLocationSet]);

  const handleUseCurrentLocation = () => {
    // Simulate fetching current location
    const mockGpsLocation = "100 GPS Way, Geolocation City, USA";
    setSearchTerm(mockGpsLocation);
    onLocationSet(mockGpsLocation);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click on suggestion item
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex items-stretch space-x-2"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="w-full text-base md:text-lg p-4 pl-10 rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary"
            aria-label="Delivery address"
          />
        </div>
        <Button 
          type="submit" 
          size="lg"
          className="text-base md:text-lg px-4 py-2 sm:px-6 shadow-sm"
          aria-label="Search for address"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="h-5 w-5 sm:hidden" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="iconlg" // custom size for icon button consistency
          onClick={handleUseCurrentLocation}
          className="p-2.5 md:p-4 shadow-sm"
          aria-label="Use my current location"
        >
          <MapPin className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1.5 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                // Use onMouseDown to trigger before input's onBlur
                onMouseDown={() => handleSuggestionClick(suggestion)} 
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </Card>
      )}
       {currentLocation && !showSuggestions && (
        <p className="mt-2 text-sm text-gray-600">
          Currently set to: <span className="font-semibold">{currentLocation}</span>
        </p>
      )}
    </div>
  );
};

export default LocationSearchBar;