import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  DollarSign,
  Search, 
  Filter,
  Edit, 
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Package,
  Globe,
  Star,
  Hotel,
  Car,
  Plus
} from 'lucide-react';
import { BookingService } from '@/services/supabaseService';
import type { Booking } from '@/config/supabaseConfig';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

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

interface ItineraryDay {
  day?: number;
  title: string;
  description: string;
}

export function BookingsManager() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Load bookings from database
  useEffect(() => {
    const initializeBookings = async () => {
      // Welcome toast on component mount
      toast({
        title: "📋 Bookings Manager",
        description: "Loading booking data from database...",
        variant: "default",
        className: "border-l-4 border-l-slate-500 bg-slate-50 text-slate-900",
      });
      
      await loadBookings();
    };
    
    initializeBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getAllBookings();
      setBookings(data);
      setError(null);
      
      // Success toast for data load
      toast({
        title: "✅ Data Loaded Successfully",
        description: `${data.length} bookings retrieved from database`,
        variant: "default",
        className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
      });
    } catch (err) {
      console.error('Error loading bookings:', err);
      const errorMessage = 'Failed to load bookings';
      setError(errorMessage);
      
      // Error toast for failed load
      toast({
        title: "❌ Loading Failed",
        description: "Unable to retrieve bookings from database. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.departure_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.package_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.booking_status === statusFilter);
    }

    setFilteredBookings(filtered);

    // Show search/filter results toast
    if (searchTerm || statusFilter !== 'all') {
      const filterText = searchTerm ? `"${searchTerm}"` : '';
      const statusText = statusFilter !== 'all' ? ` (${statusFilter} status)` : '';
      
      toast({
        title: "🔍 Search Results",
        description: `Found ${filtered.length} bookings matching ${filterText}${statusText}`,
        variant: "default",
        className: "border-l-4 border-l-cyan-500 bg-cyan-50 text-cyan-900",
      });
    }
  }, [bookings, searchTerm, statusFilter, toast]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await BookingService.updateBooking(id, { booking_status: newStatus as any });
      await loadBookings(); // Reload data
      setIsEditDialogOpen(false);
      
      // Success toast for status update
      toast({
        title: "✅ Status Updated",
        description: `Booking status changed to "${newStatus.toUpperCase()}" successfully`,
        variant: "default",
        className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = 'Failed to update booking status';
      setError(errorMessage);
      
      // Error toast for failed update
      toast({
        title: "❌ Update Failed",
        description: "Could not update booking status. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await BookingService.deleteBooking(id);
        await loadBookings(); // Reload data
        
        // Success toast for deletion
        toast({
          title: "🗑️ Booking Deleted",
          description: "Booking has been permanently removed from the system",
          variant: "default",
          className: "border-l-4 border-l-orange-500 bg-orange-50 text-orange-900",
        });
      } catch (error) {
        console.error('Error deleting booking:', error);
        const errorMessage = 'Failed to delete booking';
        setError(errorMessage);
        
        // Error toast for failed deletion
        toast({
          title: "❌ Deletion Failed",
          description: "Could not delete booking. Please try again.",
          variant: "destructive",
          className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
        });
      }
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header Skeleton */}
        <div className="flex justify-between items-center bg-gradient-to-br from-slate-50 to-white border-2 border-gray-100 p-6 rounded-lg shadow-lg">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Statistics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="p-12 text-center border-2 border-red-200 bg-red-50">
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
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Data</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <HoverRadiusButton onClick={loadBookings}>
            Try Again
          </HoverRadiusButton>
        </Card>
      </motion.div>
    );
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.booking_status === 'pending').length,
    confirmed: bookings.filter(b => b.booking_status === 'confirmed').length,
    completed: bookings.filter(b => b.booking_status === 'completed').length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.estimated_cost || 0), 0),
    totalTravelers: bookings.reduce((sum, b) => sum + (b.total_travelers || 0), 0)
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Professional Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center bg-gradient-to-br from-slate-50 to-white border-2 border-gray-100 p-6 rounded-lg shadow-lg"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#1A252F]">Bookings Management</h1>
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
      </motion.div>

      {/* Professional Statistics */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-6 gap-4"
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-[#2C3E50] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-[#1A252F]">{stats.total}</p>
                  <p className="text-xs text-green-600 flex items-center mt-2">
                    <Package className="w-3 h-3 mr-1" />
                    All orders
                  </p>
                </div>
                <div className="p-3 bg-[#2C3E50] rounded-full">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    Awaiting action
                  </p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Confirmed</p>
                  <p className="text-2xl font-bold text-green-800">{stats.confirmed}</p>
                  <p className="text-xs text-green-600 flex items-center mt-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready to go
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.completed}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-2">
                    <Star className="w-3 h-3 mr-1" />
                    Finished trips
                  </p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 mb-1">Revenue</p>
                  <p className="text-lg font-bold text-emerald-800">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-xs text-emerald-600 flex items-center mt-2">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Total earned
                  </p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-full">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-700 mb-1">Travelers</p>
                  <p className="text-2xl font-bold text-indigo-800">{stats.totalTravelers}</p>
                  <p className="text-xs text-indigo-600 flex items-center mt-2">
                    <Users className="w-3 h-3 mr-1" />
                    Total guests
                  </p>
                </div>
                <div className="p-3 bg-indigo-500 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, email, phone, package, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#2C3E50] focus:ring-[#2C3E50] h-12"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-gray-300 h-12">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={() => {
            loadBookings();
            toast({
              title: "🔄 Refreshing Data",
              description: "Fetching latest booking information...",
              variant: "default",
              className: "border-l-4 border-l-indigo-500 bg-indigo-50 text-indigo-900",
            });
          }} 
          variant="outline" 
          className="border-gray-300 hover:bg-gray-50 h-12 px-6"
        >
          Refresh
        </Button>
      </motion.div>

      {/* Enhanced Bookings Grid */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {paginatedBookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden h-full bg-white shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#2C3E50] group-hover:text-[#1A252F] transition-colors duration-200 truncate">
                      {booking.full_name}
                    </CardTitle>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600 truncate">{booking.email}</span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(booking.booking_status)} border shadow-sm`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(booking.booking_status)}
                      <span className="capitalize">{booking.booking_status || 'pending'}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2 text-[#2C3E50]" />
                    <span className="truncate">{booking.package_title || 'No package title'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-[#2C3E50]" />
                    <span>{booking.country_code} {booking.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-[#2C3E50]" />
                    <span>{booking.departure_country}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-[#2C3E50]" />
                    <span>{booking.trip_duration} days • {booking.journey_month}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-[#2C3E50]" />
                    <span>{booking.total_travelers} travelers</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-[#2C3E50]" />
                    <span className="font-medium text-emerald-600">{formatCurrency(booking.estimated_cost)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Download className="w-4 h-4 mr-2 text-[#2C3E50]" />
                    <span>{booking.download_count || 0} downloads</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Booked: {formatDate(booking.created_at)}
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsViewDialogOpen(true);
                      toast({
                        title: "👁️ Viewing Details",
                        description: `Opening detailed view for ${booking.full_name}`,
                        variant: "default",
                        className: "border-l-4 border-l-purple-500 bg-purple-50 text-purple-900",
                      });
                    }}
                    className="flex-1 border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsEditDialogOpen(true);
                      toast({
                        title: "✏️ Edit Mode",
                        description: `Editing booking for ${booking.full_name}`,
                        variant: "default",
                        className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
                      });
                    }}
                    className="flex-1 border-green-300 text-green-600 hover:bg-green-50 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(booking.id!)}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1);
              setCurrentPage(newPage);
              toast({
                title: "◀️ Previous Page",
                description: `Navigated to page ${newPage} of ${totalPages}`,
                variant: "default",
                className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
              });
            }}
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
                onClick={() => {
                  setCurrentPage(page);
                  toast({
                    title: `📄 Page ${page}`,
                    description: `Viewing bookings ${((page - 1) * itemsPerPage) + 1}-${Math.min(page * itemsPerPage, filteredBookings.length)} of ${filteredBookings.length}`,
                    variant: "default",
                    className: "border-l-4 border-l-indigo-500 bg-indigo-50 text-indigo-900",
                  });
                }}
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
            onClick={() => {
              const newPage = Math.min(currentPage + 1, totalPages);
              setCurrentPage(newPage);
              toast({
                title: "▶️ Next Page",
                description: `Navigated to page ${newPage} of ${totalPages}`,
                variant: "default",
                className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
              });
            }}
            disabled={currentPage === totalPages}
            className="border-2 border-gray-200 hover:border-[#2C3E50] hover:bg-slate-50 text-[#2C3E50] disabled:opacity-50 px-6 py-3 rounded-lg transition-colors"
          >
            Next
          </Button>
        </motion.div>
      )}

      {/* Enhanced Empty State */}
      {filteredBookings.length === 0 && !loading && (
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
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No bookings match your search criteria. Try adjusting your filters.' 
                : 'Travel bookings will appear here once customers download their itineraries.'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  toast({
                    title: "🔄 Filters Cleared",
                    description: "All search filters have been reset",
                    variant: "default",
                    className: "border-l-4 border-l-gray-500 bg-gray-50 text-gray-900",
                  });
                }}
                className="border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white"
              >
                Clear Filters
              </Button>
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E50] text-xl font-bold">Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={`${getStatusColor(selectedBooking.booking_status)} border w-fit`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedBooking.booking_status)}
                      <span className="capitalize">{selectedBooking.booking_status || 'pending'}</span>
                    </div>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.country_code} {selectedBooking.phone}</p>
                </div>
              </div>

              {/* Package Info */}
              <div>
                <Label className="text-sm font-medium">Package Details</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{selectedBooking.package_title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedBooking.package_description}</p>
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Trip Duration</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.trip_duration} days</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Journey Month</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.journey_month}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departure Country</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.departure_country}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.budget || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Adults</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.adults}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kids</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.kids || 0}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Infants</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.infants || 0}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Travelers</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.total_travelers}</p>
                </div>
              </div>

              {/* Emirates */}
              <div>
                <Label className="text-sm font-medium">Selected Emirates</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedBooking.emirates.map((emirate, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {emirate === 'all' ? 'All Emirates' : emirate}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Cost Information */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Estimated Cost</Label>
                  <p className="text-sm text-gray-700 font-semibold">{formatCurrency(selectedBooking.estimated_cost)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Price Range Min</Label>
                  <p className="text-sm text-gray-700">{formatCurrency(selectedBooking.price_range_min)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Price Range Max</Label>
                  <p className="text-sm text-gray-700">{formatCurrency(selectedBooking.price_range_max)}</p>
                </div>
              </div>

              {/* Itinerary */}
              {selectedBooking.itinerary_data && selectedBooking.itinerary_data.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Itinerary</Label>
                  <div className="mt-2 space-y-3 max-h-60 overflow-y-auto">
                    {selectedBooking.itinerary_data.map((day: ItineraryDay, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-sm text-gray-800">
                          Day {day.day || index + 1}: {day.title}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">{day.description}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <Hotel className="w-3 h-3 mr-1 text-gray-500" />
                            <span>{day.hotel || 'Hotel'}</span>
                          </div>
                          <div className="flex items-center">
                            <Car className="w-3 h-3 mr-1 text-gray-500" />
                            <span>{day.transport || 'Transport'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Downloads</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.download_count || 0} times</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Booking Date</Label>
                  <p className="text-sm text-gray-700">{formatDate(selectedBooking.created_at)}</p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2C3E50] text-xl font-bold">Update Booking Status</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <p className="text-sm text-gray-700">{selectedBooking.full_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Package</Label>
                <p className="text-sm text-gray-700">{selectedBooking.package_title}</p>
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select 
                  defaultValue={selectedBooking.booking_status || 'pending'}
                  onValueChange={(value) => handleStatusUpdate(selectedBooking.id!, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Toast Notifications */}
      <Toaster />
    </motion.div>
  );
}
