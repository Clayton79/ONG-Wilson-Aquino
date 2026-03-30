import { useEffect, useState } from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import { api } from '../../shared/services/api';
import type { OngEvent, PaginatedResponse } from '../../shared/types';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

const statusLabels: Record<string, string> = {
  scheduled: 'Agendado',
  in_progress: 'Em Andamento',
  completed: 'Realizado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
};

export function PublicEventsPage() {
  useDocumentTitle('Eventos');
  const [events, setEvents] = useState<OngEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get<PaginatedResponse<OngEvent>>('/public/events?limit=50');
        setEvents(response.data ?? []);
      } catch { /* ignored */ }
      finally { setIsLoading(false); }
    })();
  }, []);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            Nossos Eventos
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Agenda de eventos</h1>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            Participe dos nossos eventos comunitários e ajude a construir um futuro melhor.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20" role="status" aria-live="polite">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" aria-hidden="true" />
            <span className="sr-only">Carregando eventos...</span>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-muted py-20">Nenhum evento cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => {
              const date = new Date(event.date);
              const day = date.getDate().toString().padStart(2, '0');
              const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
              return (
                <div key={event.id} className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow flex">
                  {/* Date column */}
                  <div className="w-20 shrink-0 bg-primary/5 flex flex-col items-center justify-center border-r border-border">
                    <span className="text-2xl font-bold text-primary">{day}</span>
                    <span className="text-xs font-medium text-primary uppercase">{month}</span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{event.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[event.status] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[event.status] || event.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted line-clamp-2">{event.description}</p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {event.startTime} — {event.endTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                      {event.maxParticipants && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3" /> {event.participantIds.length}/{event.maxParticipants}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
