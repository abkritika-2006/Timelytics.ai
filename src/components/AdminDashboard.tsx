import { useState } from 'react';
import { motion } from 'motion/react';
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
  Building,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Logo } from './Logo';
import { FileUploadZone } from './FileUploadZone';
import { useApp } from '../contexts/AppContext';
import { CurrentView } from '../App';

interface AdminDashboardProps {
  onNavigate: (view: CurrentView) => void;
  onLogout: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export function AdminDashboard({ onNavigate, onLogout, onToggleDarkMode, darkMode }: AdminDashboardProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadProgress, setUploadProgress] = useState(0);

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'generate', icon: Calendar, label: 'Generate Timetable' },
    { id: 'faculty', icon: Users, label: 'Manage Faculty' },
    { id: 'courses', icon: BookOpen, label: 'Manage Courses' },
    { id: 'reports', icon: BarChart3, label: 'Reports' }
  ];

  const handleGenerateTimetable = () => {
    onNavigate('generate');
  };

  const handleFileUpload = async (file: File, type: 'students' | 'faculty' | 'courses' | 'rooms') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    setUploadProgress(0);

    // Simulate file upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Load sample data (in real app, would parse CSV/Excel file)
    dispatch({ type: 'LOAD_SAMPLE_DATA' });
    dispatch({ type: 'SET_LOADING', payload: false });
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="sm" showText />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
              Admin
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={onToggleDarkMode} variant="ghost" size="sm">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={onLogout} variant="ghost" size="sm" className="text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Mobile Tab Navigation */}
        <div className="px-4 pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Logo size="sm" showText />
            <div className="mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Admin Portal
              </Badge>
            </div>
          </div>

          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 dark:bg-gray-700 border-r-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <Button
              onClick={onToggleDarkMode}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8">
            {activeTab === 'dashboard' && (
            <div>
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl text-gray-800 dark:text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Manage your institution's timetable generation system</p>
              </div>

              {/* Main Action Card */}
              <Card className="mb-6 sm:mb-8 border-0 bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center text-white text-lg sm:text-xl">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    AI-Powered Timetable Generation
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-sm sm:text-base">
                    Upload data and generate optimized timetables in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-white/20 rounded-lg p-3 sm:p-4">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                      <h4 className="mb-1 text-sm sm:text-base">Upload Student Data</h4>
                      <p className="text-xs sm:text-sm text-blue-100">CSV/Excel files with enrollment info</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 sm:p-4">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                      <h4 className="mb-1 text-sm sm:text-base">Add Faculty Details</h4>
                      <p className="text-xs sm:text-sm text-blue-100">Availability and expertise mapping</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                      <MapPin className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                      <h4 className="mb-1 text-sm sm:text-base">Configure Resources</h4>
                      <p className="text-xs sm:text-sm text-blue-100">Classrooms, labs, and equipment</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleGenerateTimetable}
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Generate Timetable
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">Total Students</p>
                          <p className="text-xl sm:text-2xl lg:text-3xl text-blue-700 dark:text-blue-200">{state.students.length}</p>
                          <p className="text-xs text-blue-500 mt-1 hidden sm:block">+12% from last semester</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-green-600 dark:text-green-300">Faculty Members</p>
                          <p className="text-xl sm:text-2xl lg:text-3xl text-green-700 dark:text-green-200">{state.faculty.length}</p>
                          <p className="text-xs text-green-500 mt-1 hidden sm:block">Avg. 18h/week workload</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-300">Active Courses</p>
                          <p className="text-xl sm:text-2xl lg:text-3xl text-purple-700 dark:text-purple-200">{state.courses.length}</p>
                          <p className="text-xs text-purple-500 mt-1 hidden sm:block">NEP 2020 compliant</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-300">Classrooms</p>
                          <p className="text-xl sm:text-2xl lg:text-3xl text-orange-700 dark:text-orange-200">{state.rooms.length}</p>
                          <p className="text-xs text-orange-500 mt-1 hidden sm:block">87% utilization</p>
                        </div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                          <Building className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base">Timetable generated for Semester 5</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base">5 new faculty members added</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base">Course catalog updated for NEP 2020</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div>
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl text-gray-800 dark:text-white">Manage Faculty</h1>
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Faculty
                </Button>
              </div>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Faculty Information</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Upload faculty data or add individual members</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload" className="text-sm">Bulk Upload</TabsTrigger>
                      <TabsTrigger value="manual" className="text-sm">Add Manually</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4">
                      <FileUploadZone
                        title="Upload Faculty Data"
                        description="Include: Name, Department, Subjects, Availability, Max Hours"
                        acceptedTypes={['.csv', '.xlsx', '.xls']}
                        onFileUpload={(file) => handleFileUpload(file, 'faculty')}
                        loading={state.loading}
                        progress={uploadProgress}
                      />
                    </TabsContent>
                    <TabsContent value="manual" className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Faculty Name</Label>
                          <Input id="name" placeholder="Dr. John Smith" />
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Input id="department" placeholder="Computer Science" />
                        </div>
                        <div>
                          <Label htmlFor="subjects">Subjects</Label>
                          <Input id="subjects" placeholder="Data Structures, Algorithms" />
                        </div>
                        <div>
                          <Label htmlFor="workload">Max Weekly Hours</Label>
                          <Input id="workload" type="number" placeholder="20" />
                        </div>
                      </div>
                      <Button className="w-full">Add Faculty Member</Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl text-gray-800 dark:text-white">Manage Courses</h1>
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Course Configuration</CardTitle>
                  <CardDescription className="text-sm sm:text-base">NEP 2020 compliant course structure</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="courseCode">Course Code</Label>
                      <Input id="courseCode" placeholder="CS101" />
                    </div>
                    <div>
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input id="courseName" placeholder="Introduction to Programming" />
                    </div>
                    <div>
                      <Label htmlFor="credits">Credits</Label>
                      <Input id="credits" type="number" placeholder="4" />
                    </div>
                    <div>
                      <Label htmlFor="courseType">Course Type</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700">
                        <option>Major</option>
                        <option>Minor</option>
                        <option>Skill Enhancement</option>
                        <option>Ability Enhancement</option>
                        <option>Value Added</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="description">Course Description</Label>
                    <textarea 
                      id="description"
                      className="w-full p-2 border border-gray-300 rounded-md h-24 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Course objectives and learning outcomes..."
                    />
                  </div>
                  <Button className="mt-4 w-full sm:w-auto">Save Course</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h1 className="text-2xl sm:text-3xl text-gray-800 dark:text-white mb-4 sm:mb-6">Reports & Analytics</h1>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Faculty Workload Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-48 sm:h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-sm sm:text-base">Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Room Utilization</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-48 sm:h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-sm sm:text-base">Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Course Enrollment Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="h-48 sm:h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-sm sm:text-base">Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Quick Export</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-3">
                    <Button className="w-full text-sm" variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Faculty Report
                    </Button>
                    <Button className="w-full text-sm" variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Course Report
                    </Button>
                    <Button className="w-full text-sm" variant="outline" size="sm">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Timetable Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}