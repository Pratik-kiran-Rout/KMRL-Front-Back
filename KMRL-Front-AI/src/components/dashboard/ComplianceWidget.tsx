import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ComplianceWidgetProps {
  onPageChange?: (page: string) => void;
}

const complianceData = [
  {
    category: "CMRS Standards",
    score: 94,
    status: "good",
    lastAudit: "2 weeks ago",
    nextDue: "3 months",
    issues: 2
  },
  {
    category: "MoHUA Guidelines", 
    score: 88,
    status: "warning",
    lastAudit: "1 month ago",
    nextDue: "2 months",
    issues: 5
  },
  {
    category: "Safety Protocols",
    score: 97,
    status: "excellent",
    lastAudit: "1 week ago", 
    nextDue: "6 months",
    issues: 1
  },
  {
    category: "Environmental",
    score: 91,
    status: "good",
    lastAudit: "3 weeks ago",
    nextDue: "4 months", 
    issues: 3
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "excellent":
      return <CheckCircle className="h-4 w-4 text-priority-low" />;
    case "good":
      return <TrendingUp className="h-4 w-4 text-priority-info" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-priority-medium" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "text-priority-low";
    case "good":
      return "text-priority-info";
    case "warning":
      return "text-priority-medium";
    default:
      return "text-muted-foreground";
  }
};

const getProgressColor = (score: number) => {
  if (score >= 95) return "bg-priority-low";
  if (score >= 85) return "bg-priority-info";
  if (score >= 75) return "bg-priority-medium";
  return "bg-priority-critical";
};

const ComplianceWidget = ({ onPageChange }: ComplianceWidgetProps) => {
  const handleViewFullReport = () => {
    onPageChange?.("compliance");
    toast({
      title: "Compliance Report",
      description: "Opening full compliance dashboard...",
      duration: 5000,
    });
  };

  const handleGenerateAudit = () => {
    toast({
      title: "Audit Generation",
      description: "Starting automated compliance audit...",
      duration: 5000,
    });
  };
  const overallScore = Math.round(
    complianceData.reduce((acc, item) => acc + item.score, 0) / complianceData.length
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg text-primary">Compliance Dashboard</CardTitle>
          </div>
          <Badge className="bg-priority-low text-white">
            {overallScore}% Overall
          </Badge>
        </div>
        <CardDescription>
          Regulatory compliance monitoring and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Compliance Score</span>
              <span className="text-sm text-muted-foreground">{overallScore}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>

          {/* Individual Categories */}
          <div className="space-y-3">
            {complianceData.map((item, index) => (
              <div key={index} className="p-3 rounded-lg border bg-card hover:shadow-sm transition-smooth">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium text-sm">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getStatusColor(item.status)}`}>
                      {item.score}%
                    </span>
                    {item.issues > 0 && (
                      <Badge variant="outline" className="bg-priority-critical/10 text-priority-critical border-priority-critical/20">
                        {item.issues} issues
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Progress value={item.score} className="h-1.5 mb-2" />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last audit: {item.lastAudit}</span>
                  <span>Next due: {item.nextDue}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleViewFullReport}>
              View Full Report
            </Button>
            <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleGenerateAudit}>
              Generate Audit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceWidget;