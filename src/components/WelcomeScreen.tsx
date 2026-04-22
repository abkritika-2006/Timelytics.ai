import { motion } from 'motion/react';
import { 
  CheckCircle, 
  User, 
  Building2, 
  Mail, 
  ArrowRight,
  Shield,
  Users,
  GraduationCap
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { User as UserType } from '../contexts/AppContext';

interface WelcomeScreenProps {
  user: UserType;
  onContinue: () => void;
}

export function WelcomeScreen({ user, onContinue }: WelcomeScreenProps) {
  const roleConfig = {
    admin: {
      icon: Shield,
      title: 'Administrator',
      description: 'Full system access',
      color: 'blue'
    },
    faculty: {
      icon: Users,
      title: 'Faculty Member',
      description: 'Teaching & schedule management',
      color: 'green'
    },
    student: {
      icon: GraduationCap,
      title: 'Student',
      description: 'Personal timetable access',
      color: 'purple'
    }
  };

  const config = user.role ? roleConfig[user.role as keyof typeof roleConfig] : null;
  const IconComponent = config?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-2xl">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="text-center">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <Logo size="lg" animated className="justify-center" />
              </motion.div>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </motion.div>

              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Welcome to Timelytics.ai!
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mb-8">
                  Your account has been successfully authenticated. You're now ready to experience 
                  AI-powered academic scheduling.
                </p>
              </motion.div>

              {/* User Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-8"
              >
                {/* Role Badge */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    config?.color === 'blue' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : config?.color === 'green'
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {config?.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {config?.description}
                    </p>
                  </div>
                </div>

                {/* User Details */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{user.name || 'User'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{user.email || ''}</span>
                  </div>

                  {user.institution && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Institution
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{user.institution}</span>
                    </div>
                  )}

                  {/* Role-specific details */}
                  {user.role === 'faculty' && user.department && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Department</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{user.department}</span>
                    </div>
                  )}

                  {user.role === 'faculty' && user.employeeId && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Employee ID</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{user.employeeId}</span>
                    </div>
                  )}

                  {user.role === 'student' && user.rollNumber && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Roll Number</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{user.rollNumber}</span>
                    </div>
                  )}

                  {user.role === 'student' && user.program && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Program</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{user.program}</span>
                    </div>
                  )}

                  {user.role === 'student' && user.semester && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Semester</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">Semester {user.semester}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    What's Next?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Access your personalized dashboard to start using AI-powered timetable generation, 
                    manage your schedule, and explore all the features available for your role.
                  </p>
                </div>

                <Button
                  onClick={onContinue}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Access Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}