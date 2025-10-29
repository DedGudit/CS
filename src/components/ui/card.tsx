import type { HTMLAttributes } from 'react';
import { cn } from './utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border bg-card text-card-foreground shadow-sm', className)} {...props} />;
}
export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-6', props.className)} />;
}
export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-6 pt-0', props.className)} />;
}
export function CardFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('p-6 pt-0', props.className)} />;
}
