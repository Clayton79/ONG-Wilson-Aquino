import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, Textarea, PageLoader, ErrorState } from '../../shared/components';
import { donorApi } from '../../shared/services';

const donorFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  type: z.enum(['individual', 'company']),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  isActive: z.boolean(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === 'individual') return (data.cpf ?? '').length >= 11;
    return true;
  },
  { message: 'CPF obrigatório para Pessoa Física', path: ['cpf'] }
).refine(
  (data) => {
    if (data.type === 'company') return (data.cnpj ?? '').length >= 14;
    return true;
  },
  { message: 'CNPJ obrigatório para Pessoa Jurídica', path: ['cnpj'] }
);

type DonorFormData = z.infer<typeof donorFormSchema>;

export function DonorFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [isFetching, setIsFetching] = useState(isEditing);
  const [fetchError, setFetchError] = useState('');

  const {
    register, handleSubmit, reset, watch,
    formState: { errors, isSubmitting },
  } = useForm<DonorFormData>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      name: '', email: '', phone: '', type: 'individual',
      cpf: '', cnpj: '', address: '', city: '', state: '',
      isActive: true, notes: '',
    },
  });

  const donorType = watch('type');

  useEffect(() => { if (isEditing) loadDonor(); }, [id]);

  const loadDonor = async () => {
    try {
      setIsFetching(true);
      const response = await donorApi.getById(id!);
      if (response.data) {
        const d = response.data;
        reset({
          name: d.name, email: d.email, phone: d.phone,
          type: d.type, cpf: d.cpf || '', cnpj: d.cnpj || '',
          address: d.address || '', city: d.city || '',
          state: d.state || '', isActive: d.isActive, notes: d.notes || '',
        });
      }
    } catch (err) {
      setFetchError((err as Error).message);
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: DonorFormData) => {
    try {
      if (isEditing) await donorApi.update(id!, data);
      else await donorApi.create(data);
      navigate('/donors');
    } catch (err) {
      setFetchError((err as Error).message);
    }
  };

  if (isFetching) return <PageLoader />;
  if (fetchError) return <ErrorState message={fetchError} onRetry={loadDonor} />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/donors')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Doador' : 'Novo Doador'}</h1>
          <p className="page-subtitle">{isEditing ? 'Altere os dados.' : 'Preencha os dados para cadastrar.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader title="Dados do Doador" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome *" error={errors.name?.message} {...register('name')} />
            <Input label="Email *" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Telefone *" error={errors.phone?.message} {...register('phone')} placeholder="(00) 00000-0000" />
            <Select label="Tipo *"
              options={[
                { value: 'individual', label: 'Pessoa Física' },
                { value: 'company', label: 'Pessoa Jurídica' },
              ]}
              {...register('type')}
            />

            {donorType === 'individual' && (
              <Input label="CPF *" error={errors.cpf?.message} {...register('cpf')} placeholder="000.000.000-00" />
            )}
            {donorType === 'company' && (
              <Input label="CNPJ *" error={errors.cnpj?.message} {...register('cnpj')} placeholder="00.000.000/0000-00" />
            )}

            <Select label="Status"
              options={[{ value: 'true', label: 'Ativo' }, { value: 'false', label: 'Inativo' }]}
              {...register('isActive', { setValueAs: (v) => v === 'true' || v === true })}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Endereço" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Endereço" error={errors.address?.message} {...register('address')} />
            </div>
            <Input label="Cidade" error={errors.city?.message} {...register('city')} />
            <Input label="Estado" error={errors.state?.message} {...register('state')} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Observações" />
          <Textarea label="Notas" error={errors.notes?.message} {...register('notes')}
            placeholder="Informações adicionais sobre o doador..." rows={4} />
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/donors')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
