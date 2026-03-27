import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, Building2, User } from 'lucide-react';
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
import { donorApi } from '../../shared/services';
import type { Donor } from '../../shared/types';

export function DonorListPage() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDonors = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('isActive', statusFilter);
      const response = await donorApi.getAll(params.toString());
      setDonors(response.data ?? []);
      setTotalPages(response.totalPages ?? 1);
      setTotal(response.total ?? 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => { loadDonors(); }, [loadDonors]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await donorApi.delete(deleteId);
      setDeleteId(null);
      loadDonors();
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

  if (error && !donors.length) return <ErrorState message={error} onRetry={loadDonors} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Doadores</h1>
          <p className="page-subtitle">{total} doador(es) cadastrado(s)</p>
        </div>
        <Button onClick={() => navigate('/donors/new')}>
          <Plus className="w-4 h-4 mr-2" /> Novo Doador
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, email ou documento..." className="input pl-10" />
          </div>
          <Select value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'Todos os tipos' },
              { value: 'individual', label: 'Pessoa Física' },
              { value: 'company', label: 'Pessoa Jurídica' },
            ]}
          />
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
      ) : donors.length === 0 ? (
        <EmptyState
          title="Nenhum doador encontrado"
          description="Cadastre o primeiro doador para começar."
          action={{ label: 'Novo Doador', onClick: () => navigate('/donors/new') }}
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
                    <th className="hidden lg:table-cell">Tipo</th>
                    <th>Status</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor) => (
                    <tr key={donor.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            donor.type === 'company' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary'
                          }`}>
                            {donor.type === 'company' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{donor.name}</p>
                            <p className="text-xs text-muted">
                              {donor.type === 'company' ? donor.cnpj : donor.cpf}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <Phone className="w-3 h-3" /> {donor.phone}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <Mail className="w-3 h-3" /> {donor.email}
                          </span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell">
                        <Badge variant={donor.type === 'company' ? 'warning' : 'info'}>
                          {donor.type === 'company' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant={donor.isActive ? 'success' : 'neutral'}>
                          {donor.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/donors/${donor.id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/donors/${donor.id}/edit`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(donor.id)}>
                            <Trash2 className="w-4 h-4 text-danger" />
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
        title="Excluir Doador"
        message="Tem certeza que deseja excluir este doador? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
