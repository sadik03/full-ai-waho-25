import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  MapPin, 
  Hotel as HotelIcon, 
  Car, 
  Calendar,
  DollarSign,
  Star,
  Activity,
  Clock,
  ArrowUpRight,
  Sparkles,
  Plane,
  ExternalLink,
  MousePointer,
  Globe,
  Award
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { AttractionsService, HotelsService, TransportService } from '@/services/supabaseService';
import type { Attraction, Hotel, Transport } from '@/config/supabaseConfig';

export function Dashboard() {
  const { toast } = useToast();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Skeleton loading component
  const SkeletonCard = () => (
    <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="w-1/2 h-8 bg-slate-200 rounded mb-2"></div>
          <div className="w-2/3 h-3 bg-slate-200 rounded mb-4"></div>
          <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );

  // List skeleton component
  const SkeletonList = () => (
    <Card className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="w-1/2 h-5 bg-slate-200 rounded"></div>
            <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-slate-200 rounded mb-2"></div>
                <div className="w-1/2 h-3 bg-slate-200 rounded"></div>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        toast({
          title: "📊 Dashboard Loading",
          description: "Fetching latest statistics and data...",
          variant: "default",
          className: "border-l-4 border-l-slate-500 bg-slate-50 text-slate-900",
        });
        
        const [attractionsData, hotelsData, transportsData] = await Promise.all([
          AttractionsService.getAllAttractions(),
          HotelsService.getAllHotels(),
          TransportService.getAllTransport()
        ]);
        
        setAttractions(attractionsData);
        setHotels(hotelsData);
        setTransports(transportsData);
        setError(null);
        
        toast({
          title: "✅ Dashboard Ready",
          description: "All statistics and data loaded successfully",
          variant: "default",
          className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const stats = [
    {
      title: 'Total Attractions',
      value: attractions.length,
      icon: MapPin,
      gradient: 'from-emerald-400 via-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      change: '+12%',
      subtitle: 'Active destinations'
    },
    {
      title: 'Premium Hotels',
      value: hotels.length,
      icon: HotelIcon,
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      bgGradient: 'from-amber-50 to-orange-50',
      change: '+8%',
      subtitle: 'Partner accommodations'
    },
    {
      title: 'Transport Fleet',
      value: transports.length,
      icon: Car,
      gradient: 'from-blue-400 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      change: '+5%',
      subtitle: 'Available vehicles'
    },
    {
      title: 'Total Bookings',
      value: 1247,
      icon: Calendar,
      gradient: 'from-purple-400 via-pink-500 to-rose-500',
      bgGradient: 'from-purple-50 to-pink-50',
      change: '+23%',
      subtitle: 'This month'
    }
  ];

  const recentActivity = [
    { 
      action: 'New Premium Experience', 
      item: 'Burj Al Arab Sky Suite', 
      time: '2 min ago', 
      type: 'attraction',
      icon: Sparkles,
      color: 'emerald'
    },
    { 
      action: 'Hotel Partnership', 
      item: 'Atlantis The Royal', 
      time: '15 min ago', 
      type: 'hotel',
      icon: Award,
      color: 'amber'
    },
    { 
      action: 'Fleet Expansion', 
      item: 'Luxury Yacht Charter', 
      time: '1 hour ago', 
      type: 'transport',
      icon: Plane,
      color: 'blue'
    },
    { 
      action: 'VIP Booking Confirmed', 
      item: 'Royal Desert Safari', 
      time: '2 hours ago', 
      type: 'booking',
      icon: Globe,
      color: 'purple'
    }
  ];

  const topAttractions = attractions.slice(0, 5);
  const topHotels = hotels.slice(0, 5);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8 p-6"
        >
          {/* Header Skeleton */}
          <Card className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <CardContent className="p-8">
              <div className="animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="w-80 h-10 bg-slate-200 rounded"></div>
                    <div className="w-64 h-6 bg-slate-200 rounded"></div>
                    <div className="w-96 h-4 bg-slate-200 rounded"></div>
                    <div className="w-80 h-4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-32 h-10 bg-slate-200 rounded-full"></div>
                    <div className="w-28 h-10 bg-slate-200 rounded-lg"></div>
                    <div className="w-12 h-10 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          
          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <SkeletonList />
            </div>
            <div className="lg:col-span-4">
              <SkeletonList />
            </div>
            <div className="lg:col-span-4">
              <SkeletonList />
            </div>
          </div>
        </motion.div>
      )}
      
      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg">❌ {error}</div>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      )}
      
      {!loading && !error && (
      <motion.div 
        className="space-y-8 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 p-8"
        >
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></div>
            <div className="absolute bottom-10 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-30"></div>
          </div>
          
          <div className="relative flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                  UAE Travels
                </span>
              </h1>
              
              <span className="block text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold mb-4">
                Administrative Dashboard
              </span>
              
              <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
                Monitor your travel empire with real-time insights. Track bookings, manage destinations, 
                and optimize your guests' extraordinary experiences across the UAE with our comprehensive analytics platform.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Website redirect button with icon and text */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('/', '_blank')}
                className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                title="Visit Main Website"
              >
                <Globe className="w-5 h-5" />
                <span className="font-semibold">Website</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group"
              >
                <Card className={`
                  relative overflow-hidden bg-white/90 backdrop-blur-lg
                  border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500
                  rounded-2xl
                `}>
                  <CardContent className="p-7">
                    {/* Enhanced Background Glow Effect */}
                    <div className={`
                      absolute -top-12 -right-12 w-24 h-24 rounded-full 
                      bg-gradient-to-br ${stat.gradient} opacity-10 
                      group-hover:opacity-25 group-hover:scale-110 transition-all duration-500
                    `}></div>
                    
                    {/* Animated border effect */}
                    <div className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 
                      group-hover:opacity-10 transition-opacity duration-500
                    `}></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-slate-500 text-sm font-semibold mb-2 uppercase tracking-wide">{stat.title}</p>
                        <p className="text-4xl font-bold text-slate-800 mb-3">{stat.value.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 mb-4 font-medium">{stat.subtitle}</p>
                        
                        <motion.div 
                          className="flex items-center"
                          whileHover={{ x: 2 }}
                        >
                          <ArrowUpRight className="w-4 h-4 text-emerald-600 mr-2" />
                          <span className="text-sm text-emerald-600 font-bold">{stat.change}</span>
                          <span className="text-xs text-slate-400 ml-2">vs last month</span>
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className={`
                          w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} 
                          flex items-center justify-center shadow-lg 
                          transition-all duration-300
                        `}
                        whileHover={{ 
                          scale: 1.15,
                          rotate: 5,
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Card className="h-full bg-white/90 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50/80 to-stone-50/80 backdrop-blur-sm border-b border-slate-100/50">
                <CardTitle className="text-slate-800 flex items-center text-lg font-bold">
                  <Activity className="w-5 h-5 mr-3 text-emerald-600" />
                  Live Activity Feed
                  <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">Real-time</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentActivity.map((activity, index) => {
                    const ActivityIcon = activity.icon;
                    return (
                      <motion.div 
                        key={index}
                        whileHover={{ 
                          backgroundColor: 'rgba(248, 250, 252, 0.9)',
                          x: 4,
                          transition: { duration: 0.2 }
                        }}
                        className="flex items-center space-x-4 p-5 border-b border-slate-50 last:border-b-0 cursor-pointer transition-colors duration-200"
                      >
                        <motion.div 
                          className={`
                            w-12 h-12 rounded-xl bg-gradient-to-br 
                            ${activity.color === 'emerald' ? 'from-emerald-400 to-teal-500' :
                              activity.color === 'amber' ? 'from-amber-400 to-orange-500' :
                              activity.color === 'blue' ? 'from-blue-400 to-cyan-500' :
                              'from-purple-400 to-pink-500'}
                            flex items-center justify-center shadow-lg
                          `}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <ActivityIcon className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{activity.action}</p>
                          <p className="text-sm text-slate-600 truncate font-medium">{activity.item}</p>
                          <div className="flex items-center mt-2">
                            <Clock className="w-3 h-3 text-slate-400 mr-1" />
                            <p className="text-xs text-slate-500 font-medium">{activity.time}</p>
                          </div>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <MousePointer className="w-4 h-4 text-slate-600" />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Attractions */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Card className="h-full bg-white/90 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border-b border-amber-100/50">
                <CardTitle className="text-slate-800 flex items-center text-lg font-bold">
                  <MapPin className="w-5 h-5 mr-3 text-amber-600" />
                  Featured Destinations
                  <Badge className="ml-auto bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1">Top Rated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {topAttractions.map((attraction, index) => (
                    <motion.div 
                      key={attraction.id}
                      whileHover={{ 
                        scale: 1.02,
                        x: 4,
                        transition: { duration: 0.2 }
                      }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-amber-50/70 transition-all duration-300 border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {index + 1}
                        </motion.div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{attraction.name}</p>
                          <p className="text-xs text-slate-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {attraction.emirates}
                          </p>
                        </div>
                      </div>
                      <motion.div 
                        className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Star className="w-4 h-4 text-amber-500 mr-1 fill-current" />
                        <span className="text-sm font-bold text-slate-700">4.8</span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Premium Hotels */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Card className="h-full bg-white/90 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border-b border-blue-100/50">
                <CardTitle className="text-slate-800 flex items-center text-lg font-bold">
                  <HotelIcon className="w-5 h-5 mr-3 text-blue-600" />
                  Luxury Collection
                  <Badge className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1">Premium</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {topHotels.map((hotel, index) => (
                    <motion.div 
                      key={hotel.id}
                      whileHover={{ 
                        scale: 1.02,
                        x: 4,
                        transition: { duration: 0.2 }
                      }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-blue-50/70 transition-all duration-300 border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {index + 1}
                        </motion.div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{hotel.name}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(hotel.stars)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div 
                          className="flex items-center text-sm font-bold text-slate-800 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md"
                          whileHover={{ scale: 1.05 }}
                        >
                          <DollarSign className="w-3 h-3 mr-1 text-emerald-600" />
                          {hotel.cost_per_night}
                        </motion.div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">per night</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
  
      </motion.div>
      )}
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
