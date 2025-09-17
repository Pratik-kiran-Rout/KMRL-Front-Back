import { useCallback, useState } from "react";
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle, Users, Lock, Send, Eye, FileSearch, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { uploadDocument, getSummary } from "@/services/api";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "processing" | "tagging" | "completed" | "error";
  preview?: string;
  detectedLanguage?: string;
  suggestedType?: string;
  ocrText?: string;
  selectedDepartments?: string[];
  accessLevel?: "public" | "restricted" | "confidential";
  documentId?: number;
  summary?: string;
  summaryLoading?: boolean;
}

const departments = [
  "Operations & Safety",
  "Technical Services", 
  "Quality Assurance",
  "Human Resources",
  "Engineering",
  "Maintenance",
  "Finance & Accounts",
  "Procurement",
  "Administration",
  "Security",
  "Environment & Sustainability"
];

const UploadZoneEnhanced = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [viewingFile, setViewingFile] = useState<UploadFile | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const uploadFile: UploadFile = {
        id: Date.now().toString() + Math.random(),
        file,
        progress: 0,
        status: "uploading"
      };

      setUploadedFiles(prev => [...prev, uploadFile]);
      performActualUpload(uploadFile.id, file);
    });
  };

  const performActualUpload = async (fileId: string, file: File) => {
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
        ));
      }, 200);

      // Actual upload
      const response = await uploadDocument(file);
      clearInterval(progressInterval);
      
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return {
            ...f,
            progress: 100,
            status: "processing",
            documentId: response.id,
            detectedLanguage: file.name.includes("malayalam") ? "Malayalam" : "English",
            suggestedType: file.name.toLowerCase().includes("safety") ? "Safety Notice" : 
                         file.name.toLowerCase().includes("maintenance") ? "Maintenance Report" :
                         file.name.toLowerCase().includes("compliance") ? "Compliance Report" : "General Document",
            ocrText: "Text extracted from document..."
          };
        }
        return f;
      }));

      // Move to tagging after processing
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: "tagging" } : f
        ));
      }, 2000);
      
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: "error", progress: 0 } : f
      ));
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDepartmentChange = (fileId: string, departments: string[]) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, selectedDepartments: departments } : file
    ));
  };

  const handleAccessLevelChange = (fileId: string, level: string) => {
    setUploadedFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, accessLevel: level as "public" | "restricted" | "confidential" } : file
    ));
  };

  const handleCompleteTagging = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file?.selectedDepartments?.length) {
      toast({
        title: "Department Required",
        description: "Please select at least one department to share this document with.",
        duration: 5000,
      });
      return;
    }
    
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "completed" } : f
    ));
    
    toast({
      title: "Document Tagged Successfully",
      description: `Document shared with ${file.selectedDepartments.length} department(s).`,
      duration: 5000,
    });
  };

  const handleGenerateSummary = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file?.documentId) return;

    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, summaryLoading: true } : f
    ));

    try {
      const summaryResponse = await getSummary(file.documentId);
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          summary: summaryResponse.summary_text || "Summary generated successfully.",
          summaryLoading: false 
        } : f
      ));
      toast({
        title: "Summary Generated",
        description: "Document summary has been created."
      });
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, summaryLoading: false } : f
      ));
      toast({
        title: "Summary Failed",
        description: "Could not generate summary. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewFile = (file: UploadFile) => {
    setViewingFile(file);
  };

  const handleDownloadFile = (file: UploadFile) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "tagging":
        return <Users className="h-4 w-4 text-priority-medium" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-priority-low" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-priority-critical" />;
    }
  };

  const getStatusText = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing with AI...";
      case "tagging":
        return "Awaiting department tagging";
      case "completed":
        return "Ready for review";
      case "error":
        return "Upload failed";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card 
        className={`relative transition-all duration-300 ${
          dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-dashed border-2"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              dragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Upload className="h-8 w-8" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">
                {dragActive ? "Drop files here" : "Upload Documents"}
              </h3>
              <p className="text-muted-foreground">
                Drag and drop files here, or{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  browse to upload
                </Button>
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>PDF, DOC, TXT</span>
              </div>
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Images with OCR</span>
              </div>
            </div>

            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Multi-Source Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary">Multi-Source Integration</CardTitle>
          <CardDescription>
            Connect with your existing document sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-md" />
              <span className="text-sm">SharePoint</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-md" />
              <span className="text-sm">Email Inbox</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-md" />
              <span className="text-sm">WhatsApp</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-md" />
              <span className="text-sm">Maximo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary">Upload Progress</CardTitle>
            <CardDescription>
              AI processing and department access control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium text-sm">{file.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB • {getStatusText(file.status)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={file.status === "completed" ? "default" : "secondary"}>
                      {file.status}
                    </Badge>
                  </div>

                  {file.status !== "completed" && file.status !== "tagging" && (
                    <Progress value={file.progress} className="h-2" />
                  )}

                  {file.status === "processing" && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Language detected:</span>
                        <Badge variant="outline">{file.detectedLanguage}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Suggested type:</span>
                        <Badge variant="outline">{file.suggestedType}</Badge>
                      </div>
                      <div className="metro-train-animation">
                        <div className="text-muted-foreground">🚇 Processing: OCR → Extraction → Summarizing → Indexing</div>
                      </div>
                    </div>
                  )}

                  {file.status === "tagging" && (
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Users className="h-4 w-4" />
                        Department Access Control
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            Select Departments (Required)
                          </label>
                          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {departments.map((dept) => (
                              <div key={dept} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${file.id}-${dept}`}
                                  checked={file.selectedDepartments?.includes(dept) || false}
                                  onCheckedChange={(checked) => {
                                    const current = file.selectedDepartments || [];
                                    const updated = checked 
                                      ? [...current, dept]
                                      : current.filter(d => d !== dept);
                                    handleDepartmentChange(file.id, updated);
                                  }}
                                />
                                <label htmlFor={`${file.id}-${dept}`} className="text-xs cursor-pointer">
                                  {dept}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            Access Level
                          </label>
                          <Select value={file.accessLevel || "public"} onValueChange={(value) => handleAccessLevelChange(file.id, value)}>
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">🌐 Public - All selected departments</SelectItem>
                              <SelectItem value="restricted">🔒 Restricted - Department heads only</SelectItem>
                              <SelectItem value="confidential">🔐 Confidential - Senior management only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {file.selectedDepartments && file.selectedDepartments.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-2 block">
                              Selected Departments ({file.selectedDepartments.length})
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {file.selectedDepartments.map((dept) => (
                                <Badge key={dept} variant="secondary" className="text-xs">
                                  {dept}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteTagging(file.id)}
                          className="w-full"
                          disabled={!file.selectedDepartments?.length}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Share Document
                        </Button>
                      </div>
                    </div>
                  )}

                  {file.status === "completed" && (
                    <div className="space-y-3">
                      <Separator />
                      
                      <div className="flex items-center gap-2 text-xs">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Shared with:</span>
                        <div className="flex flex-wrap gap-1">
                          {file.selectedDepartments?.slice(0, 2).map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                          {file.selectedDepartments && file.selectedDepartments.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{file.selectedDepartments.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {file.summary && (
                        <div className="p-3 bg-primary/5 rounded-lg border text-xs">
                          <div className="flex items-center gap-2 mb-2">
                            <FileSearch className="h-3 w-3 text-primary" />
                            <span className="font-medium text-primary">AI Summary:</span>
                          </div>
                          <p className="text-muted-foreground">{file.summary}</p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGenerateSummary(file.id)}
                          disabled={file.summaryLoading}
                        >
                          {file.summaryLoading ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <FileSearch className="h-3 w-3 mr-1" />
                          )}
                          {file.summary ? "Regenerate Summary" : "Generate Summary"}
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => handleViewFile(file)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Document
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>{file.file.name}</DialogTitle>
                              <DialogDescription>
                                {file.suggestedType} • {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[60vh] w-full">
                              <div className="space-y-4">
                                {file.file.type.startsWith('image/') ? (
                                  <img 
                                    src={URL.createObjectURL(file.file)} 
                                    alt={file.file.name}
                                    className="max-w-full h-auto rounded-lg"
                                  />
                                ) : (
                                  <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-2">File Preview:</p>
                                    <p className="text-sm">{file.ocrText || "Text content will be displayed here after processing."}</p>
                                  </div>
                                )}
                                
                                {file.summary && (
                                  <div className="p-4 bg-primary/5 rounded-lg border">
                                    <h4 className="font-medium text-sm mb-2 text-primary">AI Summary:</h4>
                                    <p className="text-sm">{file.summary}</p>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                            <div className="flex gap-2 pt-4">
                              <Button size="sm" onClick={() => handleDownloadFile(file)}>
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                              {!file.summary && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleGenerateSummary(file.id)}
                                  disabled={file.summaryLoading}
                                >
                                  {file.summaryLoading ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <FileSearch className="h-3 w-3 mr-1" />
                                  )}
                                  Generate Summary
                                </Button>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button size="sm" variant="outline">
                          Edit Access
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadZoneEnhanced;