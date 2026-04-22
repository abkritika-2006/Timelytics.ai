import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Clock,
  MapPin,
  BookOpen,
  Award,
  Target,
  Gauge,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowLeft,
  Sun,
  Moon,
  Eye,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Building2,
  GraduationCap,
  UserCheck,
  Timer,
  Brain,
  Lightbulb,
  Share2,
  Settings,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  RadialBarChart,
  RadialBar,
  Area,
  AreaChart
} from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../contexts/AppContext';
import { formatNumber, formatPercentage, formatTime, formatRatio } from '../utils/numberFormatter';

interface AdvancedAnalyticsDashboardProps {
  onBack: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

interface AnalyticsData {
  facultyUtilization: Array<{
    name: string;
    hours: number;
    efficiency: number;
    satisfaction: number;
  }>;
  roomUtilization: Array<{
    room: string;
    utilization: number;
    capacity: number;
    type: 'classroom' | 'lab' | 'hall';
  }>;
  timeSlotAnalysis: Array<{
    time: string;
    utilization: number;
    conflicts: number;
    satisfaction: number;
  }>;
  subjectDistribution: Array<{
    subject: string;
    hours: number;
    students: number;
    color: string;
  }>;
  weeklyTrends: Array<{
    week: string;
    efficiency: number;
    conflicts: number;
    satisfaction: number;
  }>;
  nepCompliance: {
    multidisciplinary: number;
    flexibility: number;
    skillDevelopment: number;
    overall: number;
  };
}

export function AdvancedAnalyticsDashboard({ onBack, onToggleDarkMode, darkMode }: AdvancedAnalyticsDashboardProps) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock analytics data
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    facultyUtilization: [
      { name: 'Dr. Sarah Johnson', hours: 18, efficiency: 92, satisfaction: 4.6 },
      { name: 'Prof. Mike Wilson', hours: 16, efficiency: 88, satisfaction: 4.4 },
      { name: 'Dr. Alice Brown', hours: 20, efficiency: 85, satisfaction: 4.2 },
      { name: 'Dr. John Smith', hours: 15, efficiency: 95, satisfaction: 4.8 },
      { name: 'Prof. Lisa Davis', hours: 17, efficiency: 90, satisfaction: 4.5 }
    ],
    roomUtilization: [
      { room: 'Room 101', utilization: 85, capacity: 50, type: 'classroom' },
      { room: 'Room 102', utilization: 78, capacity: 45, type: 'classroom' },
      { room: 'Lab 203', utilization: 92, capacity: 30, type: 'lab' },
      { room: 'Lab 201', utilization: 88, capacity: 25, type: 'lab' },
      { room: 'Hall A', utilization: 65, capacity: 100, type: 'hall' },
      { room: 'Hall B', utilization: 72, capacity: 80, type: 'hall' }
    ],
    timeSlotAnalysis: [
      { time: '09:00-10:00', utilization: 95, conflicts: 0, satisfaction: 4.5 },
      { time: '10:00-11:00', utilization: 92, conflicts: 1, satisfaction: 4.3 },
      { time: '11:00-12:00', utilization: 88, conflicts: 0, satisfaction: 4.6 },
      { time: '12:00-13:00', utilization: 45, conflicts: 0, satisfaction: 3.8 },
      { time: '13:00-14:00', utilization: 70, conflicts: 2, satisfaction: 4.0 },
      { time: '14:00-15:00', utilization: 85, conflicts: 1, satisfaction: 4.2 },
      { time: '15:00-16:00', utilization: 80, conflicts: 0, satisfaction: 4.4 },
      { time: '16:00-17:00', utilization: 65, conflicts: 0, satisfaction: 4.1 }
    ],
    subjectDistribution: [
      { subject: 'Data Structures', hours: 24, students: 180, color: '#3b82f6' },
      { subject: 'Computer Networks', hours: 20, students: 160, color: '#10b981' },
      { subject: 'Database Systems', hours: 18, students: 140, color: '#8b5cf6' },
      { subject: 'Software Engineering', hours: 22, students: 170, color: '#f59e0b' },
      { subject: 'Machine Learning', hours: 16, students: 120, color: '#ef4444' }
    ],
    weeklyTrends: [
      { week: 'Week 1', efficiency: 85, conflicts: 8, satisfaction: 4.2 },
      { week: 'Week 2', efficiency: 88, conflicts: 6, satisfaction: 4.3 },
      { week: 'Week 3', efficiency: 92, conflicts: 4, satisfaction: 4.5 },
      { week: 'Week 4', efficiency: 90, conflicts: 5, satisfaction: 4.4 },
      { week: 'Week 5', efficiency: 94, conflicts: 3, satisfaction: 4.6 },
      { week: 'Week 6', efficiency: 96, conflicts: 2, satisfaction: 4.7 }
    ],
    nepCompliance: {
      multidisciplinary: 92,
      flexibility: 88,
      skillDevelopment: 95,
      overall: 91
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.dataKey.includes('percentage') || entry.dataKey.includes('efficiency') || entry.dataKey.includes('satisfaction') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-slate-100">
                    Advanced Analytics
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Comprehensive insights and performance metrics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Semester</SelectItem>
                  <SelectItem value="previous">Previous Semester</SelectItem>
                  <SelectItem value="yearly">Yearly View</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button onClick={onToggleDarkMode} variant="ghost" size="sm">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="compliance">NEP Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      94%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Overall Efficiency
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-green-500 text-sm">99.2%</div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      3
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Active Conflicts
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {formatNumber(4.567)}/5.0
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      User Satisfaction
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                        <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-blue-500 text-sm">+8%</div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      82%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Resource Utilization
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Weekly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>
                    Weekly efficiency and satisfaction metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={analyticsData.weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="week" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} />
                      <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Time Slot Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Slot Utilization
                  </CardTitle>
                  <CardDescription>
                    Hourly usage patterns and efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.timeSlotAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="utilization" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Subject Distribution
                  </CardTitle>
                  <CardDescription>
                    Teaching hours by subject area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.subjectDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="hours"
                      >
                        {analyticsData.subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {analyticsData.subjectDistribution.map((subject, index) => (
                      <div key={subject.subject} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {subject.subject}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Room Utilization
                  </CardTitle>
                  <CardDescription>
                    Classroom and lab usage efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.roomUtilization}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="room" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="utilization" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Faculty Tab */}
          <TabsContent value="faculty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Faculty Performance Analytics
                </CardTitle>
                <CardDescription>
                  Detailed analysis of faculty workload and efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Faculty Chart */}
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analyticsData.facultyUtilization}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="efficiency" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Faculty Details */}
                  <div className="grid gap-4">
                    {analyticsData.facultyUtilization.map((faculty, index) => (
                      <div key={faculty.name} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {faculty.name}
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">
                              {faculty.hours}h/week
                            </Badge>
                            <Badge variant={faculty.efficiency >= 90 ? 'default' : 'secondary'}>
                              {formatPercentage(faculty.efficiency)} efficient
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                              Weekly Hours
                            </div>
                            <Progress value={(faculty.hours / 25) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                              Efficiency Score
                            </div>
                            <Progress value={faculty.efficiency} className="h-2" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                              Satisfaction
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{formatNumber(faculty.satisfaction)}</span>
                              <span className="text-xs text-slate-500">/5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Room Utilization Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.roomUtilization.map((room) => (
                      <div key={room.room} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {room.room}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                              Capacity: {room.capacity} • Type: {room.type}
                            </div>
                          </div>
                          <Badge variant={room.utilization >= 80 ? 'default' : 'secondary'}>
                            {formatPercentage(room.utilization)}
                          </Badge>
                        </div>
                        <Progress value={room.utilization} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Utilization Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        82%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Average Room Utilization
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Classrooms</span>
                          <span>81%</span>
                        </div>
                        <Progress value={81} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Laboratories</span>
                          <span>90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Halls</span>
                          <span>68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Performance Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Advanced performance metrics and predictive analytics coming soon
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-blue-600 dark:text-blue-400">AI Insights</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-sm text-green-600 dark:text-green-400">Trend Analysis</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Lightbulb className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm text-purple-600 dark:text-purple-400">Recommendations</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Target className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-sm text-orange-600 dark:text-orange-400">Goal Tracking</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* NEP Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  NEP 2020 Compliance Analysis
                </CardTitle>
                <CardDescription>
                  Assessment of compliance with National Education Policy guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {analyticsData.nepCompliance.overall}%
                      </div>
                      <div className="text-lg text-slate-900 dark:text-slate-100 mb-1">
                        Overall Compliance Score
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Excellent compliance with NEP 2020 guidelines
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Multidisciplinary Approach</span>
                          <span className="font-medium">{analyticsData.nepCompliance.multidisciplinary}%</span>
                        </div>
                        <Progress value={analyticsData.nepCompliance.multidisciplinary} className="h-3" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Flexibility & Choice</span>
                          <span className="font-medium">{analyticsData.nepCompliance.flexibility}%</span>
                        </div>
                        <Progress value={analyticsData.nepCompliance.flexibility} className="h-3" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Skill Development</span>
                          <span className="font-medium">{analyticsData.nepCompliance.skillDevelopment}%</span>
                        </div>
                        <Progress value={analyticsData.nepCompliance.skillDevelopment} className="h-3" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Compliance Recommendations</h4>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-green-800 dark:text-green-200 mb-1">
                              Excellent Multidisciplinary Integration
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              Your timetable successfully incorporates diverse subject areas and promotes holistic learning.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                              Flexibility Enhancement Opportunity
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              Consider adding more elective time slots to increase student choice options.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-purple-800 dark:text-purple-200 mb-1">
                              Skill Development Focus
                            </div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">
                              Great integration of practical labs and skill-building sessions.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}