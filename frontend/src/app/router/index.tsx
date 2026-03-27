import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '../../shared/types';

// Auth pages
import { LoginPage } from '../../pages/auth/LoginPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';
import { RecoverPage } from '../../pages/auth/RecoverPage';

// App pages
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { VolunteerListPage } from '../../pages/volunteers/VolunteerListPage';
import { VolunteerFormPage } from '../../pages/volunteers/VolunteerFormPage';
import { DonorListPage } from '../../pages/donors/DonorListPage';
import { DonorFormPage } from '../../pages/donors/DonorFormPage';
import { ProjectListPage } from '../../pages/projects/ProjectListPage';
import { ProjectFormPage } from '../../pages/projects/ProjectFormPage';
import { DonationListPage } from '../../pages/donations/DonationListPage';
import { DonationFormPage } from '../../pages/donations/DonationFormPage';
import { EventListPage } from '../../pages/events/EventListPage';
import { EventFormPage } from '../../pages/events/EventFormPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';
import { SettingsPage } from '../../pages/settings/SettingsPage';

// Public pages
import { HomePage } from '../../pages/public/HomePage';
import { PublicProjectsPage } from '../../pages/public/PublicProjectsPage';
import { PublicEventsPage } from '../../pages/public/PublicEventsPage';
import { ContactPage } from '../../pages/public/ContactPage';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter([
  // ---- Public area ----
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/public/projects', element: <PublicProjectsPage /> },
      { path: '/public/events', element: <PublicEventsPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },
  // ---- Auth ----
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/recover', element: <RecoverPage /> },
    ],
  },
  // ---- Admin / protected ----
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/volunteers', element: <VolunteerListPage /> },
      { path: '/volunteers/new', element: <VolunteerFormPage /> },
      { path: '/volunteers/:id/edit', element: <VolunteerFormPage /> },
      { path: '/donors', element: <DonorListPage /> },
      { path: '/donors/new', element: <DonorFormPage /> },
      { path: '/donors/:id/edit', element: <DonorFormPage /> },
      { path: '/projects', element: <ProjectListPage /> },
      { path: '/projects/new', element: <ProjectFormPage /> },
      { path: '/projects/:id/edit', element: <ProjectFormPage /> },
      { path: '/donations', element: <DonationListPage /> },
      { path: '/donations/new', element: <DonationFormPage /> },
      { path: '/donations/:id/edit', element: <DonationFormPage /> },
      { path: '/events', element: <EventListPage /> },
      { path: '/events/new', element: <EventFormPage /> },
      { path: '/events/:id/edit', element: <EventFormPage /> },
      {
        path: '/reports',
        element: (
          <ProtectedRoute roles={[UserRole.ADMIN]}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute roles={[UserRole.ADMIN]}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
], { basename });
