import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  Zap,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  MapPin,
  BookOpen,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Square,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  Calendar,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Cpu,
  Database,
  Network,
  Shield,
  Award,
  Gauge,
  Timer,
  Building2,
  GraduationCap,
  UserCheck,
  BookMarked,
  Sun,
  Moon,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Share2,
  FileSpreadsheet,
  MessageSquare,
  Bell,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { UserRole, CurrentView } from '../App';
import { useApp } from '../contexts/AppContext';

interface EnhancedTimetableGeneratorProps {
  userRole: UserRole;
  onBack: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

interface GenerationConfig {
  algorithm: 'genetic' | 'simulated_annealing' | 'constraint_satisfaction' | 'hybrid';
  maxIterations: number;
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  nepCompliance: boolean;
  conflictResolution: 'strict' | 'flexible' | 'optimal';
  workloadBalancing: boolean;
  roomOptimization: boolean;
  timePreferences: boolean;
}

interface ConflictDetails {
  id: string;
  type: 'time' | 'room' | 'faculty' | 'resource';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affected: string[];
  suggestion: string;
  autoFixable: boolean;
}

interface GenerationMetrics {
  totalSlots: number;
  filledSlots: number;
  conflicts: number;
  efficiency: number;
  nepCompliance: number;
  facultyUtilization: number;
  roomUtilization: number;
  studentSatisfaction: number;
}

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject?: string;
  faculty?: string;
  room?: string;
  students?: number;
  type?: 'lecture' | 'lab' | 'tutorial';
  conflicts?: ConflictDetails[];
  locked?: boolean;
}

export function EnhancedTimetableGenerator({ userRole, onBack, onToggleDarkMode, darkMode }: EnhancedTimetableGeneratorProps) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('configure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [config, setConfig] = useState<GenerationConfig>({
    algorithm: 'hybrid',
    maxIterations: 1000,
    populationSize: 100,
    mutationRate: 0.1,
    crossoverRate: 0.8,
    nepCompliance: true,
    conflictResolution: 'optimal',
    workloadBalancing: true,
    roomOptimization: true,
    timePreferences: true
  });

  const [metrics, setMetrics] = useState<GenerationMetrics>({
    totalSlots: 0,
    filledSlots: 0,
    conflicts: 0,
    efficiency: 0,
    nepCompliance: 0,
    facultyUtilization: 0,
    roomUtilization: 0,
    studentSatisfaction: 0
  });

  const [conflicts, setConflicts] = useState<ConflictDetails[]>([]);
  const [timetableData, setTimetableData] = useState<TimeSlot[]>([]);
  const [isCollaborativeMode, setIsCollaborativeMode] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
  ];

  // Real-time collaboration simulation
  useEffect(() => {
    if (isCollaborativeMode) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        const randomCollaborators = ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams'];
        setCollaborators(prev => {
          const newCollaborators = [...prev];
          if (Math.random() > 0.7 && newCollaborators.length < 3) {
            const available = randomCollaborators.filter(c => !newCollaborators.includes(c));
            if (available.length > 0) {
              newCollaborators.push(available[0]);
              toast.success(`${available[0]} joined the collaboration session`);
            }
          }
          return newCollaborators;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isCollaborativeMode]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setActiveTab('generation');

    const phases = [
      'Initializing AI Engine',
      'Loading Constraints',
      'Analyzing Faculty Preferences',
      'Optimizing Room Allocation',
      'Applying NEP 2020 Guidelines',
      'Resolving Conflicts',
      'Fine-tuning Schedule',
      'Validating Results'
    ];

    for (let i = 0; i < phases.length; i++) {
      setGenerationPhase(phases[i]);
      setGenerationProgress(((i + 1) / phases.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Simulate generation results
    const mockTimetable: TimeSlot[] = [];
    const mockConflicts: ConflictDetails[] = [];

    days.forEach((day, dayIndex) => {
      timeSlots.forEach((time, timeIndex) => {
        const id = `${day}-${time}`;
        const shouldFill = Math.random() > 0.2; // 80% fill rate
        
        if (shouldFill) {
          const subjects = ['Data Structures', 'Computer Networks', 'Database Systems', 'Software Engineering', 'Machine Learning'];
          const faculty = ['Dr. Sarah Johnson', 'Prof. Mike Wilson', 'Dr. Alice Brown', 'Dr. John Smith'];
          const rooms = ['Room 101', 'Room 102', 'Lab 203', 'Hall A', 'Lab 201'];
          
          mockTimetable.push({
            id,
            day,
            time,
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            faculty: faculty[Math.floor(Math.random() * faculty.length)],
            room: rooms[Math.floor(Math.random() * rooms.length)],
            students: 30 + Math.floor(Math.random() * 40),
            type: Math.random() > 0.7 ? 'lab' : Math.random() > 0.8 ? 'tutorial' : 'lecture',
            conflicts: Math.random() > 0.9 ? [{
              id: `conflict-${id}`,
              type: 'room',
              severity: 'medium',
              description: 'Room scheduling overlap detected',
              affected: ['Computer Networks', 'Database Systems'],
              suggestion: 'Move one class to alternate room',
              autoFixable: true
            }] : []
          });
        }
      });
    });

    // Generate some conflicts for demonstration
    if (Math.random() > 0.3) {
      mockConflicts.push({
        id: 'conflict-1',
        type: 'faculty',
        severity: 'high',
        description: 'Dr. Sarah Johnson has overlapping class schedules',
        affected: ['Data Structures - Mon 10:00', 'Machine Learning - Mon 10:00'],
        suggestion: 'Reschedule one of the classes to a different time slot',
        autoFixable: true
      });
    }

    setTimetableData(mockTimetable);
    setConflicts(mockConflicts);
    
    // Update metrics
    setMetrics({
      totalSlots: days.length * timeSlots.length,
      filledSlots: mockTimetable.length,
      conflicts: mockConflicts.length,
      efficiency: Math.round((mockTimetable.length / (days.length * timeSlots.length)) * 100),
      nepCompliance: 95 + Math.floor(Math.random() * 5),
      facultyUtilization: 85 + Math.floor(Math.random() * 10),
      roomUtilization: 78 + Math.floor(Math.random() * 15),
      studentSatisfaction: 88 + Math.floor(Math.random() * 10)
    });

    setIsGenerating(false);
    setActiveTab('results');
    
    toast.success('Timetable generated successfully!', {
      description: `${mockTimetable.length} classes scheduled with ${mockConflicts.length} conflicts to resolve.`
    });
  }, [config]);

  const handleExport = () => {
    toast.success('Timetable exported successfully!');
  };

  const handleSave = () => {
    toast.success('Timetable saved to drafts!');
  };

  const toggleCollaborativeMode = () => {
    setIsCollaborativeMode(!isCollaborativeMode);
    if (!isCollaborativeMode) {
      toast.success('Collaborative mode enabled - Team members can now join');
    } else {
      setCollaborators([]);
      toast.info('Collaborative mode disabled');
    }
  };

  const autoFixConflicts = () => {
    const fixableConflicts = conflicts.filter(c => c.autoFixable);
    setConflicts(prev => prev.filter(c => !c.autoFixable));
    toast.success(`${fixableConflicts.length} conflicts resolved automatically`);
  };

  const renderTimetableGrid = () => (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay(day)}
            className="min-w-0"
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedDay} Schedule</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {timetableData.filter(slot => slot.day === selectedDay).length} classes
              </Badge>
              {conflicts.some(c => c.affected.some(a => a.includes(selectedDay))) && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Conflicts
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {timeSlots.map((timeSlot) => {
              const slotData = timetableData.find(
                slot => slot.day === selectedDay && slot.time === timeSlot
              );
              const hasConflict = slotData?.conflicts && slotData.conflicts.length > 0;

              return (
                <motion.div
                  key={timeSlot}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    slotData 
                      ? hasConflict 
                        ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
                        : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {timeSlot}
                      </span>
                    </div>
                    {hasConflict && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  
                  {slotData ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {slotData.subject}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          {slotData.faculty}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {slotData.room}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {slotData.students} students
                        </div>
                        <div className="flex items-center gap-1">
                          <BookMarked className="h-3 w-3" />
                          {slotData.type}
                        </div>
                      </div>
                      {hasConflict && (
                        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-xs text-red-700 dark:text-red-300">
                          {slotData.conflicts![0].description}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400 py-4">
                      <Plus className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">Available Slot</div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-slate-100">
                    AI Timetable Generator
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Advanced scheduling with conflict resolution
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Collaborative Mode Toggle */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <Switch
                  checked={isCollaborativeMode}
                  onCheckedChange={toggleCollaborativeMode}
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Collaborate
                </span>
              </div>

              {/* Active Collaborators */}
              {collaborators.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {collaborators.map((collaborator, index) => (
                      <div
                        key={collaborator}
                        className="w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-white font-medium"
                        title={collaborator}
                      >
                        {collaborator.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                  <Badge variant="secondary">{collaborators.length} online</Badge>
                </div>
              )}

              <Separator orientation="vertical" className="h-6" />
              
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
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="configure" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Algorithm Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    AI Algorithm Settings
                  </CardTitle>
                  <CardDescription>
                    Configure the AI engine for optimal timetable generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Optimization Algorithm</Label>
                    <Select 
                      value={config.algorithm} 
                      onValueChange={(value: any) => setConfig(prev => ({ ...prev, algorithm: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genetic">Genetic Algorithm</SelectItem>
                        <SelectItem value="simulated_annealing">Simulated Annealing</SelectItem>
                        <SelectItem value="constraint_satisfaction">Constraint Satisfaction</SelectItem>
                        <SelectItem value="hybrid">Hybrid AI (Recommended)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Max Iterations: {config.maxIterations}</Label>
                    <Slider
                      value={[config.maxIterations]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, maxIterations: value }))}
                      max={2000}
                      min={500}
                      step={100}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Population Size: {config.populationSize}</Label>
                    <Slider
                      value={[config.populationSize]}
                      onValueChange={([value]) => setConfig(prev => ({ ...prev, populationSize: value }))}
                      max={200}
                      min={50}
                      step={10}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Conflict Resolution Strategy</Label>
                    <Select 
                      value={config.conflictResolution} 
                      onValueChange={(value: any) => setConfig(prev => ({ ...prev, conflictResolution: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict (No Conflicts)</SelectItem>
                        <SelectItem value="flexible">Flexible (Minor Conflicts OK)</SelectItem>
                        <SelectItem value="optimal">Optimal Balance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Optimization Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Optimization Preferences
                  </CardTitle>
                  <CardDescription>
                    Enable specific optimization features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>NEP 2020 Compliance</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Ensure multidisciplinary and flexibility requirements
                      </p>
                    </div>
                    <Switch 
                      checked={config.nepCompliance}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, nepCompliance: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Faculty Workload Balancing</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Distribute teaching hours evenly across faculty
                      </p>
                    </div>
                    <Switch 
                      checked={config.workloadBalancing}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, workloadBalancing: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Room Optimization</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Optimize classroom and lab assignments
                      </p>
                    </div>
                    <Switch 
                      checked={config.roomOptimization}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, roomOptimization: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Time Preferences</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Consider faculty and student time preferences
                      </p>
                    </div>
                    <Switch 
                      checked={config.timePreferences}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, timePreferences: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={handleGenerate}
                size="lg"
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Generate AI Timetable
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Generation Tab */}
          <TabsContent value="generation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Generation in Progress
                </CardTitle>
                <CardDescription>
                  Advanced algorithms are creating your optimized timetable
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {generationPhase}
                    </h3>
                    <Progress value={generationProgress} className="w-full max-w-md mx-auto h-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      {Math.round(generationProgress)}% Complete
                    </p>
                  </div>
                </div>

                {/* Generation Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm text-blue-600 dark:text-blue-400">Data Points</div>
                    <div className="font-semibold">{state.students.length + state.faculty.length + state.courses.length}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Network className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-sm text-green-600 dark:text-green-400">Constraints</div>
                    <div className="font-semibold">247</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Cpu className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-sm text-purple-600 dark:text-purple-400">Iterations</div>
                    <div className="font-semibold">{Math.round(generationProgress * 10)}</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Gauge className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-sm text-orange-600 dark:text-orange-400">Efficiency</div>
                    <div className="font-semibold">{Math.min(95, Math.round(generationProgress))}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {metrics.efficiency}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Efficiency</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {metrics.filledSlots}/{metrics.totalSlots}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Slots Filled</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {metrics.nepCompliance}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">NEP Compliance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    conflicts.length === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {conflicts.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Conflicts</div>
                </CardContent>
              </Card>
            </div>

            {/* Conflicts Panel */}
            {conflicts.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Conflicts to Resolve ({conflicts.length})
                    </CardTitle>
                    <Button onClick={autoFixConflicts} size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Auto-Fix
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {conflicts.map((conflict) => (
                      <div key={conflict.id} className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-red-800 dark:text-red-200 mb-1">
                              {conflict.description}
                            </div>
                            <div className="text-sm text-red-600 dark:text-red-300 mb-2">
                              Affects: {conflict.affected.join(', ')}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                              💡 {conflict.suggestion}
                            </div>
                          </div>
                          <Badge variant={conflict.severity === 'high' ? 'destructive' : 'secondary'}>
                            {conflict.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">View:</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleSave} variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleExport} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Timetable Display */}
            {viewMode === 'grid' && renderTimetableGrid()}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Detailed performance metrics and insights will be displayed here
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-blue-600 dark:text-blue-400">Performance Trends</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <PieChart className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-sm text-green-600 dark:text-green-400">Resource Usage</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm text-purple-600 dark:text-purple-400">Utilization Rates</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Target className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-sm text-orange-600 dark:text-orange-400">Goal Tracking</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}

const Loader2 = ({ className, ...props }: { className?: string }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  </svg>
);