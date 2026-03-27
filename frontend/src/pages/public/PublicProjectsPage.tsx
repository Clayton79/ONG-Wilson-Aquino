import { useEffect, useState } from 'react';
import { FolderKanban, MapPin, Users } from 'lucide-react';
import { api } from '../../shared/services/api';
import type { Project, PaginatedResponse } from '../../shared/types';

const statusLabels: Record<string, string> = {
  planning: 'Planejamento',
  active: 'Em Andamento',
  paused: 'Pausado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  planning: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function PublicProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get<PaginatedResponse<Project>>('/public/projects?limit=50');
        setProjects(response.data ?? []);
      } catch { /* ignored */ }
      finally { setIsLoading(false); }
    })();
  }, []);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            Nossos Projetos
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Iniciativas que transformam</h1>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            Conheça os projetos da CUFA Pernambuco e como eles impactam a vida de milhares de pessoas.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted py-20">Nenhum projeto cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-primary" />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-5 h-5 text-primary" />
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[project.status] || project.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{project.name}</h3>
                  <p className="mt-2 text-sm text-muted line-clamp-3">{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
                    {project.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {project.location}
                      </span>
                    )}
                    {project.beneficiaries && (
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" /> {project.beneficiaries} beneficiários
                      </span>
                    )}
                  </div>

                  {project.goals.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.goals.slice(0, 3).map((goal) => (
                        <span key={goal} className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded">
                          {goal}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
