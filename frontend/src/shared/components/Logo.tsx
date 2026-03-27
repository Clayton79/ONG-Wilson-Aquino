export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-white font-extrabold text-xl leading-none">C</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-white font-bold text-sm leading-tight">CUFA Pernambuco</span>
          <span className="text-primary-200 text-[10px] uppercase tracking-[0.15em]">Central das Favelas</span>
        </div>
      )}
    </div>
  );
}
