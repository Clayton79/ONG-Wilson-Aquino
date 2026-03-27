import { clsx } from 'clsx';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ collapsed = false, className, variant = 'light' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-foreground';
  const subColor = variant === 'light' ? 'text-primary-300' : 'text-muted';

  return (
    <div className={clsx('flex items-center gap-3', collapsed && 'justify-center', className)}>
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-white font-extrabold text-lg leading-none">C</span>
      </div>
      {!collapsed && (
        <div>
          <h1 className={clsx('text-sm font-bold leading-tight', textColor)}>CUFA Pernambuco</h1>
          <p className={clsx('text-[10px] tracking-wider uppercase', subColor)}>
            Central das Favelas
          </p>
        </div>
      )}
    </div>
  );
}
