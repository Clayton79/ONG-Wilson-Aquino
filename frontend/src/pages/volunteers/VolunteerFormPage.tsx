import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X, Save, Loader2 } from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, Textarea, PageLoader, ErrorState } from '../../shared/components';
import { volunteerApi } from '../../shared/services';

const volunteerFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatória'),
  address: z.string().min(5, 'Endereço obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  zipCode: z.string().min(8, 'CEP obrigatório'),
  skills: z.array(z.object({ value: z.string().min(1, 'Habilidade obrigatória') })).min(1, 'Adicione pelo menos 1 habilidade'),
  availability: z.string().min(3, 'Descreva a disponibilidade'),
  isActive: z.boolean(),
  notes: z.string().optional(),
});

type VolunteerFormData = z.infer<typeof volunteerFormSchema>;

export function VolunteerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [isFetching, setIsFetching] = useState(isEditing);
  const [fetchError, setFetchError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: '', email: '', phone: '', cpf: '', birthDate: '',
      address: '', city: '', state: '', zipCode: '',
      skills: [{ value: '' }], availability: '', isActive: true, notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  useEffect(() => { if (isEditing) loadVolunteer(); }, [id]);

  const loadVolunteer = async () => {
    try {
      setIsFetching(true);
      const response = await volunteerApi.getById(id!);
      if (response.data) {
        const v = response.data;
        reset({
          name: v.name, email: v.email, phone: v.phone,
          cpf: v.cpf, birthDate: v.birthDate?.slice(0, 10) ?? '',
          address: v.address, city: v.city, state: v.state, zipCode: v.zipCode,
          skills: v.skills.map((s) => ({ value: s })),
          availability: v.availability, isActive: v.isActive, notes: v.notes || '',
        });
      }
    } catch (err) {
      setFetchError((err as Error).message);
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: VolunteerFormData) => {
    try {
      const payload = { ...data, skills: data.skills.map((s) => s.value) };
      if (isEditing) {
        await volunteerApi.update(id!, payload);
      } else {
        await volunteerApi.create(payload);
      }
      navigate('/volunteers');
    } catch (err) {
      setFetchError((err as Error).message);
    }
  };

  if (isFetching) return <PageLoader />;
  if (fetchError) return <ErrorState message={fetchError} onRetry={loadVolunteer} />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/volunteers')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Voluntário' : 'Novo Voluntário'}</h1>
          <p className="page-subtitle">{isEditing ? 'Altere os dados.' : 'Preencha os dados para cadastrar.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader title="Dados Pessoais" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome *" error={errors.name?.message} {...register('name')} />
            <Input label="Email *" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Telefone *" error={errors.phone?.message} {...register('phone')} placeholder="(00) 00000-0000" />
            <Input label="CPF *" error={errors.cpf?.message} {...register('cpf')} placeholder="000.000.000-00" />
            <Input label="Data de Nascimento *" type="date" error={errors.birthDate?.message} {...register('birthDate')} />
            <Select label="Status" options={[{ value: 'true', label: 'Ativo' }, { value: 'false', label: 'Inativo' }]}
              {...register('isActive', { setValueAs: (v) => v === 'true' || v === true })} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Endereço" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Endereço *" error={errors.address?.message} {...register('address')} />
            </div>
            <Input label="Cidade *" error={errors.city?.message} {...register('city')} />
            <Input label="Estado *" error={errors.state?.message} {...register('state')} />
            <Input label="CEP *" error={errors.zipCode?.message} {...register('zipCode')} placeholder="00000-000" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Habilidades e Disponibilidade" />
          <div className="space-y-3">
            <label className="label">Habilidades *</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input {...register(`skills.${index}.value`)} placeholder={`Habilidade ${index + 1}`} className="input flex-1" />
                {fields.length > 1 && (
                  <button type="button" className="p-2 text-danger hover:bg-danger/10 rounded-lg" onClick={() => remove(index)}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.skills && <p className="text-sm text-danger">{errors.skills.message || errors.skills.root?.message}</p>}
            <Button type="button" variant="secondary" size="sm" onClick={() => append({ value: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar Habilidade
            </Button>
          </div>
          <div className="mt-4">
            <Textarea label="Disponibilidade *" error={errors.availability?.message} {...register('availability')}
              placeholder="Ex: Segunda a Sexta das 14h às 18h" rows={2} />
          </div>
          <div className="mt-4">
            <Textarea label="Observações" error={errors.notes?.message} {...register('notes')}
              placeholder="Notas adicionais..." rows={3} />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/volunteers')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
