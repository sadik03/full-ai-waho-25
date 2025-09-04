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
  MapPin, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  DollarSign,
  Image as ImageIcon,
  Save,
  X,
  Star,
  Clock,
  Tag
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
import { AttractionsService } from '@/services/supabaseService';
import type { Attraction } from '@/config/supabaseConfig';

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

export function AttractionsManager() {
  const { toast } = useToast();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmirate, setSelectedEmirate] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid
  
  const [formData, setFormData] = useState({
    attraction: '',
    emirates: '',
    price: 0,
    image_url: '',
    description: '',
    category: '',
    duration: ''
  });

  // Load attractions from database
  useEffect(() => {
    const initializeAttractions = async () => {
      toast({
        title: "🎡 Attractions Manager",
        description: "Loading attractions data from database...",
        variant: "default",
        className: "border-l-4 border-l-slate-500 bg-slate-50 text-slate-900",
      });
      await loadAttractions();
    };
    
    initializeAttractions();
  }, []);

  const loadAttractions = async () => {
    try {
      setLoading(true);
      const data = await AttractionsService.getAllAttractions();
      setAttractions(data);
      setError(null);
      
      toast({
        title: "✅ Data Loaded Successfully",
        description: `${data.length} attractions retrieved from database`,
        variant: "default",
        className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
      });
    } catch (err) {
      console.error('Error loading attractions:', err);
      const errorMessage = 'Failed to load attractions';
      setError(errorMessage);
      
      toast({
        title: "❌ Loading Failed",
        description: "Unable to retrieve attractions from database. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAttractions = attractions.filter(attraction =>
    ((attraction.name || attraction.attraction || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    attraction.emirates.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedEmirate === 'All' || attraction.emirates === selectedEmirate)
  );

  // Get unique emirates for filter buttons
  const uniqueEmirates = ['All', ...Array.from(new Set(attractions.map(a => a.emirates))).sort()];

  // Pagination calculations
  const totalPages = Math.ceil(filteredAttractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttractions = filteredAttractions.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedEmirate]);

  const resetForm = () => {
    setFormData({
      attraction: '',
      emirates: '',
      price: 0,
      image_url: '',
      description: '',
      category: '',
      duration: ''
    });
    setEditingAttraction(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAttraction) {
        // Update existing attraction
        await AttractionsService.updateAttraction(Number(editingAttraction.id), formData);
        toast({
          title: "✅ Attraction Updated",
          description: `"${formData.attraction}" has been successfully updated`,
          variant: "default",
          className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
        });
      } else {
        // Add new attraction
        const newAttraction = {
          ...formData,
          rating: 4.5,
          is_active: true
        };
        await AttractionsService.addAttraction(newAttraction);
        toast({
          title: "✅ Attraction Added",
          description: `"${formData.attraction}" has been successfully added to the system`,
          variant: "default",
          className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
        });
      }
      
      await loadAttractions(); // Reload data
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving attraction:', error);
      const errorMessage = 'Failed to save attraction';
      setError(errorMessage);
      
      toast({
        title: "❌ Save Failed",
        description: editingAttraction ? "Could not update attraction. Please try again." : "Could not add new attraction. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    }
  };

  const handleEdit = (attraction: Attraction) => {
    setEditingAttraction(attraction);
    setFormData({
      attraction: attraction.attraction,
      emirates: attraction.emirates,
      price: attraction.price,
      image_url: attraction.image_url || '',
      description: attraction.description || '',
      category: attraction.category || '',
      duration: attraction.duration || ''
    });
    setIsDialogOpen(true);
    
    toast({
      title: "✏️ Edit Mode",
      description: `Editing attraction "${attraction.attraction}"`,
      variant: "default",
      className: "border-l-4 border-l-purple-500 bg-purple-50 text-purple-900",
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this attraction?')) {
      try {
        const attractionToDelete = attractions.find(a => Number(a.id) === id);
        await AttractionsService.deleteAttraction(id);
        await loadAttractions(); // Reload data
        
        toast({
          title: "🗑️ Attraction Deleted",
          description: `"${attractionToDelete?.attraction || 'Attraction'}" has been permanently removed`,
          variant: "default",
          className: "border-l-4 border-l-orange-500 bg-orange-50 text-orange-900",
        });
      } catch (error) {
        console.error('Error deleting attraction:', error);
        const errorMessage = 'Failed to delete attraction';
        setError(errorMessage);
        
        toast({
          title: "❌ Deletion Failed",
          description: "Could not delete attraction. Please try again.",
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
      title: "➕ Add New Attraction",
      description: "Opening form to add new attraction to the system",
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
                      <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
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
              onClick={() => {
                toast({
                  title: "🔄 Refreshing Data",
                  description: "Fetching latest attractions information...",
                  variant: "default",
                  className: "border-l-4 border-l-indigo-500 bg-indigo-50 text-indigo-900",
                });
                loadAttractions();
              }}
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
                    Attractions Management
                  </h1>
                  <p className="text-[#2C3E50] text-lg">Manage tourist attractions and destinations</p>
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
                          Add New Attraction
                        </>
                      }
                      onClick={handleAddNew}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-[#1A252F] mb-2">
                        {editingAttraction ? 'Edit Attraction' : 'Add New Attraction'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="attraction" className="text-[#2C3E50] font-medium">Attraction Name *</Label>
                          <Input
                            id="attraction"
                            value={formData.attraction}
                            onChange={(e) => setFormData({...formData, attraction: e.target.value})}
                            placeholder="Enter attraction name"
                            required
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emirates" className="text-[#2C3E50] font-medium">Emirates/Location *</Label>
                          <Input
                            id="emirates"
                            value={formData.emirates}
                            onChange={(e) => setFormData({...formData, emirates: e.target.value})}
                            placeholder="Enter location"
                            required
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-[#2C3E50] font-medium">Price (AED) *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            placeholder="Enter price"
                            required
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-[#2C3E50] font-medium">Category</Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            placeholder="e.g. Landmark, Museum, Adventure"
                            className="border-2 border-gray-200 focus:border-[#2C3E50] rounded-lg transition-colors"
                          />
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
                          <Label htmlFor="duration" className="text-[#2C3E50] font-medium">Duration</Label>
                          <Input
                            id="duration"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            placeholder="e.g. 2-3 hours, Half day"
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
                              {editingAttraction ? 'Update Attraction' : 'Save Attraction'}
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
                      placeholder="Search attractions by name or location..."
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
                {filteredAttractions.length > 0 && (
                  <div className="bg-[#2C3E50] text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {startIndex + 1}-{Math.min(endIndex, filteredAttractions.length)} of {filteredAttractions.length} attractions
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <Card className="border-l-4 border-l-[#2C3E50] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Attractions</p>
                      <p className="text-3xl font-bold text-[#1A252F]">{attractions.length}</p>
                      <p className="text-xs text-green-600 flex items-center mt-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        Active listings
                      </p>
                    </div>
                    <div className="p-3 bg-[#2C3E50] rounded-full">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700 mb-1">Average Price</p>
                      <p className="text-3xl font-bold text-amber-800">
                        AED {attractions.length > 0 ? Math.round(attractions.filter(a => a.price > 0).reduce((sum, a) => sum + a.price, 0) / Math.max(attractions.filter(a => a.price > 0).length, 1)) : 0}
                      </p>
                      <p className="text-xs text-amber-600 flex items-center mt-2">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Per attraction
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
                      <p className="text-sm font-medium text-blue-700 mb-1">Unique Locations</p>
                      <p className="text-3xl font-bold text-blue-800">
                        {new Set(attractions.map(a => a.emirates)).size}
                      </p>
                      <p className="text-xs text-blue-600 flex items-center mt-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        Emirates covered
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emirates Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#1A252F] mb-2 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[#2C3E50]" />
                  Filter by Emirates
                </h3>
                <div className="h-px bg-gradient-to-r from-[#2C3E50] via-gray-300 to-transparent"></div>
              </div>
              
              <div className="relative">
                <div 
                  className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide" 
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none'
                  }}
                >
                  {uniqueEmirates.map((emirate, index) => (
                    <motion.button
                      key={emirate}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => setSelectedEmirate(emirate)}
                      className={`
                        flex-shrink-0 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 
                        transform hover:scale-105 hover:shadow-md border-2 min-w-fit whitespace-nowrap
                        ${selectedEmirate === emirate 
                          ? 'bg-[#2C3E50] text-white border-[#2C3E50] shadow-lg' 
                          : 'bg-white text-[#2C3E50] border-gray-200 hover:border-[#2C3E50] hover:bg-slate-50'
                        }
                      `}
                    >
                      {emirate}
                      {emirate !== 'All' && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedEmirate === emirate 
                            ? 'bg-white text-[#2C3E50]' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {attractions.filter(a => a.emirates === emirate).length}
                        </span>
                      )}
                      {emirate === 'All' && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedEmirate === emirate 
                            ? 'bg-white text-[#2C3E50]' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {attractions.length}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
                
                {/* Scroll indicators */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
              
              {/* Results summary */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <p className="text-sm text-gray-600">
                  Showing {filteredAttractions.length} attractions
                  {selectedEmirate !== 'All' && (
                    <span className="text-[#2C3E50] font-medium"> in {selectedEmirate}</span>
                  )}
                  {searchTerm && (
                    <span className="text-[#2C3E50] font-medium"> matching "{searchTerm}"</span>
                  )}
                </p>
              </motion.div>
            </motion.div>

            {/* Attractions Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedAttractions.map((attraction, index) => (
                <motion.div
                  key={attraction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white overflow-hidden h-full">
                    {/* Image Section */}
                    {attraction.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={attraction.image_url} 
                          alt={attraction.attraction}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <Badge className="absolute top-4 right-4 bg-[#2C3E50] text-white font-bold px-3 py-1 text-sm">
                          {attraction.price > 0 ? `AED ${attraction.price}` : 'FREE'}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="space-y-3">
                        <CardTitle className="text-xl text-[#1A252F] line-clamp-1 group-hover:text-[#2C3E50] transition-colors">
                          {attraction.attraction}
                        </CardTitle>
                        
                        <div className="flex items-center text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-[#2C3E50] mr-1" />
                            <span className="text-sm font-medium">{attraction.emirates}</span>
                          </div>
                          
                          {attraction.category && (
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 text-amber-600 mr-1" />
                              <span className="text-sm text-amber-700">{attraction.category}</span>
                            </div>
                          )}

                          {attraction.duration && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-blue-600 mr-1" />
                              <span className="text-sm text-blue-700">{attraction.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {attraction.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                          {attraction.description}
                        </p>
                      )}
                      
                      <div className="flex space-x-3">
                        <HoverRadiusButton
                          text={
                            <>
                              <Edit className="w-4 h-4" />
                              Edit
                            </>
                          }
                          onClick={() => handleEdit(attraction)}
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
                          onClick={() => handleDelete(Number(attraction.id))}
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
            {filteredAttractions.length > itemsPerPage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
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
            {filteredAttractions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-16 text-center shadow-lg bg-gradient-to-br from-white to-slate-50">
                  <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#1A252F] mb-4">No attractions found</h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                    {searchTerm ? 'No attractions match your search criteria. Try adjusting your search terms.' : 'Get started by adding your first tourist attraction to showcase amazing destinations.'}
                  </p>
                  {!searchTerm && (
                    <HoverRadiusButton
                      text={
                        <>
                          <Plus className="w-5 h-5" />
                          Add Your First Attraction
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
