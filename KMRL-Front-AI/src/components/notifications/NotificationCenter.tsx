import { useState, useEffect } from "react";
import { Bell, AlertTriangle, CheckCircle, Clock, Users, ArrowRight, Filter, Search, Settings, SortAsc, SortDesc, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/i18n/LanguageProvider";

interface Notification {
  id: string;
  type: "alert" | "approval" | "update" | "routing";
  title: string;
  message: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedDoc?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Critical Safety Protocol Update",
    message: "New safety protocol for Station 12 requires immediate attention from all operations staff.",
    department: "Operations & Safety",
    priority: "Critical",
    timestamp: "2 minutes ago",
    isRead: false,
    actionRequired: true,
    relatedDoc: "Safety Protocol Update - Station 12"
  },
  {
    id: "2", 
    type: "approval",
    title: "Maintenance Schedule Approval Pending",
    message: "Q1 2025 maintenance schedule awaiting your approval. 3 other approvers have signed off.",
    department: "Technical Services",
    priority: "High",
    timestamp: "15 minutes ago",
    isRead: false,
    actionRequired: true,
    relatedDoc: "Maintenance Schedule Q1 2025"
  },
  {
    id: "3",
    type: "routing",
    title: "Document Auto-Routed",
    message: "CMRS compliance report has been automatically routed to Quality Assurance team.",
    department: "Quality Assurance", 
    priority: "Medium",
    timestamp: "1 hour ago",
    isRead: true,
    actionRequired: false,
    relatedDoc: "CMRS Compliance Audit Report"
  },
  {
    id: "4",
    type: "update",
    title: "Training Module Updated",
    message: "Emergency response training materials have been updated with new protocols.",
    department: "Human Resources",
    priority: "Medium",
    timestamp: "3 hours ago",
    isRead: true,
    actionRequired: false
  }
];

const NotificationCenter = () => {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("all");
  const [notificationList, setNotificationList] = useState(notifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: false,
    criticalOnly: false
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-4 w-4 text-priority-critical" />;
      case "approval": return <CheckCircle className="h-4 w-4 text-primary" />;
      case "routing": return <ArrowRight className="h-4 w-4 text-priority-medium" />;
      case "update": return <Bell className="h-4 w-4 text-priority-low" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const takeAction = (notification: Notification) => {
    toast.success(`Action taken for: ${notification.title}`);
    markAsRead(notification.id);
  };

  const viewDocument = (notification: Notification) => {
    toast.info(`Opening document: ${notification.relatedDoc || notification.title}`);
  };

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: "update",
        title: "System Update",
        message: "New document uploaded to the system",
        department: "System",
        priority: "Low",
        timestamp: "Just now",
        isRead: false,
        actionRequired: false
      };
      
      // Add new notification occasionally
      if (Math.random() > 0.95) {
        setNotificationList(prev => [newNotification, ...prev]);
        if (settings.soundAlerts) {
          // Play notification sound (simulated)
          toast.info("New notification received");
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [settings.soundAlerts]);

  const filteredNotifications = notificationList
    .filter(n => {
      // Tab filter
      if (selectedTab !== "all" && n.type !== selectedTab) return false;
      
      // Search filter
      if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Department filter
      if (filterDepartment !== "all" && n.department !== filterDepartment) return false;
      
      // Priority filter
      if (filterPriority !== "all" && n.priority !== filterPriority) return false;
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "priority":
          const priorityOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case "department":
          aValue = a.department;
          bValue = b.department;
          break;
        case "timestamp":
        default:
          aValue = a.timestamp;
          bValue = b.timestamp;
          break;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const departments = [...new Set(notificationList.map(n => n.department))];
  const priorities = [...new Set(notificationList.map(n => n.priority))];

  const unreadCount = notificationList.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("notifications_nav")}</h1>
          <p className="text-lg text-muted-foreground">
            Real-time alerts and intelligent document routing
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email Notifications</Label>
                  <Switch 
                    id="email"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push">Push Notifications</Label>
                  <Switch 
                    id="push"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound">Sound Alerts</Label>
                  <Switch 
                    id="sound"
                    checked={settings.soundAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="critical">Critical Only</Label>
                  <Switch 
                    id="critical"
                    checked={settings.criticalOnly}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, criticalOnly: checked }))}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Badge variant="destructive" className="px-3">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Time</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All ({notificationList.length})</TabsTrigger>
          <TabsTrigger value="alert" className="text-xs sm:text-sm">Alerts</TabsTrigger>
          <TabsTrigger value="approval" className="text-xs sm:text-sm">Approvals</TabsTrigger>
          <TabsTrigger value="routing" className="text-xs sm:text-sm">Routing</TabsTrigger>
          <TabsTrigger value="update" className="text-xs sm:text-sm">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? "border-primary/50 bg-primary/5" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-1 flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-semibold text-sm sm:text-base ${!notification.isRead ? "text-primary" : ""}`}>
                          {notification.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span className="truncate">{notification.department}</span>
                          <span className="hidden sm:inline">•</span>
                          <Clock className="h-3 w-3" />
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                          {notification.priority}
                        </Badge>
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>

                    {notification.relatedDoc && (
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <span>Related:</span>
                        <Button variant="link" className="p-0 h-auto text-xs">
                          {notification.relatedDoc}
                        </Button>
                      </div>
                    )}

                    {notification.actionRequired && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="h-7 w-full sm:w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            takeAction(notification);
                          }}
                        >
                          Take Action
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 w-full sm:w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewDocument(notification);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Document
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              className="h-12 sm:h-16 flex-col gap-1 sm:gap-2"
              onClick={markAllAsRead}
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">Mark All Read</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 sm:h-16 flex-col gap-1 sm:gap-2"
              onClick={() => setFilterDepartment(filterDepartment === "all" ? departments[0] : "all")}
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">Filter by Dept</span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 sm:h-16 flex-col gap-1 sm:gap-2">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs">Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Email Notifications</Label>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Push Notifications</Label>
                    <Switch 
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Sound Alerts</Label>
                    <Switch 
                      checked={settings.soundAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundAlerts: checked }))}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              className="h-12 sm:h-16 flex-col gap-1 sm:gap-2"
              onClick={() => toast.info("Routing rules configuration opened")}
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs">Routing Rules</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;