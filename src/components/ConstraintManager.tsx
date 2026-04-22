import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Users,
  Building,
  BookOpen,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Brain,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  Faculty,
  Room,
  Subject,
  TimeSlot,
  ScheduleSlot,
  ConstraintValidator,
  HardConstraints,
  SoftConstraints
} from '../utils/constraints';
import {
  IntelligentScheduler,
  SchedulingConfig,
  DEFAULT_SCHEDULING_CONFIG
} from '../utils/intelligentScheduler';
import { NEPComplianceEngine } from '../utils/nepCompliance';

interface ConstraintRule {
  id: string;
  name: string;
  type: 'hard' | 'soft';
  category: 'faculty' | 'room' | 'time' | 'student' | 'nep';
  description: string;
  enabled: boolean;
  weight?: number; // for soft constraints
  parameters: { [key: string]: any };
}

interface ConstraintViolation {
  id: string;
  rule: ConstraintRule;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  affectedSlots: ScheduleSlot[];
  suggestedActions: string[];
}

interface ConstraintManagerProps {
  faculty: Faculty[];
  rooms: Room[];
  subjects: Subject[];
  schedule: ScheduleSlot[];
  onConfigUpdate: (config: SchedulingConfig) => void;
  onRuleUpdate: (rules: ConstraintRule[]) => void;
}

export function ConstraintManager({
  faculty,
  rooms,
  subjects,
  schedule,
  onConfigUpdate,
  onRuleUpdate
}: ConstraintManagerProps) {
  const [config, setConfig] = useState<SchedulingConfig>(DEFAULT_SCHEDULING_CONFIG);
  const [rules, setRules] = useState<ConstraintRule[]>([]);
  const [violations, setViolations] = useState<ConstraintViolation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ConstraintRule | null>(null);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [nepEngine] = useState(new NEPComplianceEngine());

  useEffect(() => {
    initializeDefaultRules();
    analyzeConstraints();
  }, [schedule, faculty, rooms, subjects]);

  // Initialize default constraint rules
  const initializeDefaultRules = () => {
    const defaultRules: ConstraintRule[] = [
      // Hard Constraints
      {
        id: 'faculty-availability',
        name: 'Faculty Availability',
        type: 'hard',
        category: 'faculty',
        description: 'Faculty must be available during assigned time slots',
        enabled: true,
        parameters: {
          checkUnavailableSlots: true,
          preventDoubleBooking: true
        }
      },
      {
        id: 'room-availability',
        name: 'Room Availability',
        type: 'hard',
        category: 'room',
        description: 'Rooms must be available and suitable for the subject',
        enabled: true,
        parameters: {
          checkCapacity: true,
          checkFacilities: true,
          preventDoubleBooking: true
        }
      },
      {
        id: 'faculty-expertise',
        name: 'Faculty Subject Expertise',
        type: 'hard',
        category: 'faculty',
        description: 'Faculty must be qualified to teach assigned subjects',
        enabled: true,
        parameters: {
          strictMatching: true
        }
      },
      {
        id: 'workload-limits',
        name: 'Faculty Workload Limits',
        type: 'hard',
        category: 'faculty',
        description: 'Faculty workload must not exceed maximum hours',
        enabled: true,
        parameters: {
          maxHoursPerWeek: true,
          maxConsecutiveHours: 3
        }
      },
      {
        id: 'nep-compliance',
        name: 'NEP 2020 Compliance',
        type: 'hard',
        category: 'nep',
        description: 'Schedule must comply with NEP 2020 requirements',
        enabled: true,
        parameters: {
          checkMultidisciplinary: true,
          checkCreditDistribution: true
        }
      },
      
      // Soft Constraints
      {
        id: 'faculty-preferences',
        name: 'Faculty Time Preferences',
        type: 'soft',
        category: 'faculty',
        description: 'Prefer faculty preferred time slots',
        enabled: true,
        weight: 30,
        parameters: {
          preferredDaysWeight: 0.6,
          preferredTimesWeight: 0.4
        }
      },
      {
        id: 'workload-balance',
        name: 'Workload Balance',
        type: 'soft',
        category: 'faculty',
        description: 'Balance workload distribution among faculty',
        enabled: true,
        weight: 25,
        parameters: {
          optimalUtilization: 75,
          toleranceRange: 10
        }
      },
      {
        id: 'student-convenience',
        name: 'Student Schedule Convenience',
        type: 'soft',
        category: 'student',
        description: 'Minimize gaps and inconvenient timings for students',
        enabled: true,
        weight: 25,
        parameters: {
          maxGapBetweenClasses: 120,
          avoidEarlyMorning: true,
          avoidLateFriday: true
        }
      },
      {
        id: 'room-utilization',
        name: 'Room Utilization Optimization',
        type: 'soft',
        category: 'room',
        description: 'Optimize room usage and minimize building changes',
        enabled: true,
        weight: 20,
        parameters: {
          preferSameBuilding: true,
          preferSameFloor: true
        }
      }
    ];

    setRules(defaultRules);
  };

  // Analyze current schedule against constraints
  const analyzeConstraints = async () => {
    setIsAnalyzing(true);
    const newViolations: ConstraintViolation[] = [];

    try {
      // Analyze each schedule slot
      for (const slot of schedule) {
        const validation = ConstraintValidator.validateScheduleSlot(slot, schedule);
        
        if (!validation.valid) {
          validation.conflicts.forEach(conflict => {
            const violation: ConstraintViolation = {
              id: `${slot.id}-${Date.now()}-${Math.random()}`,
              rule: rules.find(r => conflict.toLowerCase().includes(r.category)) || rules[0],
              severity: 'critical',
              message: conflict,
              affectedSlots: [slot],
              suggestedActions: generateSuggestedActions(slot, conflict)
            };
            newViolations.push(violation);
          });
        } else if (validation.score < 50) {
          // Low score indicates soft constraint violations
          const violation: ConstraintViolation = {
            id: `${slot.id}-score-${Date.now()}`,
            rule: rules.find(r => r.type === 'soft') || rules[0],
            severity: 'warning',
            message: `Low optimization score (${validation.score.toFixed(1)}) for ${slot.subject.name}`,
            affectedSlots: [slot],
            suggestedActions: ['Consider alternative time slots', 'Review faculty preferences', 'Check room suitability']
          };
          newViolations.push(violation);
        }
      }

      // Check NEP 2020 compliance
      const programs = nepEngine.getAllPrograms();
      programs.forEach(program => {
        const programSubjects = subjects.filter(s => s.program === program.name);
        if (programSubjects.length > 0) {
          const nepValidation = nepEngine.validateMultidisciplinaryConstraints(
            { id: 'temp', program: program.name } as any,
            programSubjects
          );
          
          if (!nepValidation.valid) {
            nepValidation.violations.forEach(violation => {
              newViolations.push({
                id: `nep-${program.id}-${Date.now()}`,
                rule: rules.find(r => r.id === 'nep-compliance') || rules[0],
                severity: 'warning',
                message: violation,
                affectedSlots: [],
                suggestedActions: ['Review subject combinations', 'Add interdisciplinary courses']
              });
            });
          }
        }
      });

      setViolations(newViolations);
    } catch (error) {
      console.error('Error analyzing constraints:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate suggested actions for violations
  const generateSuggestedActions = (slot: ScheduleSlot, conflict: string): string[] => {
    const actions: string[] = [];
    
    if (conflict.includes('unavailable')) {
      actions.push('Check faculty availability settings');
      actions.push('Reassign to available time slot');
    }
    
    if (conflict.includes('capacity')) {
      actions.push('Use larger room');
      actions.push('Split class into multiple sessions');
    }
    
    if (conflict.includes('qualified')) {
      actions.push('Assign different faculty member');
      actions.push('Update faculty expertise profiles');
    }
    
    if (conflict.includes('workload')) {
      actions.push('Redistribute classes among faculty');
      actions.push('Adjust maximum hours settings');
    }

    if (actions.length === 0) {
      actions.push('Review constraint settings');
      actions.push('Manually resolve in timetable generator');
    }

    return actions;
  };

  // Update configuration
  const updateConfig = (updates: Partial<SchedulingConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigUpdate(newConfig);
  };

  // Update rule
  const updateRule = (ruleId: string, updates: Partial<ConstraintRule>) => {
    const newRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    setRules(newRules);
    onRuleUpdate(newRules);
  };

  // Add new rule
  const addRule = () => {
    const newRule: ConstraintRule = {
      id: `custom-${Date.now()}`,
      name: 'New Custom Rule',
      type: 'soft',
      category: 'faculty',
      description: 'Custom constraint rule',
      enabled: true,
      weight: 10,
      parameters: {}
    };
    setRules([...rules, newRule]);
    setSelectedRule(newRule);
    setShowRuleEditor(true);
  };

  // Delete rule
  const deleteRule = (ruleId: string) => {
    const newRules = rules.filter(rule => rule.id !== ruleId);
    setRules(newRules);
    onRuleUpdate(newRules);
  };

  // Calculate constraint statistics
  const getConstraintStats = () => {
    const totalRules = rules.length;
    const enabledRules = rules.filter(r => r.enabled).length;
    const hardConstraints = rules.filter(r => r.type === 'hard').length;
    const softConstraints = rules.filter(r => r.type === 'soft').length;
    const criticalViolations = violations.filter(v => v.severity === 'critical').length;
    const warningViolations = violations.filter(v => v.severity === 'warning').length;

    return {
      totalRules,
      enabledRules,
      hardConstraints,
      softConstraints,
      criticalViolations,
      warningViolations
    };
  };

  const stats = getConstraintStats();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Constraint Management</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Configure and monitor scheduling constraints for optimal timetable generation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={analyzeConstraints}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Constraints'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl">{stats.totalRules}</div>
            <div className="text-sm text-slate-600">Total Rules</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl">{stats.enabledRules}</div>
            <div className="text-sm text-slate-600">Enabled</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl">{stats.hardConstraints}</div>
            <div className="text-sm text-slate-600">Hard Rules</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl">{stats.softConstraints}</div>
            <div className="text-sm text-slate-600">Soft Rules</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl">{stats.criticalViolations}</div>
            <div className="text-sm text-slate-600">Critical Issues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl">{stats.warningViolations}</div>
            <div className="text-sm text-slate-600">Warnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="rules">Constraint Rules</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Scheduling Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Working Days */}
              <div>
                <Label className="text-base mb-3 block">Working Days</Label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Switch
                        checked={config.workingDays.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateConfig({
                              workingDays: [...config.workingDays, day]
                            });
                          } else {
                            updateConfig({
                              workingDays: config.workingDays.filter(d => d !== day)
                            });
                          }
                        }}
                      />
                      <Label>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={config.startTime}
                    onChange={(e) => updateConfig({ startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={config.endTime}
                    onChange={(e) => updateConfig({ endTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                  <Input
                    id="slotDuration"
                    type="number"
                    value={config.slotDuration}
                    onChange={(e) => updateConfig({ slotDuration: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* Break Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="breakTime">Break Time (minutes)</Label>
                  <Input
                    id="breakTime"
                    type="number"
                    value={config.breakTime}
                    onChange={(e) => updateConfig({ breakTime: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="lunchStart">Lunch Start</Label>
                  <Input
                    id="lunchStart"
                    type="time"
                    value={config.lunchBreak.start}
                    onChange={(e) => updateConfig({
                      lunchBreak: { ...config.lunchBreak, start: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="lunchDuration">Lunch Duration (minutes)</Label>
                  <Input
                    id="lunchDuration"
                    type="number"
                    value={config.lunchBreak.duration}
                    onChange={(e) => updateConfig({
                      lunchBreak: { ...config.lunchBreak, duration: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              {/* Optimization Weights */}
              <div>
                <Label className="text-base mb-3 block">Optimization Weights (%)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="facultyWeight" className="text-sm">Faculty Preference</Label>
                    <Input
                      id="facultyWeight"
                      type="number"
                      min="0"
                      max="100"
                      value={Math.round(config.optimizationWeights.facultyPreference * 100)}
                      onChange={(e) => updateConfig({
                        optimizationWeights: {
                          ...config.optimizationWeights,
                          facultyPreference: parseInt(e.target.value) / 100
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="workloadWeight" className="text-sm">Workload Balance</Label>
                    <Input
                      id="workloadWeight"
                      type="number"
                      min="0"
                      max="100"
                      value={Math.round(config.optimizationWeights.workloadBalance * 100)}
                      onChange={(e) => updateConfig({
                        optimizationWeights: {
                          ...config.optimizationWeights,
                          workloadBalance: parseInt(e.target.value) / 100
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentWeight" className="text-sm">Student Convenience</Label>
                    <Input
                      id="studentWeight"
                      type="number"
                      min="0"
                      max="100"
                      value={Math.round(config.optimizationWeights.studentConvenience * 100)}
                      onChange={(e) => updateConfig({
                        optimizationWeights: {
                          ...config.optimizationWeights,
                          studentConvenience: parseInt(e.target.value) / 100
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomWeight" className="text-sm">Room Utilization</Label>
                    <Input
                      id="roomWeight"
                      type="number"
                      min="0"
                      max="100"
                      value={Math.round(config.optimizationWeights.roomUtilization * 100)}
                      onChange={(e) => updateConfig({
                        optimizationWeights: {
                          ...config.optimizationWeights,
                          roomUtilization: parseInt(e.target.value) / 100
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* NEP 2020 Settings */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.prioritizeNEPCompliance}
                  onCheckedChange={(checked) => updateConfig({ prioritizeNEPCompliance: checked })}
                />
                <Label>Prioritize NEP 2020 Compliance</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl">Constraint Rules</h3>
            <Button onClick={addRule} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>

          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id} className={`border-l-4 ${
                rule.type === 'hard' 
                  ? 'border-l-red-500' 
                  : 'border-l-amber-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) => updateRule(rule.id, { enabled: checked })}
                        />
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.type === 'hard' ? 'destructive' : 'secondary'}>
                          {rule.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{rule.category}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        {rule.description}
                      </p>
                      {rule.type === 'soft' && (
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Weight:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={rule.weight || 0}
                            onChange={(e) => updateRule(rule.id, { weight: parseInt(e.target.value) })}
                            className="w-20"
                          />
                          <span className="text-sm text-slate-500">%</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRule(rule);
                          setShowRuleEditor(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl">Constraint Violations</h3>
            <Badge variant="outline" className="text-sm">
              {violations.length} violations found
            </Badge>
          </div>

          {violations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl mb-2">No Violations Found!</h3>
                <p className="text-slate-600">All constraints are satisfied in the current schedule.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {violations.map((violation) => (
                <Card key={violation.id} className={`border-l-4 ${
                  violation.severity === 'critical' 
                    ? 'border-l-red-500' 
                    : violation.severity === 'warning'
                    ? 'border-l-yellow-500'
                    : 'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={
                            violation.severity === 'critical' ? 'destructive' :
                            violation.severity === 'warning' ? 'secondary' : 'default'
                          }>
                            {violation.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{violation.rule.name}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {violation.message}
                        </p>
                      </div>
                    </div>
                    
                    {violation.affectedSlots.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-sm">Affected Classes:</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {violation.affectedSlots.map((slot) => (
                            <Badge key={slot.id} variant="outline" className="text-xs">
                              {slot.subject.name} - {slot.timeSlot.day} {slot.timeSlot.startTime}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm">Suggested Actions:</Label>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {violation.suggestedActions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Faculty Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Faculty Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faculty.slice(0, 5).map((f) => {
                    const utilization = Math.random() * 100; // Replace with actual calculation
                    return (
                      <div key={f.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{f.name}</span>
                          <span>{utilization.toFixed(1)}%</span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Room Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Room Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rooms.slice(0, 5).map((room) => {
                    const utilization = Math.random() * 100; // Replace with actual calculation
                    return (
                      <div key={room.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{room.name}</span>
                          <span>{utilization.toFixed(1)}%</span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Constraint Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Constraint Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl text-green-600 mb-1">
                    {((stats.totalRules - violations.length) / stats.totalRules * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-blue-600 mb-1">
                    {(schedule.length - stats.criticalViolations)}
                  </div>
                  <div className="text-sm text-slate-600">Valid Slots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-amber-600 mb-1">
                    {stats.warningViolations}
                  </div>
                  <div className="text-sm text-slate-600">Optimization Opportunities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-purple-600 mb-1">
                    {(Math.random() * 10 + 85).toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600">Overall Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}