export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-lg italic">WA</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-white font-bold text-sm leading-tight">Wilson Aquino</span>
          <span className="text-primary-200 text-[10px] uppercase tracking-[0.15em]">Educação & Saúde</span>
        </div>
      )}
    </div>
  );
}
