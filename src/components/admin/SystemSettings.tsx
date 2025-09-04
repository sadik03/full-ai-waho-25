import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Palette,
  Users,
  Key,
  Server,
  Cloud,
  FileText,
  Camera,
  Lock,
  Smartphone,
  Monitor,
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, icon: Icon, color, children }: SettingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/90 backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${color} text-white`}>
          <CardTitle className="flex items-center space-x-3 text-lg font-bold">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center"
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <div>
              <div>{title}</div>
              <div className="text-sm font-normal opacity-90">{description}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingItem({ label, description, children }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between space-x-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors duration-200">
      <div className="flex-1">
        <Label className="text-sm font-semibold text-slate-800">{label}</Label>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}

export function SystemSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'UAE Travels',
    siteDescription: 'Premium Travel Experiences Across the United Arab Emirates',
    contactEmail: 'admin@uaetravels.com',
    contactPhone: '+971 4 123 4567',
    timezone: 'Asia/Dubai',
    language: 'en',
    currency: 'AED',
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 60,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    ipWhitelisting: false,
    
    // Email Settings
    emailProvider: 'smtp',
    smtpHost: 'mail.uaetravels.com',
    smtpPort: 587,
    smtpUsername: 'noreply@uaetravels.com',
    smtpPassword: '',
    emailSignature: 'Best regards,\nUAE Travels Team',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingAlerts: true,
    systemAlerts: true,
    
    // UI/UX Settings
    darkMode: false,
    compactView: false,
    showAnimations: true,
    autoSave: true,
    
    // Database Settings
    backupFrequency: 'daily',
    retentionPeriod: 30,
    compressionEnabled: true,
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
    cachingEnabled: true,
    
    // File Settings
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
    cloudStorage: true,
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      setHasChanges(false);
      
      toast({
        title: "✅ Settings Saved Successfully",
        description: "All system settings have been updated and applied.",
        variant: "default",
        className: "border-l-4 border-l-green-500 bg-green-50 text-green-900",
      });
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      siteName: 'UAE Travels',
      siteDescription: 'Premium Travel Experiences Across the United Arab Emirates',
      contactEmail: 'admin@uaetravels.com',
      contactPhone: '+971 4 123 4567',
      timezone: 'Asia/Dubai',
      language: 'en',
      currency: 'AED',
      twoFactorAuth: true,
      sessionTimeout: 60,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      ipWhitelisting: false,
      emailProvider: 'smtp',
      smtpHost: 'mail.uaetravels.com',
      smtpPort: 587,
      smtpUsername: 'noreply@uaetravels.com',
      smtpPassword: '',
      emailSignature: 'Best regards,\nUAE Travels Team',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingAlerts: true,
      systemAlerts: true,
      darkMode: false,
      compactView: false,
      showAnimations: true,
      autoSave: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      compressionEnabled: true,
      apiRateLimit: 1000,
      apiTimeout: 30,
      cachingEnabled: true,
      maxFileSize: 10,
      allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
      cloudStorage: true,
    });
    setHasChanges(false);
    
    toast({
      title: "🔄 Settings Reset",
      description: "All settings have been restored to their default values.",
      variant: "default",
      className: "border-l-4 border-l-blue-500 bg-blue-50 text-blue-900",
    });
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uae-travels-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "📁 Settings Exported",
      description: "Settings configuration has been downloaded as JSON file.",
      variant: "default",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(prev => ({ ...prev, ...importedSettings }));
          setHasChanges(true);
          
          toast({
            title: "📥 Settings Imported",
            description: "Configuration has been imported successfully.",
            variant: "default",
            className: "border-l-4 border-l-purple-500 bg-purple-50 text-purple-900",
          });
        } catch (error) {
          toast({
            title: "❌ Import Failed",
            description: "Invalid settings file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              System Settings
            </h1>
            <p className="text-slate-600 text-lg">
              Configure and manage your travel platform settings, security, and preferences.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={`px-4 py-2 ${hasChanges ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
              {hasChanges ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Unsaved Changes
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  All Saved
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-slate-300 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button
            onClick={handleExportSettings}
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Settings
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid gap-8">
        {/* General Settings */}
        <SettingsSection
          title="General Configuration"
          description="Basic site information and regional settings"
          icon={Globe}
          color="from-blue-500 to-cyan-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteName" className="text-sm font-semibold text-slate-700">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="contactEmail" className="text-sm font-semibold text-slate-700">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="contactPhone" className="text-sm font-semibold text-slate-700">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteDescription" className="text-sm font-semibold text-slate-700">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="timezone" className="text-sm font-semibold text-slate-700">Timezone</Label>
                  <select
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Asia/Dubai">Dubai</option>
                    <option value="Asia/Abu_Dhabi">Abu Dhabi</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="language" className="text-sm font-semibold text-slate-700">Language</Label>
                  <select
                    id="language"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="currency" className="text-sm font-semibold text-slate-700">Currency</Label>
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="AED">AED</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection
          title="Security & Authentication"
          description="Manage security policies and access controls"
          icon={Shield}
          color="from-red-500 to-pink-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SettingItem
                label="Two-Factor Authentication"
                description="Require 2FA for admin accounts"
              >
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </SettingItem>
              
              <SettingItem
                label="IP Whitelisting"
                description="Restrict access to specific IP addresses"
              >
                <Switch
                  checked={settings.ipWhitelisting}
                  onCheckedChange={(checked) => handleSettingChange('ipWhitelisting', checked)}
                />
              </SettingItem>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-slate-700">Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-slate-700">Password Expiry (days)</Label>
                <Input
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-slate-700">Max Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Email Settings */}
        <SettingsSection
          title="Email Configuration"
          description="Configure SMTP settings and email templates"
          icon={Mail}
          color="from-amber-500 to-orange-500"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-slate-700">SMTP Host</Label>
                <Input
                  value={settings.smtpHost}
                  onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-700">SMTP Port</Label>
                  <Input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Email Provider</Label>
                  <select
                    value={settings.emailProvider}
                    onChange={(e) => handleSettingChange('emailProvider', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-slate-700">SMTP Username</Label>
                <Input
                  value={settings.smtpUsername}
                  onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-slate-700">SMTP Password</Label>
                <div className="relative mt-2">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-slate-700">Email Signature</Label>
              <Textarea
                value={settings.emailSignature}
                onChange={(e) => handleSettingChange('emailSignature', e.target.value)}
                className="mt-2"
                rows={8}
                placeholder="Enter your email signature..."
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          title="Notifications & Alerts"
          description="Configure notification preferences and alert settings"
          icon={Bell}
          color="from-purple-500 to-indigo-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">Communication Channels</h4>
              
              <SettingItem
                label="Email Notifications"
                description="Receive notifications via email"
              >
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </SettingItem>
              
              <SettingItem
                label="SMS Notifications"
                description="Receive notifications via SMS"
              >
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </SettingItem>
              
              <SettingItem
                label="Push Notifications"
                description="Browser push notifications"
              >
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </SettingItem>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">Alert Types</h4>
              
              <SettingItem
                label="Booking Alerts"
                description="New bookings and changes"
              >
                <Switch
                  checked={settings.bookingAlerts}
                  onCheckedChange={(checked) => handleSettingChange('bookingAlerts', checked)}
                />
              </SettingItem>
              
              <SettingItem
                label="System Alerts"
                description="System errors and maintenance"
              >
                <Switch
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
                />
              </SettingItem>
            </div>
          </div>
        </SettingsSection>

        {/* UI/UX Settings */}
        <SettingsSection
          title="User Interface & Experience"
          description="Customize the admin panel appearance and behavior"
          icon={Palette}
          color="from-green-500 to-emerald-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SettingItem
                label="Dark Mode"
                description="Use dark theme for the interface"
              >
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </SettingItem>
              
              <SettingItem
                label="Compact View"
                description="Reduce spacing and padding"
              >
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) => handleSettingChange('compactView', checked)}
                />
              </SettingItem>
            </div>
            
            <div className="space-y-4">
              <SettingItem
                label="Show Animations"
                description="Enable interface animations"
              >
                <Switch
                  checked={settings.showAnimations}
                  onCheckedChange={(checked) => handleSettingChange('showAnimations', checked)}
                />
              </SettingItem>
              
              <SettingItem
                label="Auto Save"
                description="Automatically save changes"
              >
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </SettingItem>
            </div>
          </div>
        </SettingsSection>

        {/* Database Settings */}
        <SettingsSection
          title="Database & Backup"
          description="Configure database backup and maintenance settings"
          icon={Database}
          color="from-slate-500 to-gray-600"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-semibold text-slate-700">Backup Frequency</Label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-slate-700">Retention Period (days)</Label>
              <Input
                type="number"
                value={settings.retentionPeriod}
                onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <SettingItem
                  label="Compression"
                  description="Enable backup compression"
                >
                  <Switch
                    checked={settings.compressionEnabled}
                    onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                  />
                </SettingItem>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* API Settings */}
        <SettingsSection
          title="API Configuration"
          description="Configure API limits and performance settings"
          icon={Server}
          color="from-cyan-500 to-blue-600"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-semibold text-slate-700">Rate Limit (requests/hour)</Label>
              <Input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-slate-700">Timeout (seconds)</Label>
              <Input
                type="number"
                value={settings.apiTimeout}
                onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                className="mt-2"
              />
            </div>
            
            <div>
              <SettingItem
                label="Caching"
                description="Enable API response caching"
              >
                <Switch
                  checked={settings.cachingEnabled}
                  onCheckedChange={(checked) => handleSettingChange('cachingEnabled', checked)}
                />
              </SettingItem>
            </div>
          </div>
        </SettingsSection>

        {/* File Settings */}
        <SettingsSection
          title="File Management"
          description="Configure file upload and storage settings"
          icon={FileText}
          color="from-indigo-500 to-purple-600"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-slate-700">Max File Size (MB)</Label>
                <Input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-slate-700">Allowed File Types</Label>
                <Input
                  value={settings.allowedFileTypes}
                  onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                  className="mt-2"
                  placeholder="jpg,jpeg,png,pdf,doc,docx"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <SettingItem
                label="Cloud Storage"
                description="Store files in cloud storage"
              >
                <Switch
                  checked={settings.cloudStorage}
                  onCheckedChange={(checked) => handleSettingChange('cloudStorage', checked)}
                />
              </SettingItem>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-6 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Configuration Status</p>
              <p className="text-xs text-slate-600">Last updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-white">
              <Zap className="w-3 h-3 mr-1" />
              System Online
            </Badge>
            <Badge variant="outline" className="bg-white">
              <Database className="w-3 h-3 mr-1" />
              DB Connected
            </Badge>
          </div>
        </div>
      </motion.div>

      <Toaster />
    </div>
  );
}
