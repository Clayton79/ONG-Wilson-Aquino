import { useEffect, useState } from 'react';
import {
  Settings, Shield, Download, Upload, Loader2,
  RefreshCw,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, Button, Input, ConfirmDialog } from '../../shared/components';
import { authApi, backupApi } from '../../shared/services';
import { useAuthStore } from '../../shared/stores/authStore';
import { useDocumentTitle } from '../../shared/hooks/useDocumentTitle';

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha atual obrigatória'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação obrigatória'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'As senhas não coincidem', path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function SettingsPage() {
  useDocumentTitle('Configurações');
  const { user } = useAuthStore();
  const [backups, setBackups] = useState<string[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
  });

  // Password form
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => { loadBackups(); }, []);

  const loadBackups = async () => {
    try {
      setIsLoadingBackups(true);
      const response = await backupApi.list();
      setBackups(response.data ?? []);
    } catch { /* empty */ }
    finally { setIsLoadingBackups(false); }
  };

  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true);
      await backupApi.create();
      setMessage({ type: 'success', text: 'Backup criado com sucesso!' });
      loadBackups();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally { setIsCreatingBackup(false); }
  };

  const handleRestore = async () => {
    if (!restoreTarget) return;
    try {
      setIsRestoring(true);
      await backupApi.restore(restoreTarget);
      setMessage({ type: 'success', text: 'Backup restaurado com sucesso!' });
      setRestoreTarget(null);
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    } finally { setIsRestoring(false); }
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      await authApi.updateProfile(data);
      setMessage({ type: 'success', text: 'Perfil atualizado!' });
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await authApi.updateProfile({ password: data.newPassword, currentPassword: data.currentPassword });
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      passwordForm.reset();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">Gerencie seu perfil, segurança e backups.</p>
      </div>

      {/* Feedback */}
      {message && (
        <div role="alert" className={`p-4 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile */}
      <Card>
        <CardHeader title="Perfil" />
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome" error={profileForm.formState.errors.name?.message}
              autoComplete="name" {...profileForm.register('name')} />
            <Input label="E-mail" type="email" error={profileForm.formState.errors.email?.message}
              autoComplete="email" {...profileForm.register('email')} />
          </div>
          <Input label="Telefone" {...profileForm.register('phone')} placeholder="(00) 00000-0000" autoComplete="tel" />
          <div className="flex justify-end">
            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : <Settings className="w-4 h-4 mr-2" />}
              Salvar Perfil
            </Button>
          </div>
        </form>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader title="Segurança" />
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input label="Senha Atual" type="password"
            error={passwordForm.formState.errors.currentPassword?.message}
            autoComplete="current-password" {...passwordForm.register('currentPassword')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nova Senha" type="password"
              error={passwordForm.formState.errors.newPassword?.message}
              autoComplete="new-password" {...passwordForm.register('newPassword')} />
            <Input label="Confirmar Nova Senha" type="password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              autoComplete="new-password" {...passwordForm.register('confirmPassword')} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : <Shield className="w-4 h-4 mr-2" />}
              Alterar Senha
            </Button>
          </div>
        </form>
      </Card>

      {/* Backups */}
      <Card>
        <CardHeader title="Backups" />
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
              {isCreatingBackup
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : <Download className="w-4 h-4 mr-2" />}
              Criar Backup
            </Button>
            <Button variant="secondary" onClick={loadBackups} disabled={isLoadingBackups}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingBackups ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          {backups.length === 0 ? (
            <p className="text-sm text-muted">Nenhum backup encontrado.</p>
          ) : (
            <div className="divide-y divide-border-light border border-border rounded-lg">
              {backups.map((name) => (
                <div key={name} className="flex items-center justify-between p-3 text-sm">
                  <span className="font-mono text-foreground truncate">{name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setRestoreTarget(name)}>
                    <Upload className="w-4 h-4 mr-1" /> Restaurar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Restore confirmation */}
      <ConfirmDialog
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
        title="Restaurar Backup"
        message={`Deseja restaurar o backup "${restoreTarget}"? Os dados atuais serão substituídos.`}
        confirmLabel="Restaurar"
        isLoading={isRestoring}
      />
    </div>
  );
}
