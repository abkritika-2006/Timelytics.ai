import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  User, 
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
  Plus,
  Star,
  PlayCircle,
  PauseCircle,
  Clipboard,
  Edit
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

interface EnhancedStudentPortalProps {
  onNavigate: (view: CurrentView) => void;
  onLogout: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export function EnhancedStudentPortal({ onNavigate, onLogout, onToggleDarkMode, darkMode }: EnhancedStudentPortalProps) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('current');
  
  // Mock student data with formatted numbers
  const [studentStats, setStudentStats] = useState({
    gpa: 8.567,
    attendance: 92.456,
    completedCourses: 18,
    totalCredits: 72.5,
    upcomingAssignments: 5,
    studyHours: 34.678,
    classEfficiency: 87.234
  });

  const user = state.currentUser;
  const institution = user.institution || 'Your Institution';
  
  const sidebarItems = [
    { id: 'overview', icon: Home, label: 'Overview', desc: 'Dashboard summary' },
    { id: 'schedule', icon: Calendar, label: 'My Timetable', desc: 'Class schedule' },
    { id: 'courses', icon: BookOpen, label: 'My Courses', desc: 'Enrolled courses' },
    { id: 'grades', icon: Award, label: 'Grades', desc: 'Academic progress' },
    { id: 'assignments', icon: Clipboard, label: 'Assignments', desc: 'Tasks & deadlines' },
    { id: 'preferences', icon: Settings, label: 'Preferences', desc: 'Schedule settings' }
  ];

  // Mock schedule data
  const todaySchedule = [
    { time: '9:00 AM', course: 'Mathematics I', room: 'MATH-101', type: 'Theory', faculty: 'Dr. Smith' },
    { time: '11:00 AM', course: 'Programming Lab', room: 'LAB-1', type: 'Lab', faculty: 'Prof. Johnson' },
    { time: '2:00 PM', course: 'Physics', room: 'PHY-201', type: 'Theory', faculty: 'Dr. Wilson' },
    { time: '4:00 PM', course: 'Study Group', room: 'LIB-A', type: 'Study', faculty: 'Self-organized' }
  ];

  // Mock assignments
  const upcomingAssignments = [
    { course: 'Mathematics I', title: 'Calculus Problem Set', due: '2 days', priority: 'high' },
    { course: 'Programming Lab', title: 'Data Structures Project', due: '5 days', priority: 'medium' },
    { course: 'Physics', title: 'Lab Report #3', due: '1 week', priority: 'low' }
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
              <p className="text-sm text-slate-500 dark:text-slate-400">Student Portal</p>
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

      {/* Student Profile */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
              {(user.name || 'S').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{user.name || 'Student'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.program || 'Program'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
              {user.rollNumber || 'Roll: STU001'} • {user.semester || 'Semester 5'}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">GPA: {formatNumber(studentStats.gpa)}/10.0</span>
          <Badge variant="secondary" className="text-xs">
            {formatPercentage(studentStats.attendance)} Attendance
          </Badge>
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
                isActive ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'text-slate-600 dark:text-slate-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.label}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />}
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold">Hello, {user.name || 'Student'}!</h1>
            <p className="text-purple-100">{institution} • Student Dashboard</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <GraduationCap className="w-3 h-3 mr-1" />
                GPA {formatNumber(studentStats.gpa)}/10.0
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                {formatPercentage(studentStats.attendance)} Attendance
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setActiveTab('schedule')}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Calendar className="w-4 h-4 mr-2" />
              My Timetable
            </Button>
            <Button
              onClick={() => setActiveTab('assignments')}
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Assignments
            </Button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Classes</span>
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
                        <User className="w-3 h-3 mr-1" />
                        {item.faculty}
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

      {/* Academic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Current GPA</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(studentStats.gpa)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">out of 10.0</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-3 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(studentStats.gpa / 2) 
                      ? 'text-purple-400 fill-purple-400' 
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Attendance</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatPercentage(studentStats.attendance)}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Above average</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Progress value={studentStats.attendance} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Study Hours</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatTime(studentStats.studyHours)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">this week</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Progress value={(studentStats.studyHours / 40) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Assignments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{studentStats.upcomingAssignments}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">due soon</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Clipboard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Next: Mathematics I (2 days)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Assignments</span>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('assignments')}>
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{assignment.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.course}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={assignment.priority === 'high' ? 'destructive' : assignment.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {assignment.due}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used student tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Calendar, label: 'View Schedule', action: () => setActiveTab('schedule') },
                { icon: BookOpen, label: 'My Courses', action: () => setActiveTab('courses') },
                { icon: Award, label: 'View Grades', action: () => setActiveTab('grades') },
                { icon: Clipboard, label: 'Assignments', action: () => setActiveTab('assignments') },
                { icon: MessageSquare, label: 'Study Groups', action: () => onNavigate('collaboration') },
                { icon: Download, label: 'Downloads', action: () => console.log('Downloads') }
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sheet */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1">{/* Mobile Header */}

          {/* Content Area */}
          <div className="p-4 lg:p-6 xl:p-8">
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
                  <TabsTrigger value="grades" className="text-xs">Grades</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Desktop Tabs */}
              <div className="hidden lg:block">
                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
                  <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs lg:text-sm">Schedule</TabsTrigger>
                  <TabsTrigger value="courses" className="text-xs lg:text-sm">Courses</TabsTrigger>
                  <TabsTrigger value="grades" className="text-xs lg:text-sm">Grades</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview">
                {renderOverview()}
              </TabsContent>

              <TabsContent value="schedule">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Timetable</h2>
                      <p className="text-slate-600 dark:text-slate-400">View your personalized class schedule</p>
                    </div>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current Semester</SelectItem>
                        <SelectItem value="next">Next Semester</SelectItem>
                        <SelectItem value="all">All Semesters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Personalized Timetable</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Your AI-optimized schedule based on preferences
                        </p>
                        <Button onClick={() => onNavigate('generate')}>
                          Request Schedule Change
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
                      <p className="text-slate-600 dark:text-slate-400">Current semester enrollments</p>
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Enroll Course
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Course Management</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Manage your enrolled courses and track progress
                        </p>
                        <Button onClick={() => onNavigate('analytics')}>
                          Course Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="grades">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Academic Performance</h2>
                      <p className="text-slate-600 dark:text-slate-400">Track your grades and progress</p>
                    </div>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download Transcript
                    </Button>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Academic Analytics</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Comprehensive grade tracking and performance insights
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