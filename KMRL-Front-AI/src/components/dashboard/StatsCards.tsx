import { FileText, Clock, CheckCircle, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statsData = [
  {
    title: "Total Documents",
    value: "12,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: FileText,
    description: "Documents in system",
    color: "text-primary"
  },
  {
    title: "Pending Reviews",
    value: "23",
    change: "-8.2%",
    changeType: "positive" as const,
    icon: Clock,
    description: "Awaiting approval",
    color: "text-priority-medium"
  },
  {
    title: "Processed Today",
    value: "127",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: CheckCircle,
    description: "AI summaries generated",
    color: "text-priority-low"
  },
  {
    title: "Critical Alerts",
    value: "3",
    change: "+1",
    changeType: "negative" as const,
    icon: AlertTriangle,
    description: "Requires immediate attention",
    color: "text-priority-critical"
  },
  {
    title: "Compliance Score",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "CMRS/MoHUA standards",
    color: "text-priority-low"
  },
  {
    title: "Active Users",
    value: "89",
    change: "+5",
    changeType: "positive" as const,
    icon: Users,
    description: "Online this hour",
    color: "text-priority-info"
  }
];

const StatsCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="relative overflow-hidden transition-smooth hover:shadow-lg group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
                <Badge 
                  variant={stat.changeType === "positive" ? "default" : "destructive"}
                  className={`text-xs ${
                    stat.changeType === "positive" 
                      ? "bg-priority-low/10 text-priority-low border-priority-low/20" 
                      : "bg-priority-critical/10 text-priority-critical border-priority-critical/20"
                  }`}
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
            
            {/* Gradient accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-60 ${
              stat.color === "text-primary" ? "bg-primary" :
              stat.color === "text-priority-medium" ? "bg-priority-medium" :
              stat.color === "text-priority-low" ? "bg-priority-low" :
              stat.color === "text-priority-critical" ? "bg-priority-critical" :
              stat.color === "text-priority-info" ? "bg-priority-info" : "bg-primary"
            }`}></div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;