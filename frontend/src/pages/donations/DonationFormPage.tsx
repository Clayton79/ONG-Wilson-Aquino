import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, Textarea, PageLoader, ErrorState } from '../../shared/components';
import { donationApi } from '../../shared/services';

const donationFormSchema = z.object({
  donorName: z.string().min(3, 'Nome do doador deve ter pelo menos 3 caracteres'),
  donorId: z.string().optional(),
  type: z.enum(['financial', 'material']),
  amount: z.coerce.number().optional(),
  description: z.string().min(3, 'Descrição obrigatória'),
  date: z.string().min(1, 'Data obrigatória'),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === 'financial') return (data.amount ?? 0) > 0;
    return true;
  },
  { message: 'Valor obrigatório para doações financeiras', path: ['amount'] }
);

type DonationFormData = z.infer<typeof donationFormSchema>;

export function DonationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [isFetching, setIsFetching] = useState(isEditing);
  const [fetchError, setFetchError] = useState('');

  const {
    register, handleSubmit, reset, watch,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donorName: '', donorId: '', type: 'financial',
      amount: undefined, description: '',
      date: new Date().toISOString().slice(0, 10),
      receiptNumber: '', notes: '',
    },
  });

  const donationType = watch('type');

  useEffect(() => { if (isEditing) loadDonation(); }, [id]);

  const loadDonation = async () => {
    try {
      setIsFetching(true);
      const response = await donationApi.getById(id!);
      if (response.data) {
        const d = response.data;
        reset({
          donorName: d.donorName, donorId: d.donorId || '',
          type: d.type as DonationFormData['type'],
          amount: d.amount || undefined,
          description: d.description, date: d.date.slice(0, 10),
          receiptNumber: d.receiptNumber || '', notes: d.notes || '',
        });
      }
    } catch (err) { setFetchError((err as Error).message); }
    finally { setIsFetching(false); }
  };

  const onSubmit = async (data: DonationFormData) => {
    try {
      if (isEditing) await donationApi.update(id!, data);
      else await donationApi.create(data);
      navigate('/donations');
    } catch (err) { setFetchError((err as Error).message); }
  };

  if (isFetching) return <PageLoader />;
  if (fetchError) return <ErrorState message={fetchError} onRetry={loadDonation} />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/donations')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Doação' : 'Nova Doação'}</h1>
          <p className="page-subtitle">{isEditing ? 'Altere os dados.' : 'Preencha os dados para registrar.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader title="Dados do Doador" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome do Doador *" error={errors.donorName?.message} {...register('donorName')} />
            <Input label="ID do Doador" {...register('donorId')} placeholder="Opcional" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Detalhes da Doação" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Tipo *" error={errors.type?.message}
                options={[
                  { value: 'financial', label: 'Financeira' },
                  { value: 'material', label: 'Material' },
                ]} {...register('type')} />
              <Input label="Data *" type="date" error={errors.date?.message} {...register('date')} />
            </div>

            {donationType === 'financial' && (
              <Input label="Valor (R$) *" type="number" step="0.01" error={errors.amount?.message}
                {...register('amount', { valueAsNumber: true })} placeholder="0.00" />
            )}

            <Textarea label="Descrição *" error={errors.description?.message} {...register('description')}
              rows={3} placeholder="Detalhes sobre a doação..." />
            <Input label="Nº do Recibo" {...register('receiptNumber')} placeholder="Opcional" />
            <Textarea label="Observações" {...register('notes')} rows={2} placeholder="Notas adicionais..." />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/donations')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditing ? 'Salvar Alterações' : 'Registrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
