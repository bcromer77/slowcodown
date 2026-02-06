import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-charcoal/70 mb-2">{label}</label>
        )}
        <select
          ref={ref}
          className={`w-full bg-stone/30 text-charcoal px-4 py-3 text-sm focus:outline-none focus:bg-stone/50 transition-colors cursor-pointer ${className}`}
          {...props}
        >
          {options?.map?.((opt) => (
            <option key={opt?.value} value={opt?.value}>
              {opt?.label}
            </option>
          )) ?? null}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
