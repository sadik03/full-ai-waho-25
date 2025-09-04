import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
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
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { TravelSubmissionService } from '@/services/supabaseService';
import type { TravelSubmission } from '@/config/supabaseConfig';

export function CustomersManager() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<TravelSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<TravelSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<TravelSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load submissions from database
  useEffect(() => {
    const initializeSubmissions = async () => {
      toast({
        title: "👥 Customers Manager",
        description: "Loading customer submissions from database...",
        variant: "default",
        className: "border-l-4 border-l-slate-500 bg-slate-50 text-slate-900",
      });
      await loadSubmissions();
    };
    
    initializeSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await TravelSubmissionService.getAllSubmissions();
      setSubmissions(data);
      setError(null);
      
      toast({
        title: "✅ Data Loaded Successfully",
        description: `${data.length} customer submissions retrieved from database`,
        variant: "default",
        className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
      });
    } catch (err) {
      console.error('Error loading submissions:', err);
      const errorMessage = 'Failed to load customer submissions';
      setError(errorMessage);
      
      toast({
        title: "❌ Loading Failed",
        description: "Unable to retrieve customer submissions from database. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter submissions based on search and status
  useEffect(() => {
    let filtered = submissions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.phone.includes(searchTerm) ||
        submission.departure_country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.submission_status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter]);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await TravelSubmissionService.updateSubmission(id, { 
        submission_status: newStatus as 'pending' | 'processing' | 'completed' | 'cancelled' 
      });
      await loadSubmissions(); // Reload data
      setIsEditDialogOpen(false);
      
      toast({
        title: "✅ Status Updated",
        description: `Customer submission status changed to "${newStatus.toUpperCase()}" successfully`,
        variant: "default",
        className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = 'Failed to update submission status';
      setError(errorMessage);
      
      toast({
        title: "❌ Update Failed",
        description: "Could not update submission status. Please try again.",
        variant: "destructive",
        className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this customer submission?')) {
      try {
        const submissionToDelete = submissions.find(s => Number(s.id) === id);
        await TravelSubmissionService.deleteSubmission(id);
        await loadSubmissions(); // Reload data
        
        toast({
          title: "🗑️ Submission Deleted",
          description: `Customer submission from "${submissionToDelete?.full_name || 'Customer'}" has been permanently removed`,
          variant: "default",
          className: "border-l-4 border-l-orange-500 bg-orange-50 text-orange-900",
        });
      } catch (error) {
        console.error('Error deleting submission:', error);
        const errorMessage = 'Failed to delete submission';
        setError(errorMessage);
        
        toast({
          title: "❌ Deletion Failed",
          description: "Could not delete customer submission. Please try again.",
          variant: "destructive",
          className: "border-l-4 border-l-red-500 bg-red-50 text-red-900",
        });
      }
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Data</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={loadSubmissions} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.submission_status === 'pending').length,
    processing: submissions.filter(s => s.submission_status === 'processing').length,
    completed: submissions.filter(s => s.submission_status === 'completed').length,
    totalTravelers: submissions.reduce((sum, s) => sum + (s.total_travelers || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-amber-600 bg-clip-text text-transparent">
          Customer Management
        </h1>
        <p className="text-gray-600 mt-1">Manage travel form submissions and customer inquiries</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Processing</p>
                <p className="text-2xl font-bold text-blue-900">{stats.processing}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Travelers</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalTravelers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, email, phone, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-blue-200">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={() => {
            toast({
              title: "🔄 Refreshing Data",
              description: "Fetching latest customer submissions...",
              variant: "default",
              className: "border-l-4 border-l-indigo-500 bg-indigo-50 text-indigo-900",
            });
            loadSubmissions();
          }} 
          variant="outline" 
          className="border-blue-200 hover:bg-blue-50"
        >
          Refresh
        </Button>
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-lg transition-all duration-300 border-blue-100">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-blue-800 truncate">{submission.full_name}</CardTitle>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-600 truncate">{submission.email}</span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(submission.submission_status)} border`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(submission.submission_status)}
                    <span className="capitalize">{submission.submission_status || 'pending'}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{submission.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{submission.departure_country}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{submission.trip_duration} nights • {submission.journey_month}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{submission.total_travelers || submission.adults} travelers</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Submitted: {formatDate(submission.created_at)}
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setIsViewDialogOpen(true);
                  }}
                  className="flex-1 border-blue-200 hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setIsEditDialogOpen(true);
                  }}
                  className="flex-1 border-green-200 hover:bg-green-50 text-green-600"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(submission.id!)}
                  className="flex-1 border-red-200 hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customer submissions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'No submissions match your search criteria.' 
              : 'Customer travel form submissions will appear here once they start submitting inquiries.'}
          </p>
        </Card>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={`${getStatusColor(selectedSubmission.submission_status)} border w-fit`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedSubmission.submission_status)}
                      <span className="capitalize">{selectedSubmission.submission_status || 'pending'}</span>
                    </div>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trip Duration</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.trip_duration} nights</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Journey Month</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.journey_month}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departure Country</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.departure_country}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.budget || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Adults</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.adults}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Kids</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.kids || 0}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Infants</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.infants || 0}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Travelers</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.total_travelers}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Selected Emirates</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSubmission.emirates.map((emirate, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {emirate === 'all' ? 'All Emirates' : emirate}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Submission Date</Label>
                <p className="text-sm text-gray-700">{formatDate(selectedSubmission.created_at)}</p>
              </div>
              {selectedSubmission.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-gray-700">{selectedSubmission.notes}</p>
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
            <DialogTitle>Update Submission Status</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <p className="text-sm text-gray-700">{selectedSubmission.full_name}</p>
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select 
                  defaultValue={selectedSubmission.submission_status || 'pending'}
                  onValueChange={(value) => handleStatusUpdate(selectedSubmission.id!, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
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
    </div>
  );
}
