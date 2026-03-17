import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      {/* Left side: branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8">
            <span className="text-white font-bold text-4xl italic">WA</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Wilson Aquino</h1>
          <p className="text-primary-100 text-lg mb-2 uppercase tracking-[0.2em] text-sm">
            Educação & Saúde
          </p>
          <p className="text-primary-200 text-sm mt-6 leading-relaxed">
            Sistema de gestão integrado para organização, controle e transparência
            das atividades da ONG Wilson Aquino.
          </p>
        </div>
      </div>

      {/* Right side: form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl italic">WA</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Wilson Aquino</h1>
            <p className="text-primary-200 text-xs uppercase tracking-[0.2em] mt-1">
              Educação & Saúde
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
