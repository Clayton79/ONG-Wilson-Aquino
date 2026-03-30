import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-black">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
        Pular para o conteúdo
      </a>
      {/* Left side: branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center max-w-md">
          <img
            src={`${import.meta.env.BASE_URL}CUFA%20PE.jpg`}
            alt="CUFA Pernambuco"
            className="w-24 h-24 rounded-2xl object-cover mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-white mb-4">CUFA Pernambuco</h1>
          <p className="text-primary-400 text-sm mb-2 uppercase tracking-[0.2em]">
            Central Unica das Favelas
          </p>
          <p className="text-gray-400 text-sm mt-6 leading-relaxed">
            Sistema de gestao integrado para organizacao, controle e transparencia
            das atividades da CUFA Pernambuco.
          </p>
        </div>
      </div>

      {/* Right side: form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div id="main-content" className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src={`${import.meta.env.BASE_URL}CUFA%20PE.jpg`}
              alt="CUFA Pernambuco"
              className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-foreground">CUFA Pernambuco</h1>
            <p className="text-muted text-xs uppercase tracking-[0.2em] mt-1">
              Central Unica das Favelas
            </p>
          </div>

          <div className="bg-surface rounded-2xl shadow-xl p-8 border border-border">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
