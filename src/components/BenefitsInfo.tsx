import { 
  ArrowLeft, 
  Users, 
  GraduationCap, 
  Building2, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Brain, 
  Calendar, 
  Target,
  Moon,
  Sun,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface BenefitsInfoProps {
  onBack: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export function BenefitsInfo({ onBack, onToggleDarkMode, darkMode }: BenefitsInfoProps) {
  const benefitsData = {
    students: [
      { icon: Calendar, title: "Personalized Schedules", description: "Get optimized timetables based on your course selections and preferences" },
      { icon: Clock, title: "No Schedule Conflicts", description: "AI ensures zero conflicts between selected major, minor, and skill courses" },
      { icon: Target, title: "Better Learning Path", description: "Multidisciplinary approach aligned with NEP 2020 guidelines" },
      { icon: CheckCircle, title: "Real-time Updates", description: "Instant notifications for any schedule changes or updates" }
    ],
    faculty: [
      { icon: BarChart3, title: "Balanced Workload", description: "Equitable distribution of teaching hours and responsibilities" },
      { icon: Shield, title: "Preference Consideration", description: "System considers your availability and teaching preferences" },
      { icon: Users, title: "Easy Swap Requests", description: "Simple interface for requesting and managing class exchanges" },
      { icon: TrendingUp, title: "Performance Analytics", description: "Insights into teaching load distribution and efficiency" }
    ],
    institution: [
      { icon: Zap, title: "95% Time Savings", description: "Reduce timetable creation time from weeks to minutes" },
      { icon: Brain, title: "AI-Powered Optimization", description: "Advanced algorithms ensure maximum resource utilization" },
      { icon: Building2, title: "Resource Efficiency", description: "Optimal classroom and lab utilization across all programs" },
      { icon: CheckCircle, title: "NEP 2020 Compliance", description: "Built-in compliance with latest education policy requirements" }
    ]
  };

  const impactStats = [
    { label: "Time Saved", value: "95%", description: "Reduction in manual timetable creation" },
    { label: "Conflict Resolution", value: "100%", description: "Automated detection and resolution" },
    { label: "Resource Utilization", value: "87%", description: "Optimal classroom and faculty usage" },
    { label: "Faculty Satisfaction", value: "92%", description: "Improved work-life balance" }
  ];

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
              <h1 className="text-2xl text-gray-800 dark:text-white">Benefits & Impact</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Transforming Education with AI-Powered Scheduling</p>
            </div>
          </div>
          <Button onClick={onToggleDarkMode} variant="ghost" size="sm">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Revolutionizing Academic Scheduling
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered timetable generation system creates seamless scheduling experiences for students, faculty, and institutions while ensuring complete NEP 2020 compliance.
            </p>
          </div>

          {/* Impact Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-3xl mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <h4 className="text-lg mb-2 text-gray-800 dark:text-white">{stat.label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits by Role */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Students Benefits */}
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <GraduationCap className="h-8 w-8 mr-3" />
                  For Students
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {benefitsData.students.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg mb-1 text-gray-800 dark:text-white">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">NEP 2020 Aligned</Badge>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Multidisciplinary</Badge>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Real-time Updates</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Faculty Benefits */}
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <Users className="h-8 w-8 mr-3" />
                  For Faculty
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {benefitsData.faculty.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-lg mb-1 text-gray-800 dark:text-white">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Work-Life Balance</Badge>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Flexible Preferences</Badge>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Easy Management</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Institution Benefits */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <Building2 className="h-8 w-8 mr-3" />
                  For Institution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {benefitsData.institution.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg mb-1 text-gray-800 dark:text-white">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Cost Effective</Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Scalable</Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Future Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features Highlight */}
          <Card className="mb-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Key Features & Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h4 className="text-lg mb-2">AI-Powered Engine</h4>
                  <p className="text-sm opacity-90">Advanced machine learning algorithms for optimal scheduling</p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h4 className="text-lg mb-2">NEP 2020 Compliance</h4>
                  <p className="text-sm opacity-90">Built-in compliance with latest education policy requirements</p>
                </div>
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h4 className="text-lg mb-2">Conflict Resolution</h4>
                  <p className="text-sm opacity-90">Automatic detection and resolution of scheduling conflicts</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <h4 className="text-lg mb-2">Real-time Analytics</h4>
                  <p className="text-sm opacity-90">Comprehensive reports and performance insights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Implementation Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl text-blue-600">1</span>
                  </div>
                  <h4 className="text-lg mb-2">Data Integration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Import existing student, faculty, and course data</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl text-green-600">2</span>
                  </div>
                  <h4 className="text-lg mb-2">System Configuration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Set up constraints and preferences</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl text-purple-600">3</span>
                  </div>
                  <h4 className="text-lg mb-2">Testing & Training</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">User training and system validation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl text-orange-600">4</span>
                  </div>
                  <h4 className="text-lg mb-2">Full Deployment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Go-live with continuous support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Government Footer */}
          <div className="mt-12 text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Developed for the Government of Jammu and Kashmir
            </p>
            <p className="text-sm text-gray-500">
              Higher Education Department • Smart Automation Initiative
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}