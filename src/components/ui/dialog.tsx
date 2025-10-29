import { createContext, useContext } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};
const Ctx = createContext<{ onClose: () => void } | null>(null);

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <Ctx.Provider value={{ onClose: () => onOpenChange(false) }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function DialogContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('relative z-10 bg-background p-6 shadow-xl rounded-2xl', className)} />;
}
export function DialogHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('mb-4', props.className)} />;
}
export function DialogTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cn('text-lg font-semibold', props.className)} />;
}
export function DialogDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn('text-sm text-muted-foreground', props.className)} />;
}
export function DialogFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('mt-6 flex justify-end gap-2', props.className)} />;
}
