import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, DollarSign, Package } from 'lucide-react';
import {
  Card, Button, Badge, Pagination, EmptyState, PageLoader, ErrorState, ConfirmDialog, Select,
} from '../../shared/components';
import { donationApi } from '../../shared/services';
import type { Donation } from '../../shared/types';

export function DonationListPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDonations = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      if (typeFilter) params.set('type', typeFilter);
      const response = await donationApi.getAll(params.toString());
      setDonations(response.data ?? []);
      setTotalPages(response.totalPages ?? 1);
      setTotal(response.total ?? 0);
    } catch (err) { setError((err as Error).message); }
    finally { setIsLoading(false); }
  }, [page, search, typeFilter]);

  useEffect(() => { loadDonations(); }, [loadDonations]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await donationApi.delete(deleteId);
      setDeleteId(null);
      loadDonations();
    } catch (err) { setError((err as Error).message); }
    finally { setIsDeleting(false); }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };

  if (error && !donations.length) return <ErrorState message={error} onRetry={loadDonations} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Doações</h1>
          <p className="page-subtitle">{total} doação(ões) registrada(s)</p>
        </div>
        <Button onClick={() => navigate('/donations/new')}>
          <Plus className="w-4 h-4 mr-2" /> Nova Doação
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por doador ou descrição..." className="input pl-10" />
          </div>
          <Select value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'Todos os tipos' },
              { value: 'financial', label: 'Financeira' },
              { value: 'material', label: 'Material' },
            ]}
          />
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>
      </Card>

      {isLoading ? (
        <PageLoader />
      ) : donations.length === 0 ? (
        <EmptyState title="Nenhuma doação encontrada" description="Registre a primeira doação."
          action={{ label: 'Nova Doação', onClick: () => navigate('/donations/new') }} />
      ) : (
        <>
          <Card className="overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Doador</th>
                    <th>Tipo</th>
                    <th className="hidden md:table-cell">Descrição</th>
                    <th>Valor</th>
                    <th className="hidden sm:table-cell">Data</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((don) => (
                    <tr key={don.id}>
                      <td><p className="font-medium text-foreground">{don.donorName}</p></td>
                      <td>
                        <Badge variant={don.type === 'financial' ? 'success' : 'info'}>
                          <span className="inline-flex items-center gap-1">
                            {don.type === 'financial' ? <DollarSign className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                            {don.type === 'financial' ? 'Financeira' : 'Material'}
                          </span>
                        </Badge>
                      </td>
                      <td className="hidden md:table-cell">
                        <p className="text-sm text-muted line-clamp-1">{don.description}</p>
                      </td>
                      <td>
                        {don.amount ? (
                          <span className="font-semibold text-foreground">R$ {don.amount.toLocaleString('pt-BR')}</span>
                        ) : (
                          <span className="text-sm text-muted">Material</span>
                        )}
                      </td>
                      <td className="hidden sm:table-cell">
                        <span className="text-sm text-muted">{new Date(don.date).toLocaleDateString('pt-BR')}</span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/donations/${don.id}/edit`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(don.id)}>
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

      <ConfirmDialog isOpen={!!deleteId} title="Excluir Doação"
        message="Tem certeza que deseja excluir esta doação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir" isLoading={isDeleting}
        onConfirm={handleDelete} onClose={() => setDeleteId(null)} />
    </div>
  );
}
