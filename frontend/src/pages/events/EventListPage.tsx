import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Calendar, MapPin, Trash2, Edit, Eye,
} from 'lucide-react';

import {
  Card, Badge, Button, Input, Pagination,
  EmptyState, LoadingSpinner, ConfirmDialog,
} from '../../shared/components';
import { eventApi } from '../../shared/services';
import type { OngEvent, PaginatedResponse } from '../../shared/types';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  scheduled:   { label: 'Agendado',   variant: 'info' },
  in_progress: { label: 'Em Andamento', variant: 'warning' },
  completed:   { label: 'Concluído',  variant: 'success' },
  cancelled:   { label: 'Cancelado',  variant: 'danger' },
};

export function EventListPage() {
  useDocumentTitle('Eventos');
  const navigate = useNavigate();
  const [events, setEvents] = useState<OngEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<OngEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const response: PaginatedResponse<OngEvent> = await eventApi.getAll(params.toString());
      setEvents(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch {
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await eventApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadEvents();
    } finally { setIsDeleting(false); }
  };

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Eventos</h1>
          <p className="page-subtitle">{total} evento(s) cadastrado(s)</p>
        </div>
        <Button onClick={() => navigate('/events/new')}>
          <Plus className="w-4 h-4 mr-2" /> Novo Evento
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <Input placeholder="Buscar eventos..." className="pl-9" aria-label="Buscar eventos"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="input max-w-[180px]" value={statusFilter} aria-label="Filtrar por status"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Todos os status</option>
            <option value="scheduled">Agendado</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </Card>

      {/* List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <EmptyState
          title="Nenhum evento encontrado"
          description="Comece cadastrando um novo evento."
          action={{ label: 'Novo Evento', onClick: () => navigate('/events/new') }}
        />
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const sc = statusConfig[event.status] ?? statusConfig.scheduled;
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">{event.name}</h3>
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                      <Badge variant="neutral">{event.category}</Badge>
                    </div>
                    <p className="text-sm text-muted line-clamp-1">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {fmtDate(event.date)} {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {event.location}
                      </span>
                      {event.maxParticipants && (
                        <span>{event.participantIds.length}/{event.maxParticipants} participantes</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}`)} aria-label="Ver detalhes" title="Ver detalhes">
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}/edit`)} aria-label="Editar" title="Editar">
                      <Edit className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(event)} aria-label="Excluir" title="Excluir">
                      <Trash2 className="w-4 h-4 text-red-500" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} />
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Evento"
        message={`Deseja realmente excluir o evento "${deleteTarget?.name}"? Esta ação é irreversível.`}
        confirmLabel="Excluir"
        isLoading={isDeleting}
      />
    </div>
  );
}
