import { volunteerService } from './volunteerService';
import { donationService } from './donationService';
import { projectService } from './projectService';
import { eventService } from './eventService';
import { DashboardSummary } from '../models';

export class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const [
      totalVolunteers,
      activeVolunteers,
      totalDonations,
      totalDonationAmount,
      totalProjects,
      activeProjects,
      totalEvents,
      upcomingEvents,
    ] = await Promise.all([
      volunteerService.count(),
      volunteerService.countActive(),
      donationService.count(),
      donationService.totalAmount(),
      projectService.count(),
      projectService.countActive(),
      eventService.count(),
      eventService.countUpcoming(),
    ]);

    // Recent data
    const recentDonationsResult = await donationService.getAll({
      page: 1,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const recentVolunteersResult = await volunteerService.getAll({
      page: 1,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const upcomingEventsList = await eventService.getUpcoming();

    // Monthly aggregations
    const allDonations = (await donationService.getAll({ page: 1, limit: 1000 })).data;
    const allVolunteers = (await volunteerService.getAll({ page: 1, limit: 1000 })).data;
    const allProjects = (await projectService.getAll({ page: 1, limit: 1000 })).data;

    const donationsByMonth = this.aggregateByMonth(
      allDonations,
      (d) => d.date,
      (d) => d.amount || 0
    );

    const volunteersByMonth = this.aggregateByMonth(
      allVolunteers,
      (v) => v.createdAt,
      () => 1
    );

    const projectsByStatus = Object.entries(
      allProjects.reduce(
        (acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    ).map(([status, count]) => ({ status, count }));

    return {
      totalVolunteers,
      activeVolunteers,
      totalDonations,
      totalDonationAmount,
      activeProjects,
      totalProjects,
      upcomingEvents,
      totalEvents,
      recentDonations: recentDonationsResult.data,
      recentVolunteers: recentVolunteersResult.data,
      upcomingEventsList: upcomingEventsList.slice(0, 5),
      donationsByMonth,
      volunteersByMonth,
      projectsByStatus,
    };
  }

  private aggregateByMonth<T>(
    items: T[],
    getDate: (item: T) => string,
    getValue: (item: T) => number
  ): { month: string; amount: number }[] {
    const monthMap: Record<string, number> = {};

    for (const item of items) {
      const date = new Date(getDate(item));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = (monthMap[key] || 0) + getValue(item);
    }

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, amount]) => ({ month, amount }));
  }
}

export const dashboardService = new DashboardService();
