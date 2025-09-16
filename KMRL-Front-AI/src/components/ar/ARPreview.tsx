import { useState } from "react";
import { Camera, Scan, Eye, Layers, MapPin, Info, Maximize2, RotateCcw, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/i18n/LanguageProvider";

interface ARObject {
  id: string;
  name: string;
  type: "document" | "equipment" | "safety" | "maintenance";
  position: { x: number; y: number };
  info: string;
  status?: "normal" | "warning" | "critical";
  lastUpdated: string;
}

const arObjects: ARObject[] = [
  {
    id: "1",
    name: "Safety Protocol Display",
    type: "safety",
    position: { x: 25, y: 30 },
    info: "Platform Safety Guidelines - Updated Dec 15",
    status: "normal",
    lastUpdated: "2024-12-15"
  },
  {
    id: "2",
    name: "Equipment Manual",
    type: "document",
    position: { x: 60, y: 45 },
    info: "Rolling Stock Maintenance Guide",
    lastUpdated: "2024-12-10"
  },
  {
    id: "3",
    name: "Track Sensor",
    type: "equipment",
    position: { x: 40, y: 70 },
    info: "Vibration Monitor - Status: Warning",
    status: "warning",
    lastUpdated: "2024-12-15"
  },
  {
    id: "4",
    name: "Maintenance Schedule",
    type: "maintenance",
    position: { x: 75, y: 25 },
    info: "Next inspection due: Dec 20, 2024",
    status: "normal",
    lastUpdated: "2024-12-12"
  }
];

const ARPreview = () => {
  const { t } = useLanguage();
  const [selectedObject, setSelectedObject] = useState<ARObject | null>(null);
  const [arMode, setArMode] = useState<"preview" | "live" | "overlay">("preview");
  const [showOverlays, setShowOverlays] = useState(true);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleModeChange = (mode: "preview" | "live" | "overlay") => {
    setArMode(mode);
    toast.success(`Switched to ${mode} mode`);
  };

  const handleToggleOverlays = () => {
    setShowOverlays(!showOverlays);
    toast.info(showOverlays ? "AR overlays hidden" : "AR overlays shown");
  };

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      toast.success("AR system recalibrated successfully");
    }, 2000);
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      toast.info("Exited fullscreen mode");
    } else {
      document.documentElement.requestFullscreen();
      toast.info("Entered fullscreen mode");
    }
  };

  const handleViewObject = (obj: ARObject) => {
    toast.success(`Opening ${obj.name}`);
  };

  const handleObjectDetails = (obj: ARObject) => {
    toast.info(`Showing details for ${obj.name}`);
  };

  const handleCalibrateCamera = () => {
    toast.info("Camera calibration started");
  };

  const handleARInfo = () => {
    toast.info("AR system information displayed");
  };

  const handleLocationPin = () => {
    toast.info("Location pinned on AR map");
  };

  const getObjectColor = (type: string, status?: string) => {
    if (status === "critical") return "bg-red-500 border-red-600";
    if (status === "warning") return "bg-yellow-500 border-yellow-600";
    
    switch (type) {
      case "safety": return "bg-red-100 border-red-300 text-red-800";
      case "document": return "bg-blue-100 border-blue-300 text-blue-800";
      case "equipment": return "bg-green-100 border-green-300 text-green-800";
      case "maintenance": return "bg-orange-100 border-orange-300 text-orange-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getObjectIcon = (type: string) => {
    switch (type) {
      case "safety": return "🛡️";
      case "document": return "📄";
      case "equipment": return "⚙️";
      case "maintenance": return "🔧";
      default: return "📍";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t('ar_preview_title')}</h1>
          <p className="text-lg text-muted-foreground">
            Augmented reality overlay for field operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={arMode === "live" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleModeChange("live")}
          >
            <Camera className="h-4 w-4 mr-2" />
            Live AR
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreen}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* AR Mode Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button 
                variant={arMode === "preview" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleModeChange("preview")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Mode
              </Button>
              <Button 
                variant={arMode === "live" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleModeChange("live")}
              >
                <Camera className="h-4 w-4 mr-2" />
                Live Camera
              </Button>
              <Button 
                variant={arMode === "overlay" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleModeChange("overlay")}
              >
                <Layers className="h-4 w-4 mr-2" />
                Overlay View
              </Button>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleToggleOverlays}
              >
                <Scan className="h-4 w-4 mr-2" />
                {showOverlays ? "Hide" : "Show"} Overlays
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRecalibrate}
                disabled={isCalibrating}
              >
                <RotateCcw className={`h-4 w-4 mr-2 ${isCalibrating ? 'animate-spin' : ''}`} />
                {isCalibrating ? "Calibrating..." : "Recalibrate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AR Viewport */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                AR Viewport - {arMode === "live" ? "Live Camera" : "Station 12 Platform"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="relative h-full bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg overflow-hidden">
                {/* Simulated Camera/Environment View */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-gray-300">
                  {/* Platform representation */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-400 opacity-60" />
                  <div className="absolute bottom-32 left-1/4 right-1/4 h-4 bg-yellow-400 opacity-80" />
                  
                  {/* Track lines */}
                  <div className="absolute bottom-36 left-0 right-0 h-2 bg-gray-600 opacity-70" />
                  <div className="absolute bottom-40 left-0 right-0 h-2 bg-gray-600 opacity-70" />
                </div>

                {/* AR Overlays */}
                {showOverlays && arObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className={`absolute cursor-pointer transition-all hover:scale-110 ${
                      selectedObject?.id === obj.id ? "scale-125 z-20" : "z-10"
                    }`}
                    style={{
                      left: `${obj.position.x}%`,
                      top: `${obj.position.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    onClick={() => setSelectedObject(obj)}
                  >
                    {/* AR Marker */}
                    <div className={`p-3 rounded-lg border-2 shadow-lg backdrop-blur-sm ${getObjectColor(obj.type, obj.status)}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getObjectIcon(obj.type)}</span>
                        <div>
                          <div className="font-medium text-xs">{obj.name}</div>
                          {obj.status && (
                            <Badge 
                              variant={obj.status === "critical" ? "destructive" : 
                                     obj.status === "warning" ? "secondary" : "default"}
                              className="text-xs h-4 mt-1"
                            >
                              {obj.status.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection Line */}
                    <div className="absolute top-full left-1/2 w-0.5 h-8 bg-primary transform -translate-x-1/2" />
                    <div className="absolute top-full left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 translate-y-7" />
                  </div>
                ))}

                {/* AR Grid Overlay */}
                <svg className="absolute inset-0 pointer-events-none opacity-20">
                  <defs>
                    <pattern id="ar-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#ar-grid)" />
                </svg>

                {/* AR Status Indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    arMode === "live" ? "bg-green-400" : 
                    arMode === "overlay" ? "bg-blue-400" : "bg-yellow-400"
                  }`} />
                  <span className="text-sm font-medium">
                    {arMode === "live" ? "AR Live" : 
                     arMode === "overlay" ? "AR Overlay" : "AR Preview"}
                  </span>
                </div>

                {/* AR Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-black/50 text-white border-white/20"
                    onClick={handleARInfo}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-black/50 text-white border-white/20"
                    onClick={handleLocationPin}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AR Object Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">AR Objects ({arObjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {arObjects.map((obj) => (
                  <div 
                    key={obj.id}
                    className={`p-2 border rounded cursor-pointer transition-all hover:shadow-md ${
                      selectedObject?.id === obj.id ? "ring-2 ring-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedObject(obj)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{getObjectIcon(obj.type)}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{obj.name}</div>
                        <div className="text-xs text-muted-foreground">{obj.type}</div>
                      </div>
                      {obj.status && (
                        <div className={`w-2 h-2 rounded-full ${
                          obj.status === "critical" ? "bg-red-500" :
                          obj.status === "warning" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedObject && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Object Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getObjectIcon(selectedObject.type)}</span>
                    <div>
                      <div className="font-medium">{selectedObject.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{selectedObject.type}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Information:</p>
                    <p>{selectedObject.info}</p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last updated: {selectedObject.lastUpdated}
                  </div>
                  
                  {selectedObject.status && (
                    <Badge variant={selectedObject.status === "critical" ? "destructive" : 
                                  selectedObject.status === "warning" ? "secondary" : "default"}>
                      {selectedObject.status.toUpperCase()}
                    </Badge>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewObject(selectedObject)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleObjectDetails(selectedObject)}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">AR Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tracking Quality</span>
                  <Badge variant="default">Excellent</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Objects Detected</span>
                  <span className="text-sm font-medium">{arObjects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Frame Rate</span>
                  <span className="text-sm font-medium">30 FPS</span>
                </div>
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleCalibrateCamera}
                  >
                    <Camera className="h-3 w-3 mr-2" />
                    Calibrate Camera
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toast.success("AR session exported")}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => toast.success("AR view shared")}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ARPreview;