import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Book, 
  Settings, 
  Download, 
  RefreshCw, 
  Moon, 
  Sun, 
  LogOut, 
  Bell,
  FileText,
  MapPin,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { CurrentView } from '../App';

interface FacultyPortalProps {
  onNavigate: (view: CurrentView) => void;
  onLogout: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

interface Schedule {
  id: string;
  subject: string;
  day: string;
  time: string;
  room: string;
  class: string;
  duration: number;
}

export function FacultyPortal({ onNavigate, onLogout, onToggleDarkMode, darkMode }: FacultyPortalProps) {
  const [activeTab, setActiveTab] = useState('schedule');

  // Sample faculty data
  const facultyInfo = {
    name: "Dr. Sarah Johnson",
    department: "Computer Science",
    employeeId: "FAC001",
    email: "sarah.johnson@university.edu",
    weeklyHours: 18,
    maxHours: 20
  };

  const currentSchedule: Schedule[] = [
    { id: '1', subject: 'Data Structures', day: 'Monday', time: '9:00 AM', room: 'CS-101', class: 'CS-2A', duration: 1 },
    { id: '2', subject: 'Algorithms', day: 'Monday', time: '11:00 AM', room: 'CS-102', class: 'CS-3B', duration: 1 },
    { id: '3', subject: 'Programming Lab', day: 'Tuesday', time: '9:00 AM', room: 'Lab-1', class: 'CS-2A', duration: 2 },
    { id: '4', subject: 'Data Structures', day: 'Wednesday', time: '10:00 AM', room: 'CS-101', class: 'CS-2B', duration: 1 },
    { id: '5', subject: 'Algorithms', day: 'Thursday', time: '2:00 PM', room: 'CS-102', class: 'CS-3A', duration: 1 },
    { id: '6', subject: 'Programming Lab', day: 'Friday', time: '11:00 AM', room: 'Lab-2', class: 'CS-2B', duration: 2 },
  ];

  const upcomingClasses = currentSchedule
    .filter(schedule => ['Monday', 'Tuesday', 'Wednesday'].includes(schedule.day))
    .slice(0, 3);

  const swapRequests = [
    { id: '1', requestedBy: 'Dr. Mike Wilson', subject: 'Database Systems', originalTime: 'Tuesday 2:00 PM', newTime: 'Thursday 3:00 PM', status: 'pending' },
    { id: '2', requestedBy: 'Dr. Emily Brown', subject: 'Web Development', originalTime: 'Friday 10:00 AM', newTime: 'Monday 3:00 PM', status: 'approved' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-gray-800 dark:text-white">{facultyInfo.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{facultyInfo.department} • {facultyInfo.employeeId}</p>
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
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Weekly Hours</p>
                    <p className="text-2xl text-gray-800 dark:text-white">{facultyInfo.weeklyHours}/{facultyInfo.maxHours}</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Classes Today</p>
                    <p className="text-2xl text-gray-800 dark:text-white">3</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Subjects</p>
                    <p className="text-2xl text-gray-800 dark:text-white">3</p>
                  </div>
                  <Book className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Students</p>
                    <p className="text-2xl text-gray-800 dark:text-white">120</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">My Schedule</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="swaps">Swap Requests</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-6">
              {/* Upcoming Classes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upcoming Classes</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingClasses.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <Book className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-lg">{schedule.subject}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {schedule.day} • {schedule.time} • {schedule.room} • {schedule.class}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{schedule.duration}h</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Weekly Schedule</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left">Time</th>
                          <th className="p-3 text-left">Monday</th>
                          <th className="p-3 text-left">Tuesday</th>
                          <th className="p-3 text-left">Wednesday</th>
                          <th className="p-3 text-left">Thursday</th>
                          <th className="p-3 text-left">Friday</th>
                          <th className="p-3 text-left">Saturday</th>
                        </tr>
                      </thead>
                      <tbody>
                        {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                          <tr key={time} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{time}</td>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                              const slot = currentSchedule.find(s => s.day === day && s.time === time);
                              return (
                                <td key={`${day}-${time}`} className="p-3">
                                  {slot ? (
                                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 shadow-sm">
                                      <p className="text-sm">{slot.subject}</p>
                                      <p className="text-xs text-gray-600 dark:text-gray-300">{slot.room} • {slot.class}</p>
                                    </div>
                                  ) : (
                                    <div className="h-12"></div>
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
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="maxHours">Maximum Weekly Hours</Label>
                      <Input id="maxHours" type="number" defaultValue="20" />
                    </div>
                    <div>
                      <Label htmlFor="preferredStart">Preferred Start Time</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg">Day Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="noMorning">No morning classes (before 10 AM)</Label>
                        <Switch id="noMorning" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="noEvening">No evening classes (after 4 PM)</Label>
                        <Switch id="noEvening" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="noSaturday">No Saturday classes</Label>
                        <Switch id="noSaturday" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subjects">Preferred Subjects</Label>
                    <textarea 
                      id="subjects"
                      className="w-full p-2 border border-gray-300 rounded-md h-24 dark:border-gray-600 dark:bg-gray-700"
                      defaultValue="Data Structures, Algorithms, Programming, Database Systems"
                    />
                  </div>

                  <Button className="w-full">Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="swaps" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Swap Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {swapRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg">{request.subject}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Requested by: {request.requestedBy}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {request.originalTime} → {request.newTime}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={request.status === 'approved' ? 'default' : 'secondary'}
                              className={request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {request.status}
                            </Badge>
                            {request.status === 'pending' && (
                              <>
                                <Button size="sm" variant="outline">Approve</Button>
                                <Button size="sm" variant="outline">Decline</Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-lg mb-4">Request a Swap</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="myClass">My Class</Label>
                        <select className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700">
                          <option>Data Structures - Monday 9:00 AM</option>
                          <option>Algorithms - Monday 11:00 AM</option>
                          <option>Programming Lab - Tuesday 9:00 AM</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="requestTo">Request To</Label>
                        <select className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700">
                          <option>Dr. Mike Wilson</option>
                          <option>Dr. Emily Brown</option>
                          <option>Dr. James Smith</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="reason">Reason for Swap</Label>
                      <textarea 
                        id="reason"
                        className="w-full p-2 border border-gray-300 rounded-md h-24 dark:border-gray-600 dark:bg-gray-700"
                        placeholder="Please provide a reason for the swap request..."
                      />
                    </div>
                    <Button className="mt-4">Submit Swap Request</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Load Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart: Weekly Hours Distribution</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subject Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Data Structures</span>
                        <Badge variant="secondary">6 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Algorithms</span>
                        <Badge variant="secondary">4 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Programming Lab</span>
                        <Badge variant="secondary">8 hours</Badge>
                      </div>
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
                      Download Schedule PDF
                    </Button>
                    <Button className="w-full" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Teaching Load Report
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Sync with Calendar
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feedback & Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md h-32 dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Share your feedback on the timetable or suggest improvements..."
                    />
                    <Button className="mt-4 w-full">Submit Feedback</Button>
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