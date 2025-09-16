import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Download, Eye, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/i18n/LanguageProvider";

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  status: "compliant" | "warning" | "critical" | "pending";
  score: number;
  lastAudit: string;
  nextDue: string;
  documents: number;
}

const complianceData: ComplianceItem[] = [
  {
    id: "1",
    category: "CMRS Safety",
    requirement: "Platform Safety Protocols",
    status: "compliant",
    score: 97,
    lastAudit: "2024-12-10",
    nextDue: "2025-03-10",
    documents: 12
  },
  {
    id: "2", 
    category: "Fire Safety",
    requirement: "Emergency Evacuation Procedures",
    status: "warning",
    score: 89,
    lastAudit: "2024-11-15",
    nextDue: "2025-01-15",
    documents: 8
  },
  {
    id: "3",
    category: "Environmental",
    requirement: "Noise Pollution Control",
    status: "critical",
    score: 76,
    lastAudit: "2024-10-20",
    nextDue: "2024-12-20",
    documents: 5
  },
  {
    id: "4",
    category: "Operational",
    requirement: "Rolling Stock Maintenance",
    status: "compliant",
    score: 94,
    lastAudit: "2024-12-05",
    nextDue: "2025-02-05",
    documents: 15
  }
];

const ComplianceCenter = () => {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      case "pending": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant": return "default";
      case "warning": return "secondary";
      case "critical": return "destructive";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const overallScore = Math.round(complianceData.reduce((acc, item) => acc + item.score, 0) / complianceData.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("compliance_center")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("compliance_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Generate Audit
          </Button>
        </div>
      </div>

      {/* Overall Compliance Score */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-primary">Overall Compliance Score</h3>
              <p className="text-muted-foreground">Across all regulatory categories</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{overallScore}%</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-3 w-3" />
                +2.3% this quarter
              </div>
            </div>
          </div>
          <Progress value={overallScore} className="mt-4 h-3" />
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="audits" className="text-xs sm:text-sm">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
          <TabsTrigger value="blockchain" className="text-xs sm:text-sm">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {complianceData.map((item) => (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedItem?.id === item.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(item.status)}`} />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base truncate">{item.requirement}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                      <div className="text-center sm:text-right">
                        <div className="text-lg sm:text-2xl font-bold text-primary">{item.score}%</div>
                        <div className="text-xs text-muted-foreground">Compliance Score</div>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <Badge variant={getStatusBadge(item.status)} className="text-xs">
                          {item.status.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.documents} documents
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <div className="text-xs sm:text-sm font-medium">Next Due</div>
                        <div className="text-xs text-muted-foreground">{item.nextDue}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Progress value={item.score} className="mt-3 h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Audit Trail History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-12-15", action: "Compliance Report Generated", user: "System", status: "success" },
                  { date: "2024-12-10", action: "CMRS Safety Audit Completed", user: "Chief Safety Officer", status: "success" },
                  { date: "2024-12-05", action: "Environmental Compliance Warning", user: "System", status: "warning" },
                  { date: "2024-11-30", action: "Fire Safety Documentation Updated", user: "Safety Team", status: "info" }
                ].map((entry, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      entry.status === "success" ? "bg-green-500" :
                      entry.status === "warning" ? "bg-yellow-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">by {entry.user}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{entry.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quarterly Compliance Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Report Period:</span>
                    <span>Q4 2024</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Generated:</span>
                    <span>2024-12-15</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Status:</span>
                    <Badge variant="default" className="text-xs">Ready</Badge>
                  </div>
                  <Button size="sm" className="w-full mt-3">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">CMRS Audit Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Audit Date:</span>
                    <span>2024-12-10</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Score:</span>
                    <span className="font-bold text-green-600">97%</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Status:</span>
                    <Badge variant="default" className="text-xs">Approved</Badge>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Blockchain Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">Block #1247</span>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Hash: 0x7d4a8f2e9c1b5a3d6e8f9a2b4c7d1e5f8a9b2c4d7e1f5a8b9c2d4e7f1a5b8c9d2e4f7</div>
                    <div>Timestamp: 2024-12-15 14:30:25 UTC</div>
                    <div>Transaction: CMRS Compliance Report - Score: 97%</div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">Block #1246</span>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Hash: 0x2e4f7a1b5c8d9e2f5a8b1c4d7e9f2a5b8c1d4e7f9a2b5c8d1e4f7a9b2c5d8e1f4a7</div>
                    <div>Timestamp: 2024-12-10 09:15:42 UTC</div>
                    <div>Transaction: Safety Audit Completion - Station 12</div>
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

export default ComplianceCenter;