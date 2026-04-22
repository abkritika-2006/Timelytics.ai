import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Book, 
  MapPin, 
  User, 
  Download, 
  Bell, 
  Moon, 
  Sun, 
  LogOut,
  GraduationCap,
  Star,
  ChevronRight,
  Filter,
  Grid
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { CurrentView } from '../App';

interface StudentPortalProps {
  onNavigate: (view: CurrentView) => void;
  onLogout: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

interface ClassSchedule {
  id: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  time: string;
  day: string;
  duration: number;
  courseType: 'Major' | 'Minor' | 'Skill' | 'Ability' | 'Value Added';
}

export function StudentPortal({ onNavigate, onLogout, onToggleDarkMode, darkMode }: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Sample student data
  const studentInfo = {
    name: "Arjun Sharma",
    rollNumber: "CS2021001",
    semester: "5th Semester",
    program: "B.Tech Computer Science",
    email: "arjun.sharma@student.edu",
    totalCredits: 22,
    completedCredits: 18
  };

  const schedule: ClassSchedule[] = [
    { id: '1', subject: 'Data Structures and Algorithms', code: 'CS301', faculty: 'Dr. Sarah Johnson', room: 'CS-101', time: '9:00 AM', day: 'Monday', duration: 1, courseType: 'Major' },
    { id: '2', subject: 'Database Management Systems', code: 'CS302', faculty: 'Dr. Michael Chen', room: 'CS-201', time: '10:00 AM', day: 'Monday', duration: 1, courseType: 'Major' },
    { id: '3', subject: 'Environmental Science', code: 'EVS201', faculty: 'Dr. Priya Nair', room: 'SCI-101', time: '2:00 PM', day: 'Monday', duration: 1, courseType: 'Ability' },
    { id: '4', subject: 'Programming Lab', code: 'CS303L', faculty: 'Dr. Sarah Johnson', room: 'Lab-1', time: '9:00 AM', day: 'Tuesday', duration: 2, courseType: 'Major' },
    { id: '5', subject: 'Digital Marketing', code: 'DM101', faculty: 'Prof. Raj Kumar', room: 'MBA-201', time: '11:00 AM', day: 'Tuesday', duration: 1, courseType: 'Skill' },
    { id: '6', subject: 'Psychology', code: 'PSY101', faculty: 'Dr. Meera Gupta', room: 'HUM-301', time: '2:00 PM', day: 'Tuesday', duration: 1, courseType: 'Minor' },
    { id: '7', subject: 'Machine Learning', code: 'CS401', faculty: 'Dr. Amit Singh', room: 'CS-301', time: '10:00 AM', day: 'Wednesday', duration: 1, courseType: 'Major' },
    { id: '8', subject: 'Ethics in Technology', code: 'ETH201', faculty: 'Prof. Kavita Rao', room: 'HUM-201', time: '3:00 PM', day: 'Wednesday', duration: 1, courseType: 'Value Added' },
  ];

  const todaySchedule = schedule.filter(item => item.day === selectedDay);
  const nextClass = todaySchedule[0]; // Simplified logic for demo

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case 'Major': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Minor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Skill': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Ability': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Value Added': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-purple-500 text-white text-lg">
                {studentInfo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl text-gray-800 dark:text-white">{studentInfo.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{studentInfo.program} • {studentInfo.rollNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button onClick={onToggleDarkMode} variant="ghost" size="sm">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={onLogout} variant="ghost" size="sm" className="text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section & Next Class Alert */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl mb-2">Welcome back, {studentInfo.name.split(' ')[0]}!</h2>
                      <p className="text-purple-100 mb-4">{studentInfo.semester} • Academic Year 2024-25</p>
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 px-3 py-1 rounded-full">
                          <span className="text-sm">Credits: {studentInfo.completedCredits}/{studentInfo.totalCredits}</span>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-full">
                          <span className="text-sm">GPA: 8.4</span>
                        </div>
                      </div>
                    </div>
                    <GraduationCap className="h-16 w-16 text-white/80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
                  <Bell className="h-5 w-5 mr-2" />
                  Next Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nextClass ? (
                  <div>
                    <h4 className="text-lg text-orange-900 dark:text-orange-100 mb-1">{nextClass.subject}</h4>
                    <div className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {nextClass.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {nextClass.room}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {nextClass.faculty}
                      </div>
                    </div>
                    <Badge className={`mt-2 ${getCourseTypeColor(nextClass.courseType)}`}>
                      {nextClass.courseType}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-orange-600 dark:text-orange-300">No classes today!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">My Timetable</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="profile">Academic Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-6">
              {/* View Controls */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === 'daily' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('daily')}
                  >
                    Daily View
                  </Button>
                  <Button
                    variant={viewMode === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('weekly')}
                  >
                    Weekly View
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {viewMode === 'daily' ? (
                <div>
                  {/* Day Selector */}
                  <div className="flex space-x-2 mb-6 overflow-x-auto">
                    {days.map(day => (
                      <Button
                        key={day}
                        variant={selectedDay === day ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDay(day)}
                        className="whitespace-nowrap"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>

                  {/* Daily Schedule Cards */}
                  <div className="space-y-4">
                    {todaySchedule.length > 0 ? (
                      todaySchedule.map((classItem) => (
                        <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                  <Book className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                  <h4 className="text-lg text-gray-800 dark:text-white">{classItem.subject}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{classItem.code} • {classItem.faculty}</p>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <span className="flex items-center text-sm text-gray-500">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {classItem.time}
                                    </span>
                                    <span className="flex items-center text-sm text-gray-500">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {classItem.room}
                                    </span>
                                    <span className="text-sm text-gray-500">{classItem.duration}h</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={getCourseTypeColor(classItem.courseType)}>
                                  {classItem.courseType}
                                </Badge>
                                <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-300">No classes scheduled for {selectedDay}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="p-3 text-left">Time</th>
                            {days.map(day => (
                              <th key={day} className="p-3 text-left">{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                            <tr key={time} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{time}</td>
                              {days.map(day => {
                                const slot = schedule.find(s => s.day === day && s.time === time);
                                return (
                                  <td key={`${day}-${time}`} className="p-3">
                                    {slot ? (
                                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 shadow-sm">
                                        <p className="text-sm">{slot.subject}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300">{slot.room}</p>
                                        <Badge size="sm" className={`mt-1 ${getCourseTypeColor(slot.courseType)}`}>
                                          {slot.courseType}
                                        </Badge>
                                      </div>
                                    ) : (
                                      <div className="h-16"></div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(new Set(schedule.map(s => s.subject))).map((subject, index) => {
                  const courseData = schedule.find(s => s.subject === subject);
                  return (
                    <Card key={subject} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{subject}</CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{courseData?.code}</p>
                          </div>
                          <Badge className={getCourseTypeColor(courseData?.courseType || 'Major')}>
                            {courseData?.courseType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            {courseData?.faculty}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {courseData?.room}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-2 text-gray-400" />
                            4 Credits
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Attendance</span>
                            <span className="text-green-600">87%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Calendar View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center h-96 flex items-center justify-center">
                    <div>
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">Interactive calendar view coming soon</p>
                      <p className="text-sm text-gray-500 mt-2">View assignments, exams, and class schedules</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Student ID</p>
                        <p className="text-lg">{studentInfo.rollNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Current Semester</p>
                        <p className="text-lg">{studentInfo.semester}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Program</p>
                        <p className="text-lg">{studentInfo.program}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                        <p className="text-lg">{studentInfo.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Major Courses</span>
                          <span className="text-sm">12/16 Credits</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Minor Courses</span>
                          <span className="text-sm">3/4 Credits</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Skill Enhancement</span>
                          <span className="text-sm">2/2 Credits</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Book className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Enrolled in Machine Learning course</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Star className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Completed Database Systems assignment</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Achieved 87% attendance this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Timetable PDF
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Grid className="h-4 w-4 mr-2" />
                      Export Course List
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Sync with Google Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}