import { forwardRef } from 'react';

type Props =
  & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'>
  & { onCheckedChange?: (checked: boolean) => void };

export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ onCheckedChange, disabled, ...props }, ref) => (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        ref={ref}
        disabled={disabled}
        className="peer sr-only"
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <span className="block h-6 w-10 rounded-full bg-[var(--color-switch-background)] peer-checked:bg-primary relative transition-colors">
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  )
);
Switch.displayName = 'Switch';
