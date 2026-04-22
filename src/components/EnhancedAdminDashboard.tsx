import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BookOpen, 
  BarChart3, 
  Upload, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Plus,
  FileSpreadsheet,
  MapPin,
  Zap,
  Brain,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building2,
  Clock,
  Database,
  Wifi,
  Activity,
  Shield,
  Download,
  RefreshCw,
  Eye,
  Filter,
  Search,
  Bell,
  Award,
  Target,
  PieChart,
  BarChart,
  LineChart,
  Calendar as CalendarIcon,
  UserCheck,
  School,
  GraduationCap,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  MessageSquare,
  History,
  Menu,
  X,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';
import { Logo } from './Logo';
import { FileUploadZone } from './FileUploadZone';
import { useApp } from '../contexts/AppContext';
import { CurrentView } from '../App';
import { formatNumber, formatPercentage, formatTime, formatRatio } from '../utils/numberFormatter';

interface EnhancedAdminDashboardProps {
  onNavigate: (view: CurrentView) => void;
  onLogout: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export function EnhancedAdminDashboard({ onNavigate, onLogout, onToggleDarkMode, darkMode }: EnhancedAdminDashboardProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Mock real-time data with number formatting
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45.6789,
    memoryUsage: 62.4321,
    activeUsers: 247,
    apiResponseTime: 125.678,
    roomUtilization: 78.234,
    facultyWorkload: 85.567,
    conflictRate: 2.456
  });

  const user = state.currentUser;
  const institution = user.institution || 'Your Institution';

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview', desc: 'System dashboard' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', desc: 'Data insights' },
    { id: 'generate', icon: Zap, label: 'AI Generation', desc: 'Create timetables' },
    { id: 'collaborate', icon: MessageSquare, label: 'Collaboration', desc: 'Team workspace' },
    { id: 'faculty', icon: Users, label: 'Faculty', desc: 'Manage staff' },
    { id: 'students', icon: GraduationCap, label: 'Students', desc: 'Manage students' },
    { id: 'courses', icon: BookOpen, label: 'Courses', desc: 'Course management' },
    { id: 'resources', icon: Building2, label: 'Resources', desc: 'Rooms & equipment' },
    { id: 'reports', icon: FileSpreadsheet, label: 'Reports', desc: 'Export & analysis' },
    { id: 'settings', icon: Settings, label: 'Settings', desc: 'System configuration' }
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        activeUsers: Math.max(0, prev.activeUsers + Math.floor((Math.random() - 0.5) * 10)),
        apiResponseTime: Math.max(50, prev.apiResponseTime + (Math.random() - 0.5) * 30),
        roomUtilization: Math.max(0, Math.min(100, prev.roomUtilization + (Math.random() - 0.5) * 5)),
        facultyWorkload: Math.max(0, Math.min(100, prev.facultyWorkload + (Math.random() - 0.5) * 3)),
        conflictRate: Math.max(0, Math.min(10, prev.conflictRate + (Math.random() - 0.5) * 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleNavigateFromSidebar = (viewId: string) => {
    setIsMobileSidebarOpen(false);
    
    switch (viewId) {
      case 'analytics':
        onNavigate('analytics');
        break;
      case 'generate':
        onNavigate('generate');
        break;
      case 'collaborate':
        onNavigate('collaboration');
        break;
      default:
        setActiveTab(viewId);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="xs" showText={false} animated />
            <div>
              <h2 className="font-medium text-slate-900 dark:text-slate-100">Timelytics.ai</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigateFromSidebar(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'text-slate-600 dark:text-slate-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleDarkMode}
            className="flex-1"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="ml-2 hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex-1 ml-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="ml-2 hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {user.name || 'Admin'}!</h1>
            <p className="text-blue-100">{institution} • Administrator Dashboard</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Activity className="w-3 h-3 mr-1" />
                {systemMetrics.activeUsers} Active Users
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Clock className="w-3 h-3 mr-1" />
                {formatNumber(systemMetrics.apiResponseTime)}ms Response
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => onNavigate('generate')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
            <Button
              onClick={() => onNavigate('analytics')}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercentage(systemMetrics.cpuUsage)}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Progress value={systemMetrics.cpuUsage} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Memory</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercentage(systemMetrics.memoryUsage)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Progress value={systemMetrics.memoryUsage} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Room Utilization</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercentage(systemMetrics.roomUtilization)}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <Progress value={systemMetrics.roomUtilization} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Faculty Workload</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercentage(systemMetrics.facultyWorkload)}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <Progress value={systemMetrics.facultyWorkload} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { action: 'Timetable generated', time: '2 minutes ago', type: 'success' },
              { action: 'New faculty registered', time: '5 minutes ago', type: 'info' },
              { action: 'Room conflict resolved', time: '10 minutes ago', type: 'warning' },
              { action: 'System backup completed', time: '1 hour ago', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Zap, label: 'Generate Timetable', action: () => onNavigate('generate') },
                { icon: Upload, label: 'Import Data', action: () => setActiveTab('data') },
                { icon: BarChart3, label: 'View Analytics', action: () => onNavigate('analytics') },
                { icon: FileSpreadsheet, label: 'Export Reports', action: () => setActiveTab('reports') },
                { icon: Users, label: 'Manage Faculty', action: () => setActiveTab('faculty') },
                { icon: Settings, label: 'System Settings', action: () => setActiveTab('settings') }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={item.action}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs text-center">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Data Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Import and manage your institutional data</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Template
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>Upload CSV/Excel files for bulk data import</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone
              title="Upload Data Files"
              description="Upload CSV or Excel files for bulk data import"
              onFileSelect={(file) => {
                console.log('File selected:', file);
                // Handle file upload
                // You can process the file here or store it for later processing
              }}
              acceptedFileTypes={['.csv', '.xlsx', '.xls']}
              maxFileSize={10 * 1024 * 1024} // 10MB
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Statistics</CardTitle>
            <CardDescription>Current data overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Faculty Members', count: state.faculty.length, icon: Users },
              { label: 'Students', count: state.students.length, icon: GraduationCap },
              { label: 'Courses', count: state.courses.length, icon: BookOpen },
              { label: 'Rooms', count: state.rooms.length, icon: Building2 }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
                  </div>
                  <Badge>{item.count}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 xl:w-96">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navigation - Integrated into main content */}
        <div className="lg:hidden">
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetContent side="left" className="p-0 w-80">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Access different sections of the admin dashboard</SheetDescription>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 xl:p-8 overflow-auto">
          <div className="max-w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Mobile Tabs - Scrollable for 5 items */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Menu className="w-4 h-4" />
                    <span>Menu</span>
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={onToggleDarkMode}>
                      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <TabsList className="inline-flex w-auto min-w-full">
                    <TabsTrigger value="overview" className="text-xs px-3">Overview</TabsTrigger>
                    <TabsTrigger value="faculty" className="text-xs px-3">Faculty</TabsTrigger>
                    <TabsTrigger value="students" className="text-xs px-3">Students</TabsTrigger>
                    <TabsTrigger value="courses" className="text-xs px-3">Courses</TabsTrigger>
                    <TabsTrigger value="data" className="text-xs px-3">Data</TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              {/* Desktop Tabs */}
              <div className="hidden lg:block">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex">
                  <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="faculty" className="text-xs lg:text-sm">Faculty</TabsTrigger>
                  <TabsTrigger value="students" className="text-xs lg:text-sm">Students</TabsTrigger>
                  <TabsTrigger value="courses" className="text-xs lg:text-sm">Courses</TabsTrigger>
                  <TabsTrigger value="data" className="text-xs lg:text-sm">Data</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview">
                {renderOverview()}
              </TabsContent>

              <TabsContent value="data">
                {renderDataManagement()}
              </TabsContent>

              <TabsContent value="faculty">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Faculty Management</h2>
                      <p className="text-slate-600 dark:text-slate-400">Manage faculty members and their schedules</p>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Faculty
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Faculty Management</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Comprehensive faculty management system with workload balancing
                        </p>
                        <Button onClick={() => onNavigate('analytics')}>
                          View Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="students">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Student Management</h2>
                      <p className="text-slate-600 dark:text-slate-400">Manage student enrollment and preferences</p>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Student Management</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Manage student data, preferences, and timetable assignments
                        </p>
                        <Button onClick={() => onNavigate('collaboration')}>
                          Collaboration Tools
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Management</h2>
                      <p className="text-slate-600 dark:text-slate-400">NEP 2020 compliant course structure</p>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Course
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Course Management</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Multidisciplinary course management aligned with NEP 2020
                        </p>
                        <Button onClick={() => onNavigate('generate')}>
                          Generate Timetable
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}