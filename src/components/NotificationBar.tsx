import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info, Megaphone } from 'lucide-react';
import { Button } from './ui/button';

interface NotificationBarProps {
  type?: 'success' | 'warning' | 'info' | 'announcement';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  autoHide?: boolean;
  duration?: number;
}

export function NotificationBar({
  type = 'info',
  message,
  action,
  dismissible = true,
  autoHide = false,
  duration = 5000
}: NotificationBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
          text: 'text-amber-800 dark:text-amber-200',
          icon: AlertCircle,
          iconColor: 'text-amber-600'
        };
      case 'announcement':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: Megaphone,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: Info,
          iconColor: 'text-blue-600'
        };
    }
  };

  const styles = getStyles();
  const IconComponent = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 border-b ${styles.bg} backdrop-blur-sm shadow-sm transition-all duration-300 notification-touchable`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className={`py-2 sm:py-3 transition-all duration-300 ${isExpanded ? 'pb-3 min-h-[3rem]' : ''}`}>
              {/* Mobile-first responsive layout */}
              <div className="flex items-center justify-between gap-2">
                <div 
                  className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity duration-200 sm:cursor-default notification-mobile"
                  onClick={() => {
                    // Only expand on mobile (using CSS media query logic)
                    const isMobile = window.matchMedia('(max-width: 639px)').matches;
                    if (isMobile) {
                      setIsExpanded(!isExpanded);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    const isMobile = window.matchMedia('(max-width: 639px)').matches;
                    if ((e.key === 'Enter' || e.key === ' ') && isMobile) {
                      e.preventDefault();
                      setIsExpanded(!isExpanded);
                    }
                  }}
                  aria-expanded={isExpanded}
                  aria-label="Click to expand notification on mobile"
                >
                  <IconComponent className={`h-4 w-4 ${styles.iconColor} flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm md:text-base font-medium ${styles.text} leading-tight ${isExpanded ? 'whitespace-normal break-words' : 'truncate sm:whitespace-normal sm:break-words'}`}>
                      {message}
                    </p>
                    {/* Mobile indicator for expandable content */}
                    <div className="sm:hidden">
                      {!isExpanded && (
                        <span className="text-xs opacity-60 block mt-0.5">• Tap to expand</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  {action && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        action.onClick();
                      }}
                      variant="outline"
                      size="sm"
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 h-6 sm:h-7 ${
                        type === 'announcement' 
                          ? 'border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                          : ''
                      } transition-all duration-200 whitespace-nowrap font-medium`}
                    >
                      {action.label}
                    </Button>
                  )}
                  
                  {dismissible && (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsVisible(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className={`p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-all duration-200 ${styles.text} h-6 w-6`}
                      title="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}