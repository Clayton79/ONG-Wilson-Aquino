import { clsx } from 'clsx';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={clsx('flex items-center gap-3', collapsed && 'justify-center', className)}>
      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-bold text-white tracking-tight">WA</span>
      </div>
      {!collapsed && (
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">Wilson Aquino</h1>
          <p className="text-[10px] text-primary-200 tracking-wider uppercase">Educação & Saúde</p>
        </div>
      )}
    </div>
  );
}
