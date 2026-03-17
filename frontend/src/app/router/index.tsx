import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
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
import { ProjectListPage } from '../../pages/projects/ProjectListPage';
import { ProjectFormPage } from '../../pages/projects/ProjectFormPage';
import { DonationListPage } from '../../pages/donations/DonationListPage';
import { DonationFormPage } from '../../pages/donations/DonationFormPage';
import { EventListPage } from '../../pages/events/EventListPage';
import { EventFormPage } from '../../pages/events/EventFormPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';
import { SettingsPage } from '../../pages/settings/SettingsPage';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/recover', element: <RecoverPage /> },
    ],
  },
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
