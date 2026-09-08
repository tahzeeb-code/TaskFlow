import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ className, variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taskflow-primary disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-taskflow-ink text-white hover:bg-black/90 shadow-sm',
    secondary: 'bg-taskflow-primary text-taskflow-ink hover:bg-[#ffb3c6] shadow-sm',
    outline: 'border border-taskflow-border bg-transparent hover:bg-gray-50 text-taskflow-ink',
    ghost: 'hover:bg-gray-100 text-taskflow-textSecondary hover:text-taskflow-ink',
  };

  const sizes = {
    default: 'h-11 px-6 py-2',
    sm: 'h-9 px-4 text-sm',
    lg: 'h-14 px-8 text-lg',
    icon: 'h-11 w-11',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
