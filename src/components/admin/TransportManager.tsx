import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  Plus, 
  Car, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  DollarSign,
  Save,
  X,
  Truck,
  Plane,
  Calendar,
  Clock
} from 'lucide-react';
import { TransportService } from '@/services/supabaseService';
import type { Transport } from '@/config/supabaseConfig';

// HoverRadiusButton Component
const HoverRadiusButton = ({ children, onClick, className = '', disabled = false, ...props }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) => {
  return (
    <motion.button
      whileHover={{ 
        borderRadius: disabled ? "0px 0px 20px 0px" : "2px",
        scale: disabled ? 1 : 1.02
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-[#2C3E50] to-[#1A252F] text-white hover:from-[#34495E] hover:to-[#2C3E50] shadow-lg ${className}`}
      style={{ borderRadius: "0px 0px 20px 0px" }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export function TransportManager() {
  const { toast } = useToast();
  const [transports, setTransports] = useState<Transport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [formData, setFormData] = useState({
    label: '',
    cost_per_day: 0,
    type: '',
    description: '',
    image_url: ''
  });

  // Load transport from database
  useEffect(() => {
    const initializeTransports = async () => {
      toast({
        title: "🚗 Transport Manager",
        description: "Loading transport options from database...",
        variant: "default",
        className: "border-l-4 border-l-slate-500 bg-slate-50 text-slate-900",
      });
      await loadTransports();
    };
    
    initializeTransports();
  }, []);

  const loadTransports = async () => {
    try {
      setLoading(true);
      const data = await TransportService.getAllTransport();
      setTransports(data);
      setError(null);
      
      toast({
        title: "✅ Data Loaded Successfully",
        description: `${data.length} transport options retrieved from database`,
        variant: "default",
        className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
      });
    } catch (err) {
      console.error('Error loading transports:', err);
      const errorMessage = 'Failed to load transport options';
      setError(errorMessage);
      
      toast({
        title: "❌ Loading Failed",
        description: "Unable to retrieve transport options from database. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransports = transports.filter(transport =>
    transport.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transport.type && transport.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTransports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransports = filteredTransports.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const resetForm = () => {
    setFormData({
      label: '',
      cost_per_day: 0,
      type: '',
      description: '',
      image_url: ''
    });
    setEditingTransport(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTransport) {
        // Update existing transport
        await TransportService.updateTransport(editingTransport.id!, formData);
        toast({
          title: "✅ Transport Updated",
          description: `"${formData.label}" has been successfully updated`,
          variant: "default",
          className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
        });
      } else {
        // Add new transport
        const newTransport = {
          ...formData,
          is_active: true
        };
        await TransportService.addTransport(newTransport);
        toast({
          title: "✅ Transport Added",
          description: `"${formData.label}" has been successfully added to the system`,
          variant: "default",
          className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
        });
      }
      
      await loadTransports(); // Reload data
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving transport:', error);
      const errorMessage = 'Failed to save transport';
      setError(errorMessage);
      
      toast({
        title: "❌ Save Failed",
        description: editingTransport ? "Could not update transport. Please try again." : "Could not add new transport. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    }
  };

  const handleEdit = (transport: Transport) => {
    setEditingTransport(transport);
    setFormData({
      label: transport.label,
      cost_per_day: transport.cost_per_day,
      type: transport.type || '',
      description: transport.description || '',
      image_url: transport.image_url || ''
    });
    setIsDialogOpen(true);
    
    toast({
      title: "✏️ Edit Mode",
      description: `Editing transport "${transport.label}"`,
      variant: "default",
      className: "border-l-4 border-l-purple-500 bg-purple-50 text-purple-900",
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transport option?')) {
      try {
        const transportToDelete = transports.find(t => Number(t.id) === id);
        await TransportService.deleteTransport(id);
        await loadTransports(); // Reload data
        
        toast({
          title: "🗑️ Transport Deleted",
          description: `"${transportToDelete?.label || 'Transport'}" has been permanently removed`,
          variant: "default",
          className: "border-l-4 border-l-orange-500 bg-orange-50 text-orange-900",
        });
      } catch (error) {
        console.error('Error deleting transport:', error);
        const errorMessage = 'Failed to delete transport';
        setError(errorMessage);
        
        toast({
          title: "❌ Deletion Failed",
          description: "Could not delete transport. Please try again.",
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
      title: "➕ Add New Transport",
      description: "Opening form to add new transport option",
      variant: "default",
      className: "border-l-4 border-l-indigo-500 bg-indigo-50 text-indigo-900",
    });
  };

  const getTransportIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'car':
      case 'sedan':
      case 'suv':
        return Car;
      case 'bus':
      case 'coach':
        return Truck;
      case 'plane':
      case 'flight':
        return Plane;
      default:
        return Car;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {loading ? (
        // Skeleton Loading
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Search Skeleton */}
          <div className="flex space-x-4">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Statistics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Professional Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center bg-gradient-to-br from-slate-50 to-white border-2 border-gray-100 p-6 rounded-lg shadow-lg"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#1A252F]">Transport Management</h1>
              <p className="text-[#2C3E50] mt-1 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                <Clock className="w-4 h-4 ml-4 mr-2" />
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <HoverRadiusButton onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transport
                </HoverRadiusButton>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#2C3E50] text-xl font-bold">
                    {editingTransport ? 'Edit Transport' : 'Add New Transport'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label" className="text-[#2C3E50] font-medium">Transport Name</Label>
                      <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({...formData, label: e.target.value})}
                        placeholder="e.g. Luxury Sedan, Tour Bus"
                        required
                        className="border-gray-300 focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-[#2C3E50] font-medium">Transport Type</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        placeholder="e.g. Car, Bus, Flight"
                        className="border-gray-300 focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="costPerDay" className="text-[#2C3E50] font-medium">Cost Per Day (AED)</Label>
                      <Input
                        id="costPerDay"
                        type="number"
                        value={formData.cost_per_day}
                        onChange={(e) => setFormData({...formData, cost_per_day: Number(e.target.value)})}
                        placeholder="Enter daily cost"
                        required
                        className="border-gray-300 focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageUrl" className="text-[#2C3E50] font-medium">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="Enter image URL"
                        className="border-gray-300 focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-[#2C3E50] font-medium">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter description"
                      className="border-gray-300 focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <HoverRadiusButton type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingTransport ? 'Update' : 'Save'}
                    </HoverRadiusButton>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex space-x-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transport options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#2C3E50] focus:ring-[#2C3E50] h-12"
              />
            </div>
            <Button 
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50 h-12 px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Professional Statistics */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="border-l-4 border-l-[#2C3E50] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Options</p>
                      <p className="text-3xl font-bold text-[#1A252F]">{transports.length}</p>
                      <p className="text-xs text-green-600 flex items-center mt-2">
                        <Car className="w-3 h-3 mr-1" />
                        Active listings
                      </p>
                    </div>
                    <div className="p-3 bg-[#2C3E50] rounded-full">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700 mb-1">Avg. Cost/Day</p>
                      <p className="text-3xl font-bold text-emerald-800">
                        AED {transports.length > 0 ? Math.round(transports.reduce((sum, t) => sum + t.cost_per_day, 0) / transports.length) : 0}
                      </p>
                      <p className="text-xs text-emerald-600 flex items-center mt-2">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Per day rate
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-500 rounded-full">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700 mb-1">Active Options</p>
                      <p className="text-3xl font-bold text-amber-800">
                        {transports.filter(t => t.is_active).length}
                      </p>
                      <p className="text-xs text-amber-600 flex items-center mt-2">
                        <Truck className="w-3 h-3 mr-1" />
                        Ready to book
                      </p>
                    </div>
                    <div className="p-3 bg-amber-500 rounded-full">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Vehicle Types</p>
                      <p className="text-3xl font-bold text-purple-800">
                        {new Set(transports.map(t => t.type).filter(Boolean)).size}
                      </p>
                      <p className="text-xs text-purple-600 flex items-center mt-2">
                        <Car className="w-3 h-3 mr-1" />
                        Different categories
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Transport Grid */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedTransports.map((transport, index) => {
              const IconComponent = getTransportIcon(transport.type || '');
              return (
                <motion.div
                  key={transport.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden h-full bg-white shadow-lg">
                    <div className="relative">
                      {transport.image_url ? (
                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                          <img 
                            src={transport.image_url} 
                            alt={transport.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <Badge className="absolute top-3 right-3 bg-[#2C3E50] text-white border-none shadow-lg">
                            AED {transport.cost_per_day}/day
                          </Badge>
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-[#2C3E50] to-[#1A252F] flex items-center justify-center relative">
                          <IconComponent className="w-16 h-16 text-white/70" />
                          <Badge className="absolute top-3 right-3 bg-white/20 text-white border-none">
                            AED {transport.cost_per_day}/day
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-[#2C3E50] group-hover:text-[#1A252F] transition-colors duration-200">
                        {transport.label}
                      </CardTitle>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <IconComponent className="w-4 h-4 mr-2" />
                          <span className="text-sm">{transport.type || 'Vehicle'}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {transport.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{transport.description}</p>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(transport)}
                          className="flex-1 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(transport.id!)}
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Custom Pagination */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center items-center space-x-2 mt-8"
            >
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-2 border-gray-200 hover:border-[#2C3E50] hover:bg-slate-50 text-[#2C3E50] disabled:opacity-50 px-6 py-3 rounded-lg transition-colors"
              >
                Previous
              </Button>
              
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-[#2C3E50] text-white px-4 py-3 rounded-lg shadow-md hover:bg-[#1A252F] transition-colors"
                        : "border-2 border-gray-200 hover:border-[#2C3E50] hover:bg-slate-50 text-[#2C3E50] px-4 py-3 rounded-lg transition-colors"
                    }
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-2 border-gray-200 hover:border-[#2C3E50] hover:bg-slate-50 text-[#2C3E50] disabled:opacity-50 px-6 py-3 rounded-lg transition-colors"
              >
                Next
              </Button>
            </motion.div>
          )}

          {/* Enhanced Empty State */}
          {filteredTransports.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No transport options found' : 'No transport options yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `No transport options match "${searchTerm}". Try adjusting your search.`
                    : 'Start building your transport fleet by adding your first vehicle option.'
                  }
                </p>
                {!searchTerm && (
                  <HoverRadiusButton onClick={handleAddNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Transport
                  </HoverRadiusButton>
                )}
              </Card>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <p className="text-red-800">{error}</p>
            </motion.div>
          )}
        </>
      )}
      
      {/* Toast Notifications */}
      <Toaster />
    </motion.div>
  );
}
