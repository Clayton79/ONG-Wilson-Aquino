import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Card, CardHeader, Button, Input, Select, Textarea, PageLoader, ErrorState } from '../../shared/components';
import { eventApi } from '../../shared/services';

const eventFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  date: z.string().min(1, 'Data obrigatória'),
  startTime: z.string().min(1, 'Horário de início obrigatório'),
  endTime: z.string().min(1, 'Horário de término obrigatório'),
  location: z.string().min(3, 'Local obrigatório'),
  maxParticipants: z.coerce.number().int().positive().optional().or(z.literal('')),
  category: z.string().min(1, 'Categoria obrigatória'),
  projectId: z.string().optional(),
  notes: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

export function EventFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [isFetching, setIsFetching] = useState(isEditing);
  const [fetchError, setFetchError] = useState('');

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '', description: '', status: 'scheduled',
      date: new Date().toISOString().slice(0, 10),
      startTime: '09:00', endTime: '17:00',
      location: '', maxParticipants: '' as unknown as undefined,
      category: '', projectId: '', notes: '',
    },
  });

  useEffect(() => { if (isEditing) loadEvent(); }, [id]);

  const loadEvent = async () => {
    try {
      setIsFetching(true);
      const response = await eventApi.getById(id!);
      if (response.data) {
        const e = response.data;
        reset({
          name: e.name, description: e.description,
          status: e.status as EventFormData['status'],
          date: e.date.slice(0, 10),
          startTime: e.startTime, endTime: e.endTime,
          location: e.location,
          maxParticipants: e.maxParticipants ?? ('' as unknown as undefined),
          category: e.category, projectId: e.projectId || '',
          notes: e.notes || '',
        });
      }
    } catch (err) { setFetchError((err as Error).message); }
    finally { setIsFetching(false); }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      const payload = {
        ...data,
        maxParticipants: data.maxParticipants === '' || data.maxParticipants === undefined
          ? undefined : Number(data.maxParticipants),
      };
      if (isEditing) await eventApi.update(id!, payload);
      else await eventApi.create(payload);
      navigate('/events');
    } catch (err) { setFetchError((err as Error).message); }
  };

  if (isFetching) return <PageLoader />;
  if (fetchError) return <ErrorState message={fetchError} onRetry={loadEvent} />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="page-title">{isEditing ? 'Editar Evento' : 'Novo Evento'}</h1>
          <p className="page-subtitle">{isEditing ? 'Altere os dados.' : 'Preencha os dados para criar.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader title="Informações Gerais" />
          <div className="space-y-4">
            <Input label="Nome do Evento *" error={errors.name?.message} {...register('name')} />
            <Textarea label="Descrição *" error={errors.description?.message} {...register('description')} rows={3} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Status *" error={errors.status?.message}
                options={[
                  { value: 'scheduled', label: 'Agendado' },
                  { value: 'in_progress', label: 'Em Andamento' },
                  { value: 'completed', label: 'Concluído' },
                  { value: 'cancelled', label: 'Cancelado' },
                ]} {...register('status')} />
              <Input label="Categoria *" error={errors.category?.message} {...register('category')}
                placeholder="Ex: Educação, Saúde, Cultural" />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Data e Local" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Data *" type="date" error={errors.date?.message} {...register('date')} />
              <Input label="Início *" type="time" error={errors.startTime?.message} {...register('startTime')} />
              <Input label="Término *" type="time" error={errors.endTime?.message} {...register('endTime')} />
            </div>
            <Input label="Local *" error={errors.location?.message} {...register('location')}
              placeholder="Endereço ou nome do local" />
            <Input label="Máx. Participantes" type="number" {...register('maxParticipants')}
              placeholder="Deixe vazio para ilimitado" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Informações Adicionais" />
          <div className="space-y-4">
            <Input label="ID do Projeto Relacionado" {...register('projectId')} placeholder="Opcional" />
            <Textarea label="Observações" {...register('notes')} rows={2} placeholder="Notas adicionais..." />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/events')}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEditing ? 'Salvar Alterações' : 'Criar Evento'}
          </Button>
        </div>
      </form>
    </div>
  );
}
