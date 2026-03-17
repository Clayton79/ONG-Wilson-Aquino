import { BaseEntity, PaginationParams } from '../models';

export function paginate<T extends BaseEntity>(
  items: T[],
  params: PaginationParams
): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));

  // Search filter
  let filtered = items;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (params.sortBy) {
    const sortKey = params.sortBy as keyof T;
    const order = params.sortOrder === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return -1 * order;
      if (aVal > bVal) return 1 * order;
      return 0;
    });
  } else {
    // Default: sort by createdAt desc
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}
