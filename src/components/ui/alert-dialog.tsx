import { createContext, useContext } from 'react';
import type { HTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};
const Ctx = createContext<{ onClose: () => void } | null>(null);

export function AlertDialog({ open, onOpenChange, children }: Props) {
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

export function AlertDialogContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('relative z-10 bg-background p-6 shadow-xl rounded-2xl', className)} />;
}
export function AlertDialogHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('mb-4', props.className)} />;
}
export function AlertDialogTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cn('text-lg font-semibold', props.className)} />;
}
export function AlertDialogDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn('text-sm text-muted-foreground', props.className)} />;
}
export function AlertDialogFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('mt-6 flex justify-end gap-2', props.className)} />;
}

export function AlertDialogCancel({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => ctx?.onClose()}
      className={cn('h-10 px-4 rounded-xl border border-border bg-transparent hover:bg-accent', className)}
      {...props}
    />
  );
}

export function AlertDialogAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={() => ctx?.onClose()}
      className={cn('h-10 px-4 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90', className)}
      {...props}
    />
  );
}
