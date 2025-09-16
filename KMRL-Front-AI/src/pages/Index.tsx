import { useState } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/Sidebar";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentDocuments from "@/components/dashboard/RecentDocuments";
import ComplianceWidget from "@/components/dashboard/ComplianceWidget";
import FloatingChatbot from "@/components/ai/FloatingChatbot";
import UploadZoneEnhanced from "@/components/upload/UploadZoneEnhanced";
import DocumentViewerEnhanced from "@/components/viewer/DocumentViewerEnhanced";
import SearchDiscovery from "@/components/search/SearchDiscovery";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import KnowledgeGraphEnhanced from "@/components/knowledge-graph/KnowledgeGraphEnhanced";
import ComplianceCenter from "@/components/compliance/ComplianceCenter";
import TrainingCenter from "@/components/training/TrainingCenter";
import UserManagement from "@/components/admin/UserManagement";
import IoTDashboard from "@/components/iot/IoTDashboard";
import ARPreview from "@/components/ar/ARPreview";
import SystemSettings from "@/components/settings/SystemSettings";
import AIChatPage from "@/components/ai/AIChatPage";
import ProfilePage from "@/components/profile/ProfilePage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/auth/LoginPage";

const IndexContent = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { t } = useLanguage();
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{t("welcome_title")}</h1>
              <p className="text-lg text-muted-foreground">
                {t("welcome_subtitle")}
              </p>
            </div>
            
            <StatsCards />
            
            <div className="grid gap-6 lg:grid-cols-3">
              <RecentDocuments onPageChange={setCurrentPage} />
              <ComplianceWidget onPageChange={setCurrentPage} />
            </div>
          </div>
        );
      
      case "upload":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{t("upload_documents")}</h1>
              <p className="text-lg text-muted-foreground">
                {t("upload_subtitle")}
              </p>
            </div>
            <UploadZoneEnhanced />
          </div>
        );
      
      case "search":
        return <SearchDiscovery />;
      
      case "viewer":
        return <DocumentViewerEnhanced />;
      
      case "notifications":
        return <NotificationCenter />;
      
      case "analytics":
        return <AnalyticsDashboard />;
      
      case "knowledge-graph":
        return <KnowledgeGraphEnhanced />;
      
      case "compliance":
        return <ComplianceCenter />;
      
      case "training":
        return <TrainingCenter />;
      
      case "users":
        return <UserManagement />;
      
      case "iot":
        return <IoTDashboard />;
      
      case "ar":
        return <ARPreview />;
      
      case "settings":
        return <SystemSettings />;
      
      case "ai-chat":
        return <AIChatPage />;
      
      case "profile":
        return <ProfilePage />;
      
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace("-", " ")}
              </h1>
              <p className="text-lg text-muted-foreground">
                This feature is coming soon in the next development phase.
              </p>
            </div>
            <div className="p-12 text-center border-2 border-dashed border-muted rounded-lg">
              <p className="text-xl text-muted-foreground">
                🚧 Under Development 🚧
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This feature will be available in Phase {currentPage === "knowledge-graph" ? "2" : "2-3"} of the roadmap.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        
        <div className="flex flex-col flex-1">
          <Header onPageChange={setCurrentPage} />
          
          <main className="flex-1 p-6 overflow-auto">
            {renderPageContent()}
          </main>
        </div>
      </div>

      <FloatingChatbot />
    </SidebarProvider>
  );
};

const Index = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="kmrl-ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <IndexContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Index;
