import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@/components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Plus, MapPin, Star, Users, Calendar, Grip, Building, Car,
  Clock, Sparkles, Eye, Settings, Filter, Search,
  Plane, DollarSign, ArrowRight, ChevronDown, X, Check,
  Navigation, Edit3, Trash2, Palette, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AttractionsService, HotelsService, TransportService } from "@/services/supabaseService";
import type { Attraction, Hotel, Transport } from "@/config/supabaseConfig";

export default function ManualPlan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [dayPlans, setDayPlans] = useState<any[]>([]);
  const [availableAttractions, setAvailableAttractions] = useState<any[]>([]);
  const [availableHotels, setAvailableHotels] = useState<any[]>([]);
  const [availableTransports, setAvailableTransports] = useState<any[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmirateFilter, setSelectedEmirateFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("attractions");
  const [loading, setLoading] = useState(true);
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load saved form data
        const savedData = localStorage.getItem('travelFormData');
        if (savedData) {
          const data = JSON.parse(savedData);
          setFormData(data);

          // Initialize day plans
          const days = parseInt(data.tripDuration) || 7;
          const initialDays = Array.from({ length: days }, (_, index) => ({
            id: `day-${index + 1}`,
            day: index + 1,
            title: `Day ${index + 1}`,
            description: "",
            attractions: [],
            hotel: null,
            transport: null,
            duration: "Full Day"
          }));
          setDayPlans(initialDays);
        }

        // Load attractions from database
        const attractions = await AttractionsService.getAllAttractions();
        const transformedAttractions = attractions.map((attr, index) => ({
          id: `attraction-${attr.id}-${index}`,
          name: attr.attraction,
          emirates: attr.emirates,
          duration: attr.duration || "2-3 hours",
          price: attr.price || 0,
          type: "attraction",
          description: attr.description || `Experience the beauty and culture of ${attr.attraction} in ${attr.emirates}`,
          image: attr.image_url || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop",
          category: attr.category
        }));
        setAvailableAttractions(transformedAttractions);
        setFilteredAttractions(transformedAttractions);

        // Load hotels from database
        const hotels = await HotelsService.getAllHotels();
        const transformedHotels = hotels.map((hotel, index) => ({
          id: `hotel-${hotel.id}-${index}`,
          name: hotel.name,
          stars: hotel.stars,
          costPerNight: hotel.price_range_max || 300,
          type: "hotel",
          description: hotel.description || `${hotel.stars}-star luxury accommodation`,
          image: hotel.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
          location: hotel.location
        }));
        setAvailableHotels(transformedHotels);

        // Load transports from database
        const transports = await TransportService.getAllTransport();
        const transformedTransports = transports.map((transport, index) => ({
          id: `transport-${transport.id}-${index}`,
          label: transport.label,
          costPerDay: transport.cost_per_day || 100,
          type: "transport",
          description: transport.description || transport.label,
          image: transport.image_url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop"
        }));
        setAvailableTransports(transformedTransports);

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter attractions
  useEffect(() => {
    let filtered = availableAttractions;

    // First filter by selected emirates from travel form
    if (formData?.emirates && Array.isArray(formData.emirates) && !formData.emirates.includes("all")) {
      filtered = filtered.filter(attr =>
        formData.emirates.some((emirate: string) =>
          attr.emirates.toLowerCase().includes(emirate.toLowerCase())
        )
      );
    }

    // Then apply search and other filters
    if (searchTerm) {
      filtered = filtered.filter(attr =>
        attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.emirates.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEmirateFilter !== "all") {
      filtered = filtered.filter(attr =>
        attr.emirates.toLowerCase().includes(selectedEmirateFilter.toLowerCase())
      );
    }

    if (priceFilter !== "all") {
      if (priceFilter === "free") {
        filtered = filtered.filter(attr => attr.price === 0);
      } else if (priceFilter === "low") {
        filtered = filtered.filter(attr => attr.price > 0 && attr.price <= 100);
      } else if (priceFilter === "medium") {
        filtered = filtered.filter(attr => attr.price > 100 && attr.price <= 300);
      } else if (priceFilter === "high") {
        filtered = filtered.filter(attr => attr.price > 300);
      }
    }

    setFilteredAttractions(filtered);
  }, [availableAttractions, searchTerm, selectedEmirateFilter, priceFilter, formData?.emirates]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;
    const itemId = result.draggableId.split('-')[0] === 'attraction' || result.draggableId.split('-')[0] === 'hotel' || result.draggableId.split('-')[0] === 'transport' ? result.draggableId : result.draggableId.split('-').slice(0, -1).join('-');

    // Handle dropping items into day slots
    if (destinationDroppableId.startsWith("day-")) {
      const dayId = destinationDroppableId.split('-')[0] + '-' + destinationDroppableId.split('-')[1];
      let item = null;

      // Find the item being dragged
      if (sourceDroppableId === "attractions") {
        item = filteredAttractions.find(a => a.id === itemId);
      } else if (sourceDroppableId === "hotels") {
        item = availableHotels.find(h => h.id === itemId);
      } else if (sourceDroppableId === "transports") {
        item = availableTransports.find(t => t.id === itemId);
      } else if (sourceDroppableId.includes("attractions")) {
        // Moving from one day to another
        const sourceDayId = sourceDroppableId.replace("-attractions", "");
        const sourceDay = dayPlans.find(d => d.id === sourceDayId);
        if (sourceDay) {
          item = sourceDay.attractions[source.index];
        }
      }

      if (item) {
        setDayPlans(prev => prev.map(day => {
          // Remove from source day if moving between days
          if (sourceDroppableId.includes("attractions") && sourceDroppableId !== destinationDroppableId) {
            const sourceDayId = sourceDroppableId.replace("-attractions", "");
            if (day.id === sourceDayId) {
              return {
                ...day,
                attractions: day.attractions.filter((_: any, idx: number) => idx !== source.index)
              };
            }
          }

          // Add to destination day
          if (day.id === dayId) {
            if (item.type === "attraction") {
              // Check if attraction is already added
              if (!sourceDroppableId.includes("attractions")) {
                const isAlreadyAdded = day.attractions.some((attr: any) => attr.id === itemId);
                if (isAlreadyAdded) return day;
              }

              const newAttractions = [...day.attractions];
              if (destinationDroppableId.includes("attractions")) {
                newAttractions.splice(destination.index, 0, item);
              } else {
                newAttractions.push(item);
              }
              return {
                ...day,
                attractions: newAttractions
              };
            } else if (item.type === "hotel") {
              return { ...day, hotel: item };
            } else if (item.type === "transport") {
              return { ...day, transport: item };
            }
          }
          return day;
        }));
      }
    }

    // Handle reordering attractions within the same day
    else if (sourceDroppableId === destinationDroppableId && sourceDroppableId.includes("attractions")) {
      const dayId = sourceDroppableId.replace("-attractions", "");
      setDayPlans(prev => prev.map(day => {
        if (day.id === dayId) {
          const newAttractions = Array.from(day.attractions);
          const [reorderedItem] = newAttractions.splice(source.index, 1);
          newAttractions.splice(destination.index, 0, reorderedItem);
          return { ...day, attractions: newAttractions };
        }
        return day;
      }));
    }
  };

  const removeFromDay = (dayId: string, itemId: string, itemType: string) => {
    setDayPlans(prev => prev.map(day => {
      if (day.id === dayId) {
        if (itemType === "attraction") {
          return {
            ...day,
            attractions: day.attractions.filter((attr: any) => attr.id !== itemId)
          };
        } else if (itemType === "hotel") {
          return { ...day, hotel: null };
        } else if (itemType === "transport") {
          return { ...day, transport: null };
        }
      }
      return day;
    }));
  };

  const updateDayTitle = (dayId: string, title: string) => {
    setDayPlans(prev => prev.map(day =>
      day.id === dayId ? { ...day, title } : day
    ));
  };

  const updateDayDescription = (dayId: string, description: string) => {
    setDayPlans(prev => prev.map(day =>
      day.id === dayId ? { ...day, description } : day
    ));
  };

  // Calculate total cost
  useEffect(() => {
    let total = 0;

    dayPlans.forEach(day => {
      // Add attraction costs
      day.attractions.forEach((attr: any) => {
        total += attr.price || 0;
      });

      // Add hotel cost
      if (day.hotel) {
        total += day.hotel.costPerNight || 0;
      }

      // Add transport cost
      if (day.transport) {
        total += day.transport.costPerDay || 0;
      }
    });

    setTotalCost(total);
  }, [dayPlans]);

  const handleProceedToDetails = () => {
    // Create package format similar to AI packages
    const manualPackage = {
      id: "manual-package",
      title: `Custom ${formData?.emirates?.join(" & ") || "UAE"} Experience`,
      description: "Your personally crafted itinerary with handpicked attractions and experiences",
      personalNote: "This custom itinerary has been carefully designed based on your preferences and selected attractions.",
      totalEstimatedCost: totalCost,
      bestFor: "Travelers who prefer to customize their own journey",
      itinerary: dayPlans.map(day => ({
        ...day,
        hotel: day.hotel?.name || "Premium Hotel Selection",
        transport: day.transport?.label || "Comfortable Transportation",
        image: day.attractions[0]?.image || day.hotel?.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop",
        images: day.attractions.slice(0, 3).map((attr: any) => attr.image).filter(Boolean),
        meals: {
          breakfast: "Hotel breakfast or local cafe",
          lunch: "Local restaurant near attractions",
          dinner: "Traditional UAE dining experience"
        },
        budgetBreakdown: {
          attractions: day.attractions.reduce((sum: number, attr: any) => sum + (attr.price || 0), 0),
          meals: 150,
          transport: day.transport?.costPerDay || 100,
          accommodation: day.hotel?.costPerNight || 300
        },
        expertTip: "Make sure to book tickets in advance for popular attractions"
      }))
    };

    localStorage.setItem("selectedPackage", JSON.stringify(manualPackage));
    navigate("/details");
  };

  const getUniqueEmirates = () => {
    const emirates = [...new Set(availableAttractions.map(attr => attr.emirates))];
    return emirates.sort();
  };

  const toggleDayCollapse = (dayId: string) => {
    const newCollapsed = new Set(collapsedDays);
    if (newCollapsed.has(dayId)) {
      newCollapsed.delete(dayId);
    } else {
      newCollapsed.add(dayId);
    }
    setCollapsedDays(newCollapsed);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your custom planning experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <ProgressBar currentStep={2} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6"
          >
            <Palette className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            Craft Your Perfect Journey
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Design your own adventure by selecting attractions and building your ideal itinerary
          </p>

          {/* Trip Summary */}
          {formData && (
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {formData.adults} Adult{formData.adults > 1 ? 's' : ''}
                    {formData.kids > 0 && ` + ${formData.kids} Kid${formData.kids > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{formData.tripDuration} Days</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    {Array.isArray(formData.emirates) && formData.emirates.includes("all")
                      ? "All Emirates"
                      : Array.isArray(formData.emirates)
                        ? formData.emirates.join(", ")
                        : formData.emirates}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid lg:grid-cols-12 gap-6 relative">
            {/* Sidebar - Available Items */}
            <motion.div
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {/* Tab Selector */}
              <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                    Available Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {[
                      { id: "attractions", label: "Attractions", icon: MapPin, count: filteredAttractions.length },
                      { id: "hotels", label: "Hotels", icon: Building, count: availableHotels.length },
                      { id: "transports", label: "Transport", icon: Navigation, count: availableTransports.length }
                    ].map((tab) => (
                      <motion.button
                        key={tab.id}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 shadow-lg'
                            : 'border-slate-200 bg-white/50 text-slate-600 hover:border-purple-300 hover:bg-purple-50/50'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <tab.icon className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">{tab.label}</span>
                        <Badge className="mt-1 bg-purple-500 text-white text-xs">
                          {tab.count}
                        </Badge>
                      </motion.button>
                    ))}
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/70 border-slate-200 text-slate-700 placeholder:text-slate-400"
                      />
                    </div>

                    {activeTab === "attractions" && (
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={selectedEmirateFilter} onValueChange={setSelectedEmirateFilter}>
                          <SelectTrigger className="bg-white/70 border-slate-200">
                            <SelectValue placeholder="Emirate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Emirates</SelectItem>
                            {getUniqueEmirates().map(emirate => (
                              <SelectItem key={emirate} value={emirate}>{emirate}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={priceFilter} onValueChange={setPriceFilter}>
                          <SelectTrigger className="bg-white/70 border-slate-200">
                            <SelectValue placeholder="Price" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="low">Low (1-100 AED)</SelectItem>
                            <SelectItem value="medium">Medium (101-300 AED)</SelectItem>
                            <SelectItem value="high">High (300+ AED)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Available Items */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 flex items-center">
                        Available {activeTab}
                        <Badge className="ml-2 bg-slate-100 text-slate-600">
                          {activeTab === "attractions" ? filteredAttractions.length :
                           activeTab === "hotels" ? availableHotels.length :
                           availableTransports.length}
                        </Badge>
                      </h4>
                      {activeTab === "attractions" && formData?.emirates && Array.isArray(formData.emirates) && !formData.emirates.includes("all") && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Filtered by:</span>
                          <div className="flex gap-1">
                            {formData.emirates.map((emirate: string) => (
                              <Badge key={emirate} className="bg-purple-100 text-purple-700 text-xs">
                                {emirate}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-h-96 overflow-y-auto space-y-3 pr-2"
                      >
                        <Droppable droppableId={activeTab} isDropDisabled>
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                              {(activeTab === "attractions" ? filteredAttractions :
                                activeTab === "hotels" ? availableHotels :
                                availableTransports).map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-4 bg-white border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 ${
                                        snapshot.isDragging
                                          ? 'shadow-2xl scale-105 rotate-2 z-[9999] relative'
                                          : 'hover:shadow-lg hover:border-purple-300'
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                              src={item.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&h=150&fit=crop"}
                                              alt={item.name || item.label}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="text-sm font-semibold text-slate-800 mb-1 truncate">
                                            {item.name || item.label}
                                          </h5>
                                          {item.emirates && (
                                            <p className="text-xs text-slate-500 mb-1">{item.emirates}</p>
                                          )}
                                          {(item.price !== undefined || item.costPerNight || item.costPerDay) && (
                                            <p className="text-xs text-purple-600 font-medium">
                                              AED {item.price || item.costPerNight || item.costPerDay}
                                              {item.costPerNight && "/night"}
                                              {item.costPerDay && "/day"}
                                            </p>
                                          )}
                                          {item.stars && (
                                            <div className="flex items-center mt-1">
                                              {Array.from({ length: item.stars }, (_, i) => (
                                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        <Grip className="w-5 h-5 text-slate-400" />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {(activeTab === "attractions" ? filteredAttractions :
                                activeTab === "hotels" ? availableHotels :
                                availableTransports).length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                  <p className="text-sm">
                                    {activeTab === "attractions" && formData?.emirates && Array.isArray(formData.emirates) && !formData.emirates.includes("all")
                                      ? `No attractions found for selected emirates: ${formData.emirates.join(", ")}`
                                      : `No ${activeTab} available`
                                    }
                                  </p>
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content - Day Plans */}
            <div className="lg:col-span-8 space-y-6">
              {/* Day Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {dayPlans.map((day, index) => (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                              {day.day}
                            </div>
                            <Input
                              value={day.title}
                              onChange={(e) => updateDayTitle(day.id, e.target.value)}
                              className="border-none bg-transparent p-0 text-xl font-bold text-slate-800 focus:ring-0 focus:outline-none"
                              placeholder={`Day ${day.day}`}
                            />
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDayCollapse(day.id)}
                            className="text-slate-500 hover:text-slate-700"
                          >
                            <ChevronDown className={`w-5 h-5 transition-transform ${
                              collapsedDays.has(day.id) ? 'rotate-180' : ''
                            }`} />
                          </Button>
                        </div>
                        <Input
                          value={day.description}
                          onChange={(e) => updateDayDescription(day.id, e.target.value)}
                          placeholder="Add a description for this day..."
                          className="mt-3 bg-white/50 border-slate-200 text-slate-600"
                        />
                      </CardHeader>

                      <AnimatePresence>
                        {!collapsedDays.has(day.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              {/* Attractions Drop Zone */}
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                                  Attractions ({day.attractions.length})
                                </h4>
                                <Droppable droppableId={`${day.id}-attractions`}>
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className={`min-h-24 p-4 border-2 border-dashed rounded-xl transition-all duration-200 ${
                                        snapshot.isDraggingOver
                                          ? 'border-purple-400 bg-purple-50'
                                          : day.attractions.length > 0
                                            ? 'border-slate-200 bg-white/50'
                                            : 'border-slate-300 bg-gray-50/50'
                                      }`}
                                    >
                                      {day.attractions.length === 0 ? (
                                        <div className="text-center text-slate-400 py-6">
                                          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                          <p className="text-sm">Drag attractions here</p>
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          {day.attractions.map((attraction: any, attractionIndex: number) => (
                                            <Draggable key={attraction.id} draggableId={attraction.id} index={attractionIndex}>
                                              {(provided, snapshot) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className={`p-3 bg-white border border-slate-200 rounded-lg transition-all duration-200 ${
                                                    snapshot.isDragging ? 'shadow-xl scale-105' : 'hover:shadow-md'
                                                  }`}
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                      <Grip className="w-4 h-4 text-slate-400" />
                                                      <div className="flex-shrink-0">
                                                        <div className="w-8 h-6 rounded overflow-hidden bg-gray-100">
                                                          <img
                                                            src={attraction.image}
                                                            alt={attraction.name}
                                                            className="w-full h-full object-cover"
                                                          />
                                                        </div>
                                                      </div>
                                                      <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium text-slate-700 block truncate">
                                                          {attraction.name}
                                                        </span>
                                                        {attraction.price > 0 && (
                                                          <Badge className="mt-1 bg-purple-100 text-purple-700 text-xs">
                                                            AED {attraction.price}
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => removeFromDay(day.id, attraction.id, "attraction")}
                                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                      <X className="w-4 h-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          ))}
                                        </div>
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>

                              {/* Hotel and Transport */}
                              <div className="grid grid-cols-2 gap-4">
                                {/* Hotel Drop Zone */}
                                <Droppable droppableId={`${day.id}-hotel`}>
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className={`p-4 border-2 border-dashed rounded-xl transition-all duration-200 ${
                                        snapshot.isDraggingOver ? 'border-purple-400 bg-purple-50' : 'border-slate-300 bg-gray-50/50'
                                      }`}
                                    >
                                      <h5 className="text-xs font-semibold text-slate-600 mb-3 flex items-center">
                                        <Building className="w-4 h-4 mr-1" />
                                        Hotel
                                      </h5>
                                      {day.hotel ? (
                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                          <div className="flex items-start gap-2">
                                            <div className="flex-shrink-0">
                                              <div className="w-8 h-6 rounded overflow-hidden bg-gray-100">
                                                <img
                                                  src={day.hotel.image}
                                                  alt={day.hotel.name}
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium text-slate-700 truncate">{day.hotel.name}</p>
                                              <p className="text-xs text-purple-600">AED {day.hotel.costPerNight}/night</p>
                                              {day.hotel.stars && (
                                                <div className="flex items-center mt-1">
                                                  {Array.from({ length: day.hotel.stars }, (_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeFromDay(day.id, day.hotel.id, "hotel")}
                                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            >
                                              <X className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center text-slate-400 py-4">
                                          <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                          <p className="text-xs">Drop hotel</p>
                                        </div>
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>

                                {/* Transport Drop Zone */}
                                <Droppable droppableId={`${day.id}-transport`}>
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className={`p-4 border-2 border-dashed rounded-xl transition-all duration-200 ${
                                        snapshot.isDraggingOver ? 'border-purple-400 bg-purple-50' : 'border-slate-300 bg-gray-50/50'
                                      }`}
                                    >
                                      <h5 className="text-xs font-semibold text-slate-600 mb-3 flex items-center">
                                        <Navigation className="w-4 h-4 mr-1" />
                                        Transport
                                      </h5>
                                      {day.transport ? (
                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                          <div className="flex items-start gap-2">
                                            <div className="flex-shrink-0">
                                              <div className="w-8 h-6 rounded overflow-hidden bg-gray-100">
                                                <img
                                                  src={day.transport.image}
                                                  alt={day.transport.label}
                                                  className="w-full h-full object-cover"
                                                />
                                              </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium text-slate-700 truncate">{day.transport.label}</p>
                                              <p className="text-xs text-purple-600">AED {day.transport.costPerDay}/day</p>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeFromDay(day.id, day.transport.id, "transport")}
                                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            >
                                              <X className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center text-slate-400 py-4">
                                          <Navigation className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                          <p className="text-xs">Drop transport</p>
                                        </div>
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Proceed Button */}
              <motion.div
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleProceedToDetails}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 hover:from-purple-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    <Zap className="w-6 h-6 mr-3" />
                    Review Your Custom Itinerary
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </DragDropContext>

        {/* Cost Summary Sidebar */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-2xl border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                  AED {totalCost.toLocaleString()}
                </div>
                <p className="text-purple-100 text-sm mb-4">Total Estimated Cost</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Attractions:</span>
                    <span className="font-medium">
                      AED {dayPlans.reduce((sum, day) =>
                        sum + day.attractions.reduce((attractionSum: number, attr: any) =>
                          attractionSum + (attr.price || 0), 0), 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotels:</span>
                    <span className="font-medium">
                      AED {dayPlans.reduce((sum, day) =>
                        sum + (day.hotel?.costPerNight || 0), 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport:</span>
                    <span className="font-medium">
                      AED {dayPlans.reduce((sum, day) =>
                        sum + (day.transport?.costPerDay || 0), 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
