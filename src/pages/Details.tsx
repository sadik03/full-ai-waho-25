import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Clock,
  MapPin,
  Star,
  Plane,
  Hotel,
  ChevronDown,
  ChevronUp,
  Edit,
  ArrowLeft,
  ImageIcon,
  Car,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import { CustomizePanel } from "@/components/CustomizePanel";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/fonts.css";
import { supabase } from "../config/supabaseConfig";

// Function to get attraction image by name - now uses database
const getAttractionImage = async (attractionName) => {
  if (!attractionName) return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center";
  
  try {
    const { data: attractions } = await supabase
      .from('attractions')
      .select('image_url')
      .ilike('attraction', `%${attractionName}%`)
      .limit(1);
    
    return attractions?.[0]?.image_url || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center";
  } catch (error) {
    console.error('Error fetching attraction image:', error);
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center";
  }
};

// Component to handle async image loading
const AttractionImage = ({ attractionName, className }: { attractionName: string; className?: string }) => {
  const [imageSrc, setImageSrc] = useState("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&crop=center");
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

export default function Details() {

  const navigate = useNavigate();
  const [expandedDays, setExpandedDays] = useState({});
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [headerTitle, setHeaderTitle] = useState("Loading...");
  const [headerSubtitle, setHeaderSubtitle] = useState("Getting your itinerary ready...");
  const [headerImage, setHeaderImage] = useState(
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop&crop=center"
  );
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [budget, setBudget] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [expandedHotelCard, setExpandedHotelCard] = useState(null);
  const [expandedTransportCard, setExpandedTransportCard] = useState(null);
  const [hotelData, setHotelData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [attractionsData, setAttractionsData] = useState([]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hotels
        const { data: hotels, error: hotelError } = await supabase
          .from('hotels')
          .select('*');
        
        if (hotelError) {
          console.error('Error fetching hotels:', hotelError);
        } else {
          setHotelData(hotels || []);
        }

        // Fetch transport
        const { data: transport, error: transportError } = await supabase
          .from('transport')
          .select('*');
        
        if (transportError) {
          console.error('Error fetching transport:', transportError);
        } else {
          setTransportData(transport || []);
        }

        // Fetch attractions with emirates data
        const { data: attractions, error: attractionsError } = await supabase
          .from('attractions')
          .select('*');
        
        if (attractionsError) {
          console.error('Error fetching attractions:', attractionsError);
        } else {
          setAttractionsData(attractions || []);
          console.log('Loaded attractions from Supabase:', attractions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Recalculate costs when hotel and transport data are loaded
  useEffect(() => {
    if (hotelData.length > 0 && transportData.length > 0 && itinerary.length > 0) {
      calculateCosts(itinerary);
    }
  }, [hotelData, transportData]);

  // Dynamic content for travel pass section
  const travelPassContent = [
    {
      title: "The Travel Pass",
      description: "Discover the finest experiences your destination has to offer with our exclusive travel pass, granting you entry to popular attractions across the city!"
    },
    {
      title: "Adventure Awaits",
      description: "Unlock unlimited access to breathtaking destinations and create unforgettable memories with our comprehensive travel experience package!"
    },
    {
      title: "Explore More",
      description: "Experience the best of your destination with our curated selection of premium attractions and activities, all included in one convenient pass!"
    },
    {
      title: "Journey Begins",
      description: "Transform your travel dreams into reality with our all-inclusive pass that opens doors to the most spectacular sights and experiences!"
    },
    {
      title: "Ultimate Experience",
      description: "Embark on an extraordinary adventure with unlimited access to top-rated attractions, tours, and activities in your chosen destination!"
    }
  ];

  // Price calculation logic - move to top-level so it's accessible everywhere
  const calculateCosts = (days) => {
    if (!days || !Array.isArray(days)) {
      console.warn('calculateCosts called with invalid days array:', days);
      return;
    }
    
    let total = 0;
    days.forEach(day => {
      if (!day) return;
      
      // Attractions cost
      if (day.attractions && Array.isArray(day.attractions)) {
        day.attractions.forEach(attraction => {
          if (attraction && typeof attraction.price === 'number') {
            total += attraction.price;
          }
        });
      }
            // Hotel cost (extract numeric value from cost range)
      if (day.hotel) {
        try {
          // Handle both string and object hotel formats
          const hotelName = typeof day.hotel === 'object' ? day.hotel.name : day.hotel;
          const hotelObj = hotelData?.find(h => h && h.name === hotelName);
          if (hotelObj && hotelObj.costPerNight && typeof hotelObj.costPerNight === 'string') {
            const costMatch = hotelObj.costPerNight.match(/(\d+)[–-](\d+)/);
            if (costMatch) {
              const avgCost = (parseInt(costMatch[1]) + parseInt(costMatch[2])) / 2;
              total += avgCost;
            } else {
              const singleCost = hotelObj.costPerNight.match(/(\d+)/);
              total += singleCost ? parseInt(singleCost[1]) : 300;
            }
          } else if (day.hotel && typeof day.hotel === 'object' && typeof day.hotel.costPerNight === 'number') {
            total += day.hotel.costPerNight;
          } else {
            total += 300; // Default hotel cost
          }
        } catch (error) {
          console.error('Error processing hotel cost:', error);
          total += 300; // Default hotel cost on error
        }
      }
      // Transport cost (try to get from transportData)
      if (day.transport) {
        try {
          if (typeof day.transport === 'object' && day.transport?.costPerDay) {
            total += day.transport.costPerDay;
          } else if (typeof day.transport === 'string') {
            const transportObj = transportData?.find(t => t && t.label === day.transport);
            total += transportObj?.cost_per_day ? transportObj.cost_per_day : 150;
          } else {
            total += 150; // Default transport cost
          }
        } catch (error) {
          console.error('Error processing transport cost:', error);
          total += 150; // Default transport cost on error
        }
      }
    });
    setTotalCost(total);
    setPriceRange({ min: Math.round(total * 0.8), max: Math.round(total * 1.3) });
  };

  useEffect(() => {
    const savedPackage = localStorage.getItem("selectedPackage");
    const travelFormData = localStorage.getItem("travelFormData");
    if (savedPackage) {
      const parsedPackage = JSON.parse(savedPackage);
      setItinerary(parsedPackage.itinerary);
      setHeaderTitle(parsedPackage.title);
      setHeaderSubtitle(parsedPackage.description);

      // Get budget from travel form
      if (travelFormData) {
        try {
          const parsedForm = JSON.parse(travelFormData);
          setBudget(parsedForm.budget || "Not specified");
        } catch {}
      }

      const collectedImages = parsedPackage.itinerary
        .flatMap((day) => day.images)
        .filter(Boolean);
      setAllImages(collectedImages);

      if (collectedImages.length > 0) {
        setHeaderImage(collectedImages[0]);
      }
      // Initial cost calculation
      calculateCosts(parsedPackage.itinerary);
    } else {
      navigate("/ai-generate");
    }
  }, [navigate]);

  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [allImages]);

  useEffect(() => {
    if (allImages.length > 0) {
      setHeaderImage(allImages[currentImageIndex]);
    }
  }, [currentImageIndex, allImages]);

  const toggleDay = (dayId) => {
    console.log('Toggling day:', dayId);
    setExpandedDays((prev) => {
      const newState = {
        ...prev,
        [dayId]: !prev[dayId]
      };
      console.log('New expanded state:', newState);
      return newState;
    });
  };

  const handleCustomize = (day) => {
    setSelectedDay(day);
    setShowCustomize(true);
  };

  const handleUpdateDay = (updatedDay) => {
    setItinerary((prev) => {
      const updated = prev.map((day) => (day.id === updatedDay.id ? updatedDay : day));
      calculateCosts(updated);
      // Save updated itinerary to localStorage for Summary page
      const savedPackage = localStorage.getItem("selectedPackage");
      if (savedPackage) {
        const parsedPackage = JSON.parse(savedPackage);
        parsedPackage.itinerary = updated;
        localStorage.setItem("selectedPackage", JSON.stringify(parsedPackage));
      }
      return updated;
    });
  };

  // handlers for hotel and transport updates
  const handleHotelUpdate = (dayId, hotelName) => {
    setItinerary((prev) => {
      const updated = prev.map((day) => day.id === dayId ? { ...day, hotel: hotelName } : day);
      calculateCosts(updated);
      // Save updated itinerary to localStorage for Summary page
      const savedPackage = localStorage.getItem("selectedPackage");
      if (savedPackage) {
        const parsedPackage = JSON.parse(savedPackage);
        parsedPackage.itinerary = updated;
        localStorage.setItem("selectedPackage", JSON.stringify(parsedPackage));
      }
      return updated;
    });
    
    // Close the hotel selection dropdown after selection
    setExpandedHotelCard(null);
  };

  const handleTransportUpdate = (dayId, transportName) => {
    setItinerary((prev) => {
      const updated = prev.map((day) => day.id === dayId ? { ...day, transport: transportName } : day);
      calculateCosts(updated);
      // Save updated itinerary to localStorage for Summary page
      const savedPackage = localStorage.getItem("selectedPackage");
      if (savedPackage) {
        const parsedPackage = JSON.parse(savedPackage);
        parsedPackage.itinerary = updated;
        localStorage.setItem("selectedPackage", JSON.stringify(parsedPackage));
      }
      return updated;
    });
    
    // Close the transport selection dropdown after selection
    setExpandedTransportCard(null);
  };

  if (itinerary.length === 0) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-black/20 backdrop-blur-2xl border border-[#AD803B]/20 rounded-3xl p-8">
            <Sparkles className="w-12 h-12 text-[#AD803B] mx-auto mb-4 animate-spin" />
            <p className="text-[#AD803B] text-lg">Loading your detailed itinerary...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundImage: 'url(/18.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#F5F2E9',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Soft Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-stone-50/80 via-white/70 to-stone-100/80 pointer-events-none z-0"></div>
      
      {/* Elegant Decorative Elements - Hidden on mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden md:block">
        <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-stone-300/30 to-stone-400/40 rounded-full backdrop-blur-sm opacity-50"></div>
        <div className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-[#AD803B]/25 to-[#AD803B]/35 rounded-full backdrop-blur-sm opacity-45"></div>
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-stone-200/20 to-stone-300/30 rounded-full opacity-35"></div>
        <div className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-gradient-to-br from-[#AD803B]/25 to-[#AD803B]/35 rounded-full opacity-40"></div>
        
        {/* Subtle decorative lines */}
        <div className="absolute top-1/2 left-1/4 w-40 h-px bg-gradient-to-r from-transparent via-stone-300/25 to-transparent opacity-25"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-px bg-gradient-to-l from-transparent via-[#AD803B]/20 to-transparent opacity-20"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <ProgressBar currentStep={3} />

        <div className="container mx-auto px-4 sm:px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Premium Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              <div className="relative overflow-hidden bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl shadow-slate-500/20 rounded-2xl sm:rounded-3xl">
                <div className="relative h-64 sm:h-80 md:h-96">
                  <motion.img
                    key={currentImageIndex}
                    src={headerImage}
                    alt="Featured destination"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent"></div>
                  
                  {/* Elegant corners - Hidden on mobile */}
                  <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-[#2C3D4F]/40 rounded-tl-3xl hidden sm:block"></div>
                  <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-[#2C3D4F]/40 rounded-tr-3xl hidden sm:block"></div>
                  
                  <div className="absolute inset-0 flex items-end">
                    <div className="p-4 sm:p-8 text-white w-full">
                      <motion.h1 
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-white leading-tight"
                        style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '-0.02em' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        {headerTitle}
                      </motion.h1>
                      <motion.p 
                        className="text-white/90 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                      >
                        {headerSubtitle}
                      </motion.p>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Premium Image Gallery - Hidden on mobile */}
                <div className="hidden md:block p-6 lg:p-8 bg-white/10 backdrop-blur-md">
                  <motion.h3 
                    className="text-lg font-semibold text-[#2C3D4F] mb-6 text-center"
                    style={{ fontFamily: 'HYPE, sans-serif' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    Gallery Highlights
                  </motion.h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {allImages.slice(0, 4).map((image, index) => (
                      <motion.div
                        key={index}
                        className="relative h-24 lg:h-28 rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer group bg-white/10 backdrop-blur-sm border border-white/20"
                        onClick={() => setHeaderImage(image)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -4,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/10 transition-all duration-500"></div>
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#AD803B]/60 rounded-xl lg:rounded-2xl transition-all duration-500"></div>
                        
                        {/* Hover overlay with icon */}
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                        >
                          <div className="bg-white/20 backdrop-blur-md rounded-full p-2 lg:p-3">
                            <ImageIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                          </div>
                        </motion.div>
                        
                        {/* Image number indicator */}
                        <div className="absolute top-1 lg:top-2 right-1 lg:right-2 bg-[#2C3D4F]/50 backdrop-blur-sm text-white text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                          {index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Day-by-Day Timeline */}
            <div className="space-y-4 sm:space-y-6">
              {itinerary.map((day, index) => (
                <motion.div 
                  key={day.id} 
                  className="flex relative z-20"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  {/* Enhanced Timeline - Hidden on mobile */}
                  <div className="relative flex-shrink-0 mr-4 sm:mr-6 hidden sm:block">
                    {/* Elegant timeline line */}
                    <div
                      className="absolute left-1/2 -ml-1.5 top-0 w-3 bg-gradient-to-b from-[#2C3D4F] via-[#1A252F] to-[#0F1419] z-0 transition-all duration-500 ease-in-out rounded-full shadow-md shadow-[#2C3D4F]/30"
                      style={{
                        height: expandedDays[day.id] ? "100%" : "60px",
                      }}
                    />
                    
                    {/* Timeline connector dots */}
                    <div className="absolute left-1/2 -ml-2 w-4 h-4 bg-[#2C3D4F] rounded-full z-10 shadow-sm" style={{ top: '30px' }}></div>
                    {/* Expanded timeline decorations */}
                    {expandedDays[day.id] && (
                      <>
                        <div className="absolute left-1/2 -ml-1.5 w-3 h-3 bg-[#2C3D4F] rounded-full z-10 shadow-sm" style={{ top: '120px' }}></div>
                        <div className="absolute left-1/2 -ml-1.5 w-3 h-3 bg-[#2C3D4F] rounded-full z-10 shadow-sm" style={{ top: '200px' }}></div>
                        <div className="absolute left-1/2 -ml-1.5 w-3 h-3 bg-[#2C3D4F] rounded-full z-10 shadow-sm" style={{ top: '280px' }}></div>
                      </>
                    )}

                    {/* Elegant Day Circle */}
                    <div className="relative z-20 w-16 sm:w-20 h-16 sm:h-20 flex-shrink-0 flex items-center justify-center">
                      <motion.div 
                        className="rounded-full w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-[#2C3D4F] via-[#1A252F] to-[#0F1419] flex items-center justify-center text-white font-bold text-sm sm:text-lg border-2 sm:border-4 border-[#2C3D4F]/20 shadow-lg sm:shadow-xl shadow-[#2C3D4F]/40 relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 25px rgba(44, 62, 80, 0.6)"
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {/* Subtle inner highlight */}
                        <div className="absolute inset-1 sm:inset-2 rounded-full bg-gradient-to-br from-white/20 via-[#2C3D4F]/10 to-transparent"></div>
                        
                        {/* Travel icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-white absolute" />
                        </div>
                        
                        <span className="relative z-10 drop-shadow-lg" style={{ fontFamily: 'HYPE, sans-serif' }}>
                          {index + 1}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Mobile Day Number Badge - Visible only on mobile */}
                  <div className="block sm:hidden absolute top-4 left-4 z-30">
                    <div className="bg-[#2C3D4F] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Enhanced Collapsible Card with Advanced Hover */}
                  <div className="flex-grow w-full">
                    <div 
                      className="bg-stone-50/90 backdrop-blur-xl border border-stone-200/60 shadow-lg sm:shadow-xl shadow-stone-400/20 hover:shadow-stone-400/30 transition-all duration-500 overflow-hidden group relative rounded-lg sm:rounded-2xl"
                      style={{
                        borderRadius: window.innerWidth >= 640 ? '0px 0px 60px 0px' : '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth >= 640) {
                          e.currentTarget.style.borderRadius = '8px';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth >= 640) {
                          e.currentTarget.style.borderRadius = '0px 0px 60px 0px';
                        }
                      }}
                    >
                      {/* Elegant border highlight */}
                      <div className="absolute inset-0 rounded-lg sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-stone-300/15 to-transparent"></div>
                      <details className="group">
                        <summary className="w-full hover:bg-white/20 transition-colors cursor-pointer p-3 sm:p-4 relative list-none [&::-webkit-details-marker]:hidden">
                            <div className="flex flex-col space-y-3">
                              <div className="text-left pl-12 sm:pl-0">
                                <h3 
                                  className="text-base sm:text-lg lg:text-xl font-semibold text-[#1A252F] mb-2 drop-shadow-sm leading-tight"
                                  style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '-0.01em' }}
                                >
                                  {day.title}
                                  {day.attractions && day.attractions.length > 0 && (() => {
                                    console.log(`=== Day ${day.day} Emirates Detection ===`);
                                    console.log('Day attractions:', day.attractions);
                                    
                                    const emirates = [...new Set(day.attractions.map((attr, index) => {
                                      console.log(`Attraction ${index + 1}:`, {
                                        name: attr.name,
                                        emirates: attr.emirates,
                                        emirate: attr.emirate,
                                        location: attr.location,
                                        fullObject: attr
                                      });
                                      
                                      // Priority 1: Direct emirates property from attraction data
                                      if (attr.emirates && attr.emirates !== 'UAE') {
                                        console.log(`✅ Found direct emirates: ${attr.emirates}`);
                                        return attr.emirates;
                                      }
                                      
                                      // Priority 2: Look up in Supabase attractions data
                                      const dbAttraction = attractionsData.find(dbAttr => 
                                        dbAttr.attraction && attr.name && (
                                          dbAttr.attraction.toLowerCase() === attr.name.toLowerCase() ||
                                          attr.name.toLowerCase().includes(dbAttr.attraction.toLowerCase()) ||
                                          dbAttr.attraction.toLowerCase().includes(attr.name.toLowerCase())
                                        )
                                      );
                                      
                                      if (dbAttraction && dbAttraction.emirates && dbAttraction.emirates !== 'UAE') {
                                        console.log(`✅ Found emirates from Supabase: ${dbAttraction.emirates} for ${attr.name}`);
                                        return dbAttraction.emirates;
                                      }
                                      
                                      // Priority 3: Other location properties
                                      if (attr.emirate && attr.emirate !== 'UAE') return attr.emirate;
                                      if (attr.location && attr.location !== 'UAE') return attr.location;
                                      if (attr.city && attr.city !== 'UAE') return attr.city;
                                      if (attr.region && attr.region !== 'UAE') return attr.region;
                                      
                                      // Priority 4: Fallback name-based detection (reduced reliance)
                                      const name = (attr.name || '').toLowerCase();
                                      console.log(`🔍 Fallback name analysis: "${name}"`);
                                      
                                      // Key attractions only for fallback
                                      if (name.includes('burj khalifa')) return 'Dubai';
                                      if (name.includes('dubai mall')) return 'Dubai';
                                      if (name.includes('sheikh zayed') || name.includes('grand mosque')) return 'Abu Dhabi';
                                      if (name.includes('ferrari world')) return 'Abu Dhabi';
                                      if (name.includes('louvre abu dhabi')) return 'Abu Dhabi';
                                      if (name.includes('dubai') && !name.includes('abu dhabi')) return 'Dubai';
                                      if (name.includes('abu dhabi')) return 'Abu Dhabi';
                                      if (name.includes('sharjah')) return 'Sharjah';
                                      if (name.includes('ajman')) return 'Ajman';
                                      if (name.includes('fujairah')) return 'Fujairah';
                                      if (name.includes('ras al khaimah')) return 'Ras Al Khaimah';
                                      if (name.includes('umm al quwain')) return 'Umm Al Quwain';
                                      
                                      console.log(`⚠️ No emirate found in Supabase or fallback for: ${name}`);
                                      return null;
                                    }).filter(Boolean))];
                                    
                                    console.log(`📍 Final emirates for Day ${day.day}:`, emirates);
                                    console.log('=================================');
                                    
                                    return emirates.length > 0 ? (
                                      <span className="text-sm font-medium text-[#AD803B] ml-2">
                                        • {emirates.join(', ')}
                                      </span>
                                    ) : (
                                      <span className="text-sm font-medium text-[#AD803B] ml-2">
                                        • UAE
                                      </span>
                                    );
                                  })()}
                                </h3>
                                <div className="flex flex-wrap gap-2 sm:gap-3 text-[#2C3D4F] mt-1 text-xs sm:text-sm font-medium">
                                  <div className="flex items-center bg-white/40 px-2 py-1 rounded-full backdrop-blur-sm">
                                    <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1 text-[#1A252F]" />
                                    <span className="font-medium text-[#1A252F]">{day.duration}</span>
                                  </div>
                                  <div className="flex items-center bg-white/40 px-2 py-1 rounded-full backdrop-blur-sm">
                                    <MapPin className="w-3 sm:w-4 h-3 sm:h-4 mr-1 text-[#1A252F]" />
                                    <span className="font-medium text-[#1A252F]">{day.attractions?.length || 0} attractions</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-end items-center">
                                <div className="bg-white/30 p-1 rounded-full backdrop-blur-sm group-open:rotate-180 transition-transform duration-300">
                                  <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-[#2C3D4F]" />
                                </div>
                              </div>
                            </div>
                        </summary>

                        <div className="pb-4">
                                <CardContent className="pt-0">
                                  <div className="border-t border-[#AD803B]/30 pt-4 bg-white/60 backdrop-blur-sm rounded-b-2xl sm:rounded-b-3xl">
                                    
                                    <p className="text-[#1A252F] mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm font-medium px-2 sm:px-4">
                                      {day.description}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
                                      {/* Enhanced Attractions Section */}
                                      <div className="lg:col-span-2">
                                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#1A252F] flex items-center bg-gradient-to-r from-[#AD803B]/10 to-[#AD803B]/5 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-[#AD803B]/20">
                                          <MapPin className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-[#AD803B]" />
                                          <span className="text-sm sm:text-base">Attractions & Activities</span>
                                        </h3>
                                        <div className="space-y-2 sm:space-y-3">
                                          {day.attractions?.reduce((unique, attraction, index) => {
                                            const isDuplicate = unique.some(item => 
                                              item.name?.toLowerCase() === attraction.name?.toLowerCase() ||
                                              (item.name === attraction.name && item.type === attraction.type)
                                            );
                                            if (!isDuplicate) {
                                              unique.push(attraction);
                                            }
                                            return unique;
                                          }, []).map((attraction, i) => (
                                            <motion.div 
                                              key={`${day.id}-attraction-${i}-${attraction.name || i}`} 
                                              className="bg-white/90 backdrop-blur-lg border border-[#AD803B]/20 p-3 sm:p-4 hover:border-[#AD803B]/60 hover:shadow-lg transition-all duration-500 shadow-md rounded-lg"
                                              whileHover={{ scale: 1.01, y: -1 }}
                                              transition={{ duration: 0.2 }}
                                            >
                                              <div className="flex gap-3 sm:gap-4">
                                                {/* Left Side - Attraction Image */}
                                                <div className="flex-shrink-0">
                                                  <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
                                                    <AttractionImage
                                                      attractionName={attraction.name}
                                                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                    />
                                                  </div>
                                                </div>
                                                
                                                {/* Right Side - Attraction Details */}
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                                    <h4 className="font-semibold text-[#1A252F] text-sm sm:text-base truncate">
                                                      {attraction.name}
                                                    </h4>
                                                    <Badge className="bg-[#AD803B]/10 text-[#AD803B] border-[#AD803B]/30 font-medium px-2 py-1 text-xs w-fit flex-shrink-0">
                                                      {attraction.duration}
                                                    </Badge>
                                                  </div>
                                                  <p className="text-xs text-[#2C3D4F] mb-2 sm:mb-3 leading-relaxed font-medium">
                                                    {attraction.description}
                                                  </p>
                                                  <div className="flex flex-wrap justify-start items-center gap-2">
                                                    <Badge variant="secondary" className="bg-[#2C3D4F]/10 text-[#2C3D4F] border-[#2C3D4F]/30 font-medium text-xs">
                                                      {attraction.type}
                                                    </Badge>
                                                    {(() => {
                                                      // Get emirate for this specific attraction
                                                      let emirate = null;
                                                      
                                                      // Priority 1: Direct emirates property
                                                      if (attraction.emirates && attraction.emirates !== 'UAE') {
                                                        emirate = attraction.emirates;
                                                      }
                                                      // Priority 2: Supabase lookup
                                                      else {
                                                        const dbAttraction = attractionsData.find(dbAttr => 
                                                          dbAttr.attraction && attraction.name && (
                                                            dbAttr.attraction.toLowerCase() === attraction.name.toLowerCase() ||
                                                            attraction.name.toLowerCase().includes(dbAttr.attraction.toLowerCase()) ||
                                                            dbAttr.attraction.toLowerCase().includes(attraction.name.toLowerCase())
                                                          )
                                                        );
                                                        
                                                        if (dbAttraction && dbAttraction.emirates && dbAttraction.emirates !== 'UAE') {
                                                          emirate = dbAttraction.emirates;
                                                        }
                                                        // Priority 3: Other properties
                                                        else if (attraction.emirate && attraction.emirate !== 'UAE') {
                                                          emirate = attraction.emirate;
                                                        }
                                                        else if (attraction.location && attraction.location !== 'UAE') {
                                                          emirate = attraction.location;
                                                        }
                                                        // Priority 4: Name-based fallback
                                                        else {
                                                          const name = (attraction.name || '').toLowerCase();
                                                          if (name.includes('burj khalifa') || name.includes('dubai mall')) emirate = 'Dubai';
                                                          else if (name.includes('sheikh zayed') || name.includes('ferrari world')) emirate = 'Abu Dhabi';
                                                          else if (name.includes('dubai') && !name.includes('abu dhabi')) emirate = 'Dubai';
                                                          else if (name.includes('abu dhabi')) emirate = 'Abu Dhabi';
                                                          else if (name.includes('sharjah')) emirate = 'Sharjah';
                                                          else if (name.includes('ajman')) emirate = 'Ajman';
                                                          else if (name.includes('fujairah')) emirate = 'Fujairah';
                                                          else if (name.includes('ras al khaimah')) emirate = 'Ras Al Khaimah';
                                                        }
                                                      }
                                                      
                                                      return emirate ? (
                                                        <Badge className="bg-[#AD803B]/10 text-[#AD803B] border-[#AD803B]/30 font-medium text-xs">
                                                          📍 {emirate}
                                                        </Badge>
                                                      ) : null;
                                                    })()}
                                                  </div>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )) || (
                                            <p className="text-[#2C3D4F] text-xs sm:text-sm font-medium bg-white/70 p-3 rounded-lg">No attractions planned for this day.</p>
                                          )}
                                        </div>
                                      </div>

                                      {/* Right Side - Service Cards */}
                                      <div className="space-y-3 sm:space-y-4">
                                        {/* Enhanced Accommodation Card with Selection Dropdown */}
                                        <div className="bg-white/90 backdrop-blur-lg border border-[#AD803B]/20 rounded-lg sm:rounded-xl shadow-md">
                                          <Collapsible 
                                            open={expandedHotelCard === day.id}
                                            onOpenChange={(isOpen) => {
                                              setExpandedHotelCard(isOpen ? day.id : null);
                                            }}
                                          >
                                            <CollapsibleTrigger className="w-full">
                                              <div className="p-3 sm:p-4 hover:bg-white/50 transition-colors cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center">
                                                    <Hotel className="w-4 sm:w-5 h-4 sm:h-5 text-[#AD803B] mr-2 sm:mr-3" />
                                                    <div className="text-left">
                                                      <h4 className="font-semibold text-[#1A252F] text-xs sm:text-sm">Accommodation</h4>
                                                      <p className="text-xs text-[#2C3D4F]">
                                                        {typeof day.hotel === 'object' && day.hotel?.name 
                                                          ? day.hotel.name 
                                                          : day.hotel || "Select Hotel"
                                                        }
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 text-[#2C3D4F]" />
                                                </div>
                                              </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                              <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-[#AD803B]/20 p-3 sm:p-4 bg-white/30"
                                              >
                                                {/* Hotel Selection Dropdown */}
                                                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                                  <h5 className="text-xs font-semibold text-[#2C3D4F] mb-2">Choose Hotel:</h5>
                                                  <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-2">
                                                    {hotelData?.map((hotel, hotelIndex) => (
                                                      <motion.div
                                                        key={`hotel-${hotelIndex}`}
                                                        className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                                                          (typeof day.hotel === 'object' ? day.hotel?.name : day.hotel) === hotel.name 
                                                            ? 'bg-[#AD803B]/20 border-[#AD803B]/50 shadow-md' 
                                                            : 'bg-white/50 border-[#AD803B]/20 hover:bg-[#AD803B]/10 hover:border-[#AD803B]/40'
                                                        }`}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleHotelUpdate(day.id, hotel.name);
                                                        }}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                      >
                                                        <div className="flex justify-between items-start">
                                                          <div className="flex-1">
                                                            <h6 className="font-semibold text-[#1A252F] text-xs">{hotel.name}</h6>
                                                            {/* <p className="text-xs text-[#2C3D4F] mt-1">{hotel.location}</p> */}
                                                            <div className="flex items-center mt-1">
                                                              {[...Array(hotel.stars || 5)].map((_, i) => (
                                                                <Star key={`hotel-${hotel.id || hotelIndex}-star-${i}`} className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-[#AD803B] fill-current" />
                                                              ))}
                                                            </div>
                                                          </div>
                                                          <div className="text-right ml-2">
                                                            <p className="text-xs font-semibold text-[#AD803B]">
                                                              ${hotel.costPerNight || 200}/night
                                                            </p>
                                                            {/* <Badge className="bg-[#AD803B]/10 text-[#AD803B] border-[#AD803B]/30 text-xs mt-1">
                                                              {hotel.type || "Premium"}
                                                            </Badge> */}
                                                          </div>
                                                        </div>
                                                        {/* <div className="mt-2 flex flex-wrap gap-1">
                                                          {(hotel.amenities || ["WiFi", "Pool", "Gym"]).slice(0, 3).map((amenity, i) => (
                                                            <span key={`hotel-${hotel.id || hotelIndex}-amenity-${i}-${amenity}`} className="text-xs bg-[#2C3D4F]/10 text-[#2C3D4F] px-1.5 py-0.5 rounded">
                                                              {amenity}
                                                            </span>
                                                          ))}
                                                        </div> */}
                                                      </motion.div>
                                                    ))}
                                                  </div>
                                                </div>

                                                {/* Current Hotel Info (if selected) */}
                                                {((typeof day.hotel === 'object' && day.hotel?.name) || day.hotel) && (
                                                  <div className="border-t border-[#AD803B]/20 pt-3">
                                                    <div className="space-y-2">
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-[#2C3D4F]">Selected:</span>
                                                        <span className="text-xs font-semibold text-[#AD803B]">
                                                          {typeof day.hotel === 'object' && day.hotel?.name 
                                                            ? day.hotel.name 
                                                            : day.hotel
                                                          }
                                                        </span>
                                                      </div>
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-[#2C3D4F]">Rating:</span>
                                                        <div className="flex items-center">
                                                          {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star key={`rating-star-${star}`} className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-[#AD803B] fill-current" />
                                                          ))}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </motion.div>
                                            </CollapsibleContent>
                                          </Collapsible>
                                        </div>

                                        {/* Enhanced Transportation Card with Selection Dropdown */}
                                        <div className="bg-white/90 backdrop-blur-lg border border-[#AD803B]/20 rounded-lg sm:rounded-xl shadow-md">
                                          <Collapsible
                                            open={expandedTransportCard === day.id}
                                            onOpenChange={(isOpen) => {
                                              setExpandedTransportCard(isOpen ? day.id : null);
                                            }}
                                          >
                                            <CollapsibleTrigger className="w-full">
                                              <div className="p-3 sm:p-4 hover:bg-white/50 transition-colors cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center">
                                                    <Car className="w-4 sm:w-5 h-4 sm:h-5 text-[#AD803B] mr-2 sm:mr-3" />
                                                    <div className="text-left">
                                                      <h4 className="font-semibold text-[#1A252F] text-xs sm:text-sm">Transportation</h4>
                                                      <p className="text-xs text-[#2C3D4F]">
                                                        {typeof day.transport === 'object' && day.transport?.type 
                                                          ? day.transport.type 
                                                          : day.transport || "Select Transport"
                                                        }
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 text-[#2C3D4F]" />
                                                </div>
                                              </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                              <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-[#AD803B]/20 p-3 sm:p-4 bg-white/30"
                                              >
                                                {/* Transport Selection Dropdown */}
                                                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                                  <h5 className="text-xs font-semibold text-[#2C3D4F] mb-2">Choose Transportation:</h5>
                                                  <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-2">
                                                    {transportData?.map((transport) => (
                                                      <motion.div
                                                        key={transport.id}
                                                        className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                                                          (typeof day.transport === 'object' ? day.transport?.type : day.transport) === transport.label 
                                                            ? 'bg-[#AD803B]/20 border-[#AD803B]/50 shadow-md' 
                                                            : 'bg-white/50 border-[#AD803B]/20 hover:bg-[#AD803B]/10 hover:border-[#AD803B]/40'
                                                        }`}
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleTransportUpdate(day.id, transport.label);
                                                        }}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                      >
                                                        <div className="flex justify-between items-start">
                                                          <div className="flex-1">
                                                            <h6 className="font-semibold text-[#1A252F] text-xs">{transport.label}</h6>
                                                            <p className="text-xs text-[#2C3D4F] mt-1">{transport.description || "Premium transport service"}</p>
                                                            <div className="flex items-center mt-1">
                                                              <Badge variant="secondary" className="bg-[#2C3D4F]/10 text-[#2C3D4F] border-[#2C3D4F]/30 text-xs">
                                                                {transport.category || "Standard"}
                                                              </Badge>
                                                            </div>
                                                          </div>
                                                          <div className="text-right ml-2">
                                                            <p className="text-xs font-semibold text-[#AD803B]">
                                                              AED {transport.cost_per_day || 150}/day
                                                            </p>
                                                            <span className="text-xs text-[#2C3D4F]">{transport.duration || "Full Day"}</span>
                                                          </div>
                                                        </div>
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                          {(transport.features || ["Driver", "Fuel", "Insurance"]).slice(0, 3).map((feature, i) => (
                                                            <span key={`transport-${transport.id}-feature-${i}-${feature}`} className="text-xs bg-[#2C3D4F]/10 text-[#2C3D4F] px-1.5 py-0.5 rounded">
                                                              {feature}
                                                            </span>
                                                          ))}
                                                        </div>
                                                      </motion.div>
                                                    ))}
                                                  </div>
                                                </div>

                                                {/* Current Transport Info (if selected) */}
                                                {((typeof day.transport === 'object' && day.transport?.type) || day.transport) && (
                                                  <div className="border-t border-[#AD803B]/20 pt-3">
                                                    <div className="space-y-2">
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-[#2C3D4F]">Selected:</span>
                                                        <span className="text-xs font-semibold text-[#AD803B]">
                                                          {typeof day.transport === 'object' && day.transport?.type 
                                                            ? day.transport.type 
                                                            : day.transport
                                                          }
                                                        </span>
                                                      </div>
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-[#2C3D4F]">Duration:</span>
                                                        <Badge className="bg-[#AD803B]/10 text-[#AD803B] border-[#AD803B]/30 text-xs">
                                                          Full Day
                                                        </Badge>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </motion.div>
                                            </CollapsibleContent>
                                          </Collapsible>
                                        </div>

                                        {/* Simplified Customize Options Card */}
                                        <div className="bg-white/90 backdrop-blur-lg border border-[#2C3D4F]/20 rounded-lg sm:rounded-xl shadow-md">
                                          <div className="p-3 sm:p-4 hover:bg-white/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center">
                                                <Edit className="w-4 sm:w-5 h-4 sm:h-5 text-[#2C3D4F] mr-2 sm:mr-3" />
                                                <div className="text-left">
                                                  <h4 className="font-semibold text-[#1A252F] text-xs sm:text-sm">Customize Attractions</h4>
                                                  <p className="text-xs text-[#2C3D4F]">Modify day activities</p>
                                                </div>
                                              </div>
                                              <motion.button
                                                onClick={() => handleCustomize(day)}
                                                className="bg-[#2C3D4F]/10 hover:bg-[#2C3D4F]/20 border border-[#2C3D4F]/30 text-[#2C3D4F] font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 text-xs sm:text-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                              >
                                                Edit
                                              </motion.button>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Day Summary Card */}
                                        <div className="bg-gradient-to-br from-[#AD803B]/5 to-[#AD803B]/10 border border-[#AD803B]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
                                          <h4 className="font-semibold mb-2 sm:mb-3 text-[#1A252F] flex items-center text-xs sm:text-sm">
                                            <Calendar className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-[#AD803B]" />
                                            Day Summary
                                          </h4>
                                          <div className="space-y-1.5 sm:space-y-2 text-xs">
                                            <div className="flex justify-between text-[#2C3D4F] font-medium">
                                              <span>Duration:</span>
                                              <span className="text-[#AD803B] font-semibold">{day.duration || "Full Day"}</span>
                                            </div>
                                            <div className="flex justify-between text-[#2C3D4F] font-medium">
                                              <span>Activities:</span>
                                              <span className="text-[#AD803B] font-semibold">{day.attractions?.length || 0} planned</span>
                                            </div>
                                            <div className="flex justify-between text-[#2C3D4F] font-medium">
                                              <span>Hotel:</span>
                                              <span className="text-[#AD803B] font-semibold">
                                                {((typeof day.hotel === 'object' && day.hotel?.name) || day.hotel) ? "Selected" : "Not set"}
                                              </span>
                                            </div>
                                            <div className="flex justify-between text-[#2C3D4F] font-medium">
                                              <span>Transport:</span>
                                              <span className="text-[#AD803B] font-semibold">
                                                {((typeof day.transport === 'object' && day.transport?.type) || day.transport) ? "Selected" : "Not set"}
                                              </span>
                                            </div>
                                            <div className="flex justify-between text-[#2C3D4F] font-medium">
                                              <span>Status:</span>
                                              <Badge className="bg-green-100 text-green-700 border-green-300 font-medium px-2 py-1 text-xs">
                                                Confirmed
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                        </div>
                      </details>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Summary Card with Image Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative min-h-[400px]">
                  {/* Full Width Background Image */}
                  <div className="absolute inset-0">
                    <div className="relative w-full h-full overflow-hidden">
                      {allImages.length > 0 && (
                        <motion.img
                          key={currentImageIndex}
                          src={allImages[currentImageIndex] || headerImage}
                          alt="Travel destination"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 1 }}
                        />
                      )}
                      {/* Black Overlay */}
                      <div className="absolute inset-0 bg-black/50"></div>
                    </div>
                  </div>

                  {/* Overlay Content Section - Positioned over the image */}
                  <div className="relative z-10 flex items-center justify-end min-h-[400px]">
                    <div className="w-full sm:w-2/3 lg:w-3/5 m-4 sm:m-6 lg:m-8 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-[#2C3D4F] via-[#2C3D4F] to-[#2C3D4F] rounded-2xl relative shadow-2xl">
                      {/* Background pattern overlay */}
                      <div className="absolute inset-0 opacity-10 rounded-2xl">
                        <div className="w-full h-full" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />
                      </div>
                      
                      <div className="relative z-10 space-y-4 sm:space-y-6">
                        <motion.h3 
                          key={`title-${currentImageIndex}`}
                          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 leading-tight"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {travelPassContent[currentImageIndex % travelPassContent.length]?.title || "The Travel Pass"}
                        </motion.h3>
                        
                        <motion.p 
                          key={`desc-${currentImageIndex}`}
                          className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed font-medium"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          {travelPassContent[currentImageIndex % travelPassContent.length]?.description || "Discover the finest experiences your destination has to offer with our exclusive travel pass, granting you entry to popular attractions across the city!"}
                        </motion.p>
                        
                        <div className="pt-4 sm:pt-6 flex justify-end items-end">
                          <Button
                            className="bg-white text-[#2C3D4F] hover:bg-gray-50 font-bold px-8 sm:px-12 py-4 sm:py-6 rounded-full shadow-xl transition-all duration-300 text-lg sm:text-xl group hover:scale-105"
                            onClick={() => navigate("/summary")}
                          >
                            Summary
                            <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6 ml-3 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Customize Panel */}
        <CustomizePanel
          isOpen={showCustomize}
          onClose={() => setShowCustomize(false)}
          selectedDay={selectedDay}
          onUpdate={handleUpdateDay}
        />
      </div>
    </div>
  );
}
