import { volunteerRepository, donorRepository, donationRepository, projectRepository, eventRepository } from '../repositories';

type ReportType = 'volunteers' | 'donors' | 'donations' | 'projects' | 'events';

export class ReportService {
  async generateReport(type: ReportType, filters?: Record<string, string>) {
    switch (type) {
      case 'volunteers':
        return this.volunteerReport(filters);
      case 'donors':
        return this.donorReport(filters);
      case 'donations':
        return this.donationReport(filters);
      case 'projects':
        return this.projectReport(filters);
      case 'events':
        return this.eventReport(filters);
      default:
        throw new Error('Tipo de relatório inválido');
    }
  }

  private async volunteerReport(filters?: Record<string, string>) {
    let data = await volunteerRepository.findAll();
    if (filters?.isActive !== undefined) {
      data = data.filter((v) => v.isActive === (filters.isActive === 'true'));
    }
    if (filters?.city) {
      data = data.filter((v) => v.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    return {
      title: 'Relatório de Voluntários',
      generatedAt: new Date().toISOString(),
      total: data.length,
      data,
    };
  }

  private async donorReport(filters?: Record<string, string>) {
    let data = await donorRepository.findAll();
    if (filters?.isActive !== undefined) {
      data = data.filter((d) => d.isActive === (filters.isActive === 'true'));
    }
    if (filters?.type) {
      data = data.filter((d) => d.type === filters.type);
    }
    return {
      title: 'Relatório de Doadores',
      generatedAt: new Date().toISOString(),
      total: data.length,
      data,
    };
  }

  private async donationReport(filters?: Record<string, string>) {
    let data = await donationRepository.findAll();
    if (filters?.type) {
      data = data.filter((d) => d.type === filters.type);
    }
    if (filters?.startDate) {
      data = data.filter((d) => d.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      data = data.filter((d) => d.date <= filters.endDate!);
    }
    const totalAmount = data.reduce((sum, d) => sum + (d.amount || 0), 0);
    return {
      title: 'Relatório de Doações',
      generatedAt: new Date().toISOString(),
      total: data.length,
      totalAmount,
      data,
    };
  }

  private async projectReport(filters?: Record<string, string>) {
    let data = await projectRepository.findAll();
    if (filters?.status) {
      data = data.filter((p) => p.status === filters.status);
    }
    if (filters?.category) {
      data = data.filter((p) => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
    }
    return {
      title: 'Relatório de Projetos',
      generatedAt: new Date().toISOString(),
      total: data.length,
      data,
    };
  }

  private async eventReport(filters?: Record<string, string>) {
    let data = await eventRepository.findAll();
    if (filters?.status) {
      data = data.filter((e) => e.status === filters.status);
    }
    const totalParticipants = data.reduce((sum, e) => sum + e.participantIds.length, 0);
    return {
      title: 'Relatório de Eventos',
      generatedAt: new Date().toISOString(),
      total: data.length,
      totalParticipants,
      data,
    };
  }

  toCSV<T extends Record<string, unknown>>(data: T[]): string {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map((item) =>
      headers.map((h) => {
        const value = item[h];
        const str = Array.isArray(value) ? value.join('; ') : String(value ?? '');
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }
}

export const reportService = new ReportService();
