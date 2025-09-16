import { useCallback, useState } from "react";
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle, Users, Lock, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

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

const UploadZone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

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
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          if (file.progress < 100) {
            return { ...file, progress: file.progress + 10 };
          } else if (file.status === "uploading") {
            // Start processing phase
            return { 
              ...file, 
              status: "processing",
              detectedLanguage: file.file.name.includes("malayalam") ? "Malayalam" : "English",
              suggestedType: file.file.name.toLowerCase().includes("safety") ? "Safety Notice" : 
                           file.file.name.toLowerCase().includes("maintenance") ? "Maintenance Report" :
                           file.file.name.toLowerCase().includes("compliance") ? "Compliance Report" : "General Document",
              ocrText: "Sample OCR text extracted from document..."
            };
          } else if (file.status === "processing") {
            // Complete processing
            clearInterval(interval);
            return { ...file, status: "completed" };
          }
        }
        return file;
      }));
    }, 500);
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
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
              AI processing and metadata extraction
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

                  {file.status !== "completed" && (
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

                  {file.status === "completed" && (
                    <div className="space-y-2">
                      <Separator />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Summary
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Metadata
                        </Button>
                        <Button size="sm">
                          Route Document
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

export default UploadZone;