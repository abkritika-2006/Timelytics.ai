import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Moon,
  Building,
  Award,
  Target,
  Briefcase,
  Star,
  ChevronRight,
  FileText,
  Upload,
  Eye,
  Save,
  Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Logo } from './Logo';
import { InstitutionAuthModal } from './InstitutionAuthModal';
import { NotificationBar } from './NotificationBar';
import { UserRole } from '../App';

interface EnhancedLandingPageProps {
  onLogin: (role: UserRole, userData?: any) => void;
}

export function EnhancedLandingPage({ onLogin }: EnhancedLandingPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  // Demo steps simulation - Simplified workflow
  const demoSteps = [
    { 
      title: "Data Upload", 
      description: "Import CSV/Excel files",
      icon: Upload,
      details: ["Faculty Data", "Course List", "Room Info", "Time Slots"],
      color: "from-blue-500 to-blue-600"
    },
    { 
      title: "AI Processing", 
      description: "Smart conflict detection & optimization",
      icon: Brain,
      details: ["Conflict Check", "Resource Balance", "NEP Compliance", "Auto-Schedule"],
      color: "from-purple-500 to-purple-600"
    },
    { 
      title: "Review & Export", 
      description: "Final review and publish",
      icon: Download,
      details: ["Visual Preview", "Quick Edits", "PDF Export", "Email Send"],
      color: "from-green-500 to-green-600"
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
      {/* Government Announcement Notification */}
      {showNotification && (
        <NotificationBar
          type="announcement"
          message="🚀 Smart AI Scheduling | NEP 2020 Compliant | Zero Conflicts Guaranteed"
          action={{
            label: "Get Started",
            onClick: () => {
              setShowAuthModal(true);
              setShowNotification(false);
            }
          }}
          dismissible={true}
        />
      )}

      <div className={`min-h-screen bg-white dark:bg-slate-900 ${showNotification ? 'pt-16 sm:pt-14 md:pt-16' : ''}`}>
        {/* Enhanced Government Navigation */}
        <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 sm:h-16">
              {/* Government Logo Section */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Logo size="sm" animated className="transition-transform duration-300 hover:scale-105" />
                <div className="hidden sm:block h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                <div className="hidden md:flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Government of</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Jammu & Kashmir</span>
                </div>
                <div className="sm:hidden flex items-center">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">J&K Govt</span>
                </div>
                <div className="hidden sm:block md:hidden">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">J&K Government</span>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {[
                  { href: '#demo', label: 'Live Demo', icon: Play },
                  { href: '#features', label: 'Features', icon: Zap },
                  { href: '#security', label: 'Security', icon: Shield },
                  { href: '#implementation', label: 'Setup', icon: Settings }
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
                    Start Scheduling
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden flex items-center gap-2">
                <Button
                  onClick={toggleDarkMode}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-600" />
                  )}
                </Button>
                
                <Button
                  onClick={() => setShowAuthModal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-3 py-2 text-sm transition-all duration-200"
                >
                  Login
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-button p-2 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="px-4 py-3 space-y-2">
                    {[
                      { href: '#demo', label: 'Live Demo', icon: Play },
                      { href: '#features', label: 'Features', icon: Zap },
                      { href: '#security', label: 'Security', icon: Shield },
                      { href: '#implementation', label: 'Setup Guide', icon: Settings }
                    ].map((item) => (
                      <button
                        key={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-3 py-3 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group flex items-center gap-3 min-h-[48px]"
                      >
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg">
                          <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Enhanced Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:20px_20px] opacity-30 lg:opacity-50"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-r from-blue-400/15 to-green-400/15 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Government Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full border-2 border-blue-200 dark:border-blue-700 mb-6 sm:mb-8 shadow-lg">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                  AI-Powered Academic Excellence
                </span>
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>

              {/* Enhanced Typography */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 leading-tight px-2">
                <span className="block">Transform Academic</span>
                <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                  Scheduling with AI
                </span>
              </h1>
              
              {/* Descriptions */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-3 sm:mb-4 max-w-4xl mx-auto leading-relaxed px-4">
                Official AI-Powered Timetable Generation System
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                NEP 2020 compliant, multidisciplinary programs, intelligent automation, zero conflicts.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 px-4 sm:px-0">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 hover:from-blue-700 hover:via-green-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-base shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 h-11 sm:h-12"
                >
                  Start with Timelytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 sm:px-8 py-3 text-sm sm:text-base transition-all duration-300 h-11 sm:h-12"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>

              {/* Government Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto px-4">
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">2-3min</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Generation Time</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Conflict-Free</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">1000+</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Constraints</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">95%</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Time Savings</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="py-12 sm:py-16 lg:py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                AI Scheduling
                <span className="block text-blue-600 dark:text-blue-400">Live Demo</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                See how AI transforms scheduling in minutes, not hours.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Demo Controls */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <Button
                    onClick={toggleDemo}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'} Demo
                  </Button>
                  <Button
                    onClick={nextStep}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600"
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next Step
                  </Button>
                </div>

                {/* Demo Steps */}
                <div className="space-y-4">
                  {demoSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = index === demoStep;
                    const isCompleted = index < demoStep;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                            : isCompleted
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${step.color} text-white`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                              {step.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                              {step.description}
                            </p>
                            {isActive && (
                              <div className="grid grid-cols-2 gap-2">
                                {step.details.map((detail, i) => (
                                  <div key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {detail}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {isCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-2" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demo Visualization */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {demoSteps[demoStep].title}
                    </h3>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-500">Live Preview</span>
                    </div>
                  </div>
                  
                  {/* Mock UI based on current step */}
                  {demoStep === 0 && (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                        <CloudUpload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-blue-600">Upload Data Files</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-xs text-center">Faculty.csv ✓</div>
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-xs text-center">Courses.xlsx ✓</div>
                      </div>
                    </div>
                  )}
                  
                  {demoStep === 1 && (
                    <div className="text-center space-y-4">
                      <Brain className="h-12 w-12 text-purple-500 mx-auto animate-pulse" />
                      <div className="space-y-2">
                        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                        </div>
                        <p className="text-sm text-purple-600">AI Processing: 847 constraints...</p>
                      </div>
                    </div>
                  )}
                  
                  {demoStep === 2 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-1 mb-3">
                        {Array.from({ length: 15 }, (_, i) => (
                          <div
                            key={i}
                            className={`aspect-square rounded text-xs flex items-center justify-center ${
                              i % 3 === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                              i % 3 === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                              'bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            {i % 3 === 0 ? 'M' : i % 3 === 1 ? 'T' : ''}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-blue-500 text-white">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" className="flex-1 bg-green-500 text-white">
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                      </div>
                      <div className="text-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-green-600">Ready!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Key Features for
                <span className="block text-green-600 dark:text-green-400">Smart Scheduling</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                NEP 2020 compliant with intelligent automation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Generation",
                  description: "Smart algorithms create optimal timetables in minutes.",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: Shield,
                  title: "Zero Conflicts",
                  description: "Intelligent detection prevents scheduling overlaps.",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: Users,
                  title: "Faculty Management",
                  description: "Comprehensive profiles with workload balancing.",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: FileSpreadsheet,
                  title: "Easy Data Import",
                  description: "CSV/Excel upload with seamless integration.",
                  color: "from-teal-500 to-teal-600"
                },
                {
                  icon: BarChart3,
                  title: "Smart Analytics",
                  description: "Real-time insights and efficiency reports.",
                  color: "from-red-500 to-red-600"
                },
                {
                  icon: Globe,
                  title: "Multi-Platform",
                  description: "Works on desktop, tablet, and mobile devices.",
                  color: "from-indigo-500 to-indigo-600"
                }
              ].map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-slate-900 dark:text-slate-100">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Compliance Section */}
        <section id="security" className="py-12 sm:py-16 lg:py-20 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Secure & Compliant
                <span className="block text-red-600 dark:text-red-400">Government Standards</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Enterprise security with NEP 2020 compliance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
              {[
                {
                  icon: Shield,
                  title: "Data Protection",
                  description: "Advanced encryption and secure data handling protocols"
                },
                {
                  icon: Award,
                  title: "NEP 2020 Compliant",
                  description: "Fully aligned with National Education Policy requirements"
                },
                {
                  icon: Building,
                  title: "Institution Ready",
                  description: "Designed for seamless institutional deployment"
                },
                {
                  icon: CheckCircle,
                  title: "GDPR Ready",
                  description: "Complete compliance with data privacy regulations"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
                Government Platform Reliability
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Always</div>
                  <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300">Available</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Secure</div>
                  <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300">Data Protection</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">Instant</div>
                  <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300">Updates</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Section */}
        <section id="implementation" className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Quick Setup &
                <span className="block text-purple-600 dark:text-purple-400">Implementation</span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Get started in minutes with our streamlined onboarding process designed for educational institutions.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Institution Registration",
                    description: "Register your institution with basic details and administrative information.",
                    icon: Building,
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    step: "02",
                    title: "Data Upload",
                    description: "Import existing faculty, student, and course data using our templates.",
                    icon: Upload,
                    color: "from-green-500 to-green-600"
                  },
                  {
                    step: "03",
                    title: "Configuration",
                    description: "Set up institutional rules, constraints, and scheduling preferences.",
                    icon: Settings,
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    step: "04",
                    title: "Go Live",
                    description: "Generate your first timetable and start using the system immediately.",
                    icon: Zap,
                    color: "from-amber-500 to-amber-600"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 items-start group">
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-green-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
                Ready to Transform Your
                <br />
                <span className="text-yellow-300">Institution's Scheduling?</span>
              </h2>
              <p className="text-lg sm:text-xl text-blue-100 mb-4 max-w-3xl mx-auto">
                Join the digital education revolution with AI-powered timetable generation.
              </p>
              <p className="text-base sm:text-lg text-blue-200 mb-8 sm:mb-12 max-w-2xl mx-auto">
                Trusted by educational institutions across India for reliable, intelligent scheduling solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-yellow-50 hover:text-blue-700 px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Start with Timelytics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <Shield className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Enterprise Security</h3>
                  <p className="text-blue-100 text-sm">Bank-grade security with advanced data protection</p>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2 text-center md:text-left">
                  <Logo size="md" className="mb-4 justify-center md:justify-start" animated />
                  <p className="text-slate-400 mb-6 max-w-md mx-auto md:mx-0">
                    Transforming educational scheduling with AI-powered automation. 
                    Built for NEP 2020 compliance and modern academic excellence.
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-900/30 rounded-full border border-green-700/50 w-fit mx-auto md:mx-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-300">System Operational</span>
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <h3 className="text-white mb-4 font-semibold">Platform Features</h3>
                  <ul className="space-y-3 text-slate-400">
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2 justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        AI Timetable Generation
                      </span>
                    </li>
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2 justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        Faculty Management
                      </span>
                    </li>
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2 justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 text-purple-400" />
                        Student Portals
                      </span>
                    </li>
                    <li className="hover:text-slate-300 transition-colors cursor-pointer">
                      <span className="flex items-center gap-2 justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 text-amber-400" />
                        Analytics & Reports
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center md:text-left">
                  <h3 className="text-white mb-4 font-semibold">Government Initiative</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 justify-center md:justify-start">
                      <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-300 font-medium">Higher Education Department</p>
                        <p className="text-slate-400 text-sm">Government of Jammu & Kashmir</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 justify-center md:justify-start">
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-slate-400 text-sm text-center sm:text-left">
                    <span>&copy; 2024 <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent font-semibold">Timelytics.ai</span></span>
                    <span className="hidden sm:inline">•</span>
                    <span>Built for Educational Excellence</span>
                    <span className="hidden sm:inline">•</span>
                    <span>NEP 2020 Compliant</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 px-6 w-full sm:w-auto"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition-all duration-300 w-full sm:w-auto"
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

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        {/* Quick Access CTA */}
        <Button
          onClick={() => setShowAuthModal(true)}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full w-11 h-11 sm:w-12 sm:h-12 p-0 active:scale-95"
          title="Get Started with Timelytics"
        >
          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Back to Top */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            variant="outline"
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 rounded-full w-9 h-9 sm:w-10 sm:h-10 p-0 active:scale-95"
            title="Back to Top"
          >
            <ArrowRight className="h-3 w-3 rotate-[-90deg]" />
          </Button>
        )}
      </div>

      {/* Institution Authentication Modal */}
      <InstitutionAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={onLogin}
      />
    </>
  );
}