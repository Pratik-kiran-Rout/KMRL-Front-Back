import { 
  LayoutDashboard, 
  Upload, 
  Search, 
  FileText, 
  Bell, 
  BarChart3, 
  Users, 
  Settings,
  Network,
  MessageSquare,
  Shield,
  BookOpen,
  Target,
  Wifi,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const getNavigation = (t: (key: string) => string) => [
  {
    name: t("dashboard"),
    icon: LayoutDashboard,
    id: "dashboard",
    badge: null,
  },
  {
    name: t("upload_documents"),
    icon: Upload,
    id: "upload",
    badge: null,
  },
  {
    name: t("search"),
    icon: Search,
    id: "search",
    badge: null,
  },
  {
    name: t("viewer"),
    icon: FileText,
    id: "viewer",
    badge: null,
  },
  {
    name: t("knowledge_graph"),
    icon: Network,
    id: "knowledge-graph",
    badge: "New",
  },
  {
    name: t("ai_chat"),
    icon: MessageSquare,
    id: "ai-chat",
    badge: null,
  },
  {
    name: t("notifications_nav"),
    icon: Bell,
    id: "notifications",
    badge: "3",
  },
  {
    name: t("analytics"),
    icon: BarChart3,
    id: "analytics",
    badge: null,
  },
  {
    name: t("compliance"),
    icon: Shield,
    id: "compliance",
    badge: null,
  },
  {
    name: t("training"),
    icon: BookOpen,
    id: "training",
    badge: null,
  },
  {
    name: t("iot"),
    icon: Wifi,
    id: "iot",
    badge: "New",
  },
  {
    name: t("ar"),
    icon: Camera,
    id: "ar",
    badge: "Beta",
  },
  {
    name: t("users"),
    icon: Users,
    id: "users",
    badge: null,
  },
  {
    name: t("settings"),
    icon: Settings,
    id: "settings",
    badge: null,
  },
];

const AppSidebar = ({ currentPage = "dashboard", onPageChange }: AppSidebarProps) => {
  const { open } = useSidebar();
  const { t } = useLanguage();
  const navigation = getNavigation(t);

  return (
    <Sidebar className="border-r bg-background">
      <SidebarContent>


        <SidebarGroup>
          <SidebarGroupLabel>{t("dashboard")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-primary/10 text-primary border-r-2 border-primary"
                      )}
                    >
                      <button onClick={() => onPageChange?.(item.id)}>
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === "New" ? "default" : "secondary"}
                            className={cn(
                              "ml-auto h-5 px-1.5 text-xs",
                              item.badge === "New" && "bg-primary text-primary-foreground",
                              item.id === "notifications" && "bg-priority-high text-white"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats - Only show when expanded */}
        {open && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("analytics")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{t("documents_processed")}</span>
                  <span className="font-medium text-primary">127</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{t("pending_approval")}</span>
                  <span className="font-medium text-priority-medium">8</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">AI Summaries</span>
                  <span className="font-medium text-priority-low">45</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Status Indicator - Only show when expanded */}
        {open && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="mx-3">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-sm text-success font-medium">{t("online")}</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;