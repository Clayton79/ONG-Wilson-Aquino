import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X, Save, Loader2 } from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, Textarea, PageLoader, ErrorState } from '../../shared/components';
import { projectApi } from '../../shared/services';

const projectFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['planning', 'active', 'paused', 'completed', 'cancelled']),
  startDate: z.string().min(1, 'Data de início obrigatória'),
  endDate: z.string().optional(),
  coordinator: z.string().min(3, 'Coordenador obrigatório'),
  category: z.string().min(2, 'Categoria obrigatória'),
  budget: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  beneficiaries: z.coerce.number().min(0).optional(),
  goals: z.array(z.object({ value: z.string().min(1, 'Meta obrigatória') })).min(1, 'Adicione pelo menos 1 meta'),
  notes: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export function ProjectFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [isFetching, setIsFetching] = useState(isEditing);
  const [fetchError, setFetchError] = useState('');

  const {
    register, control, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '', description: '', status: 'planning', startDate: '', endDate: '',
      coordinator: '', category: '', budget: undefined, location: '',
      beneficiaries: undefined, goals: [{ value: '' }], notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'goals' });

  useEffect(() => { if (isEditing) loadProject(); }, [id]);

  const loadProject = async () => {
    try {
      setIsFetching(true);
      const response = await projectApi.getById(id!);
      if (response.data) {
        const p = response.data;
        reset({
          name: p.name, description: p.description, status: p.status as ProjectFormData['status'],
          startDate: p.startDate.slice(0, 10), endDate: p.endDate ? p.endDate.slice(0, 10) : '',
          coordinator: p.coordinator, category: p.category,
          budget: p.budget, location: p.location || '', beneficiaries: p.beneficiaries,
          goals: p.goals.length > 0 ? p.goals.map((g) => ({ value: g })) : [{ value: '' }],
          notes: p.notes || '',
        });
      }
    } catch (err) { setFetchError((err as Error).message); }
    finally { setIsFetching(false); }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = { ...data, goals: data.goals.map((g) => g.value), volunteerIds: [] };
      if (isEditing) await projectApi.update(id!, payload);
      else await projectApi.create(payload);
      navigate('/projects');
    } catch (err) { setFetchError((err as Error).message); }
  };

  if (isFetching) return <PageLoader />;
  if (fetchError) return <ErrorState message={fetchError} onRetry={loadProject} />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Projeto' : 'Novo Projeto'}</h1>
          <p className="page-subtitle">{isEditing ? 'Altere os dados.' : 'Preencha os dados para cadastrar.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader title="Informações do Projeto" />
          <div className="space-y-4">
            <Input label="Nome do Projeto *" error={errors.name?.message} {...register('name')} />
            <Textarea label="Descrição *" error={errors.description?.message} {...register('description')} rows={3} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select label="Status" error={errors.status?.message}
                options={[
                  { value: 'planning', label: 'Planejamento' }, { value: 'active', label: 'Ativo' },
                  { value: 'paused', label: 'Pausado' }, { value: 'completed', label: 'Concluído' },
                  { value: 'cancelled', label: 'Cancelado' },
                ]} {...register('status')} />
              <Input label="Data de Início *" type="date" error={errors.startDate?.message} {...register('startDate')} />
              <Input label="Data de Término" type="date" error={errors.endDate?.message} {...register('endDate')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Coordenador *" error={errors.coordinator?.message} {...register('coordinator')} />
              <Input label="Categoria *" error={errors.category?.message} {...register('category')} placeholder="Ex: Educação, Saúde" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Orçamento (R$)" type="number" step="0.01" {...register('budget', { valueAsNumber: true })} />
              <Input label="Local" {...register('location')} />
              <Input label="Nº Beneficiários" type="number" {...register('beneficiaries', { valueAsNumber: true })} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Metas do Projeto" />
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input {...register(`goals.${index}.value`)} placeholder={`Meta ${index + 1}`} className="input flex-1" />
                {fields.length > 1 && (
                  <button type="button" className="p-2 text-danger hover:bg-danger/10 rounded-lg" onClick={() => remove(index)}>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {errors.goals && <p className="text-sm text-danger">{errors.goals.message || errors.goals.root?.message}</p>}
            <Button type="button" variant="secondary" size="sm" onClick={() => append({ value: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar Meta
            </Button>
          </div>
          <div className="mt-4">
            <Textarea label="Observações" {...register('notes')} rows={3} />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/projects')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
