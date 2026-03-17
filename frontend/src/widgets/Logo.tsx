import { clsx } from 'clsx';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={clsx('flex items-center gap-3', collapsed && 'justify-center', className)}>
      <img
        src={`${import.meta.env.BASE_URL}logo.jpg`}
        alt="Wilson Aquino"
        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
      />
      {!collapsed && (
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">Wilson Aquino</h1>
          <p className="text-[10px] text-primary-200 tracking-wider uppercase">Educação & Saúde</p>
        </div>
      )}
    </div>
  );
}
