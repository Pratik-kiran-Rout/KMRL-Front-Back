import { useState } from "react";
import { Settings, Database, Shield, Bell, Palette, Globe, Download, Upload, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/i18n/LanguageProvider";

interface SystemConfig {
  category: string;
  settings: {
    key: string;
    label: string;
    type: "boolean" | "select" | "number" | "text";
    value: any;
    options?: string[];
    description?: string;
  }[];
}

const systemConfigs: SystemConfig[] = [
  {
    category: "General",
    settings: [
      {
        key: "auto_backup",
        label: "Automatic Backup",
        type: "boolean",
        value: true,
        description: "Enable automatic daily backups"
      },
      {
        key: "language",
        label: "Default Language",
        type: "select",
        value: "english",
        options: ["english", "malayalam", "hindi"],
        description: "System default language"
      },
      {
        key: "session_timeout",
        label: "Session Timeout (minutes)",
        type: "number",
        value: 30,
        description: "Auto logout after inactivity"
      }
    ]
  },
  {
    category: "Security",
    settings: [
      {
        key: "two_factor_auth",
        label: "Two-Factor Authentication",
        type: "boolean",
        value: true,
        description: "Require 2FA for all users"
      },
      {
        key: "password_policy",
        label: "Password Policy",
        type: "select",
        value: "strict",
        options: ["basic", "moderate", "strict"],
        description: "Password complexity requirements"
      },
      {
        key: "audit_logging",
        label: "Audit Logging",
        type: "boolean",
        value: true,
        description: "Log all user activities"
      }
    ]
  },
  {
    category: "AI & Processing",
    settings: [
      {
        key: "ai_processing",
        label: "AI Document Processing",
        type: "boolean",
        value: true,
        description: "Enable AI-powered document analysis"
      },
      {
        key: "ocr_language",
        label: "OCR Language Support",
        type: "select",
        value: "multilingual",
        options: ["english", "malayalam", "multilingual"],
        description: "OCR language detection"
      },
      {
        key: "batch_size",
        label: "Processing Batch Size",
        type: "number",
        value: 10,
        description: "Documents processed simultaneously"
      }
    ]
  }
];

const SystemSettings = () => {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("general");
  const [configs, setConfigs] = useState(systemConfigs);
  const [isLoading, setIsLoading] = useState(false);

  const updateSetting = (category: string, key: string, value: any) => {
    setConfigs(prev => prev.map(config => 
      config.category.toLowerCase() === category ? {
        ...config,
        settings: config.settings.map(setting => 
          setting.key === key ? { ...setting, value } : setting
        )
      } : config
    ));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const renderSetting = (category: string, setting: any) => {
    switch (setting.type) {
      case "boolean":
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => updateSetting(category, setting.key, checked)}
          />
        );
      case "select":
        return (
          <Select 
            value={setting.value} 
            onValueChange={(value) => updateSetting(category, setting.key, value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "number":
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(category, setting.key, parseInt(e.target.value))}
            className="w-24 px-3 py-1 border rounded text-sm bg-background"
          />
        );
      default:
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => updateSetting(category, setting.key, e.target.value)}
            className="w-48 px-3 py-1 border rounded text-sm bg-background"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("system_settings")}</h1>
          <p className="text-lg text-muted-foreground">
            Configure system preferences and advanced options
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">Online</div>
            <div className="text-xs sm:text-sm text-muted-foreground">System Status</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">99.8%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">2.1GB</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Storage Used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">v2.4.1</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Version</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="general" className="text-xs sm:text-sm">{t("general")}</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">{t("security")}</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs sm:text-sm">AI & Processing</TabsTrigger>
          <TabsTrigger value="backup" className="text-xs sm:text-sm">{t("backup")}</TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs sm:text-sm">{t("advanced")}</TabsTrigger>
        </TabsList>

        {configs.map((config) => (
          <TabsContent 
            key={config.category.toLowerCase()} 
            value={config.category.toLowerCase()}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {config.category === "General" && <Settings className="h-5 w-5" />}
                  {config.category === "Security" && <Shield className="h-5 w-5" />}
                  {config.category === "AI & Processing" && <Database className="h-5 w-5" />}
                  {config.category} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {config.settings.map((setting) => (
                    <div key={setting.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-sm sm:text-base">{setting.label}</div>
                        {setting.description && (
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {setting.description}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {renderSetting(config.category.toLowerCase(), setting)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Backup Status</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Last Backup:</span>
                        <span className="font-medium">2024-12-15 02:00 AM</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Backup Size:</span>
                        <span className="font-medium">1.8 GB</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Status:</span>
                        <Badge variant="default" className="text-xs">Successful</Badge>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Storage: 1.8GB / 10GB used
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                        <Download className="h-4 w-4 mr-2" />
                        Create Manual Backup
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Restore from Backup
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Schedule Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">Warning</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Advanced settings can affect system performance and stability. 
                    Only modify these if you understand the implications.
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">{t("performance_tuning")}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm">Cache Size (MB)</span>
                        <input type="number" defaultValue={512} className="w-16 sm:w-20 px-2 py-1 border rounded text-xs sm:text-sm bg-background" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm">Max Concurrent Users</span>
                        <input type="number" defaultValue={100} className="w-16 sm:w-20 px-2 py-1 border rounded text-xs sm:text-sm bg-background" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm">Database Pool Size</span>
                        <input type="number" defaultValue={20} className="w-16 sm:w-20 px-2 py-1 border rounded text-xs sm:text-sm bg-background" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">System Maintenance</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear System Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                        <Database className="h-4 w-4 mr-2" />
                        Optimize Database
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Reset Network Config
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;