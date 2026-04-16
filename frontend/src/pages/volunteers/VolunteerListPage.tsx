import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Pagination,
  EmptyState,
  PageLoader,
  ErrorState,
  ConfirmDialog,
  Select,
} from '../../shared/components';
import { volunteerApi } from '../../shared/services';
import type { Volunteer } from '../../shared/types';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

export function VolunteerListPage() {
  useDocumentTitle('Voluntários');
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadVolunteers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('isActive', statusFilter);
      const response = await volunteerApi.getAll(params.toString());
      setVolunteers(response.data ?? []);
      setTotalPages(response.totalPages ?? 1);
      setTotal(response.total ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { loadVolunteers(); }, [loadVolunteers]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await volunteerApi.delete(deleteId);
      setDeleteId(null);
      loadVolunteers();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (error && !volunteers.length) return <ErrorState message={error} onRetry={loadVolunteers} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Voluntários</h1>
          <p className="page-subtitle">{total} voluntário(s) cadastrado(s)</p>
        </div>
        <Button onClick={() => navigate('/volunteers/new')}>
          <Plus className="w-4 h-4 mr-2" /> Novo Voluntário
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" aria-hidden="true" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email ou habilidade..." className="input pl-10" aria-label="Buscar voluntários" />
          </div>
          <Select value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'true', label: 'Ativo' },
              { value: 'false', label: 'Inativo' },
            ]}
          />
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>
      </Card>

      {isLoading ? (
        <PageLoader />
      ) : volunteers.length === 0 ? (
        <EmptyState
          title="Nenhum voluntário encontrado"
          description="Cadastre o primeiro voluntário para começar."
          action={{ label: 'Novo Voluntário', onClick: () => navigate('/volunteers/new') }}
        />
      ) : (
        <>
          <Card className="overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th className="hidden md:table-cell">Contato</th>
                    <th className="hidden lg:table-cell">Habilidades</th>
                    <th>Status</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((vol) => (
                    <tr key={vol.id}>
                      <td>
                        <p className="font-medium text-foreground">{vol.name}</p>
                        <p className="text-xs text-muted">{vol.email}</p>
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <Phone className="w-3 h-3" /> {vol.phone}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <Mail className="w-3 h-3" /> {vol.email}
                          </span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {vol.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="info">{skill}</Badge>
                          ))}
                          {vol.skills.length > 3 && (
                            <Badge variant="neutral">+{vol.skills.length - 3}</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge variant={vol.isActive ? 'success' : 'neutral'}>
                          {vol.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/volunteers/${vol.id}/edit`)} aria-label="Editar" title="Editar">
                            <Edit className="w-4 h-4" aria-hidden="true" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(vol.id)} aria-label="Excluir" title="Excluir">
                            <Trash2 className="w-4 h-4 text-danger" aria-hidden="true" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Excluir Voluntário"
        message="Tem certeza que deseja excluir este voluntário? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
