import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Shield, 
  Calendar, 
  Users,
  GraduationCap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: 'admin' | 'faculty' | 'student', userData?: any) => void;
}

type AuthMode = 'login' | 'signup' | 'role-select';
type UserRole = 'admin' | 'faculty' | 'student';

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('role-select');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const roleData = {
    admin: {
      icon: Shield,
      title: 'Administrator',
      description: 'Manage courses, faculty, and generate optimized timetables',
      features: ['Data Management', 'AI Generation', 'Analytics & Reports', 'System Configuration'],
      color: 'blue'
    },
    faculty: {
      icon: Users,
      title: 'Faculty Member',
      description: 'View schedules, set preferences, and manage teaching loads',
      features: ['Personal Schedule', 'Preferences', 'Swap Requests', 'Workload Analytics'],
      color: 'green'
    },
    student: {
      icon: GraduationCap,
      title: 'Student',
      description: 'Access personalized timetables and course schedules',
      features: ['Personal Timetable', 'Course Calendar', 'Next Class Alerts', 'Mobile Sync'],
      color: 'purple'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user data based on role
    const userData = {
      admin: { id: 'admin1', name: 'System Administrator', email: formData.email },
      faculty: { id: 'faculty1', name: 'Dr. Sarah Johnson', email: formData.email, department: 'Computer Science' },
      student: { id: 'student1', name: 'Arjun Sharma', email: formData.email, rollNumber: 'CS2021001', program: 'B.Tech Computer Science' }
    };

    onLogin(selectedRole, userData[selectedRole]);
    setLoading(false);
    onClose();
  };

  const handleGoogleLogin = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      admin: { id: 'admin1', name: 'System Administrator', email: 'admin@timelytics.ai' },
      faculty: { id: 'faculty1', name: 'Dr. Sarah Johnson', email: 'sarah.j@timelytics.ai', department: 'Computer Science' },
      student: { id: 'student1', name: 'Arjun Sharma', email: 'arjun.s@student.edu', rollNumber: 'CS2021001', program: 'B.Tech Computer Science' }
    };

    onLogin(selectedRole, userData[selectedRole]);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto mx-2 sm:mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <Logo size="sm" animated className="sm:hidden" />
          <Logo size="md" animated className="hidden sm:block" />
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {authMode === 'role-select' && (
          <div className="p-4 sm:p-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl mb-2">Welcome to Timelytics.ai</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Choose your role to access your personalized dashboard
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                        isSelected
                          ? data.color === 'blue' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : data.color === 'green'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'  
                            : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <CardHeader className="text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                          data.color === 'blue' 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : data.color === 'green'
                            ? 'bg-gradient-to-br from-green-500 to-green-600'
                            : 'bg-gradient-to-br from-purple-500 to-purple-600'
                        }`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl">{data.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                          {data.description}
                        </p>
                        <div className="space-y-2">
                          {data.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle className={`h-4 w-4 mr-2 ${
                                data.color === 'blue' 
                                  ? 'text-blue-500'
                                  : data.color === 'green'
                                  ? 'text-green-500'
                                  : 'text-purple-500'
                              }`} />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <Button
                onClick={() => setAuthMode('login')}
                disabled={!selectedRole}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                size="lg"
              >
                Continue as {selectedRole ? roleData[selectedRole].title : 'Selected Role'}
              </Button>
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Why create an account?
                    </h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Personalized timetable optimization</li>
                      <li>• Role-based dashboard with relevant features</li>
                      <li>• Real-time synchronization across devices</li>
                      <li>• AI-powered recommendations and insights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(authMode === 'login' || authMode === 'signup') && selectedRole && (
          <div className="p-4 sm:p-6">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  roleData[selectedRole].color === 'blue' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                    : roleData[selectedRole].color === 'green'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  {(() => {
                    const IconComponent = roleData[selectedRole].icon;
                    return <IconComponent className="h-8 w-8 text-white" />;
                  })()}
                </div>
                <h2 className="text-2xl mb-2">
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {authMode === 'login' ? 'Welcome back!' : 'Join Timelytics.ai'} as {roleData[selectedRole].title}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {roleData[selectedRole].title}
                </Badge>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    authMode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>

              <Button
                onClick={() => setAuthMode('role-select')}
                variant="ghost"
                className="w-full mt-4"
              >
                ← Back to role selection
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}