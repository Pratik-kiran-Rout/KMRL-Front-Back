import { useState } from "react";
import { FileText, Languages, Download, Share2, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  title: string;
  type: string;
  language: string;
  content: string;
  summary: {
    english: string;
    malayalam: string;
  };
  metadata: {
    department: string;
    priority: string;
    uploadDate: string;
    fileSize: string;
  };
}

const sampleDocument: Document = {
  id: "1",
  title: "Safety Protocol Update - Station 12",
  type: "Safety Notice",
  language: "English",
  content: `KOCHI METRO RAIL LIMITED
SAFETY PROTOCOL UPDATE - STATION 12

Date: December 15, 2024
Department: Operations & Safety
Priority: HIGH

SUBJECT: Updated Safety Protocols for Platform Operations at Station 12

This document outlines the revised safety protocols for platform operations at Station 12, effective immediately. All personnel must adhere to these updated guidelines to ensure passenger safety and operational efficiency.

1. PLATFORM SAFETY MEASURES
- Maintain minimum 2-meter distance from platform edge during train arrival
- Ensure all safety barriers are functional before passenger boarding
- Conduct visual inspection of platform every 30 minutes
- Report any structural anomalies immediately to control room

2. EMERGENCY PROCEDURES
- In case of medical emergency, contact medical team via emergency button
- For technical failures, immediately notify maintenance team
- Evacuation procedures must be initiated within 60 seconds of alarm
- All staff must be familiar with emergency exit routes

3. PASSENGER ASSISTANCE
- Provide assistance to elderly and disabled passengers
- Ensure proper queue management during peak hours
- Monitor passenger behavior for safety violations
- Maintain clear announcements in both English and Malayalam

4. EQUIPMENT CHECKS
- Daily inspection of CCTV systems
- Verify functionality of public address systems
- Check emergency lighting systems
- Test communication equipment twice per shift

This protocol supersedes all previous safety guidelines for Station 12. Compliance is mandatory for all operational staff. Training sessions will be conducted next week.

For queries, contact Safety Department at ext. 2345.

Authorized by: Chief Safety Officer
Distribution: All Station 12 Personnel`,
  summary: {
    english: "This safety protocol update for Station 12 introduces critical operational changes effective immediately. Key requirements include maintaining 2-meter platform distance, 30-minute platform inspections, 60-second emergency response times, and bilingual passenger assistance. Daily equipment checks for CCTV, PA systems, and emergency lighting are mandatory. All staff must attend upcoming training sessions for compliance.",
    malayalam: "സ്റ്റേഷൻ 12-നുള്ള ഈ സുരക്ഷാ പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ് ഉടനടി പ്രാബല്യത്തിൽ വരുന്ന നിർണായക പ്രവർത്തന മാറ്റങ്ങൾ അവതരിപ്പിക്കുന്നു. പ്രധാന ആവശ്യകതകളിൽ 2-മീറ്റർ പ്ലാറ്റ്ഫോം ദൂരം, 30-മിനിറ്റ് പ്ലാറ്റ്ഫോം പരിശോധനകൾ, 60-സെക്കൻഡ് അടിയന്തര പ്രതികരണ സമയം, ദ്വിഭാഷാ യാത്രക്കാരുടെ സഹായം എന്നിവ ഉൾപ്പെടുന്നു."
  },
  metadata: {
    department: "Operations & Safety",
    priority: "High",
    uploadDate: "2024-12-15",
    fileSize: "2.4 MB"
  }
};

const DocumentViewer = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "malayalam">("english");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Document Viewer</h1>
          <p className="text-lg text-muted-foreground">
            Split-view document analysis with AI-powered summaries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 min-h-[60vh] lg:h-[calc(100vh-200px)]">
        {/* Original Document */}
        <Card className="flex flex-col order-2 lg:order-1">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-base sm:text-lg text-primary flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Original Document
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">{sampleDocument.type}</Badge>
                <Badge variant={sampleDocument.metadata.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                  {sampleDocument.metadata.priority}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="truncate">{sampleDocument.metadata.department}</span>
              <span className="hidden sm:inline">•</span>
              <span>{sampleDocument.metadata.uploadDate}</span>
              <span className="hidden sm:inline">•</span>
              <span>{sampleDocument.metadata.fileSize}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                {sampleDocument.content}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card className="flex flex-col order-1 lg:order-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-base sm:text-lg text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                AI Summary
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLanguage(selectedLanguage === "english" ? "malayalam" : "english")}
                className="w-full sm:w-auto"
              >
                <Languages className="h-4 w-4 mr-2" />
                {selectedLanguage === "english" ? "മലയാളം" : "English"}
              </Button>
            </div>
            <Badge variant="outline" className="w-fit text-xs">
              {selectedLanguage === "english" ? "English Summary" : "Malayalam Summary"}
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs sm:text-sm leading-relaxed">
                {sampleDocument.summary[selectedLanguage]}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold text-sm sm:text-base text-primary flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Key Insights
              </h4>
              <div className="space-y-2">
                <div className="p-2 sm:p-3 bg-muted rounded-lg">
                  <p className="text-xs sm:text-sm font-medium text-priority-high">Critical Action Required</p>
                  <p className="text-xs text-muted-foreground">Immediate implementation of 2-meter safety distance protocol</p>
                </div>
                <div className="p-2 sm:p-3 bg-muted rounded-lg">
                  <p className="text-xs sm:text-sm font-medium text-priority-medium">Training Scheduled</p>
                  <p className="text-xs text-muted-foreground">Mandatory training sessions for all Station 12 personnel</p>
                </div>
                <div className="p-2 sm:p-3 bg-muted rounded-lg">
                  <p className="text-xs sm:text-sm font-medium text-priority-low">Equipment Checks</p>
                  <p className="text-xs text-muted-foreground">Daily CCTV and PA system inspections required</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm sm:text-base text-primary">Related Documents</h4>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
                  <div className="text-left">
                    <p className="text-xs font-medium">Station 12 Emergency Procedures</p>
                    <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                  </div>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
                  <div className="text-left">
                    <p className="text-xs font-medium">Platform Safety Guidelines</p>
                    <p className="text-xs text-muted-foreground">Updated 1 week ago</p>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentViewer;