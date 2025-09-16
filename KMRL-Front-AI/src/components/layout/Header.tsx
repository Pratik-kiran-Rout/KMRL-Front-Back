import { Search, User, Globe, Bell, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onPageChange?: (page: string) => void;
}

const Header = ({ onPageChange }: HeaderProps) => {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Hamburger Menu & Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">KM</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-primary">DocHub</h1>
              <p className="text-xs text-muted-foreground">Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("search_placeholder")}
              className="pl-10 bg-muted/50 border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hidden md:flex"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ml")} className={language === "ml" ? "bg-accent" : ""}>
                മലയാളം
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("hi")} className={language === "hi" ? "bg-accent" : ""}>
                हिंदी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-priority-high text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b">
                <h3 className="font-semibold">{t("notifications")}</h3>
                <p className="text-sm text-muted-foreground">3 unread alerts</p>
              </div>
              <div className="p-2">
                <div className="p-3 rounded-lg bg-priority-critical/10 border-l-4 border-priority-critical mb-2">
                  <p className="text-sm font-medium">Critical: Safety Document</p>
                  <p className="text-xs text-muted-foreground">Requires immediate review</p>
                </div>
                <div className="p-3 rounded-lg bg-priority-medium/10 border-l-4 border-priority-medium mb-2">
                  <p className="text-sm font-medium">Compliance Report Due</p>
                  <p className="text-xs text-muted-foreground">CMRS submission pending</p>
                </div>
                <div className="p-3 rounded-lg bg-priority-info/10 border-l-4 border-priority-info">
                  <p className="text-sm font-medium">New Training Module</p>
                  <p className="text-xs text-muted-foreground">AR Safety Training available</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/user.jpg" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.role}, {user?.department}
                  </p>
                </div>
              </div>
              <DropdownMenuItem onClick={() => onPageChange?.("profile")}>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPageChange?.("users")}>Department</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPageChange?.("settings")}>Help & Support</DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;