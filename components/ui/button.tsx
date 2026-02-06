import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, children, className = "", disabled, ...props }, ref) => {
    const baseStyles = "px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2";
    
    const variants = {
      primary: "bg-charcoal text-warm-white hover:bg-charcoal/90 disabled:bg-charcoal/50",
      secondary: "bg-stone/50 text-charcoal hover:bg-stone/70 disabled:bg-stone/30",
      ghost: "bg-transparent text-charcoal hover:bg-stone/30 disabled:opacity-50",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
