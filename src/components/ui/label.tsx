import type { LabelHTMLAttributes } from 'react';
import { cn } from './utils';

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn('text-sm font-medium', props.className)} />;
}
