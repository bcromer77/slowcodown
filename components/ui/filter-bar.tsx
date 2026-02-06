"use client";

import { ChevronDown } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: {
    name: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
}

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters?.map?.((filter) => (
        <div key={filter?.name} className="relative">
          <select
            value={filter?.value ?? ""}
            onChange={(e) => filter?.onChange?.(e?.target?.value ?? "")}
            className="appearance-none bg-stone/30 text-charcoal text-sm px-4 py-2 pr-8 hover:bg-stone/50 transition-colors cursor-pointer focus:outline-none"
          >
            <option value="">{filter?.name}</option>
            {filter?.options?.map?.((opt) => (
              <option key={opt?.value} value={opt?.value}>
                {opt?.label}
              </option>
            )) ?? null}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/50 pointer-events-none"
          />
        </div>
      )) ?? null}
    </div>
  );
}
