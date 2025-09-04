import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Dashboard } from '@/components/admin/Dashboard';
import { AttractionsManager } from '@/components/admin/AttractionsManager';
import { HotelsManager } from '@/components/admin/HotelsManager';
import { TransportManager } from '@/components/admin/TransportManager';
import { CustomersManager } from '@/components/admin/CustomersManager';
import { BookingsManager } from '@/components/admin/BookingsManager';
import { SystemSettings } from '@/components/admin/SystemSettings';
import ReportsAnalytics from './ReportsAnalytics';
import AuthWrapper from '@/components/AuthWrapper';

// Placeholder components for other sections
const ReportsManager = () => <ReportsAnalytics />;

export default function AdminPanelNew() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'attractions':
        return <AttractionsManager />;
      case 'hotels':
        return <HotelsManager />;
      case 'transports':
        return <TransportManager />;
      case 'customers':
        return <CustomersManager />;
      case 'bookings':
        return <BookingsManager />;
      case 'reports':
        return <ReportsManager />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthWrapper>
  );
}
