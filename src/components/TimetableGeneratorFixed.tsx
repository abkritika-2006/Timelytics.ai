import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Brain, 
  Calendar, 
  Clock, 
  Download, 
  Share2, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Filter,
  Grid,
  List,
  Zap,
  Target,
  Shield,
  BarChart3,
  Users,
  BookOpen,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ExportModal } from './ExportModal';
import { UserRole } from '../App';

interface TimetableGeneratorProps {
  userRole: UserRole;
  onBack: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

interface TimetableSlot {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  time: string;
  duration: number;
  courseType: string;
}

export function TimetableGenerator({ userRole, onBack, onToggleDarkMode, darkMode }: TimetableGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [timetableGenerated, setTimetableGenerated] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showExportModal, setShowExportModal] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const sampleTimetable: Record<string, TimetableSlot[]> = {
    'Monday': [
      { id: '1', subject: 'Data Structures', faculty: 'Dr. Smith', room: 'CS-101', time: '9:00 AM', duration: 1, courseType: 'Major' },
      { id: '2', subject: 'Mathematics', faculty: 'Dr. Johnson', room: 'M-201', time: '10:00 AM', duration: 1, courseType: 'Major' },
      { id: '3', subject: 'Communication Skills', faculty: 'Dr. Brown', room: 'L-301', time: '2:00 PM', duration: 1, courseType: 'Ability' },
    ],
    'Tuesday': [
      { id: '4', subject: 'Programming Lab', faculty: 'Dr. Smith', room: 'Lab-1', time: '9:00 AM', duration: 2, courseType: 'Major' },
      { id: '5', subject: 'Ethics', faculty: 'Dr. Wilson', room: 'H-202', time: '2:00 PM', duration: 1, courseType: 'Value Added' },
    ],
    // Add more days...
  };

  const generationSteps = [
    { text: 'Analyzing student enrollment data...', icon: Users, color: 'blue' },
    { text: 'Processing faculty availability...', icon: BookOpen, color: 'green' },
    { text: 'Optimizing room allocation...', icon: Settings, color: 'purple' },
    { text: 'Checking NEP 2020 compliance...', icon: Shield, color: 'orange' },
    { text: 'Resolving schedule conflicts...', icon: Target, color: 'red' },
    { text: 'Generating final timetable...', icon: Zap, color: 'indigo' }
  ];

  const generateTimetable = async () => {
    setIsGenerating(true);
    setProgress(0);
    setTimetableGenerated(false);

    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(generationSteps[i].text);
      setProgress((i + 1) * (100 / generationSteps.length));
      await new Promise(resolve => setTimeout(resolve, 1800));
    }

    setIsGenerating(false);
    setTimetableGenerated(true);
    setCurrentStep('Timetable generated successfully!');
  };

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

  const getBorderAndBgClass = (step: any, isCurrent: boolean, isActive: boolean) => {
    if (isCurrent) {
      switch (step.color) {
        case 'blue': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
        case 'green': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
        case 'purple': return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
        case 'orange': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
        case 'red': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
        case 'indigo': return 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
        default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
      }
    }
    return isActive 
      ? 'border-gray-300 bg-gray-50 dark:bg-gray-800'
      : 'border-gray-200 bg-gray-100 dark:bg-gray-900';
  };

  const getIconClass = (step: any, isActive: boolean) => {
    if (isActive) {
      switch (step.color) {
        case 'blue': return 'bg-blue-500 text-white';
        case 'green': return 'bg-green-500 text-white';
        case 'purple': return 'bg-purple-500 text-white';
        case 'orange': return 'bg-orange-500 text-white';
        case 'red': return 'bg-red-500 text-white';
        case 'indigo': return 'bg-indigo-500 text-white';
        default: return 'bg-gray-500 text-white';
      }
    }
    return 'bg-gray-300 text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl text-gray-800 dark:text-white">AI Timetable Generator</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">NEP 2020 Compliant Scheduling</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={onToggleDarkMode} variant="ghost" size="sm">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {timetableGenerated && (
              <Button 
                onClick={() => setShowExportModal(true)}
                variant="outline" 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0 hover:from-blue-700 hover:to-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export & Share
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {!timetableGenerated ? (
          <div className="max-w-4xl mx-auto">
            {/* Generation Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-blue-600" />
                  AI-Powered Timetable Generation
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate optimized timetables that comply with NEP 2020 guidelines and handle multidisciplinary course scheduling.
                </p>
              </CardHeader>
              <CardContent>
                {!isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg">
                      <h3 className="text-lg mb-4">Ready to Generate Your Timetable</h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm">2,847 Students</p>
                        </div>
                        <div className="text-center">
                          <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm">89 Courses</p>
                        </div>
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm">45 Rooms</p>
                        </div>
                      </div>
                      <Button 
                        onClick={generateTimetable}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        Generate AI Timetable
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* AI Processing Header */}
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center"
                      >
                        <Brain className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl mb-2">AI Engine Processing</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{currentStep}</p>
                      <Progress value={progress} className="max-w-md mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
                    </div>

                    {/* Processing Steps Visualization */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {generationSteps.map((step, index) => {
                        const isActive = progress > (index * (100 / generationSteps.length));
                        const isCurrent = currentStep === step.text;
                        const IconComponent = step.icon;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0.3, scale: 0.9 }}
                            animate={{ 
                              opacity: isActive ? 1 : 0.3,
                              scale: isCurrent ? 1.05 : isActive ? 1 : 0.9
                            }}
                            className={`p-4 rounded-lg border ${getBorderAndBgClass(step, isCurrent, isActive)}`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconClass(step, isActive)}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  {step.text.split('...')[0]}
                                </p>
                                {isCurrent && (
                                  <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-xs text-blue-600 mt-1"
                                  >
                                    Processing...
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Success Message */}
            <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg text-green-800 dark:text-green-200">Timetable Generated Successfully!</h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      AI-optimized schedule with 0 conflicts • 95% faculty preference satisfaction • NEP 2020 compliant
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timetable Display */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-6 w-6 mr-2" />
                    Generated Timetable
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Grid className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedDay} onValueChange={setSelectedDay}>
                  <TabsList className="grid grid-cols-6 w-full mb-6">
                    {days.map(day => (
                      <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
                    ))}
                  </TabsList>

                  {days.map(day => (
                    <TabsContent key={day} value={day}>
                      <div className="space-y-4">
                        {sampleTimetable[day]?.map(slot => (
                          <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-700 p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                                  <p className="text-sm">{slot.time}</p>
                                </div>
                                <div>
                                  <h4 className="text-lg">{slot.subject}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {slot.faculty} • {slot.room}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className={getCourseTypeColor(slot.courseType)}>
                                  {slot.courseType}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {slot.duration}h duration
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )) || (
                          <div className="text-center py-8 text-gray-500">
                            No classes scheduled for {day}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        timetableData={timetableGenerated}
      />
    </div>
  );
}