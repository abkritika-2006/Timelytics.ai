import timelyticsFinalLogo from 'figma:asset/da370188166117499bd7b613fc7ca5f39540bb5f.png';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
  textColor?: 'default' | 'white' | 'dark';
}

export function Logo({ 
  size = 'md', 
  showText = true, 
  animated = false, 
  className = '', 
  textColor = 'default' 
}: LogoProps) {
  const sizeClasses = {
    xs: { logo: 'h-6 w-6', text: 'text-sm', container: 'h-6', spacing: 'space-x-2' },
    sm: { logo: 'h-8 w-8', text: 'text-base', container: 'h-8', spacing: 'space-x-2' },
    md: { logo: 'h-10 w-10', text: 'text-lg', container: 'h-10', spacing: 'space-x-3' },
    lg: { logo: 'h-14 w-14', text: 'text-xl', container: 'h-14', spacing: 'space-x-3' },
    xl: { logo: 'h-18 w-18', text: 'text-2xl', container: 'h-18', spacing: 'space-x-4' }
  };

  const textColorClasses = {
    default: 'bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent',
    white: 'text-white',
    dark: 'text-slate-800 dark:text-slate-200'
  };

  const currentSize = sizeClasses[size];

  const LogoImage = () => (
    <div
      className={`relative ${currentSize.container} flex items-center justify-center ${
        animated ? 'transition-all duration-300 hover:scale-105 active:scale-95' : ''
      }`}
    >
      {/* Clean logo without background - professional look */}
      <img 
        src={timelyticsFinalLogo} 
        alt="Timelytics.ai Logo"
        className={`${currentSize.logo} object-contain ${
          animated ? 'transition-all duration-300 hover:brightness-110' : ''
        }`}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );

  if (!showText) {
    return (
      <div className={`inline-flex ${className}`}>
        <LogoImage />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${currentSize.spacing} ${className} ${animated ? 'group' : ''}`}>
      <LogoImage />
      <span 
        className={`${currentSize.text} font-semibold tracking-tight ${textColorClasses[textColor]} ${
          animated ? 'transition-all duration-300 group-hover:brightness-110' : ''
        }`}
      >
        Timelytics.ai
      </span>
    </div>
  );
}

export function LogoMark({ 
  size = 'md', 
  animated = false, 
  className = '' 
}: Omit<LogoProps, 'showText' | 'textColor'>) {
  return <Logo size={size} showText={false} animated={animated} className={className} />;
}

// Specialized logo variants for different contexts
export function LogoWithText({ 
  size = 'md', 
  animated = true, 
  textColor = 'default' as const,
  className = '' 
}: Omit<LogoProps, 'showText'>) {
  return <Logo size={size} showText={true} animated={animated} textColor={textColor} className={className} />;
}

export function LogoIcon({ 
  size = 'sm', 
  animated = false, 
  className = '' 
}: Omit<LogoProps, 'showText' | 'textColor'>) {
  return <Logo size={size} showText={false} animated={animated} className={className} />;
}