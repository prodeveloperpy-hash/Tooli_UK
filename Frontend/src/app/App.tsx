import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SupplierDashboard } from './pages/SupplierDashboard';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { HelpPage } from './pages/HelpPage';
import { CitiesPage } from './pages/CitiesPage';
import { BlogPage, BlogPostPage } from './pages/BlogPage';
import { LocationPage } from './pages/LocationPage';
import { EquipmentPage } from './pages/EquipmentPage';

function DashboardSelector() {
  const role = localStorage.getItem('role_key');
  
  switch (role) {
    case 'SUPERADMIN':
      return <SuperAdminDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'SUPPLIER':
      return <SupplierDashboard />;
    default:
      return <LoginPage />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/locations/:slug" element={<LocationPage />} />
          <Route path="/equipment/:slug" element={<EquipmentPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardSelector />} />
      </Routes>
    </BrowserRouter>
  );
}
