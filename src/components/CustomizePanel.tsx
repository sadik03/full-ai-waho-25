import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Star, DollarSign, Filter, Search, Plus, Minus, Sparkles, AlertCircle, Heart, Camera, Check, ArrowRight, Users, Calendar, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "../config/supabaseConfig";

// Function to get attraction image by name - now uses database
const getAttractionImage = async (attractionName) => {
  if (!attractionName) return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop&crop=center";
  
  try {
    const { data: attractions } = await supabase
      .from('attractions')
      .select('image_url')
      .ilike('attraction', `%${attractionName}%`)
      .limit(1);
    
    return attractions?.[0]?.image_url || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop&crop=center";
  } catch (error) {
    console.error('Error fetching attraction image:', error);
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop&crop=center";
  }
};

// Component to handle async image loading
const AttractionImage = ({ attractionName, className }: { attractionName: string; className?: string }) => {
  const [imageSrc, setImageSrc] = useState("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop&crop=center");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageUrl = await getAttractionImage(attractionName);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error loading image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (attractionName) {
      loadImage();
    } else {
      setIsLoading(false);
    }
  }, [attractionName]);

  return (
    <img
      src={imageSrc}
      alt={attractionName}
      className={className}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    />
  );
};

interface CustomizePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: any;
  onUpdate: (updatedDay: any) => void;
}

// Toast Component
const Toast = ({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-4 right-4 sm:top-20 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-[60] bg-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-xl backdrop-blur-lg border border-red-400/30 flex items-start gap-3 max-w-sm sm:max-w-md mx-auto sm:mx-0"
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
          <span className="font-medium text-xs sm:text-sm leading-tight">{message}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="ml-auto hover:bg-red-600/50 rounded-full p-1 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function CustomizePanel({ isOpen, onClose, selectedDay, onUpdate }: CustomizePanelProps) {
  const [selectedAttractions, setSelectedAttractions] = useState(selectedDay?.attractions || []);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [attractionsData, setAttractionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [userSelectedEmirates, setUserSelectedEmirates] = useState<string[]>([]);
  const [displayEmiratesText, setDisplayEmiratesText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch attractions data from Supabase
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const { data, error } = await supabase
          .from('attractions')
          .select('*');
        
        if (error) {
          console.error('Error fetching attractions:', error);
          return;
        }
        
        // Transform database format to expected format
        const transformedData = data?.map(attraction => ({
          Attraction: attraction.attraction,
          Emirates: attraction.emirates,
          Price: attraction.price,
          Duration: attraction.duration,
          rating: attraction.rating,
          image_url: attraction.image_url,
          description: attraction.description
        })) || [];
        
        setAttractionsData(transformedData);
      } catch (error) {
        console.error('Error fetching attractions:', error);
      }
    };

    if (isOpen) {
      fetchAttractions();
    }
  }, [isOpen]);

  // Function to convert duration string to hours
  const convertDurationToHours = (duration: string): number => {
    if (!duration) return 0;
    
    const durationStr = duration.toLowerCase();
    
    // Extract numbers from the duration string
    const hourMatch = durationStr.match(/(\d+(?:\.\d+)?)\s*h(?:our)?s?/);
    const minuteMatch = durationStr.match(/(\d+(?:\.\d+)?)\s*m(?:in)?(?:ute)?s?/);
    
    let hours = 0;
    
    if (hourMatch) {
      hours += parseFloat(hourMatch[1]);
    }
    
    if (minuteMatch) {
      hours += parseFloat(minuteMatch[1]) / 60;
    }
    
    // If no specific format found, try to extract just numbers and assume hours
    if (!hourMatch && !minuteMatch) {
      const numberMatch = durationStr.match(/(\d+(?:\.\d+)?)/);
      if (numberMatch) {
        const number = parseFloat(numberMatch[1]);
        // If it's a reasonable number for hours (0.5 to 12), treat as hours
        // If it's a large number (30+), treat as minutes
        if (number >= 30) {
          hours = number / 60; // Assume minutes
        } else {
          hours = number; // Assume hours
        }
      } else {
        // Default durations based on common patterns
        if (durationStr.includes('full day') || durationStr.includes('whole day')) {
          hours = 8;
        } else if (durationStr.includes('half day')) {
          hours = 4;
        } else if (durationStr.includes('morning') || durationStr.includes('afternoon')) {
          hours = 3;
        } else {
          hours = 2; // Default to 2 hours
        }
      }
    }
    
    return Math.max(0.5, hours); // Minimum 30 minutes
  };

  // Function to calculate total hours of selected attractions
  const calculateTotalHours = (attractions: any[] = selectedAttractions): number => {
    return attractions.reduce((total, attr) => {
      return total + convertDurationToHours(attr.duration || "2 hours");
    }, 0);
  };

  // Function to show toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Get user's selected emirates from travel form data
  useEffect(() => {
    const formData = localStorage.getItem("travelFormData");
    if (formData) {
      try {
        const parsedData = JSON.parse(formData);
        const emirates = parsedData.emirates || [];
        setUserSelectedEmirates(emirates);
        
        // Emirate ID to name mapping
        const emirateNameMap = {
          "dubai": "Dubai",
          "abu-dhabi": "Abu Dhabi", 
          "sharjah": "Sharjah",
          "ajman": "Ajman",
          "fujairah": "Fujairah",
          "ras-al-khaimah": "Ras Al Khaimah",
          "umm-al-quwain": "Umm Al Quwain"
        };
        
        if (emirates.includes("all") || emirates.length === 0) {
          setDisplayEmiratesText("All UAE");
        } else if (emirates.length === 1) {
          const emirateName = emirateNameMap[emirates[0]] || emirates[0];
          setDisplayEmiratesText(emirateName);
        } else if (emirates.length === 7) {
          setDisplayEmiratesText("All UAE");
        } else {
          const emirateNames = emirates.map(id => emirateNameMap[id] || id);
          setDisplayEmiratesText(`${emirateNames.join(", ")}`);
        }
      } catch (error) {
        console.error("Error parsing travel form data:", error);
        setUserSelectedEmirates([]);
        setDisplayEmiratesText("All UAE");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedDay) {
      setSelectedAttractions(selectedDay.attractions || []);
    }
  }, [selectedDay]);

  // Filter attractions based on user's selected emirates and search criteria
  useEffect(() => {
    if (!attractionsData || !Array.isArray(attractionsData)) {
      setFilteredAttractions([]);
      return;
    }

    const filtered = attractionsData.filter(attraction => {
      if (!attraction) return false;
      
      const attractionName = attraction.Attraction || "";
      const attractionEmirate = attraction.Emirates || "";
      
      // Enhanced emirate matching logic
      const matchesUserEmirates = userSelectedEmirates.includes("all") || 
        userSelectedEmirates.length === 0 ||
        userSelectedEmirates.some(emirate => {
          // Convert emirate ID to name for comparison
          const emirateNameMap = {
            "dubai": "Dubai",
            "abu-dhabi": "Abu Dhabi", 
            "sharjah": "Sharjah",
            "ajman": "Ajman",
            "fujairah": "Fujairah",
            "ras-al-khaimah": "Ras Al Khaimah",
            "umm-al-quwain": "Umm Al Quwain"
          };
          
          const emirateName = emirateNameMap[emirate] || emirate;
          
          return attractionEmirate.toLowerCase() === emirateName.toLowerCase() ||
                 attractionEmirate.toLowerCase() === emirate.toLowerCase() ||
                 attractionEmirate.toLowerCase().includes(emirateName.toLowerCase()) ||
                 attractionEmirate.toLowerCase().includes(emirate.toLowerCase());
        });
      
      const matchesSearch = !searchTerm ||
        attractionName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "all"; // Since we don't have type data, show all
      
      return matchesUserEmirates && matchesSearch && matchesType;
    });

    console.log(`Filtering attractions: ${userSelectedEmirates.join(', ')} emirates selected, ${filtered.length} attractions found`);
    setFilteredAttractions(filtered);
  }, [searchTerm, selectedType, userSelectedEmirates, attractionsData]);

  const handleAttractionToggle = (attraction: any) => {
    const attractionName = attraction.Attraction || attraction.name;
    const isSelected = selectedAttractions.some((a: any) => a.name === attractionName);
    
    if (isSelected) {
      // Remove attraction
      const newAttractions = selectedAttractions.filter((a: any) => a.name !== attractionName);
      setSelectedAttractions(newAttractions);
    } else {
      // Add attraction
      const newAttraction = {
        name: attractionName,
        price: attraction.Price || attraction.price || 0,
        emirates: attraction.Emirates || attraction.emirate,
        duration: attraction.Duration || attraction.duration || "2 hours",
        type: attraction.Type || attraction.type || "Attraction",
        description: attraction.Description || attraction.description || "No description available"
      };
      
      const newAttractions = [...selectedAttractions, newAttraction];
      const totalHours = calculateTotalHours(newAttractions);
      
      if (totalHours > 8) {
        const currentHours = calculateTotalHours();
        const attractionHours = convertDurationToHours(newAttraction.duration);
        const exceededBy = totalHours - 8;
        
        showToastNotification(
          `Cannot add "${attractionName}". Would exceed 8h limit by ${exceededBy.toFixed(1)}h.`
        );
        return;
      }
      
      setSelectedAttractions(newAttractions);
    }
  };

  const removeAttraction = (index: number) => {
    setSelectedAttractions(selectedAttractions.filter((_: any, i: number) => i !== index));
  };

  const calculateTotalCost = () => {
    return selectedAttractions.reduce((sum: number, attr: any) => sum + (parseFloat(attr.price) || 0), 0);
  };

  const handleSave = () => {
    const updatedDay = {
      ...selectedDay,
      attractions: selectedAttractions
    };
    onUpdate(updatedDay);
    onClose();
  };

  const attractionTypes = filteredAttractions.length > 0 
    ? [...new Set(filteredAttractions.map(a => a.Type || a.type).filter(Boolean))]
    : [];

  const totalHours = calculateTotalHours();
  const remainingHours = Math.max(0, 8 - totalHours);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Toast Notification */}
          <Toast 
            message={toastMessage}
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />

          {/* Professional Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modern Professional Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.8
            }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-6xl z-50 overflow-hidden bg-white shadow-2xl"
          >
            <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
              
              {/* Premium Header with Website Colors */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative bg-gradient-to-r from-[#2C3D4F] via-[#1A252F] to-[#0F1419] text-white p-4 sm:p-6 shadow-lg"
              >
                {/* Header Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='3'/%3E%3Ccircle cx='53' cy='7' r='3'/%3E%3Ccircle cx='7' cy='53' r='3'/%3E%3Ccircle cx='53' cy='53' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }} />
                </div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Compass className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                          Customize Your Journey
                        </h2>
                        <p className="text-blue-100 text-sm font-medium">
                          {selectedDay?.title || `Day ${selectedDay?.day}`} • Perfect Your Itinerary
                        </p>
                      </div>
                    </div>
                    
                    {/* Professional Stats Cards */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/20">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#AD803B]" />
                          <span className="text-xs sm:text-sm font-medium text-white">{displayEmiratesText}</span>
                        </div>
                      </div>
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-white/20">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#AD803B]" />
                          <span className="text-xs sm:text-sm font-medium text-white">{selectedAttractions.length} Selected</span>
                        </div>
                      </div>
                      <div className={`backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border ${
                        totalHours > 8 ? 'bg-red-500/20 border-red-300/50' : 
                        totalHours > 6 ? 'bg-yellow-500/20 border-yellow-300/50' : 
                        'bg-green-500/20 border-green-300/50'
                      }`}>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          <span className="text-xs sm:text-sm font-medium text-white">
                            {totalHours.toFixed(1)}h / 8h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-12 h-12 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-white/30"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Modern Content Layout */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col lg:grid lg:grid-cols-4 gap-0">
                  
                  {/* Professional Sidebar - Mobile: Bottom overlay, Desktop: Side panel */}
                  <div className="order-2 lg:order-1 lg:col-span-1 bg-stone-50/80 backdrop-blur-sm border-t lg:border-t-0 lg:border-r border-stone-200/50 p-3 lg:p-6 overflow-y-auto max-h-48 lg:max-h-full">
                    
                    {/* Mobile-friendly Search & Filters Section */}
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="space-y-3 lg:space-y-6"
                    >
                      <div>
                        <h3 className="text-sm lg:text-lg font-semibold text-[#1A252F] mb-2 lg:mb-4 flex items-center">
                          <Search className="w-3 h-3 lg:w-5 lg:h-5 mr-2 text-[#AD803B]" />
                          <span className="hidden lg:inline">Discover Attractions</span>
                          <span className="lg:hidden">Search</span>
                        </h3>
                        
                        <div className="space-y-2 lg:space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder={`Search ${displayEmiratesText}...`}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 bg-white/80 border-stone-200 focus:border-[#AD803B] focus:ring-2 focus:ring-[#AD803B]/20 rounded-lg h-8 lg:h-12 text-sm lg:text-base text-gray-700 placeholder:text-gray-400"
                            />
                          </div>

                          {attractionTypes.length > 0 && (
                            <Select value={selectedType} onValueChange={setSelectedType}>
                              <SelectTrigger className="bg-white/80 border-stone-200 focus:border-[#AD803B] rounded-lg h-8 lg:h-12 text-sm lg:text-base text-gray-700">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-stone-200 rounded-lg shadow-xl">
                                <SelectItem value="all" className="text-gray-700 hover:bg-[#AD803B]/10">All Categories</SelectItem>
                                {attractionTypes.map(type => (
                                  <SelectItem key={type} value={type} className="text-gray-700 hover:bg-[#AD803B]/10">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>

                      {/* Compact Time Management for Mobile */}
                      <div className="bg-white rounded-lg p-3 lg:p-5 shadow-sm border border-stone-200/50">
                        <h4 className="font-semibold text-[#1A252F] mb-2 lg:mb-4 flex items-center text-sm lg:text-base">
                          <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-2 text-[#AD803B]" />
                          <span className="hidden lg:inline">Time Planning</span>
                          <span className="lg:hidden">Time: {totalHours.toFixed(1)}h/8h</span>
                        </h4>
                        
                        <div className="space-y-2 lg:space-y-3">
                          <div className="lg:flex lg:items-center lg:justify-between hidden">
                            <span className="text-sm font-medium text-gray-600">Available Time:</span>
                            <span className={`text-sm font-bold ${
                              remainingHours <= 1 ? 'text-red-600' : 
                              remainingHours <= 2 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}>
                              {remainingHours.toFixed(1)}h remaining
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (totalHours / 8) * 100)}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-2 lg:h-3 rounded-full ${
                                totalHours > 8 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                                totalHours > 6 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 
                                'bg-gradient-to-r from-[#AD803B] to-yellow-500'
                              }`}
                            />
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1 lg:mt-2 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="hidden lg:inline">Recommended: 6-8 hours per day</span>
                            <span className="lg:hidden">Max: 8h/day</span>
                          </p>
                        </div>
                      </div>

                      {/* Compact Selected Summary for Mobile */}
                      {selectedAttractions.length > 0 && (
                        <div className="bg-gradient-to-br from-[#AD803B]/10 to-[#AD803B]/5 rounded-lg p-3 lg:p-5 border border-[#AD803B]/20">
                          <h4 className="font-semibold text-[#1A252F] mb-2 lg:mb-3 flex items-center text-sm lg:text-base">
                            <Check className="w-3 h-3 lg:w-4 lg:h-4 mr-2 text-[#AD803B]" />
                            <span className="hidden lg:inline">Your Selection</span>
                            <span className="lg:hidden">{selectedAttractions.length} Selected</span>
                          </h4>
                          <div className="space-y-1 lg:space-y-2">
                            <div className="flex justify-between text-xs lg:text-sm">
                              <span className="text-gray-600">Attractions:</span>
                              <span className="font-semibold text-[#AD803B]">{selectedAttractions.length}</span>
                            </div>
                            <div className="flex justify-between text-xs lg:text-sm">
                              <span className="text-gray-600">Total Time:</span>
                              <span className="font-semibold text-[#AD803B]">{totalHours.toFixed(1)}h</span>
                            </div>
                            <div className="flex justify-between text-xs lg:text-sm">
                              <span className="text-gray-600">Estimated Cost:</span>
                              <span className="font-semibold text-[#AD803B]">AED {calculateTotalCost()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Main Content Area */}
                  <div className="order-1 lg:order-2 lg:col-span-3 overflow-y-auto flex-1">
                    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                      
                      {/* Selected Attractions Section */}
                      {selectedAttractions.length > 0 && (
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="bg-white rounded-xl shadow-sm border border-stone-200/50 overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-[#AD803B]/10 to-[#AD803B]/5 px-4 lg:px-6 py-3 lg:py-4 border-b border-[#AD803B]/20">
                            <h3 className="text-base lg:text-lg font-semibold text-[#1A252F] flex items-center">
                              <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-[#AD803B]" />
                              Selected Attractions ({selectedAttractions.length})
                            </h3>
                            <p className="text-sm text-[#AD803B] mt-1">
                              Total duration: {totalHours.toFixed(1)} hours
                            </p>
                          </div>
                          
                          <div className="p-4 lg:p-6">
                            <div className="grid grid-cols-1 gap-3 lg:gap-4">
                              {selectedAttractions.map((attr: any, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: index * 0.1, duration: 0.3 }}
                                  className="bg-gradient-to-r from-[#AD803B]/5 to-[#AD803B]/10 rounded-lg p-3 lg:p-4 border border-[#AD803B]/20 group hover:shadow-md transition-all duration-300"
                                >
                                  <div className="flex gap-3 lg:gap-4">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                      <AttractionImage
                                        attractionName={attr.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-[#1A252F] text-sm lg:text-base truncate pr-2">
                                          {attr.name}
                                        </h4>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => removeAttraction(index)}
                                          className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 transition-colors flex-shrink-0"
                                        >
                                          <X className="w-3 h-3 lg:w-4 lg:h-4" />
                                        </motion.button>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        <Badge className="bg-[#2C3D4F]/10 text-[#2C3D4F] border-[#2C3D4F]/20 text-xs">
                                          {attr.duration || "2 hours"}
                                        </Badge>
                                        {attr.price && (
                                          <Badge className="bg-[#AD803B]/10 text-[#AD803B] border-[#AD803B]/20 text-xs">
                                            AED {attr.price}
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">
                                        {attr.description || "Experience this amazing attraction"}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Available Attractions Grid - Mobile Optimized */}
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-stone-200/50 overflow-hidden"
                      >
                        <div className="bg-gradient-to-r from-[#2C3D4F]/10 to-[#2C3D4F]/5 px-4 lg:px-6 py-3 lg:py-4 border-b border-[#2C3D4F]/20">
                          <h3 className="text-base lg:text-lg font-semibold text-[#1A252F] flex items-center">
                            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-[#2C3D4F]" />
                            Available Attractions in {displayEmiratesText}
                          </h3>
                          <p className="text-sm text-[#2C3D4F] mt-1">
                            {filteredAttractions.length} attractions found
                          </p>
                        </div>
                        
                        <div className="p-4 lg:p-6">
                          {filteredAttractions.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6">
                              {filteredAttractions.map((attraction, index) => {
                                const attractionName = attraction.Attraction;
                                const isSelected = selectedAttractions.some((a: any) => a.name === attractionName);
                                const attractionDuration = attraction.Duration || "2 hours";
                                const attractionHours = convertDurationToHours(attractionDuration);
                                const wouldExceedLimit = !isSelected && (totalHours + attractionHours) > 8;
                                
                                return (
                                  <motion.div
                                    key={attraction.id || index}
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className={`group relative bg-white rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer active:scale-95 ${
                                      wouldExceedLimit 
                                        ? 'border-red-200 bg-red-50/30 cursor-not-allowed opacity-60' :
                                      isSelected 
                                        ? 'border-[#AD803B] bg-[#AD803B]/5 shadow-lg ring-2 ring-[#AD803B]/20' 
                                        : 'border-stone-200 hover:border-[#2C3D4F] hover:shadow-lg hover:ring-2 hover:ring-[#2C3D4F]/20'
                                    }`}
                                    whileHover={wouldExceedLimit ? {} : { y: -2, scale: 1.01 }}
                                    whileTap={wouldExceedLimit ? {} : { scale: 0.98 }}
                                    onClick={() => !wouldExceedLimit && handleAttractionToggle(attraction)}
                                  >
                                    {/* Mobile-optimized Image with better aspect ratio */}
                                    <div className="relative h-32 sm:h-40 lg:h-48 overflow-hidden">
                                      <AttractionImage
                                        attractionName={attractionName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                      
                                      {/* Large Selection Indicator for mobile */}
                                      {isSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute top-2 right-2 w-8 h-8 lg:w-8 lg:h-8 bg-[#AD803B] rounded-full flex items-center justify-center shadow-lg"
                                        >
                                          <Check className="w-4 h-4 lg:w-4 lg:h-4 text-white" />
                                        </motion.div>
                                      )}
                                      
                                      {/* Price Badge */}
                                      {attraction.Price && (
                                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs lg:text-sm font-semibold">
                                          AED {attraction.Price}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Content with better mobile spacing */}
                                    <div className="p-3 lg:p-4">
                                      <h4 className="font-semibold text-[#1A252F] mb-2 line-clamp-2 group-hover:text-[#2C3D4F] transition-colors text-sm lg:text-base leading-tight">
                                        {attractionName}
                                      </h4>
                                      
                                      <div className="flex items-center gap-2 mb-2 lg:mb-3">
                                        <Badge className="bg-[#2C3D4F]/10 text-[#2C3D4F] border-[#2C3D4F]/20 text-xs">
                                          {attractionDuration}
                                        </Badge>
                                        {attraction.Emirates && (
                                          <Badge variant="secondary" className="text-xs bg-stone-100 text-stone-700">
                                            {attraction.Emirates}
                                          </Badge>
                                        )}
                                      </div>
                                      
                                      <p className="text-xs lg:text-sm text-gray-600 line-clamp-2 lg:line-clamp-3 mb-3 lg:mb-4 leading-relaxed">
                                        {attraction.Description || "Discover this amazing attraction and create unforgettable memories."}
                                      </p>
                                      
                                      {/* Action Button - More prominent on mobile */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center text-xs text-gray-500">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {attractionDuration}
                                        </div>
                                        
                                        {!wouldExceedLimit && (
                                          <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`w-9 h-9 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-colors ${
                                              isSelected 
                                                ? 'bg-[#AD803B] text-white' 
                                                : 'bg-[#2C3D4F]/10 text-[#2C3D4F] group-hover:bg-[#2C3D4F] group-hover:text-white'
                                            }`}
                                          >
                                            {isSelected ? <Check className="w-4 h-4 lg:w-4 lg:h-4" /> : <Plus className="w-4 h-4 lg:w-4 lg:h-4" />}
                                          </motion.div>
                                        )}
                                      </div>
                                      
                                      {wouldExceedLimit && (
                                        <div className="mt-2 text-xs text-red-600 font-medium flex items-center">
                                          <AlertCircle className="w-3 h-3 mr-1" />
                                          Would exceed time limit
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <motion.div 
                              className="text-center py-16 text-gray-500"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.4 }}
                            >
                              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-700 mb-2">No attractions found</h4>
                              <p className="text-gray-500 mb-2">
                                No attractions found in {displayEmiratesText}
                                {searchTerm && (
                                  <span> matching "{searchTerm}"</span>
                                )}
                              </p>
                              <p className="text-sm text-gray-400">
                                Try adjusting your search criteria or select different emirates
                              </p>
                              {userSelectedEmirates.length > 0 && !userSelectedEmirates.includes("all") && (
                                <div className="mt-3">
                                  <p className="text-xs text-gray-400 mb-2">Selected Emirates:</p>
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {userSelectedEmirates.map(emirate => {
                                      const emirateNameMap = {
                                        "dubai": "Dubai",
                                        "abu-dhabi": "Abu Dhabi", 
                                        "sharjah": "Sharjah",
                                        "ajman": "Ajman",
                                        "fujairah": "Fujairah",
                                        "ras-al-khaimah": "Ras Al Khaimah",
                                        "umm-al-quwain": "Umm Al Quwain"
                                      };
                                      return (
                                        <Badge key={emirate} variant="outline" className="text-xs">
                                          {emirateNameMap[emirate] || emirate}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Footer */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-white border-t border-gray-200/50 p-6 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-md mx-auto sm:max-w-none">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{selectedAttractions.length} selected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{totalHours.toFixed(1)}h planned</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>${calculateTotalCost()} total</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg flex items-center gap-2 font-semibold"
                    >
                      Save Itinerary
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
