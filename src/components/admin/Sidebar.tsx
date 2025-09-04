import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MapPin, 
  Hotel, 
  Car, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  Calendar,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Custom Hover Radius Button Component (from TravelForm)
function HoverRadiusButton({ 
  children, 
  onClick, 
  isActive = false, 
  className = "" 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  isActive?: boolean; 
  className?: string;
}) {
  const [hover, setHover] = useState(false);

  const buttonStyle: React.CSSProperties = {
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
    color: isActive ? "#FFF" : "#E5E7EB",
    width: "100%",
    padding: "16px 20px",
    textDecoration: "none",
    fontWeight: isActive ? "600" : "500",
    fontSize: "14px",
    fontFamily: "Nunito, sans-serif",
    borderRadius: hover ? "8px" : isActive ? "8px" : "0px 0px 30px 0px",
    transition: "all 0.4s ease",
    boxShadow: hover
      ? "0 6px 14px rgba(0,0,0,0.15)"
      : isActive 
        ? "0 4px 10px rgba(0,0,0,0.1)"
        : "none",
    border: isActive ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    overflow: "hidden"
  };

  return (
    <button
      type="button"
      style={buttonStyle}
      className={`${className} group`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {/* Background gradient on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 opacity-0 transition-opacity duration-300 ${
          hover ? 'opacity-100' : ''
        }`}
      />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </button>
  );
}

const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & Analytics',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'attractions',
    label: 'Attractions',
    icon: MapPin,
    description: 'Manage Tourist Places',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'hotels',
    label: 'Hotels',
    icon: Hotel,
    description: 'Manage Accommodations',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'transports',
    label: 'Transport',
    icon: Car,
    description: 'Manage Transportation',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
    description: 'Customer Bookings',
    color: 'from-rose-400 to-red-500'
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    description: 'Customer Management',
    color: 'from-indigo-400 to-blue-500'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    description: 'Analytics & Reports',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'System Configuration',
    color: 'from-slate-400 to-gray-500'
  }
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false); // Close mobile menu on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle tab change and auto-close on mobile
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center border border-slate-600/50 backdrop-blur-lg"
          style={{ borderRadius: isOpen ? "8px" : "0px 0px 30px 0px" }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.div>
        </motion.button>
      )}

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile ? 'z-50' : 'z-10'}
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        ${isCollapsed && !isMobile ? 'w-20' : 'w-80'} 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen overflow-y-auto shadow-2xl
        transition-all duration-500 ease-in-out flex flex-col
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -15, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-40 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
          />
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-b border-slate-700/50 ${isCollapsed && !isMobile ? 'p-4' : 'p-6 md:p-8'} transition-all duration-500`}
        >
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center w-full' : 'space-x-4'}`}>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-10 h-10 md:w-12 md:h-12'} bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500`}
              >
                <FileText className={`${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-5 h-5 md:w-7 md:h-7'} text-slate-900`} />
              </motion.div>
              
              {/* Hide text when collapsed on desktop */}
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                      UAE Travels
                    </h1>
                    <p className="text-slate-400 text-xs md:text-sm font-medium">Admin Portal</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close button for mobile */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
          </div>
          
          {/* Welcome Message - Hide when collapsed */}
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4 p-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30"
              >
                <p className="text-slate-300 text-sm">
                  <span className="text-amber-400 font-semibold">Welcome back!</span>
                  <br />Manage your travel empire
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <nav className={`relative flex-1 ${isCollapsed && !isMobile ? 'p-2' : 'p-4 md:p-6'} transition-all duration-500`}>
          <div className={`${isCollapsed && !isMobile ? 'space-y-1' : 'space-y-2 md:space-y-3'} transition-all duration-500`}>
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap shadow-lg border border-slate-600">
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs text-slate-300">{item.description}</div>
                      {/* Arrow */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
                    </div>
                  )}

                  <HoverRadiusButton
                    isActive={isActive}
                    onClick={() => handleTabChange(item.id)}
                    className={`${isCollapsed && !isMobile ? 'mb-1' : 'mb-1 md:mb-2'}`}
                  >
                    <div className={`flex items-center w-full ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3 md:space-x-4'} transition-all duration-500`}>
                      {/* Icon with gradient background */}
                      <motion.div 
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.6 }}
                        className={`
                          ${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-8 h-8 md:w-10 md:h-10'} rounded-xl flex items-center justify-center transition-all duration-500
                          ${isActive 
                            ? `bg-gradient-to-br ${item.color} shadow-lg scale-110` 
                            : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                          }
                        `}
                      >
                        <Icon className={`${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4 md:w-5 md:h-5'} transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`} />
                      </motion.div>
                      
                      {/* Content - Hide when collapsed */}
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.div 
                            className="flex-1 text-left"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className={`text-sm md:text-base font-semibold transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-xs transition-colors duration-300 ${
                              isActive ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'
                            }`}>
                              {item.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Active indicator arrow - Hide when collapsed */}
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.div
                            animate={{ 
                              x: isActive ? 0 : -10,
                              opacity: isActive ? 1 : 0 
                            }}
                            transition={{ duration: 0.3 }}
                            initial={{ opacity: 0, x: -10 }}
                            exit={{ opacity: 0, x: -10 }}
                          >
                            <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                              isActive 
                                ? 'text-amber-400 scale-100 opacity-100' 
                                : 'text-slate-500 scale-75 opacity-0 group-hover:opacity-50'
                            }`} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </HoverRadiusButton>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={`border-t border-slate-600/30 ${isCollapsed && !isMobile ? 'my-2' : 'my-4 md:my-6'} transition-all duration-500`}
          />

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="relative group"
          >
            {/* Tooltip for collapsed logout */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap shadow-lg border border-slate-600">
                <div className="font-semibold">Sign Out</div>
                <div className="text-xs text-slate-300">End your session</div>
                {/* Arrow */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-600"></div>
              </div>
            )}

            <HoverRadiusButton
              onClick={() => {
                // Clear authentication
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userEmail');
                
                toast({
                  title: "Logged Out Successfully",
                  description: "You have been signed out of your account",
                  variant: "default",
                });
                
                // Redirect to login
                navigate('/login');
                
                if (isMobile) setIsOpen(false);
              }}
              className="mb-2"
            >
              <div className={`flex items-center w-full ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3 md:space-x-4'} transition-all duration-500`}>
                <motion.div 
                  whileHover={{ rotate: -15 }}
                  className={`${isCollapsed && !isMobile ? 'w-10 h-10' : 'w-8 h-8 md:w-10 md:h-10'} rounded-xl bg-red-500/20 flex items-center justify-center transition-all duration-500 group-hover:bg-red-500/30`}
                >
                  <LogOut className={`${isCollapsed && !isMobile ? 'w-5 h-5' : 'w-4 h-4 md:w-5 md:h-5'} text-red-400 group-hover:text-red-300 transition-colors duration-300`} />
                </motion.div>
                
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.div 
                      className="flex-1 text-left"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-sm md:text-base font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
                        Sign Out
                      </div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                        End your session
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </HoverRadiusButton>
          </motion.div>
        </nav>

        
      </div>

      {/* Desktop Toggle Button - Positioned on the left side */}
      {!isMobile && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleCollapse}
          className={`fixed top-6 z-20 w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg flex items-center justify-center border border-slate-600/50 transition-all duration-500 ${
            isCollapsed ? 'left-24' : 'left-72'
          }`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      )}
    </>
  );
}
