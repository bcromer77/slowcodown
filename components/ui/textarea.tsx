import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, charCount, maxChars, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-charcoal/70">{label}</label>
            {maxChars && (
              <span className="text-xs text-charcoal/40">
                {charCount ?? 0}/{maxChars}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-stone/30 text-charcoal px-4 py-3 text-sm focus:outline-none focus:bg-stone/50 transition-colors resize-none ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
