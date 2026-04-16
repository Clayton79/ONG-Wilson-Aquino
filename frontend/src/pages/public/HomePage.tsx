import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, FolderKanban, Calendar, Instagram, MessageCircle } from 'lucide-react';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

const highlights = [
  { icon: Users, label: 'Voluntários', description: 'Centenas de voluntários engajados em nossas ações.' },
  { icon: Heart, label: 'Doações', description: 'Recursos que transformam comunidades inteiras.' },
  { icon: FolderKanban, label: 'Projetos', description: 'Iniciativas de educação, cultura e cidadania.' },
  { icon: Calendar, label: 'Eventos', description: 'Ações comunitárias que geram impacto real.' },
];

export function HomePage() {
  useDocumentTitle('Início');
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary mb-6">
              Central Única das Favelas
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Transformando <span className="text-primary">realidades</span> em Pernambuco
            </h1>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              A CUFA Pernambuco atua na promoção de educação, cultura, esporte e cidadania nas comunidades,
              gerando oportunidades e fortalecendo vidas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
              >
                Quero Ajudar <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/public/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Nossos Projetos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">O que fazemos</h2>
            <p className="mt-3 text-muted max-w-lg mx-auto">
              Atuamos em diversas frentes para promover a inclusão social e o desenvolvimento comunitário.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="bg-surface rounded-xl border border-border p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{item.label}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Nossas ações em imagens</h2>
            <p className="mt-3 text-muted max-w-lg mx-auto">
              Conheça os momentos e impactos de nossas ações na comunidade.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {['cufa1', 'cufa2', 'cufa3', 'cufa4', 'cufa5'].map((filename) => (
              <div key={filename} className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                <img
                  src={`/${filename}.jpg`}
                  alt={`CUFA Pernambuco ${filename}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Conecte-se conosco</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://www.instagram.com/cufapernambucooficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
              <a
                href="https://wa.me/5581997475008?text=Olá,%20gostaria%20de%20informações%20sobre%20a%20ONG"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Faça parte dessa transformação</h2>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">
            Seja voluntário, doador ou parceiro. Juntos podemos transformar a realidade de milhares de
            famílias nas comunidades de Pernambuco.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-gray-100 transition-colors"
            >
              Entre em Contato
            </Link>
            <Link
              to="/public/events"
              className="px-6 py-3 rounded-lg border border-white/40 font-semibold hover:bg-white/10 transition-colors"
            >
              Ver Eventos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
