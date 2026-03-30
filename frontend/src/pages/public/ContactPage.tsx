import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

export function ContactPage() {
  useDocumentTitle('Contato');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app this would send to an API
    setSubmitted(true);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            Contato
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Fale conosco</h1>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            Quer ser voluntário, doador ou parceiro? Envie uma mensagem e entraremos em contato.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Endereço</h3>
              <p className="mt-1 text-sm text-muted">Recife, PE — Brasil</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="mt-1 text-sm text-muted">contato@cufape.org.br</p>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Telefone</h3>
              <p className="mt-1 text-sm text-muted">(81) 99999-0000</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-surface rounded-xl border border-border p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Mensagem enviada!</h2>
                <p className="mt-2 text-sm text-muted">
                  Obrigado por entrar em contato. Retornaremos o mais breve possível.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-medium text-primary hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">Nome *</label>
                    <input id="contact-name" type="text" required className="input" placeholder="Seu nome completo" autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                    <input id="contact-email" type="email" required className="input" placeholder="seu@email.com" autoComplete="email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1.5">Assunto *</label>
                  <input id="contact-subject" type="text" required className="input" placeholder="Assunto da mensagem" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">Mensagem *</label>
                  <textarea id="contact-message" required className="input min-h-[120px]" rows={5} placeholder="Escreva sua mensagem..." />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                >
                  <Send className="w-4 h-4" aria-hidden="true" /> Enviar Mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
