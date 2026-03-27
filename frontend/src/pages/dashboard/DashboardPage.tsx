import { useEffect, useState } from 'react';
import {
  Users,
  Heart,
  UserCheck,
  FolderKanban,
  Calendar,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, PageLoader, ErrorState, Badge } from '../../shared/components';
import { dashboardApi } from '../../shared/services';
import { useAuthStore } from '../../shared/stores';
import type { DashboardSummary } from '../../shared/types';

const CHART_COLORS = ['#0F7A3B', '#14A150', '#57AB82', '#89C8A8', '#B9DFCA'];

const statusLabels: Record<string, string> = {
  planning: 'Planejamento',
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export function DashboardPage() {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardApi.getSummary();
      if (response.data) setSummary(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />;
  if (!summary) return null;

  const stats = [
    {
      label: 'Voluntários',
      value: summary.totalVolunteers,
      subLabel: `${summary.activeVolunteers} ativos`,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary-50',
    },
    {
      label: 'Doadores',
      value: summary.totalDonors,
      subLabel: `${summary.activeDonors} ativos`,
      icon: UserCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Doações',
      value: summary.totalDonations,
      subLabel: `R$ ${summary.totalDonationAmount.toLocaleString('pt-BR')}`,
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Projetos Ativos',
      value: summary.activeProjects,
      subLabel: `${summary.totalProjects} total`,
      icon: FolderKanban,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Eventos Próximos',
      value: summary.upcomingEvents,
      subLabel: `${summary.totalEvents} total`,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Bem-vindo(a), {user?.name}! Aqui está o resumo da CUFA.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className="text-xs text-muted mt-1">{stat.subLabel}</p>
              </div>
              <div className={`${stat.bg} p-2.5 rounded-xl`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donations Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Doações por Mês"
            subtitle="Valores dos últimos 12 meses"
            action={
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">
                  R$ {summary.totalDonationAmount.toLocaleString('pt-BR')}
                </span>
              </div>
            }
          />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.donationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value: string) => {
                    const [, m] = value.split('-');
                    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                    return months[parseInt(m) - 1] || m;
                  }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="amount" fill="#0F7A3B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Projects by Status */}
        <Card>
          <CardHeader title="Projetos por Status" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.projectsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ status, count }: { status: string; count: number }) =>
                    `${statusLabels[status] || status}: ${count}`
                  }
                >
                  {summary.projectsByStatus.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, statusLabels[name] || name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <Card>
          <CardHeader title="Doações Recentes" subtitle="Últimas 5 doações registradas" />
          <div className="space-y-3">
            {summary.recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{donation.donorName}</p>
                    <p className="text-xs text-muted">{donation.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {donation.amount ? (
                    <p className="text-sm font-semibold text-foreground">
                      R$ {donation.amount.toLocaleString('pt-BR')}
                    </p>
                  ) : (
                    <Badge variant="info">Material</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader title="Próximos Eventos" subtitle="Eventos agendados" />
          <div className="space-y-3">
            {summary.upcomingEventsList.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.name}</p>
                    <p className="text-xs text-muted">
                      {new Date(event.date).toLocaleDateString('pt-BR')} · {event.startTime}
                    </p>
                  </div>
                </div>
                <Badge variant="info">{event.participantIds.length} participantes</Badge>
              </div>
            ))}
            {summary.upcomingEventsList.length === 0 && (
              <p className="text-sm text-muted text-center py-4">Nenhum evento próximo</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
