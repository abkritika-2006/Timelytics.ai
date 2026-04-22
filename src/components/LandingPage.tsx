import { useState, useEffect } from 'react';
import { 
  Calendar,
  Users,
  Settings,
  GraduationCap,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  FileSpreadsheet,
  Download,
  Shield,
  Layers,
  Brain,
  Monitor,
  Smartphone,
  Globe,
  Menu,
  X,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Activity,
  Lock,
  Database,
  Zap,
  Link,
  Server,
  CloudUpload,
  FileCheck,
  UserCheck,
  Clipboard,
  Timer,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Wifi,
  WifiOff,
  Edit,
  Share,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Logo } from './Logo';
import { InstitutionAuthModal } from './InstitutionAuthModal';
import { NotificationBar } from './NotificationBar';
import { UserRole } from '../App';

interface LandingPageProps {
  onLogin: (role: UserRole, userData?: any) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    api: 'operational',
    database: 'operational',
    ai: 'operational',
    uptime: '99.9%'
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  // Demo steps simulation - Enhanced with more detailed workflow
  const demoSteps = [
    { 
      title: "Data Input", 
      description: "Import faculty, students, courses, and room data",
      icon: "Upload",
      details: ["CSV/Excel Upload", "API Integration", "Manual Entry", "Data Validation"]
    },
    { 
      title: "Constraint Setup", 
      description: "Configure institutional rules and preferences",
      icon: "Settings",
      details: ["Faculty Availability", "Room Capacities", "Time Slots", "Course Prerequisites"]
    },
    { 
      title: "AI Processing", 
      description: "Intelligent algorithms optimize schedule generation",
      icon: "Brain",
      details: ["Conflict Analysis", "Resource Allocation", "Workload Balancing", "NEP 2020 Compliance"]
    },
    { 
      title: "Review & Adjust", 
      description: "Interactive review with manual adjustments",
      icon: "Edit",
      details: ["Visual Timeline", "Drag & Drop", "Conflict Highlighting", "Real-time Updates"]
    },
    { 
      title: "Deployment", 
      description: "Publish and distribute final timetables",
      icon: "Share",
      details: ["Multi-format Export", "Email Distribution", "Portal Publishing", "Mobile Access"]
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setDemoStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDemo = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    setDemoStep((prev) => (prev + 1) % demoSteps.length);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      {/* Announcement Notification */}
      {showNotification && (
        <NotificationBar
          type="announcement"
          message="🚀 Transform your academic scheduling with AI-powered automation - Zero conflicts, optimized workloads, instant generation!"
          action={{
            label: "Experience Demo",
            onClick: () => {
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
              setShowNotification(false);
            }
          }}
          dismissible={true}
        />
      )}

      <div className={`min-h-screen bg-white dark:bg-slate-900 ${showNotification ? 'pt-16' : ''}`}>
        {/* Dynamic Minimal Navigation */}
        <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo Section */}
              <div className="flex items-center">
                <Logo size="sm" animated className="transition-transform duration-300 hover:scale-105" />
              </div>
              
              {/* Desktop Navigation - Minimal & Clean */}
              <div className="hidden lg:flex items-center space-x-1">
                {[
                  { href: '#demo', label: 'Demo', icon: Play },
                  { href: '#features', label: 'Features', icon: Zap },
                  { href: '#security', label: 'Security', icon: Shield },
                  { href: '#implementation', label: 'Implementation', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <item.icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </span>
                  </button>
                ))}
                
                {/* Action Section */}
                <div className="flex items-center gap-2 ml-6 pl-6 border-l border-slate-200 dark:border-slate-700">
                  <Button
                    onClick={toggleDarkMode}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-slate-600" />
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile/Tablet Navigation */}
              <div className="lg:hidden flex items-center gap-2">
                <Button
                  onClick={toggleDarkMode}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-600" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg transition-all duration-200"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden">
                <div className="border-t border-slate-200 dark:border-slate-700 py-4 space-y-1">
                  {[
                    { href: '#demo', label: 'Interactive Demo', icon: Play, description: 'See AI in action' },
                    { href: '#features', label: 'Features & Benefits', icon: Zap, description: 'What makes us different' },
                    { href: '#security', label: 'Security & Compliance', icon: Shield, description: 'Enterprise-grade security' },
                    { href: '#implementation', label: 'Implementation', icon: Settings, description: 'Easy setup process' }
                  ].map((item) => (
                    <button
                      key={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg">
                          <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.label}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button 
                      onClick={() => {
                        setShowAuthModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white h-12"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Enhanced Hero Section - Mobile First */}
        <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:20px_20px] opacity-30 lg:opacity-50"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-r from-blue-400/15 to-green-400/15 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Status Badge - Mobile Optimized */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700 mb-6 sm:mb-8">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  🚀 AI-Powered Scheduling Revolution
                </span>
              </div>

              {/* Mobile-First Typography */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-slate-900 dark:text-slate-100 mb-6 sm:mb-8 leading-tight">
                <span className="block">Academic Timetable</span>
                <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                  AI Revolution
                </span>
              </h1>
              
              {/* Mobile-First Descriptions */}
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 max-w-4xl mx-auto leading-relaxed px-2">
                Transform educational scheduling with intelligent automation.
              </p>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-8 sm:mb-12 max-w-3xl mx-auto px-2">
                Built for NEP 2020 compliance, multidisciplinary programs, and modern educational excellence.
              </p>
              
              {/* Mobile-First Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-12 sm:mb-16 px-4 sm:px-0">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 hover:from-blue-700 hover:via-green-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-12 sm:h-auto"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 h-12 sm:h-auto"
                >
                  <Play className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                  Interactive Demo
                </Button>
              </div>

              {/* Mobile-First Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto px-2">
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">2-3min</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Generation Time</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">100%</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Conflict-Free</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">1000+</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Constraints</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1 sm:mb-2">95%</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Time Savings</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section - Mobile First */}
        <section id="demo" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 px-2">
                Interactive System Demo
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4">
                See how Timelytics.ai generates conflict-free timetables in real-time
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start lg:items-center">
              {/* Demo Controls - Mobile First */}
              <div className="order-2 lg:order-1">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                    <h3 className="text-lg sm:text-xl text-slate-900 dark:text-slate-100 font-semibold">Live Demo Walkthrough</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleDemo}
                        className="flex items-center gap-2 h-8 sm:h-9 px-3 text-sm"
                      >
                        {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextStep}
                        className="flex items-center gap-2 h-8 sm:h-9 px-3 text-sm"
                      >
                        <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
                        Next
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {demoSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg transition-all cursor-pointer ${
                          index === demoStep
                            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 shadow-md'
                            : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600'
                        }`}
                        onClick={() => setDemoStep(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                              index === demoStep
                                ? 'bg-blue-600 text-white'
                                : index < demoStep
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {index < demoStep ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : index === demoStep ? (
                              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-slate-900 dark:text-slate-100 mb-1">{step.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{step.description}</p>
                            {index === demoStep && (
                              <div className="grid grid-cols-2 gap-2 mt-3">
                                {step.details.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    {detail}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 text-center">
                      <Timer className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <h4 className="text-slate-900 dark:text-slate-100 mb-1">Generation Time</h4>
                      <p className="text-2xl text-blue-600 dark:text-blue-400">2-3 min</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 text-center">
                      <CheckSquare className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <h4 className="text-slate-900 dark:text-slate-100 mb-1">Conflict Resolution</h4>
                      <p className="text-2xl text-green-600 dark:text-green-400">100%</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 text-center">
                      <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <h4 className="text-slate-900 dark:text-slate-100 mb-1">Constraints Handled</h4>
                      <p className="text-2xl text-purple-600 dark:text-purple-400">1000+</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                      <h4 className="text-slate-900 dark:text-slate-100 mb-1">Efficiency Gain</h4>
                      <p className="text-2xl text-amber-600 dark:text-amber-400">95%</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Demo Interface Mockup */}
              <div className="relative">
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
                  {/* Mockup Browser Bar */}
                  <div className="flex items-center gap-2 p-3 bg-slate-800">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center text-slate-300 text-sm">timelytics.ai</div>
                  </div>
                  
                  {/* Enhanced Interactive Mockup Interface */}
                  <div className="p-6 bg-white dark:bg-slate-800 min-h-[450px]">
                    {demoStep === 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <CloudUpload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          <h3 className="text-lg text-slate-900 dark:text-slate-100">Data Input & Validation</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center gap-2 mb-2">
                              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Faculty Data</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">247 records imported</p>
                            <div className="mt-2 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs text-green-700 dark:text-green-300">✓ Validated</div>
                          </div>
                          
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Student Data</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">1,847 records imported</p>
                            <div className="mt-2 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs text-green-700 dark:text-green-300">✓ Validated</div>
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Course Data</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">156 courses loaded</p>
                            <div className="mt-2 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs text-green-700 dark:text-green-300">✓ Validated</div>
                          </div>
                          
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Monitor className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Room Data</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300">43 rooms configured</p>
                            <div className="mt-2 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs text-green-700 dark:text-green-300">✓ Validated</div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>All data validation checks passed. Ready for constraint setup.</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {demoStep === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                          <h3 className="text-lg text-slate-900 dark:text-slate-100">Constraint Configuration</h3>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Faculty Availability</h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-white dark:bg-slate-700 p-2 rounded">Dr. Smith: Mon-Wed</div>
                              <div className="bg-white dark:bg-slate-700 p-2 rounded">Prof. Johnson: Tue-Thu</div>
                              <div className="bg-white dark:bg-slate-700 p-2 rounded">Dr. Williams: Mon-Fri</div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Room Capacities</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-white dark:bg-slate-700 p-2 rounded">Room 101: 60 students</div>
                              <div className="bg-white dark:bg-slate-700 p-2 rounded">Lab A: 30 students</div>
                              <div className="bg-white dark:bg-slate-700 p-2 rounded">Hall B: 120 students</div>
                              <div className="bg-white dark:bg-slate-700 p-2 rounded">Room 205: 45 students</div>
                            </div>
                          </div>
                          
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Time Slot Preferences</h4>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="bg-white dark:bg-slate-700 px-3 py-1 rounded">Morning: 9:00-12:00</div>
                              <div className="bg-white dark:bg-slate-700 px-3 py-1 rounded">Afternoon: 1:00-4:00</div>
                              <div className="bg-white dark:bg-slate-700 px-3 py-1 rounded">Evening: 4:30-6:30</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {demoStep === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          <h3 className="text-lg text-slate-900 dark:text-slate-100">AI Processing Engine</h3>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                          <div className="flex items-center gap-3 mb-4">
                            <RefreshCw className="h-5 w-5 animate-spin text-purple-600" />
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Optimizing Schedule Generation...</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600 dark:text-slate-300">Analyzing constraints</span>
                              <span className="text-xs text-green-600">✓ Complete</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600 dark:text-slate-300">Resource allocation</span>
                              <span className="text-xs text-blue-600">Processing...</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600 dark:text-slate-300">Workload balancing</span>
                              <span className="text-xs text-slate-400">Pending</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600 dark:text-slate-300">NEP 2020 compliance</span>
                              <span className="text-xs text-slate-400">Pending</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 bg-white dark:bg-slate-700 rounded p-3">
                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <Activity className="h-4 w-4" />
                              <span>Processing 1,247 possible combinations...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {demoStep === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Edit className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          <h3 className="text-lg text-slate-900 dark:text-slate-100">Interactive Review & Adjustment</h3>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Suggested Optimizations</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-700 rounded">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Move Database Lab to Room A for better capacity</span>
                              <Button size="sm" variant="outline" className="ml-auto text-xs">Apply</Button>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-700 rounded">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Dr. Smith has 3 consecutive classes on Monday</span>
                              <Button size="sm" variant="outline" className="ml-auto text-xs">Review</Button>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-700 rounded">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Balanced workload across all faculty members</span>
                              <Button size="sm" variant="outline" className="ml-auto text-xs">Confirm</Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-6 gap-1 text-xs">
                          <div className="bg-slate-200 dark:bg-slate-600 p-2 text-center font-medium">Time</div>
                          <div className="bg-slate-200 dark:bg-slate-600 p-2 text-center font-medium">Mon</div>
                          <div className="bg-slate-200 dark:bg-slate-600 p-2 text-center font-medium">Tue</div>
                          <div className="bg-slate-200 dark:bg-slate-600 p-2 text-center font-medium">Wed</div>
                          <div className="bg-slate-200 dark:bg-slate-600 p-2 text-center font-medium">Thu</div>
                          <div className="bg-slate-200 dark:bg-slate-600 p-2 text-center font-medium">Fri</div>
                          
                          <div className="bg-slate-100 dark:bg-slate-700 p-2 text-center">9:00</div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 cursor-pointer hover:bg-blue-200">DS-101</div>
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 cursor-pointer hover:bg-green-200">DB-201</div>
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 cursor-pointer hover:bg-purple-200">AI-301</div>
                          <div className="bg-red-100 dark:bg-red-900/30 p-2 cursor-pointer hover:bg-red-200">Lab-A</div>
                          <div className="bg-amber-100 dark:bg-amber-900/30 p-2 cursor-pointer hover:bg-amber-200">SE-401</div>
                          
                          <div className="bg-slate-100 dark:bg-slate-700 p-2 text-center">10:00</div>
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 cursor-pointer hover:bg-green-200">DB-201</div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 cursor-pointer hover:bg-blue-200">DS-101</div>
                          <div className="bg-slate-100 dark:bg-slate-700 p-2"></div>
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 cursor-pointer hover:bg-purple-200">AI-301</div>
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 cursor-pointer hover:bg-green-200">DB-201</div>
                        </div>
                      </div>
                    )}
                    
                    {demoStep === 4 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Share className="h-6 w-6 text-green-600 dark:text-green-400" />
                          <h3 className="text-lg text-slate-900 dark:text-slate-100">Deployment & Distribution</h3>
                        </div>
                        
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">Timetable Successfully Generated!</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="bg-white dark:bg-slate-700 p-2 rounded">
                              <span className="text-slate-600 dark:text-slate-300">Total Schedules:</span>
                              <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">247</span>
                            </div>
                            <div className="bg-white dark:bg-slate-700 p-2 rounded">
                              <span className="text-slate-600 dark:text-slate-300">Zero Conflicts:</span>
                              <span className="ml-2 font-medium text-green-600">✓ Verified</span>
                            </div>
                            <div className="bg-white dark:bg-slate-700 p-2 rounded">
                              <span className="text-slate-600 dark:text-slate-300">Room Utilization:</span>
                              <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">94.7%</span>
                            </div>
                            <div className="bg-white dark:bg-slate-700 p-2 rounded">
                              <span className="text-slate-600 dark:text-slate-300">Faculty Balance:</span>
                              <span className="ml-2 font-medium text-green-600">Optimal</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Export Options</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 cursor-pointer hover:bg-blue-100">
                              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-slate-900 dark:text-slate-100">Excel Export</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 cursor-pointer hover:bg-green-100">
                              <Download className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-slate-900 dark:text-slate-100">PDF Reports</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 cursor-pointer hover:bg-purple-100">
                              <Globe className="h-4 w-4 text-purple-600" />
                              <span className="text-sm text-slate-900 dark:text-slate-100">Web Portal</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700 cursor-pointer hover:bg-amber-100">
                              <Smartphone className="h-4 w-4 text-amber-600" />
                              <span className="text-sm text-slate-900 dark:text-slate-100">Mobile App</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                <h4 className="text-lg text-slate-900 dark:text-slate-100 mb-4">Demo Progress</h4>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Step {demoStep + 1} of {demoSteps.length}</span>
                  <span>{Math.round(((demoStep + 1) / demoSteps.length) * 100)}% Complete</span>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Try Full Interactive Demo
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-4">
                Complete Scheduling Solution
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Everything you need to manage academic timetables efficiently and accurately.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">AI-Powered Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Intelligent algorithms automatically resolve conflicts and optimize resource allocation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">NEP 2020 Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Built-in support for multidisciplinary programs and flexible credit systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                    <FileSpreadsheet className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Data Import/Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Easy CSV/Excel data upload and export capabilities for seamless integration.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Analytics & Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Comprehensive reporting for faculty workload, room utilization, and efficiency.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Multi-Platform Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Responsive design works seamlessly across desktop, tablet, and mobile devices.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Secure & Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Enterprise-grade security with role-based access control and data protection.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Integration Capabilities */}
        <section className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-4">
                Seamless Integration
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Connect with your existing systems and workflows for a unified educational ecosystem.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl text-slate-900 dark:text-slate-100 mb-6">
                  Connect Everything
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                  Timelytics.ai integrates with your institution's existing infrastructure, 
                  ensuring data consistency and streamlined workflows across all departments.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg text-slate-900 dark:text-slate-100 mb-1">System Integration</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Direct integration with existing learning management systems and institutional software platforms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-lg text-slate-900 dark:text-slate-100 mb-1">Student Information Systems</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Sync with SIS platforms for real-time student enrollment and academic record updates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Server className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-lg text-slate-900 dark:text-slate-100 mb-1">ERP Systems</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Connect with institutional ERP for faculty management, resource allocation, and reporting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <CardContent className="p-6 text-center">
                    <CloudUpload className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-2">API Integration</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">RESTful APIs for custom integrations</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <CardContent className="p-6 text-center">
                    <FileSpreadsheet className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-2">Data Exchange</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">CSV, Excel, JSON import/export</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-2">Real-time Sync</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Live data synchronization</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <CardContent className="p-6 text-center">
                    <FileCheck className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-2">Data Validation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Automated data integrity checks</p>
                  </CardContent>
                </Card>
              </div>
            </div>


          </div>
        </section>

        {/* Role-Based Solutions */}
        <section id="solutions" className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-4">
                Built for Every Role
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Tailored interfaces and features for administrators, faculty, and students.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Admin */}
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Administrators</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Complete system management with AI-powered timetable generation and comprehensive analytics.
                  </p>
                  <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      System Configuration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      AI Timetable Generation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Faculty Management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Analytics Dashboard
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Faculty */}
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Faculty</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Personal schedule management with preference settings and workload tracking.
                  </p>
                  <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Personal Schedule View
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Time Preferences
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Workload Overview
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Schedule Export
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Students */}
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-slate-100">Students</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Easy access to personal timetables and course information with mobile-friendly design.
                  </p>
                  <ul className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Personal Timetable
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Course Details
                    </li>
                    <li className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Mobile Access
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      PDF Export
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section id="security" className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-4">
                Security & Compliance
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Enterprise-grade security with full compliance to educational data protection standards.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl text-slate-900 dark:text-slate-100 mb-6">
                  Government-Grade Security
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                  Built with security-first architecture to protect sensitive academic data and 
                  ensure compliance with national and international educational privacy standards.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-lg text-slate-900 dark:text-slate-100 mb-2">End-to-End Encryption</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        All data transmission and storage encrypted with AES-256 encryption standard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg text-slate-900 dark:text-slate-100 mb-2">Role-Based Access Control</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Granular permissions ensure users only access data relevant to their role.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Clipboard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-lg text-slate-900 dark:text-slate-100 mb-2">Audit Logging</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Comprehensive audit trails for all system activities and data access.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <CardTitle className="text-green-900 dark:text-green-100">Data Protection Compliance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        FERPA (Family Educational Rights and Privacy Act)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        GDPR (General Data Protection Regulation)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Indian Data Protection Framework
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        ISO 27001 Information Security Standards
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="text-blue-900 dark:text-blue-100">Security Certifications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        SOC 2 Type II Compliance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Government Security Standards
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Regular Security Audits
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Penetration Testing
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Security Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardContent className="p-6 text-center">
                  <Database className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto mb-4" />
                  <h4 className="text-slate-900 dark:text-slate-100 mb-2">Data Residency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    All data stored within Indian borders with government-approved data centers
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardContent className="p-6 text-center">
                  <Activity className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                  <h4 className="text-slate-900 dark:text-slate-100 mb-2">24/7 Monitoring</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Continuous security monitoring with real-time threat detection
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h4 className="text-slate-900 dark:text-slate-100 mb-2">Incident Response</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Dedicated security team with 24/7 incident response capabilities
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technical Capabilities */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-6">
                  Intelligent Automation
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                  Advanced algorithms handle complex scheduling requirements while maintaining 
                  full compliance with educational standards and institutional policies.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mt-0.5">
                      <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg text-slate-900 dark:text-slate-100 mb-1">Conflict Detection</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Automatically identifies and resolves scheduling conflicts across all resources.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mt-0.5">
                      <Layers className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg text-slate-900 dark:text-slate-100 mb-1">Resource Optimization</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Maximizes room utilization and balances faculty workload distribution.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg text-slate-900 dark:text-slate-100 mb-1">Constraint Management</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Handles complex institutional rules and faculty preferences seamlessly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">Desktop</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Full-featured interface</p>
                  </div>
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">Mobile</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Responsive design</p>
                  </div>
                  <div className="text-center">
                    <FileSpreadsheet className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">Import</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">CSV/Excel support</p>
                  </div>
                  <div className="text-center">
                    <Download className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">Export</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Multiple formats</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section id="implementation" className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-4">
                Implementation Process
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Get your institution up and running with Timelytics.ai in just a few simple steps.
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-slate-300 dark:bg-slate-600"></div>
              
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8 text-right">
                    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 inline-block">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg text-slate-900 dark:text-slate-100">Initial Setup</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Day 1</p>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          Account creation, basic configuration, and team member invitations.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-slate-800"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white dark:border-slate-800"></div>
                  <div className="flex-1 pl-8">
                    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 inline-block">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <CloudUpload className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg text-slate-900 dark:text-slate-100">Data Import</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Days 2-3</p>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          Upload faculty, student, and course data via CSV/Excel or system integration.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8 text-right">
                    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 inline-block">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-lg text-slate-900 dark:text-slate-100">Configuration</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Days 4-5</p>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          Set up constraints, preferences, and institutional rules for AI generation.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white dark:border-slate-800"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-600 rounded-full border-4 border-white dark:border-slate-800"></div>
                  <div className="flex-1 pl-8">
                    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 inline-block">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                            <Brain className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-lg text-slate-900 dark:text-slate-100">Testing & Training</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Days 6-7</p>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          Generate test timetables, train staff, and fine-tune system parameters.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8 text-right">
                    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 inline-block">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg text-slate-900 dark:text-slate-100">Go Live</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Day 8+</p>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          Full deployment with ongoing support and continuous optimization.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white dark:border-slate-800"></div>
                  <div className="flex-1 pl-8"></div>
                </div>
              </div>
            </div>

            {/* Implementation Support */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h4 className="text-slate-900 dark:text-slate-100 mb-2">Dedicated Support Team</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Assigned implementation specialist guides you through every step
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h4 className="text-slate-900 dark:text-slate-100 mb-2">Training Materials</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Comprehensive documentation and video tutorials for all users
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h4 className="text-slate-900 dark:text-slate-100 mb-2">Continuous Optimization</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Ongoing performance monitoring and system improvements
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live System Status */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-4">
                System Status & Performance
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Real-time monitoring of all system components to ensure reliable service.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl text-slate-900 dark:text-slate-100">All Systems Operational</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-slate-900 dark:text-slate-100">API Services</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-slate-900 dark:text-slate-100">Database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-slate-900 dark:text-slate-100">AI Engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-slate-900 dark:text-slate-100">Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl text-green-600 dark:text-green-400 mb-2">99.9%</div>
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">Uptime</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl text-blue-600 dark:text-blue-400 mb-2">145ms</div>
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">Response Time</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Average</p>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl text-purple-600 dark:text-purple-400 mb-2">2.3s</div>
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">AI Generation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Average time</p>
                  </CardContent>
                </Card>

                <Card className="border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl text-amber-600 dark:text-amber-400 mb-2">0</div>
                    <h4 className="text-slate-900 dark:text-slate-100 mb-1">Active Issues</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Current</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-slate-900 dark:text-slate-100">System Performance (Last 7 Days)</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-300">Response Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-300">Uptime %</span>
                  </div>
                </div>
              </div>
              <div className="h-32 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Performance monitoring data</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl text-slate-900 dark:text-slate-100 mb-4">
                Support & Resources
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Get help when you need it with comprehensive documentation and support channels.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Comprehensive guides covering installation, configuration, and usage.
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    <span className="text-slate-400">Coming Soon</span>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    Technical Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Direct assistance for technical issues and implementation questions.
                  </p>
                  <Button variant="outline" className="w-full" disabled>
                    <span className="text-slate-400">Coming Soon</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-green-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl text-white mb-6 leading-tight">
                Ready to Transform Your
                <br />
                <span className="text-yellow-300">Educational Scheduling?</span>
              </h2>
              <p className="text-xl text-blue-100 mb-4 max-w-3xl mx-auto">
                Join the revolution in academic timetable management.
              </p>
              <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
                Trusted by institutions across India for reliable, AI-powered scheduling solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-yellow-50 hover:text-blue-700 px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  See It In Action
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <Shield className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Government Approved</h3>
                  <p className="text-blue-100 text-sm">Compliant with J&K Higher Education standards</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <CheckCircle className="h-8 w-8 text-green-300 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">NEP 2020 Ready</h3>
                  <p className="text-blue-100 text-sm">Built for multidisciplinary education programs</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <Activity className="h-8 w-8 text-purple-300 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Real-time Updates</h3>
                  <p className="text-blue-100 text-sm">Live synchronization across all platforms</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-green-900/20"></div>
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <Logo size="md" className="mb-4" />
                  <p className="text-slate-400 mb-6 max-w-md">
                    Transforming educational scheduling with AI-powered automation. 
                    Built for NEP 2020 compliance and modern academic excellence.
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 rounded-full border border-green-700/50 w-fit">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-300">System Operational</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white mb-4 font-semibold">Platform Features</h3>
                  <ul className="space-y-3 text-slate-400">
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        AI Timetable Generation
                      </span>
                    </li>
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        Faculty Management
                      </span>
                    </li>
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-400" />
                        Student Portals
                      </span>
                    </li>
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-amber-400" />
                        Analytics & Reports
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white mb-4 font-semibold">Government Initiative</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-300 font-medium">Higher Education Department</p>
                        <p className="text-slate-400 text-sm">Government of Jammu & Kashmir</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-300 font-medium">Digital India Initiative</p>
                        <p className="text-slate-400 text-sm">Modernizing Education Technology</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="border-t border-slate-700 mt-12 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span>&copy; 2024 <span className=\"bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent font-semibold\">Timelytics.ai</span></span>
                    <span>•</span>
                    <span>Built for Educational Excellence</span>
                    <span>•</span>
                    <span>NEP 2020 Compliant</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      Get Started
                    </Button>
                    <Button
                      onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-300"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile-First Floating Action Buttons */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 sm:gap-3">
        {/* Quick Access CTA - Mobile Optimized */}
        <Button
          onClick={() => setShowAuthModal(true)}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 active:scale-95"
          title="Get Started"
        >
          <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        {/* Back to Top - Mobile Optimized */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            variant="outline"
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 active:scale-95"
            title="Back to Top"
          >
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-[-90deg]" />
          </Button>
        )}
      </div>

      {/* Enhanced Institution Authentication Modal */}
      <InstitutionAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={onLogin}
      />
    </>
  );
}