import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Shield, 
  Users,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Building,
  MapPin,
  Phone,
  FileText,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Zap,
  Clock,
  Award,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Logo } from './Logo';

interface InstitutionAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: 'admin' | 'faculty' | 'student', userData?: any) => void;
}

type AuthStep = 'welcome' | 'institution' | 'role-select' | 'register' | 'login' | 'verify';
type UserRole = 'admin' | 'faculty' | 'student';

interface Institution {
  id: string;
  name: string;
  type: string;
  location: string;
  code: string;
  students: number;
  verified: boolean;
}

const institutions: Institution[] = [
  { id: '1', name: 'University of Kashmir', type: 'State University', location: 'Srinagar', code: 'UOK', students: 25000, verified: true },
  { id: '2', name: 'University of Jammu', type: 'State University', location: 'Jammu', code: 'UOJ', students: 22000, verified: true },
  { id: '3', name: 'Central University of Kashmir', type: 'Central University', location: 'Ganderbal', code: 'CUK', students: 8000, verified: true },
  { id: '4', name: 'Islamic University of Science & Technology', type: 'State University', location: 'Awantipora', code: 'IUST', students: 12000, verified: true },
  { id: '5', name: 'Shri Mata Vaishno Devi University', type: 'State University', location: 'Katra', code: 'SMVDU', students: 9000, verified: true },
  { id: '6', name: 'Cluster University Srinagar', type: 'Cluster University', location: 'Srinagar', code: 'CUS', students: 15000, verified: true },
  { id: '7', name: 'Cluster University Jammu', type: 'Cluster University', location: 'Jammu', code: 'CUJ', students: 18000, verified: true }
];

const programs = {
  'B.Ed.': ['General', 'Science', 'Arts', 'Commerce', 'Physical Education'],
  'M.Ed.': ['Educational Administration', 'Curriculum & Instruction', 'Educational Psychology'],
  'FYUP': ['Arts', 'Science', 'Commerce', 'BBA', 'BCA', 'B.Tech'],
  'ITEP': ['Integrated Teacher Education', 'B.A. B.Ed.', 'B.Sc. B.Ed.']
};

export function InstitutionAuthModal({ isOpen, onClose, onLogin }: InstitutionAuthModalProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('welcome');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    department: '',
    program: '',
    semester: '',
    employeeId: '',
    rollNumber: '',
    phone: ''
  });

  if (!isOpen) return null;

  const roleData = {
    admin: {
      icon: Shield,
      title: 'Administrator',
      description: 'Full system access for institutional management',
      features: ['Complete Data Management', 'AI Timetable Generation', 'Analytics & Reports', 'User Management', 'System Configuration'],
      color: 'blue',
      permissions: 'Full Access'
    },
    faculty: {
      icon: Users,
      title: 'Faculty Member',
      description: 'Teaching staff with schedule management access',
      features: ['Personal Schedule View', 'Teaching Preferences', 'Workload Management', 'Conflict Resolution', 'Mobile Sync'],
      color: 'green',
      permissions: 'Schedule & Preferences'
    },
    student: {
      icon: GraduationCap,
      title: 'Student',
      description: 'Access to personalized academic schedules',
      features: ['Personal Timetable', 'Course Calendar', 'Class Notifications', 'Exam Schedule', 'Mobile App'],
      color: 'purple',
      permissions: 'View Only'
    }
  };

  const handleNext = (step: AuthStep) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'institution':
        setCurrentStep('welcome');
        break;
      case 'role-select':
        setCurrentStep('institution');
        break;
      case 'register':
      case 'login':
        setCurrentStep('role-select');
        break;
      case 'verify':
        setCurrentStep(selectedRole ? 'register' : 'login');
        break;
      default:
        setCurrentStep('welcome');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !selectedInstitution) return;

    setLoading(true);
    
    // Simulate authentication/registration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (currentStep === 'register') {
      setCurrentStep('verify');
    } else {
      // Mock user data based on role
      const userData = {
        admin: { 
          id: 'admin1', 
          name: formData.name || 'System Administrator', 
          email: formData.email,
          institution: selectedInstitution.name,
          role: 'admin'
        },
        faculty: { 
          id: 'faculty1', 
          name: formData.name || 'Dr. Sarah Johnson', 
          email: formData.email, 
          department: formData.department || 'Computer Science',
          employeeId: formData.employeeId || 'FAC001',
          institution: selectedInstitution.name,
          role: 'faculty'
        },
        student: { 
          id: 'student1', 
          name: formData.name || 'Arjun Sharma', 
          email: formData.email, 
          rollNumber: formData.rollNumber || 'CS2021001', 
          program: formData.program || 'B.Tech Computer Science',
          semester: formData.semester || '6',
          institution: selectedInstitution.name,
          role: 'student'
        }
      };

      onLogin(selectedRole, userData[selectedRole]);
      onClose();
    }
    
    setLoading(false);
  };

  const handleVerificationComplete = () => {
    if (!selectedRole || !selectedInstitution) return;
    
    const userData = {
      admin: { 
        id: 'admin1', 
        name: formData.name, 
        email: formData.email,
        institution: selectedInstitution.name,
        role: 'admin'
      },
      faculty: { 
        id: 'faculty1', 
        name: formData.name, 
        email: formData.email, 
        department: formData.department,
        employeeId: formData.employeeId,
        institution: selectedInstitution.name,
        role: 'faculty'
      },
      student: { 
        id: 'student1', 
        name: formData.name, 
        email: formData.email, 
        rollNumber: formData.rollNumber, 
        program: formData.program,
        semester: formData.semester,
        institution: selectedInstitution.name,
        role: 'student'
      }
    };

    onLogin(selectedRole, userData[selectedRole]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <Logo size="sm" animated className="sm:hidden" />
            <Logo size="md" animated className="hidden sm:block" />
            <div className="hidden sm:block">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Government of J&K Initiative
              </Badge>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="hover:bg-white/50 dark:hover:bg-slate-700">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-8"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                      <Building className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      Welcome to Timelytics.ai
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6">
                      AI-powered timetable generation system for J&K educational institutions
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">AI-Powered</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Zero conflicts, optimized schedules</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <Clock className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Instant Generation</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">2-3 minutes for complete timetables</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <Award className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">NEP 2020 Ready</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Compliant with new education policy</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleNext('institution')}
                    size="lg"
                    className="w-full max-w-md bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                          Institutional Access Only
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          This system is exclusively available to recognized educational institutions in Jammu and Kashmir. 
                          Valid institutional credentials are required for access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Institution Selection Step */}
            {currentStep === 'institution' && (
              <motion.div
                key="institution"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-8"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      Select Your Institution
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Choose your educational institution from the verified list
                    </p>
                  </div>

                  <div className="grid gap-4 mb-6">
                    {institutions.map((institution) => (
                      <motion.div
                        key={institution.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                            selectedInstitution?.id === institution.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                          onClick={() => setSelectedInstitution(institution)}
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                                    <Building className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{institution.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                      <Badge variant="outline" className="text-xs">{institution.code}</Badge>
                                      <span>{institution.type}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {institution.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {institution.students.toLocaleString()} students
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {institution.verified && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="order-2 sm:order-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={() => handleNext('role-select')}
                      disabled={!selectedInstitution}
                      className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                    >
                      Continue with {selectedInstitution?.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Role Selection Step */}
            {currentStep === 'role-select' && selectedInstitution && (
              <motion.div
                key="role-select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-8"
              >
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                      <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {selectedInstitution.name}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      Select Your Role
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Choose your role to access the appropriate dashboard and features
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {(Object.entries(roleData) as [UserRole, typeof roleData.admin][]).map(([role, data]) => {
                      const IconComponent = data.icon;
                      const isSelected = selectedRole === role;
                      
                      return (
                        <motion.div
                          key={role}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 h-full ${
                              isSelected
                                ? data.color === 'blue' 
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                                  : data.color === 'green'
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'  
                                  : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                            onClick={() => setSelectedRole(role)}
                          >
                            <CardHeader className="text-center pb-4">
                              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                                data.color === 'blue' 
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                  : data.color === 'green'
                                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                                  : 'bg-gradient-to-br from-purple-500 to-purple-600'
                              } shadow-lg`}>
                                <IconComponent className="h-8 w-8 text-white" />
                              </div>
                              <CardTitle className="text-xl mb-2">{data.title}</CardTitle>
                              <Badge variant="outline" className="w-fit mx-auto">
                                {data.permissions}
                              </Badge>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 text-center leading-relaxed">
                                {data.description}
                              </p>
                              <div className="space-y-2">
                                {data.features.map((feature, index) => (
                                  <div key={index} className="flex items-center text-sm">
                                    <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 ${
                                      data.color === 'blue' 
                                        ? 'text-blue-500'
                                        : data.color === 'green'
                                        ? 'text-green-500'
                                        : 'text-purple-500'
                                    }`} />
                                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="order-2 sm:order-1"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <div className="order-1 sm:order-2 flex flex-col sm:flex-row gap-3 flex-1">
                      <Button
                        onClick={() => handleNext('login')}
                        disabled={!selectedRole}
                        variant="outline"
                        className="flex-1"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => handleNext('register')}
                        disabled={!selectedRole}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      >
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Registration Step */}
            {currentStep === 'register' && selectedRole && selectedInstitution && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-8"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        roleData[selectedRole].color === 'blue' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : roleData[selectedRole].color === 'green'
                          ? 'bg-gradient-to-br from-green-500 to-green-600'
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        {(() => {
                          const IconComponent = roleData[selectedRole].icon;
                          return <IconComponent className="h-6 w-6 text-white" />;
                        })()}
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          Create Account
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {roleData[selectedRole].title} at {selectedInstitution.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                        Personal Information
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="name"
                              type="text"
                              placeholder="Enter your full name"
                              className="pl-10"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your institutional email"
                              className="pl-10"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Role-specific fields */}
                    {selectedRole === 'faculty' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                          Faculty Details
                        </h3>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="employeeId">Employee ID *</Label>
                            <div className="relative">
                              <UserCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="employeeId"
                                type="text"
                                placeholder="Your employee ID"
                                className="pl-10"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="department">Department *</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, department: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="computer-science">Computer Science</SelectItem>
                                <SelectItem value="mathematics">Mathematics</SelectItem>
                                <SelectItem value="physics">Physics</SelectItem>
                                <SelectItem value="chemistry">Chemistry</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="history">History</SelectItem>
                                <SelectItem value="economics">Economics</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRole === 'student' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                          Academic Details
                        </h3>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="rollNumber">Roll Number *</Label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="rollNumber"
                                type="text"
                                placeholder="Your roll number"
                                className="pl-10"
                                value={formData.rollNumber}
                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="program">Program *</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, program: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select program" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(programs).map(([program, specializations]) => (
                                  <div key={program}>
                                    <SelectItem value={program} className="font-semibold">{program}</SelectItem>
                                    {specializations.map((spec) => (
                                      <SelectItem key={`${program}-${spec}`} value={`${program} - ${spec}`} className="pl-6">
                                        {spec}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="semester">Current Semester</Label>
                          <Select onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 8 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  Semester {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Security */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2">
                        Security
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password">Password *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a strong password"
                              className="pl-10 pr-10"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Confirm your password"
                              className="pl-10"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="order-2 sm:order-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Login Step */}
            {currentStep === 'login' && selectedRole && selectedInstitution && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-8"
              >
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        roleData[selectedRole].color === 'blue' 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : roleData[selectedRole].color === 'green'
                          ? 'bg-gradient-to-br from-green-500 to-green-600'
                          : 'bg-gradient-to-br from-purple-500 to-purple-600'
                      }`}>
                        {(() => {
                          const IconComponent = roleData[selectedRole].icon;
                          return <IconComponent className="h-6 w-6 text-white" />;
                        })()}
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          Sign In
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {roleData[selectedRole].title} at {selectedInstitution.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <input
                          id="remember"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <Label htmlFor="remember" className="ml-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                          Remember me
                        </Label>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="order-2 sm:order-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </div>

                    <Separator />

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleNext('register')}
                    >
                      Don't have an account? Create one
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Verification Step */}
            {currentStep === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-8"
              >
                <div className="max-w-md mx-auto text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Account Created Successfully!
                  </h2>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Your account has been created and you're ready to access Timelytics.ai. 
                    Welcome to the future of academic scheduling!
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Institution:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{selectedInstitution?.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Role:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{selectedRole && roleData[selectedRole].title}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Email:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{formData.email}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleVerificationComplete}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                    size="lg"
                  >
                    Access Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}