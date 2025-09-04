import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  Activity,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TravelSubmissionService, HotelsService, AttractionsService, TransportService } from '@/services/supabaseService';
import '@/styles/print.css';

// Custom Hover Radius Button Component
function HoverRadiusButton({ text, onClick, className = "", type = "button", disabled = false }: {
  text: React.ReactNode;
  onClick: (e?: React.FormEvent) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);

  const buttonStyle: React.CSSProperties = {
    backgroundColor: disabled ? "#94A3B8" : "#2C3E50",
    color: "#FFFFFF",
    padding: "12px 20px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "Nunito, sans-serif",
    borderRadius: hover && !disabled ? "2px" : "0px 0px 25px 0px",
    transition: "all 0.4s ease",
    boxShadow: hover && !disabled
      ? "0 6px 14px rgba(0,0,0,0.2)"
      : "0 2px 6px rgba(0,0,0,0.1)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
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

// Interface definitions
interface AnalyticsData {
  totalSubmissions: number;
  totalRevenue: number;
  averageBookingValue: number;
  completionRate: number;
  monthlySubmissions: Array<{ month: string; submissions: number; revenue: number }>;
  emiratesDistribution: Array<{ emirate: string; count: number; percentage: number }>;
  budgetDistribution: Array<{ range: string; count: number; value: number }>;
  countryDistribution: Array<{ country: string; count: number }>;
  recentSubmissions: Array<any>;
  popularAttractions: Array<{ name: string; bookings: number }>;
  monthlyTrends: Array<{ month: string; submissions: number; customers: number; revenue: number }>;
}

const COLORS = ['#2C3E50', '#E74C3C', '#3498DB', '#F39C12', '#27AE60', '#9B59B6', '#E67E22', '#1ABC9C'];

export default function ReportsAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [chartType, setChartType] = useState('bar');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data from different services
      const [submissions, hotels, attractions, transport] = await Promise.all([
        TravelSubmissionService.getAllSubmissions(),
        HotelsService.getAllHotels(),
        AttractionsService.getAllAttractions(),
        TransportService.getAllTransport()
      ]);

      // Process submissions data for analytics
      const processedData = processSubmissionsData(submissions, attractions);
      setAnalyticsData(processedData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Process submissions data into analytics
  const processSubmissionsData = (submissions: any[], attractions: any[]): AnalyticsData => {
    const currentDate = new Date();
    const daysBack = parseInt(dateRange);
    const dateThreshold = new Date(currentDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Filter submissions by date range
    const filteredSubmissions = submissions.filter(sub => 
      new Date(sub.created_at) >= dateThreshold
    );

    // Calculate basic metrics
    const totalSubmissions = filteredSubmissions.length;
    const budgetToRevenue = (budget: string): number => {
      if (!budget) return 0;
      const budgetMap: { [key: string]: number } = {
        '1,000 - 3,000': 2000,
        '3,000 - 5,000': 4000,
        '5,000 - 10,000': 7500,
        '10,000 - 20,000': 15000,
        '20,000+': 25000
      };
      return budgetMap[budget] || 0;
    };

    const totalRevenue = filteredSubmissions.reduce((sum, sub) => 
      sum + budgetToRevenue(sub.budget), 0
    );
    const averageBookingValue = totalSubmissions > 0 ? totalRevenue / totalSubmissions : 0;
    const completionRate = (filteredSubmissions.filter(sub => sub.submission_status === 'completed').length / totalSubmissions) * 100;

    // Monthly submissions and revenue
    const monthlyData = getMonthlyData(filteredSubmissions, budgetToRevenue);

    // Emirates distribution
    const emiratesCount: { [key: string]: number } = {};
    filteredSubmissions.forEach(sub => {
      if (sub.emirates && Array.isArray(sub.emirates)) {
        sub.emirates.forEach((emirate: string) => {
          if (emirate !== 'all') {
            emiratesCount[emirate] = (emiratesCount[emirate] || 0) + 1;
          }
        });
      }
    });

    const emiratesDistribution = Object.entries(emiratesCount).map(([emirate, count]) => ({
      emirate: emirate.charAt(0).toUpperCase() + emirate.slice(1).replace('-', ' '),
      count,
      percentage: (count / totalSubmissions) * 100
    }));

    // Budget distribution
    const budgetCount: { [key: string]: number } = {};
    filteredSubmissions.forEach(sub => {
      if (sub.budget) {
        budgetCount[sub.budget] = (budgetCount[sub.budget] || 0) + 1;
      }
    });

    const budgetDistribution = Object.entries(budgetCount).map(([range, count]) => ({
      range,
      count,
      value: budgetToRevenue(range)
    }));

    // Country distribution
    const countryCount: { [key: string]: number } = {};
    filteredSubmissions.forEach(sub => {
      if (sub.departure_country) {
        countryCount[sub.departure_country] = (countryCount[sub.departure_country] || 0) + 1;
      }
    });

    const countryDistribution = Object.entries(countryCount)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Popular attractions (mock data based on emirates)
    const popularAttractions = emiratesDistribution.slice(0, 5).map(item => ({
      name: `${item.emirate} Attractions`,
      bookings: item.count
    }));

    // Monthly trends
    const monthlyTrends = monthlyData.map(item => ({
      ...item,
      customers: Math.floor(item.submissions * 2.5), // Estimated customers
    }));

    return {
      totalSubmissions,
      totalRevenue,
      averageBookingValue,
      completionRate,
      monthlySubmissions: monthlyData,
      emiratesDistribution,
      budgetDistribution,
      countryDistribution,
      recentSubmissions: filteredSubmissions.slice(0, 10),
      popularAttractions,
      monthlyTrends
    };
  };

  // Get monthly data for charts
  const getMonthlyData = (submissions: any[], budgetToRevenue: (budget: string) => number) => {
    const monthlyMap: { [key: string]: { submissions: number; revenue: number } } = {};
    
    submissions.forEach(sub => {
      const date = new Date(sub.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { submissions: 0, revenue: 0 };
      }
      
      monthlyMap[monthKey].submissions += 1;
      monthlyMap[monthKey].revenue += budgetToRevenue(sub.budget);
    });

    return Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      submissions: data.submissions,
      revenue: data.revenue
    }));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
  };

  // Print report
  const handlePrint = () => {
    window.print();
  };

  // Export to PDF
  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('reports-content');
      if (!element) return;

      // Temporarily add PDF export class for better styling
      element.classList.add('pdf-export');

      // Create canvas from the reports content
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        logging: false,
        removeContainer: false
      });

      // Remove the temporary class
      element.classList.remove('pdf-export');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit the content
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add title page
      pdf.setFontSize(20);
      pdf.text('Travel Analytics Report', 20, 30);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
      pdf.text(`Date Range: Last ${dateRange} days`, 20, 50);
      
      // Add first page with content
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      pdf.save(`travel-analytics-report-${timestamp}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Export data (placeholder)
  const handleExport = () => {
    if (!analyticsData) return;
    
    // Create comprehensive report data
    const reportData = {
      generated_at: new Date().toISOString(),
      date_range: `Last ${dateRange} days`,
      summary: {
        total_submissions: analyticsData.totalSubmissions,
        total_revenue: analyticsData.totalRevenue,
        average_booking_value: analyticsData.averageBookingValue,
        completion_rate: analyticsData.completionRate
      },
      monthly_data: analyticsData.monthlySubmissions,
      emirates_distribution: analyticsData.emiratesDistribution,
      budget_distribution: analyticsData.budgetDistribution,
      country_distribution: analyticsData.countryDistribution,
      recent_submissions: analyticsData.recentSubmissions.map(sub => ({
        name: sub.full_name,
        email: sub.email,
        country: sub.departure_country,
        budget: sub.budget,
        status: sub.submission_status,
        date: sub.created_at
      }))
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(() => {
      if (!refreshing && !loading) {
        fetchAnalyticsData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-[#2C3E50]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto" id="reports-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1A252F] mb-2">Reports & Analytics</h1>
              <p className="text-[#2C3E50] text-lg">Comprehensive insights for your travel business</p>
              <p className="text-sm text-gray-500 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 print-hide">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </div>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <HoverRadiusButton
                text={
                  <>
                    {refreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refresh
                  </>
                }
                onClick={handleRefresh}
                disabled={refreshing}
              />
              
              <HoverRadiusButton
                text={
                  <>
                    <Printer className="w-4 h-4" />
                    Print
                  </>
                }
                onClick={handlePrint}
              />
              
              <HoverRadiusButton
                text={
                  <>
                    <Download className="w-4 h-4" />
                    Export PDF
                  </>
                }
                onClick={handleExportPDF}
              />
            </div>
          </div>
        </motion.div>

        {analyticsData && (
          <>
            {/* Key Metrics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print-optimize"
            >
              <Card className="border-l-4 border-l-[#2C3E50] shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                      <p className="text-2xl font-bold text-[#1A252F]">{analyticsData.totalSubmissions}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12% from last period
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-[#2C3E50]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-[#1A252F]">
                        {new Intl.NumberFormat('en-AE', { 
                          style: 'currency', 
                          currency: 'AED',
                          minimumFractionDigits: 0 
                        }).format(analyticsData.totalRevenue)}
                      </p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8% from last period
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Booking Value</p>
                      <p className="text-2xl font-bold text-[#1A252F]">
                        {new Intl.NumberFormat('en-AE', { 
                          style: 'currency', 
                          currency: 'AED',
                          minimumFractionDigits: 0 
                        }).format(analyticsData.averageBookingValue)}
                      </p>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" />
                        Stable trend
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-[#1A252F]">{analyticsData.completionRate.toFixed(1)}%</p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -2% from last period
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts Row 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print-optimize"
            >
              {/* Monthly Submissions Chart */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#1A252F]">Monthly Submissions & Revenue</CardTitle>
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'bar' ? (
                      <BarChart data={analyticsData.monthlySubmissions}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            border: '2px solid #2C3E50',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}
                          formatter={(value, name) => [
                            name === 'revenue' 
                              ? new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(Number(value))
                              : value,
                            name === 'revenue' ? 'Revenue (AED)' : 'Submissions'
                          ]}
                        />
                        <Legend />
                        <Bar dataKey="submissions" fill="#2C3E50" name="Submissions" />
                        <Bar dataKey="revenue" fill="#3498DB" name="Revenue (AED)" />
                      </BarChart>
                    ) : chartType === 'line' ? (
                      <LineChart data={analyticsData.monthlySubmissions}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            border: '2px solid #2C3E50',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Line type="monotone" dataKey="submissions" stroke="#2C3E50" strokeWidth={3} name="Submissions" />
                        <Line type="monotone" dataKey="revenue" stroke="#3498DB" strokeWidth={3} name="Revenue (AED)" />
                      </LineChart>
                    ) : (
                      <AreaChart data={analyticsData.monthlySubmissions}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            border: '2px solid #2C3E50',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Area type="monotone" dataKey="submissions" stackId="1" stroke="#2C3E50" fill="#2C3E50" fillOpacity={0.6} name="Submissions" />
                        <Area type="monotone" dataKey="revenue" stackId="2" stroke="#3498DB" fill="#3498DB" fillOpacity={0.6} name="Revenue (AED)" />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Emirates Distribution Pie Chart */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#1A252F]">Popular Emirates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.emiratesDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ emirate, percentage }) => `${emirate} (${percentage.toFixed(1)}%)`}
                      >
                        {analyticsData.emiratesDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '2px solid #2C3E50',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts Row 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print-optimize"
            >
              {/* Budget Distribution */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#1A252F]">Budget Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.budgetDistribution} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="range" type="category" stroke="#6B7280" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '2px solid #2C3E50',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="count" fill="#E74C3C" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#1A252F]">Top Departure Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.countryDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="country" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '2px solid #2C3E50',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="count" fill="#27AE60" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Submissions Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="print-optimize"
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#1A252F]">Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-3 font-semibold text-[#1A252F]">Name</th>
                          <th className="text-left p-3 font-semibold text-[#1A252F]">Email</th>
                          <th className="text-left p-3 font-semibold text-[#1A252F]">Country</th>
                          <th className="text-left p-3 font-semibold text-[#1A252F]">Emirates</th>
                          <th className="text-left p-3 font-semibold text-[#1A252F]">Budget</th>
                          <th className="text-left p-3 font-semibold text-[#1A252F]">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.recentSubmissions.map((submission, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-[#2C3E50]">{submission.full_name}</td>
                            <td className="p-3 text-[#2C3E50]">{submission.email}</td>
                            <td className="p-3 text-[#2C3E50]">{submission.departure_country}</td>
                            <td className="p-3 text-[#2C3E50]">
                              {submission.emirates?.join(', ') || 'All'}
                            </td>
                            <td className="p-3 text-[#2C3E50]">{submission.budget || 'Not specified'}</td>
                            <td className="p-3 text-[#2C3E50]">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
