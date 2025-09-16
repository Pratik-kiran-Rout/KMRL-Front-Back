import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, FileText, Clock, AlertTriangle, Download, Filter, Calendar, RefreshCw, Target, Zap, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const documentTrends = [
  { month: "Sep", uploads: 245, processed: 238, compliance: 94 },
  { month: "Oct", uploads: 312, processed: 305, compliance: 96 },
  { month: "Nov", uploads: 289, processed: 285, compliance: 95 },
  { month: "Dec", uploads: 356, processed: 348, compliance: 97 }
];

const departmentData = [
  { name: "Operations", value: 35, color: "#3b82f6" },
  { name: "Technical", value: 28, color: "#10b981" },
  { name: "Safety", value: 22, color: "#f59e0b" },
  { name: "Quality", value: 15, color: "#ef4444" }
];

const complianceMetrics = [
  { category: "Safety Protocols", score: 97, trend: "+2%" },
  { category: "Maintenance Reports", score: 94, trend: "+1%" },
  { category: "Training Records", score: 89, trend: "-1%" },
  { category: "Audit Documentation", score: 96, trend: "+3%" }
];

const realTimeData = [
  { time: "00:00", users: 12, documents: 5, alerts: 0 },
  { time: "04:00", users: 8, documents: 2, alerts: 1 },
  { time: "08:00", users: 45, documents: 23, alerts: 2 },
  { time: "12:00", users: 89, documents: 67, alerts: 1 },
  { time: "16:00", users: 76, documents: 45, alerts: 3 },
  { time: "20:00", users: 34, documents: 18, alerts: 0 }
];

const performanceMetrics = [
  { metric: "System Uptime", value: 99.8, target: 99.5, status: "excellent" },
  { metric: "Response Time", value: 1.2, target: 2.0, status: "good", unit: "s" },
  { metric: "Error Rate", value: 0.1, target: 0.5, status: "excellent", unit: "%" },
  { metric: "Storage Usage", value: 67, target: 80, status: "warning", unit: "%" }
];

const predictiveInsights = [
  {
    title: "Peak Load Prediction",
    description: "System load expected to increase by 35% next Tuesday 9-11 AM",
    confidence: 87,
    impact: "high",
    action: "Scale resources"
  },
  {
    title: "Compliance Risk",
    description: "Environmental compliance may drop below 75% if current trend continues",
    confidence: 92,
    impact: "critical",
    action: "Review protocols"
  },
  {
    title: "Document Surge",
    description: "40% increase in safety documents expected due to seasonal maintenance",
    confidence: 78,
    impact: "medium",
    action: "Prepare resources"
  }
];

const AnalyticsDashboard = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveData, setLiveData] = useState(realTimeData);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => prev.map(item => ({
        ...item,
        users: Math.max(5, item.users + Math.floor(Math.random() * 10 - 5)),
        documents: Math.max(0, item.documents + Math.floor(Math.random() * 6 - 3)),
        alerts: Math.max(0, item.alerts + Math.floor(Math.random() * 2 - 1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard refreshed");
    }, 1000);
  };

  const handleExport = () => {
    toast.success("Analytics report exported to CSV");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-blue-600";
      case "warning": return "text-yellow-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical": return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "high": return "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "medium": return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default: return "border-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("analytics_title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("analytics_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("documents_processed")}</p>
                    <p className="text-2xl font-bold text-primary">1,247</p>
                    <p className="text-xs text-green-600">+12% this month</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("avg_processing_time")}</p>
                    <p className="text-2xl font-bold text-primary">2.3s</p>
                    <p className="text-xs text-green-600">-0.5s improvement</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("active_users")}</p>
                    <p className="text-2xl font-bold text-primary">{liveData[3]?.users || 89}</p>
                    <p className="text-xs text-yellow-600">Peak: 127 users</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("compliance_score")}</p>
                    <p className="text-2xl font-bold text-primary">94.2%</p>
                    <p className="text-xs text-green-600">+1.8% this quarter</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t("performance_metrics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                          {metric.value}{metric.unit || ''}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Target: {metric.target}{metric.unit || ''}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={metric.unit === '%' ? metric.value : (metric.value / metric.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t("system_health")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{t("all_systems_operational")}</span>
                    </div>
                    <Badge variant="secondary">99.8% Uptime</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">CPU Usage</p>
                      <p className="font-bold text-blue-600">34%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Memory Usage</p>
                      <p className="font-bold text-green-600">67%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Disk I/O</p>
                      <p className="font-bold text-yellow-600">23 MB/s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Network</p>
                      <p className="font-bold text-purple-600">145 Mbps</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {/* Real-time Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-time Activity
                <Badge variant="outline" className="ml-2">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={liveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="documents" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Predictive Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                AI-Powered Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${getImpactColor(insight.impact)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Confidence:</span>
                            <Badge variant="outline">{insight.confidence}%</Badge>
                          </div>
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                      <Badge variant={insight.impact === 'critical' ? 'destructive' : insight.impact === 'high' ? 'default' : 'secondary'}>
                        {insight.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historical Charts - Always visible */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Document Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Document Processing Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={documentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="processed" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary">Department Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {complianceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.category}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={metric.score >= 95 ? "default" : metric.score >= 90 ? "secondary" : "destructive"}>
                      {metric.score}%
                    </Badge>
                    <span className={`text-xs ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
                <Progress value={metric.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;