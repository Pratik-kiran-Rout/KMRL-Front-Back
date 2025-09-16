import { FileText, Clock, User, Download, Eye, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface RecentDocumentsProps {
  onPageChange?: (page: string) => void;
}

const recentDocuments = [
  {
    id: "1",
    title: "Safety Protocol Update - Station 12",
    type: "Safety Notice",
    uploadedBy: "Priya Nair",
    uploadedAt: "2 hours ago",
    department: "Operations",
    priority: "critical",
    status: "pending",
    summary: "Updated emergency evacuation procedures for Edappally station including new assembly points and communication protocols.",
    avatar: "PN"
  },
  {
    id: "2", 
    title: "Quarterly Maintenance Report Q3-2024",
    type: "Maintenance Report",
    uploadedBy: "Kumar Menon",
    uploadedAt: "4 hours ago",
    department: "Engineering",
    priority: "medium",
    status: "reviewed",
    summary: "Comprehensive analysis of rolling stock performance, infrastructure maintenance, and predictive maintenance insights.",
    avatar: "KM"
  },
  {
    id: "3",
    title: "CMRS Compliance Audit Findings",
    type: "Compliance Report",
    uploadedBy: "Sujitha Raj",
    uploadedAt: "6 hours ago", 
    department: "Compliance",
    priority: "high",
    status: "approved",
    summary: "Commissioner of Metro Rail Safety audit results with recommendations for operational improvements.",
    avatar: "SR"
  },
  {
    id: "4",
    title: "Employee Training Schedule - December",
    type: "HR Document",
    uploadedBy: "Anand Krishnan",
    uploadedAt: "1 day ago",
    department: "Human Resources",
    priority: "low",
    status: "draft",
    summary: "Monthly training calendar including safety certifications, technical workshops, and compliance modules.",
    avatar: "AK"
  },
  {
    id: "5",
    title: "Procurement Request - Signal Systems",
    type: "Procurement",
    uploadedBy: "Deepa Thomas",
    uploadedAt: "1 day ago",
    department: "Procurement",
    priority: "medium",
    status: "pending",
    summary: "Detailed specifications for new signal control systems upgrade project with vendor evaluation criteria.",
    avatar: "DT"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "border-priority-critical bg-priority-critical/10 text-priority-critical";
    case "high": return "border-priority-high bg-priority-high/10 text-priority-high";
    case "medium": return "border-priority-medium bg-priority-medium/10 text-priority-medium";
    case "low": return "border-priority-low bg-priority-low/10 text-priority-low";
    default: return "border-muted bg-muted/10 text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "bg-priority-low text-white";
    case "reviewed": return "bg-priority-info text-white";
    case "pending": return "bg-priority-medium text-white";
    case "draft": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getDepartmentColor = (department: string) => {
  const colors = {
    "Operations": "bg-primary/10 text-primary border-primary/20",
    "Engineering": "bg-priority-info/10 text-priority-info border-priority-info/20", 
    "Compliance": "bg-priority-critical/10 text-priority-critical border-priority-critical/20",
    "Human Resources": "bg-priority-low/10 text-priority-low border-priority-low/20",
    "Procurement": "bg-priority-medium/10 text-priority-medium border-priority-medium/20"
  };
  return colors[department as keyof typeof colors] || "bg-muted/10 text-muted-foreground border-muted/20";
};

const RecentDocuments = ({ onPageChange }: RecentDocumentsProps) => {
  const handleViewDocument = (docTitle: string) => {
    onPageChange?.("viewer");
    toast({
      title: "Opening Document",
      description: `Loading "${docTitle}" in document viewer...`,
      duration: 5000,
    });
  };

  const handleDownload = (docTitle: string) => {
    toast({
      title: "Download Started",
      description: `Downloading "${docTitle}"...`,
      duration: 5000,
    });
  };

  const handleViewSummary = (docTitle: string) => {
    toast({
      title: "AI Summary",
      description: `Displaying AI-generated summary for "${docTitle}"`,
      duration: 5000,
    });
  };

  const handleViewAll = () => {
    onPageChange?.("search");
    toast({
      title: "All Documents",
      description: "Navigating to search & discovery page...",
      duration: 5000,
    });
  };
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-primary">Recent Documents</CardTitle>
            <CardDescription>Latest uploads and AI-processed summaries</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(doc.priority)} bg-card hover:shadow-md transition-smooth cursor-pointer group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {doc.summary}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {doc.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span>{doc.uploadedBy}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDocument(doc.title)}>
                        <Eye className="mr-2 h-3 w-3" />
                        View Document
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(doc.title)}>
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewSummary(doc.title)}>
                        <User className="mr-2 h-3 w-3" />
                        View Summary
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant="outline" className={getDepartmentColor(doc.department)}>
                      {doc.department}
                    </Badge>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDocuments;