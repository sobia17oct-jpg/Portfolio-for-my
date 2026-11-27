import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProjectModal } from './components/ProjectModal';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import {
  ADMIN_SESSION_KEY,
  loadAdminPasscode,
  loadInquiries,
  loadPortfolioData,
  resetPortfolioData,
  saveAdminPasscode,
  saveInquiries,
  savePortfolioData,
  StorageSaveResult,
} from './data/defaultPortfolio';
import { ContactInquiry, PortfolioData, ProjectItem } from './types/portfolio';

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(() =>
    loadPortfolioData()
  );
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() =>
    loadInquiries()
  );
  const [adminPasscode, setAdminPasscode] = useState<string>(() =>
    loadAdminPasscode()
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [storageError, setStorageError] = useState<string>('');

  useEffect(() => {
    saveInquiries(inquiries);
  }, [inquiries]);

  useEffect(() => {
    saveAdminPasscode(adminPasscode);
  }, [adminPasscode]);

  const handleChangePortfolio = (updated: PortfolioData): StorageSaveResult => {
    const result = savePortfolioData(updated);
    if (!result.ok) {
      setStorageError(
        result.error ||
          'Unable to save to browser localStorage. Try removing heavy images.'
      );
      return result;
    }
    setStorageError('');
    setPortfolio(updated);
    return result;
  };

  const handleAdminButtonClick = () => {
    if (isAdminAuthenticated) {
      setDashboardOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    setLoginModalOpen(false);
    setDashboardOpen(true);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
    setDashboardOpen(false);
  };

  const handleResetToDefault = () => {
    const restored = resetPortfolioData();
    setStorageError('');
    setPortfolio(restored);
  };

  const handleSubmitInquiry = (
    payload: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>
  ) => {
    const newInquiry: ContactInquiry = {
      ...payload,
      id: `inq_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] text-[#111827]">
      <Navbar
        brandName={portfolio.hero.brandName}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminAction={handleAdminButtonClick}
      />

      <main className="flex-1">
        <HeroSection hero={portfolio.hero} />
        <AboutSection about={portfolio.about} />
        <SkillsSection skills={portfolio.skills} />
        <ProjectsSection
          projects={portfolio.projects}
          onSelectProject={setSelectedProject}
        />
        <ContactSection
          contact={portfolio.contact}
          onSubmitInquiry={handleSubmitInquiry}
        />
      </main>

      <Footer
        footer={portfolio.footer}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminAction={handleAdminButtonClick}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <AdminLoginModal
        isOpen={loginModalOpen}
        activePasscode={adminPasscode}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {dashboardOpen && isAdminAuthenticated && (
        <AdminDashboard
          portfolio={portfolio}
          inquiries={inquiries}
          adminPasscode={adminPasscode}
          storageError={storageError}
          onChangePortfolio={handleChangePortfolio}
          onChangePasscode={setAdminPasscode}
          onResetToDefault={handleResetToDefault}
          onUpdateInquiries={setInquiries}
          onCloseDashboard={() => setDashboardOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
