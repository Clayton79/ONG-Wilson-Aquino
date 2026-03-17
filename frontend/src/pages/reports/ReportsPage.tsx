import { useState } from 'react';
import {
  FileText, Download, BarChart3, Users, HandCoins, FolderOpen,
  Calendar, Loader2,
} from 'lucide-react';
import { Card, CardHeader, Button, Input } from '../../shared/components';
import { reportApi } from '../../shared/services';

type ReportType = 'volunteers' | 'donations' | 'projects' | 'events';

interface ReportConfig {
  type: ReportType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const reportTypes: ReportConfig[] = [
  { type: 'volunteers', label: 'Voluntários', description: 'Relatório de todos os voluntários ativos e inativos.', icon: <Users className="w-5 h-5" /> },
  { type: 'donations', label: 'Doações', description: 'Relatório financeiro com todas as doações recebidas.', icon: <HandCoins className="w-5 h-5" /> },
  { type: 'projects', label: 'Projetos', description: 'Visão geral dos projetos e seus status.', icon: <FolderOpen className="w-5 h-5" /> },
  { type: 'events', label: 'Eventos', description: 'Relatório de eventos realizados e agendados.', icon: <Calendar className="w-5 h-5" /> },
];

export function ReportsPage() {
  const [selectedType, setSelectedType] = useState<ReportType>('volunteers');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  const buildParams = () => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return params.toString() || undefined;
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError('');
      const response = await reportApi.generate(selectedType, buildParams());
      setReportData((response.data ?? response) as Record<string, unknown>);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      setError('');
      const csv = await reportApi.generateCSV(selectedType, buildParams());
      const blob = new Blob([csv as unknown as string], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${selectedType}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Relatórios</h1>
        <p className="page-subtitle">Gere relatórios e exporte dados em CSV.</p>
      </div>

      {/* Report type selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((rt) => (
          <Card
            key={rt.type}
            className={`cursor-pointer transition-all ${
              selectedType === rt.type
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedType(rt.type)}
          >
            <div className="flex flex-col items-center text-center gap-2 py-2">
              <div className={`p-2 rounded-lg ${
                selectedType === rt.type ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {rt.icon}
              </div>
              <h3 className="font-semibold text-sm">{rt.label}</h3>
              <p className="text-xs text-gray-500">{rt.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader title="Filtros" />
        <div className="flex flex-wrap items-end gap-4">
          <Input label="Data Início" type="date" value={startDate}
            onChange={(e) => setStartDate(e.target.value)} />
          <Input label="Data Fim" type="date" value={endDate}
            onChange={(e) => setEndDate(e.target.value)} />
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <BarChart3 className="w-4 h-4 mr-2" />}
            Gerar Relatório
          </Button>
          <Button variant="secondary" onClick={handleExportCSV} disabled={isExporting}>
            {isExporting
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <Download className="w-4 h-4 mr-2" />}
            Exportar CSV
          </Button>
        </div>
      </Card>

      {/* Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      {/* Report Data */}
      {reportData && (
        <Card>
          <CardHeader title={`Relatório — ${reportTypes.find(r => r.type === selectedType)?.label}`} />
          <div className="overflow-x-auto">
            <pre className="text-xs font-mono bg-gray-50 p-4 rounded-lg overflow-auto max-h-[500px] whitespace-pre-wrap">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      {!reportData && !isGenerating && !error && (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="w-12 h-12 mb-3" />
            <p className="text-sm">Selecione um tipo de relatório e clique em &quot;Gerar&quot;.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
