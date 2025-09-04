import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  Plus, 
  Hotel as HotelIcon, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  DollarSign,
  Save,
  X,
  Star,
  MapPin,
  Wifi,
  Car
} from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { HotelsService } from '@/services/supabaseService';
import type { Hotel } from '@/config/supabaseConfig';

// Custom Hover Radius Button Component
function HoverRadiusButton({ 
  text, 
  onClick, 
  className = "", 
  type = "button", 
  disabled = false,
  variant = "primary"
}: {
  text: React.ReactNode;
  onClick: (e?: React.FormEvent) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}) {
  const [hover, setHover] = useState(false);

  const getColors = () => {
    switch (variant) {
      case "danger":
        return {
          bg: disabled ? "#94A3B8" : "#DC2626",
          color: "#FFFFFF"
        };
      case "secondary":
        return {
          bg: disabled ? "#94A3B8" : "#64748B",
          color: "#FFFFFF"
        };
      default:
        return {
          bg: disabled ? "#94A3B8" : "#2C3E50",
          color: "#FFFFFF"
        };
    }
  };

  const colors = getColors();

  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.bg,
    color: colors.color,
    padding: "10px 16px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "Nunito, sans-serif",
    borderRadius: hover && !disabled ? "2px" : "0px 0px 20px 0px",
    transition: "all 0.4s ease",
    boxShadow: hover && !disabled
      ? "0 4px 12px rgba(0,0,0,0.15)"
      : "0 2px 4px rgba(0,0,0,0.1)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      className={className}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => !disabled && setHover(false)}
      onClick={(e) => !disabled && onClick(e)}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export function HotelsManager() {
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid
  
  const [formData, setFormData] = useState({
    name: '',
    stars: 5,
    price_range_min: 0,
    price_range_max: 0,
    category: '',
    star_category: '',
    image_url: '',
    location: '',
    amenities: [] as string[],
    description: ''
  });

  // Load hotels from database
  useEffect(() => {
    const initializeHotels = async () => {
      toast({
        title: "🏨 Hotels Manager",
        description: "Loading hotels data from database...",
        variant: "default",
        className: "border-l-4 border-l-slate-500 bg-slate-50 text-slate-900",
      });
      await loadHotels();
    };
    
    initializeHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await HotelsService.getAllHotels();
      setHotels(data);
      setError(null);
      
      toast({
        title: "✅ Data Loaded Successfully",
        description: `${data.length} hotels retrieved from database`,
        variant: "default",
        className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
      });
    } catch (err) {
      console.error('Error loading hotels:', err);
      const errorMessage = 'Failed to load hotels';
      setError(errorMessage);
      
      toast({
        title: "❌ Loading Failed",
        description: "Unable to retrieve hotels from database. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    (hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (hotel.location && hotel.location.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({
      name: '',
      stars: 5,
      price_range_min: 0,
      price_range_max: 0,
      category: '',
      star_category: '',
      image_url: '',
      location: '',
      amenities: [],
      description: ''
    });
    setEditingHotel(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingHotel) {
        // Update existing hotel
        await HotelsService.updateHotel(Number(editingHotel.id), formData);
        toast({
          title: "✅ Hotel Updated",
          description: `"${formData.name}" has been successfully updated`,
          variant: "default",
          className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
        });
      } else {
        // Add new hotel
        const newHotel = {
          ...formData,
          is_active: true
        };
        await HotelsService.addHotel(newHotel);
        toast({
          title: "✅ Hotel Added",
          description: `"${formData.name}" has been successfully added to the system`,
          variant: "default",
          className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
        });
      }
      
      await loadHotels(); // Reload data
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving hotel:', error);
      const errorMessage = 'Failed to save hotel';
      setError(errorMessage);
      
      toast({
        title: "❌ Save Failed",
        description: editingHotel ? "Could not update hotel. Please try again." : "Could not add new hotel. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      stars: hotel.stars,
      price_range_min: hotel.price_range_min || 0,
      price_range_max: hotel.price_range_max || 0,
      category: hotel.category || '',
      star_category: hotel.star_category || '',
      image_url: hotel.image_url || '',
      location: hotel.location || '',
      amenities: hotel.amenities || [],
      description: hotel.description || ''
    });
    setIsDialogOpen(true);
    
    toast({
      title: "✏️ Edit Mode",
      description: `Editing hotel "${hotel.name}"`,
      variant: "default",
      className: "border-l-4 border-l-purple-500 bg-purple-50 text-purple-900",
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        const hotelToDelete = hotels.find(h => Number(h.id) === id);
        await HotelsService.deleteHotel(id);
        await loadHotels(); // Reload data
        
        toast({
          title: "🗑️ Hotel Deleted",
          description: `"${hotelToDelete?.name || 'Hotel'}" has been permanently removed`,
          variant: "default",
          className: "border-l-4 border-l-orange-500 bg-orange-50 text-orange-900",
        });
      } catch (error) {
        console.error('Error deleting hotel:', error);
        const errorMessage = 'Failed to delete hotel';
        setError(errorMessage);
        
        toast({
          title: "❌ Deletion Failed",
          description: "Could not delete hotel. Please try again.",
          variant: "destructive",
          className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
        });
      }
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
    
    toast({
      title: "➕ Add New Hotel",
      description: "Opening form to add new hotel to the system",
      variant: "default",
      className: "border-l-4 border-l-indigo-500 bg-indigo-50 text-indigo-900",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Loading State - Skeleton Animation */}
        {loading && (
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded-lg w-80 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            </div>

            {/* Search Section Skeleton */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              </div>
            </div>

            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Image Skeleton */}
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  
                  {/* Content Skeleton */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg"
          >
            <div className="text-red-800 font-medium mb-3">{error}</div>
            <HoverRadiusButton
              text="Retry Loading"
              onClick={loadHotels}
              variant="danger"
            />
          </motion.div>
        )}
        
        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-[#1A252F] mb-3">
                    Hotels Management
                  </h1>
                  <p className="text-[#2C3E50] text-lg">Manage hotel accommodations and bookings</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <HoverRadiusButton
                      text={
                        <>
                          <Plus className="w-5 h-5" />
                          Add New Hotel
                        </>
                      }
                      onClick={handleAddNew}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-[#1A252F] mb-2">
                        {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[#2C3E50] font-medium">Hotel Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Enter hotel name"
                            required
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-[#2C3E50] font-medium">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Enter location"
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="stars" className="text-[#2C3E50] font-medium">Star Rating *</Label>
                          <Input
                            id="stars"
                            type="number"
                            min="1"
                            max="5"
                            value={formData.stars}
                            onChange={(e) => setFormData({...formData, stars: Number(e.target.value)})}
                            required
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceRangeMin" className="text-[#2C3E50] font-medium">Min Price (AED) *</Label>
                          <Input
                            id="priceRangeMin"
                            type="number"
                            value={formData.price_range_min}
                            onChange={(e) => setFormData({...formData, price_range_min: Number(e.target.value)})}
                            placeholder="Enter minimum price"
                            required
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceRangeMax" className="text-[#2C3E50] font-medium">Max Price (AED) *</Label>
                          <Input
                            id="priceRangeMax"
                            type="number"
                            value={formData.price_range_max}
                            onChange={(e) => setFormData({...formData, price_range_max: Number(e.target.value)})}
                            placeholder="Enter maximum price"
                            required
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-[#2C3E50] font-medium">Category</Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            placeholder="Enter hotel category"
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="starCategory" className="text-[#2C3E50] font-medium">Star Category</Label>
                          <select
                            id="starCategory"
                            value={formData.star_category}
                            onChange={(e) => setFormData({...formData, star_category: e.target.value})}
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors w-full px-3 py-2"
                          >
                            <option value="">Select star category</option>
                            <option value="3-Star">3-Star</option>
                            <option value="4-Star">4-Star</option>
                            <option value="5-Star Standard">5-Star Standard</option>
                            <option value="5-Star Premium">5-Star Premium</option>
                            <option value="5-Star Luxury">5-Star Luxury</option>
                            <option value="7-Star">7-Star</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="imageUrl" className="text-[#2C3E50] font-medium">Image URL</Label>
                        <Input
                          id="imageUrl"
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          placeholder="Enter image URL"
                          className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="amenities" className="text-[#2C3E50] font-medium">Amenities</Label>
                          <Input
                            id="amenities"
                            value={formData.amenities.join(', ')}
                            onChange={(e) => setFormData({...formData, amenities: e.target.value.split(',').map(a => a.trim()).filter(a => a)})}
                            placeholder="e.g. WiFi, Pool, Spa, Gym"
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-[#2C3E50] font-medium">Description</Label>
                          <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Brief description"
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-4 pt-6 border-t">
                        <HoverRadiusButton
                          text={
                            <>
                              <X className="w-4 h-4" />
                              Cancel
                            </>
                          }
                          onClick={() => setIsDialogOpen(false)}
                          variant="secondary"
                        />
                        <HoverRadiusButton
                          text={
                            <>
                              <Save className="w-4 h-4" />
                              {editingHotel ? 'Update Hotel' : 'Save Hotel'}
                            </>
                          }
                          onClick={() => {}}
                          type="submit"
                        />
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search hotels by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 py-3 border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors text-lg"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-2 border-gray-200 hover:border-[#2C3E50] hover:bg-slate-50 px-6 py-3 rounded-lg transition-colors"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Advanced Filters
                  </Button>
                </div>
                
                {/* Results Counter */}
                {filteredHotels.length > 0 && (
                  <div className="bg-[#2C3E50] text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {startIndex + 1}-{Math.min(endIndex, filteredHotels.length)} of {filteredHotels.length} hotels
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <Card className="border-l-4 border-l-[#2C3E50] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Hotels</p>
                      <p className="text-3xl font-bold text-[#1A252F]">{hotels.length}</p>
                      <p className="text-xs text-green-600 flex items-center mt-2">
                        <HotelIcon className="w-3 h-3 mr-1" />
                        Active listings
                      </p>
                    </div>
                    <div className="p-3 bg-[#2C3E50] rounded-full">
                      <HotelIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700 mb-1">Avg. Price Range</p>
                      <p className="text-3xl font-bold text-amber-800">
                        AED {hotels.length > 0 ? Math.round(hotels.reduce((sum, h) => sum + ((h.price_range_min || 0) + (h.price_range_max || 0)) / 2, 0) / hotels.length) : 0}
                      </p>
                      <p className="text-xs text-amber-600 flex items-center mt-2">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Per night
                      </p>
                    </div>
                    <div className="p-3 bg-amber-500 rounded-full">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">5-Star Hotels</p>
                      <p className="text-3xl font-bold text-blue-800">
                        {hotels.filter(h => h.stars === 5).length}
                      </p>
                      <p className="text-xs text-blue-600 flex items-center mt-2">
                        <Star className="w-3 h-3 mr-1" />
                        Luxury options
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Locations</p>
                      <p className="text-3xl font-bold text-purple-800">
                        {new Set(hotels.map(h => h.location).filter(Boolean)).size}
                      </p>
                      <p className="text-xs text-purple-600 flex items-center mt-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        Cities covered
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hotels Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white overflow-hidden h-full">
                    {/* Image Section */}
                    {hotel.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={hotel.image_url} 
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <Badge className="absolute top-4 right-4 bg-[#2C3E50] text-white font-bold px-3 py-1 text-sm">
                          AED {hotel.price_range_min || 0}-{hotel.price_range_max || 0}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="space-y-4">
                        <CardTitle className="text-xl text-[#1A252F] line-clamp-1 group-hover:text-[#2C3E50] transition-colors">
                          {hotel.name}
                        </CardTitle>
                        
                        {/* Star Rating - Standalone Row */}
                        <div className="flex items-center">
                          {[...Array(hotel.stars)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                          ))}
                          <span className="text-sm text-amber-700 ml-2 font-medium">({hotel.stars} stars)</span>
                        </div>

                        {/* Categories Row */}
                        {(hotel.star_category || hotel.category) && (
                          <div className="flex flex-wrap gap-2">
                            {hotel.star_category && (
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                {hotel.star_category}
                              </Badge>
                            )}
                            {hotel.category && (
                              <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {hotel.category}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Amenities Preview */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {hotel.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs bg-gray-50 text-gray-600 border-gray-200 px-2 py-1"
                              >
                                {amenity}
                              </Badge>
                            ))}
                            {hotel.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 px-2 py-1">
                                +{hotel.amenities.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-6">
                      {/* Price Range Display */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price Range</p>
                          <p className="text-lg font-bold text-[#2C3E50]">AED {hotel.price_range_min || 0} - {hotel.price_range_max || 0}</p>
                          <p className="text-xs text-gray-600">per night</p>
                        </div>
                        <DollarSign className="w-5 h-5 text-[#2C3E50]" />
                      </div>

                      {hotel.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                          {hotel.description}
                        </p>
                      )}
                      
                      <div className="flex space-x-3 mt-auto">
                        <HoverRadiusButton
                          text={
                            <>
                              <Edit className="w-4 h-4" />
                              Edit
                            </>
                          }
                          onClick={() => handleEdit(hotel)}
                          variant="secondary"
                          className="flex-1"
                        />
                        <HoverRadiusButton
                          text={
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          }
                          onClick={() => handleDelete(Number(hotel.id))}
                          variant="danger"
                          className="flex-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {filteredHotels.length > itemsPerPage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-10"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[#2C3E50] hover:text-white'} transition-colors`}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const showPage = page === 1 || 
                                      page === totalPages || 
                                      Math.abs(page - currentPage) <= 1;
                      
                      if (!showPage) {
                        if (page === 2 && currentPage > 4) {
                          return (
                            <PaginationItem key={`ellipsis-start`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        if (page === totalPages - 1 && currentPage < totalPages - 3) {
                          return (
                            <PaginationItem key={`ellipsis-end`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className={`cursor-pointer transition-colors ${
                              currentPage === page ? 'bg-[#2C3E50] text-white' : 'hover:bg-[#2C3E50] hover:text-white'
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[#2C3E50] hover:text-white'} transition-colors`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}

            {/* Empty State */}
            {filteredHotels.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-16 text-center shadow-lg bg-gradient-to-br from-white to-slate-50">
                  <HotelIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#1A252F] mb-4">No hotels found</h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                    {searchTerm ? 'No hotels match your search criteria. Try adjusting your search terms.' : 'Get started by adding your first hotel to showcase amazing accommodations.'}
                  </p>
                  {!searchTerm && (
                    <HoverRadiusButton
                      text={
                        <>
                          <Plus className="w-5 h-5" />
                          Add Your First Hotel
                        </>
                      }
                      onClick={handleAddNew}
                    />
                  )}
                  {searchTerm && (
                    <HoverRadiusButton
                      text="Clear Search"
                      onClick={() => setSearchTerm('')}
                      variant="secondary"
                    />
                  )}
                </Card>
              </motion.div>
            )}
          </>
        )}
        
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </div>
  );
}
