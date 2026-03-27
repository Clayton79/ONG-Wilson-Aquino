import { Outlet, Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/public/projects', label: 'Projetos' },
  { to: '/public/events', label: 'Eventos' },
  { to: '/contact', label: 'Contato' },
];

export function PublicLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-extrabold text-lg leading-none">C</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg tracking-tight">CUFA Pernambuco</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.to ? 'text-primary' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Área Restrita
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-white/10 pb-4 px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === link.to ? 'text-primary' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-primary">
              Área Restrita
            </Link>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-extrabold text-base leading-none">C</span>
                </div>
                <span className="font-bold text-white">CUFA Pernambuco</span>
              </div>
              <p className="text-sm leading-relaxed">
                Central Única das Favelas — Transformando realidades por meio da educação,
                cultura e cidadania nas comunidades de Pernambuco.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li>Recife, PE — Brasil</li>
                <li>contato@cufape.org.br</li>
                <li>(81) 99999-0000</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} CUFA Pernambuco. Todos os direitos reservados.
            </p>
            <p className="text-xs flex items-center gap-1">
              Feito com <Heart className="w-3 h-3 text-primary" /> para a comunidade
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
