export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={`${import.meta.env.BASE_URL}logo.jpg`}
        alt="Wilson Aquino"
        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
      />
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-white font-bold text-sm leading-tight">Wilson Aquino</span>
          <span className="text-primary-200 text-[10px] uppercase tracking-[0.15em]">Educação & Saúde</span>
        </div>
      )}
    </div>
  );
}
