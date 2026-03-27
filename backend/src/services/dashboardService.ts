import { volunteerService } from './volunteerService';
import { donorService } from './donorService';
import { donationService } from './donationService';
import { projectService } from './projectService';
import { eventService } from './eventService';
import { DashboardSummary } from '../models';

export class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const [
      totalVolunteers,
      activeVolunteers,
      totalDonors,
      activeDonors,
      totalDonations,
      totalDonationAmount,
      totalProjects,
      activeProjects,
      totalEvents,
      upcomingEvents,
    ] = await Promise.all([
      volunteerService.count(),
      volunteerService.countActive(),
      donorService.count(),
      donorService.countActive(),
      donationService.count(),
      donationService.totalAmount(),
      projectService.count(),
      projectService.countActive(),
      eventService.count(),
      eventService.countUpcoming(),
    ]);

    const recentDonationsResult = await donationService.getAll({
      page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc',
    });

    const recentVolunteersResult = await volunteerService.getAll({
      page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc',
    });

    const upcomingEventsList = await eventService.getUpcoming();

    const allDonations = (await donationService.getAll({ page: 1, limit: 1000 })).data;
    const allVolunteers = (await volunteerService.getAll({ page: 1, limit: 1000 })).data;
    const allProjects = (await projectService.getAll({ page: 1, limit: 1000 })).data;

    const donationsByMonth = this.aggregateByMonth(
      allDonations, (d) => d.date, (d) => d.amount || 0
    );

    const donationsByType = Object.entries(
      allDonations.reduce((acc, d) => {
        if (!acc[d.type]) acc[d.type] = { count: 0, amount: 0 };
        acc[d.type].count += 1;
        acc[d.type].amount += d.amount || 0;
        return acc;
      }, {} as Record<string, { count: number; amount: number }>)
    ).map(([type, { count, amount }]) => ({ type, count, amount }));

    const volunteersByMonth = this.aggregateByMonth(
      allVolunteers, (v) => v.createdAt, () => 1
    ).map(({ month, amount }) => ({ month, count: amount }));

    const projectsByStatus = Object.entries(
      allProjects.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([status, count]) => ({ status, count }));

    return {
      totalVolunteers, activeVolunteers, totalDonors, activeDonors,
      totalDonations, totalDonationAmount,
      activeProjects, totalProjects, upcomingEvents, totalEvents,
      recentDonations: recentDonationsResult.data,
      recentVolunteers: recentVolunteersResult.data,
      upcomingEventsList: upcomingEventsList.slice(0, 5),
      donationsByMonth, donationsByType, volunteersByMonth, projectsByStatus,
    };
  }

  private aggregateByMonth<T>(
    items: T[], getDate: (item: T) => string, getValue: (item: T) => number
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
