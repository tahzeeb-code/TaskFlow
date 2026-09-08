import { cn } from '../../utils/cn';

export default function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-taskflow-primary/20 text-taskflow-ink',
    success: 'bg-[#E6F4EA] text-[#1E7E34]',
    warning: 'bg-[#FFF4E5] text-[#B07D2B]',
    danger: 'bg-[#FCE8EB] text-[#C81E1E]',
    outline: 'border border-taskflow-border text-taskflow-textSecondary bg-transparent',
  };

  return (
    <span 
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors", variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
