import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Settings, 
  Download, 
  RefreshCw, 
  Moon, 
  Sun, 
  LogOut, 
  Bell,
  FileText,
  MapPin,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Award,
  TrendingUp,
  BarChart3,
  Heart,
  Coffee,
  Building2,
  Calendar as CalendarIcon,
  Bookmark,
  MessageSquare,
  Timer,
  Target,
  BookMarked,
  GraduationCap,
  Shield,
  Phone,
  Mail,
  Building,
  UserCheck,
  Eye,
  PlusCircle,
  MinusCircle,
  ArrowRight,
  Info,
  Menu,
  X,
  Home,
  ChevronDown,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Logo } from './Logo';
import { useApp } from '../contexts/AppContext';
import { CurrentView } from '../App';
import { formatNumber, formatPercentage, formatTime } from '../utils/numberFormatter';

interface EnhancedFacultyPortalProps {
  onNavigate: (view: CurrentView) => void;
  onLogout: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export function EnhancedFacultyPortal({ onNavigate, onLogout, onToggleDarkMode, darkMode }: EnhancedFacultyPortalProps) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('current');
  
  // Mock faculty data with formatted numbers
  const [facultyStats, setFacultyStats] = useState({
    weeklyHours: 18.678,
    maxHours: 20,
    efficiency: 92.456,
    studentRating: 4.567,
    coursesCompleted: 75.234,
    researchProgress: 68.789
  });

  const user = state.currentUser;
  const institution = user.institution || 'Your Institution';
  
  const sidebarItems = [
    { id: 'overview', icon: Home, label: 'Overview', desc: 'Dashboard summary' },
    { id: 'schedule', icon: Calendar, label: 'My Schedule', desc: 'View timetable' },
    { id: 'courses', icon: BookOpen, label: 'My Courses', desc: 'Course management' },
    { id: 'students', icon: GraduationCap, label: 'Students', desc: 'Student data' },
    { id: 'preferences', icon: Settings, label: 'Preferences', desc: 'Schedule settings' },
    { id: 'reports', icon: BarChart3, label: 'Reports', desc: 'Performance data' }
  ];

  // Mock schedule data
  const todaySchedule = [
    { time: '9:00 AM', course: 'Data Structures', room: 'CS-101', type: 'Theory', students: 45 },
    { time: '11:00 AM', course: 'Algorithm Design', room: 'CS-102', type: 'Theory', students: 38 },
    { time: '2:00 PM', course: 'Programming Lab', room: 'LAB-1', type: 'Lab', students: 25 },
    { time: '4:00 PM', course: 'Research Meeting', room: 'CONF-A', type: 'Meeting', students: 8 }
  ];

  const handleNavigateFromSidebar = (viewId: string) => {
    setIsMobileSidebarOpen(false);
    
    switch (viewId) {
      case 'analytics':
        onNavigate('analytics');
        break;
      case 'generate':
        onNavigate('generate');
        break;
      case 'collaboration':
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
              <p className="text-sm text-slate-500 dark:text-slate-400">Faculty Portal</p>
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

      {/* Faculty Profile */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              {(user.name || 'F').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{user.name || 'Faculty Member'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.department || 'Department'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.employeeId || 'ID: FAC001'}</p>
          </div>
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold">Welcome, {user.name || 'Faculty'}!</h1>
            <p className="text-green-100">{institution} • Faculty Dashboard</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(facultyStats.weeklyHours)} / {facultyStats.maxHours}h this week
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                {formatNumber(facultyStats.studentRating)}/5.0 Rating
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setActiveTab('schedule')}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
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

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Schedule</span>
            <Badge variant="secondary">{todaySchedule.length} Classes</Badge>
          </CardTitle>
          <CardDescription>Your schedule for today, {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{item.time}</p>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{item.course}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.room}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {item.students} students
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={item.type === 'Lab' ? 'default' : item.type === 'Theory' ? 'secondary' : 'outline'}>
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Weekly Workload</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatTime(facultyStats.weeklyHours)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">of {facultyStats.maxHours}h max</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Progress value={(facultyStats.weeklyHours / facultyStats.maxHours) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Teaching Efficiency</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercentage(facultyStats.efficiency)}</p>
                <p className="text-xs text-green-600 dark:text-green-400">+{formatNumber(2.3)}% this week</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Progress value={facultyStats.efficiency} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Student Rating</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(facultyStats.studentRating)}/5.0</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Based on {formatNumber(87)} reviews</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex items-center mt-3 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-3 h-3 rounded-full ${
                    star <= Math.floor(facultyStats.studentRating) 
                      ? 'bg-amber-400' 
                      : star === Math.ceil(facultyStats.studentRating) 
                      ? 'bg-amber-200' 
                      : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used faculty tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Calendar, label: 'View Schedule', action: () => setActiveTab('schedule') },
                { icon: BookOpen, label: 'My Courses', action: () => setActiveTab('courses') },
                { icon: BarChart3, label: 'Performance', action: () => setActiveTab('reports') },
                { icon: Settings, label: 'Preferences', action: () => setActiveTab('preferences') },
                { icon: MessageSquare, label: 'Collaborate', action: () => onNavigate('collaboration') },
                { icon: Download, label: 'Export Data', action: () => console.log('Export') }
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

        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Current semester progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { course: 'Data Structures', progress: 78.456, students: 45 },
              { course: 'Algorithm Design', progress: 65.234, students: 38 },
              { course: 'Programming Lab', progress: 82.789, students: 25 }
            ].map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{course.course}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{formatPercentage(course.progress)}</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">{course.students} students enrolled</p>
              </div>
            ))}
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
                <SheetTitle>Faculty Navigation Menu</SheetTitle>
                <SheetDescription>Access different sections of the faculty dashboard</SheetDescription>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 xl:p-8 overflow-auto">
          <div className="max-w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Mobile Tabs */}
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs">Schedule</TabsTrigger>
                  <TabsTrigger value="courses" className="text-xs">Courses</TabsTrigger>
                  <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Desktop Tabs */}
              <div className="hidden lg:block">
                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
                  <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs lg:text-sm">Schedule</TabsTrigger>
                  <TabsTrigger value="courses" className="text-xs lg:text-sm">Courses</TabsTrigger>
                  <TabsTrigger value="reports" className="text-xs lg:text-sm">Reports</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview">
                {renderOverview()}
              </TabsContent>

              <TabsContent value="schedule">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Schedule</h2>
                      <p className="text-slate-600 dark:text-slate-400">View and manage your teaching schedule</p>
                    </div>
                    <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current Week</SelectItem>
                        <SelectItem value="next">Next Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Schedule Management</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Interactive schedule view with conflict detection
                        </p>
                        <Button onClick={() => onNavigate('generate')}>
                          Generate New Schedule
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
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Courses</h2>
                      <p className="text-slate-600 dark:text-slate-400">Manage your assigned courses</p>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Request Course
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Course Management</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Comprehensive course management with student tracking
                        </p>
                        <Button onClick={() => onNavigate('analytics')}>
                          Course Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Performance Reports</h2>
                      <p className="text-slate-600 dark:text-slate-400">Analytics and performance insights</p>
                    </div>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Performance Analytics</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Detailed insights into your teaching performance
                        </p>
                        <Button onClick={() => onNavigate('analytics')}>
                          View Analytics
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