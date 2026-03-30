import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react';
import {
  Card, Button, Badge, Pagination, EmptyState, PageLoader, ErrorState, ConfirmDialog, Select,
} from '../../shared/components';
import { projectApi } from '../../shared/services';
import type { Project } from '../../shared/types';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  planning: { label: 'Planejamento', variant: 'info' },
  active: { label: 'Ativo', variant: 'success' },
  paused: { label: 'Pausado', variant: 'warning' },
  completed: { label: 'Concluído', variant: 'neutral' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

export function ProjectListPage() {
  useDocumentTitle('Projetos');
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const response = await projectApi.getAll(params.toString());
      setProjects(response.data ?? []);
      setTotalPages(response.totalPages ?? 1);
      setTotal(response.total ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await projectApi.delete(deleteId);
      setDeleteId(null);
      loadProjects();
    } catch (err) { setError((err as Error).message); }
    finally { setIsDeleting(false); }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };

  if (error && !projects.length) return <ErrorState message={error} onRetry={loadProjects} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Projetos</h1>
          <p className="page-subtitle">{total} projeto(s) cadastrado(s)</p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="w-4 h-4 mr-2" /> Novo Projeto
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" aria-hidden="true" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou descrição..." className="input pl-10" aria-label="Buscar projetos" />
          </div>
          <Select value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'Todos os status' },
              { value: 'planning', label: 'Planejamento' },
              { value: 'active', label: 'Ativo' },
              { value: 'paused', label: 'Pausado' },
              { value: 'completed', label: 'Concluído' },
              { value: 'cancelled', label: 'Cancelado' },
            ]}
          />
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>
      </Card>

      {isLoading ? (
        <PageLoader />
      ) : projects.length === 0 ? (
        <EmptyState title="Nenhum projeto encontrado" description="Crie o primeiro projeto da ONG."
          action={{ label: 'Novo Projeto', onClick: () => navigate('/projects/new') }} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project) => {
              const cfg = statusConfig[project.status] ?? { label: project.status, variant: 'neutral' as const };
              return (
                <Card key={project.id} className="flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project.id}`)} aria-label="Ver detalhes" title="Ver detalhes">
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/projects/${project.id}/edit`)} aria-label="Editar" title="Editar">
                        <Edit className="w-4 h-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(project.id)} aria-label="Excluir" title="Excluir">
                        <Trash2 className="w-4 h-4 text-danger" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{project.name}</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2 flex-1">{project.description}</p>
                  {/* Goals count */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted mb-1">
                      <span>Metas</span>
                      <span>{project.goals.length} definida(s)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> {project.volunteerIds.length} voluntários
                    </span>
                    <span>
                      {new Date(project.startDate).toLocaleDateString('pt-BR')}
                      {project.endDate && ` — ${new Date(project.endDate).toLocaleDateString('pt-BR')}`}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} />
        </>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Excluir Projeto"
        message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        confirmLabel="Excluir" isLoading={isDeleting}
        onConfirm={handleDelete} onClose={() => setDeleteId(null)} />
    </div>
  );
}
