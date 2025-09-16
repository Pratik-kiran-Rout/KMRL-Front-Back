import { useState, useEffect } from "react";
import { Wifi, Thermometer, Zap, AlertTriangle, Activity, Radio, MapPin, Settings, Flame, Droplets, History, Save } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface IoTDevice {
  id: string;
  name: string;
  type: "sensor" | "camera" | "controller" | "gateway";
  location: string;
  status: "online" | "offline" | "warning" | "critical";
  lastSeen: string;
  battery?: number;
  signal: number;
  data: any;
}

interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  vibration: number;
  noise: number;
}

const iotDevices: IoTDevice[] = [
  {
    id: "1",
    name: "Platform Temperature Sensor",
    type: "sensor",
    location: "Station 12 - Platform A",
    status: "online",
    lastSeen: "2024-12-15 14:30:25",
    battery: 87,
    signal: 95,
    data: { temperature: 24.5, humidity: 65 }
  },
  {
    id: "2",
    name: "Track Vibration Monitor",
    type: "sensor", 
    location: "Track Section 5",
    status: "warning",
    lastSeen: "2024-12-15 14:29:45",
    battery: 23,
    signal: 78,
    data: { vibration: 8.2, threshold: 7.0 }
  },
  {
    id: "3",
    name: "Security Camera Hub",
    type: "camera",
    location: "Station 12 - Entrance",
    status: "online",
    lastSeen: "2024-12-15 14:30:30",
    signal: 92,
    data: { recording: true, motion_detected: false }
  },
  {
    id: "4",
    name: "Environmental Controller",
    type: "controller",
    location: "Station 12 - Control Room",
    status: "critical",
    lastSeen: "2024-12-15 13:45:12",
    signal: 45,
    data: { hvac_status: "fault", backup_power: true }
  },
  {
    id: "5",
    name: "Smoke/Fire Detection System",
    type: "sensor",
    location: "Train Coach A1 - Compartment 3",
    status: "online",
    lastSeen: "2024-12-15 14:30:45",
    battery: 92,
    signal: 88,
    data: { smoke_level: 0.02, fire_detected: false, temperature: 26.3, air_quality: "good" }
  },
  {
    id: "6",
    name: "Water Level Monitor",
    type: "sensor",
    location: "Kochi Canal - Bridge Section",
    status: "warning",
    lastSeen: "2024-12-15 14:31:12",
    battery: 76,
    signal: 82,
    data: { water_level: 2.8, flow_rate: 1.2, flood_risk: "medium", low_water_alert: false }
  },
  {
    id: "7",
    name: "Fire Safety Sensor - Station",
    type: "sensor",
    location: "Station 8 - Waiting Area",
    status: "online",
    lastSeen: "2024-12-15 14:30:55",
    battery: 84,
    signal: 94,
    data: { smoke_density: 0.01, heat_index: 28.5, fire_risk: "low", evacuation_ready: true }
  },
  {
    id: "8",
    name: "Water Flow Sensor - Vessel Route",
    type: "sensor",
    location: "Backwater Channel - Route 2",
    status: "online",
    lastSeen: "2024-12-15 14:31:05",
    battery: 89,
    signal: 79,
    data: { current_depth: 4.2, flow_velocity: 0.8, navigation_safe: true, tide_level: "normal" }
  }
];

const sensorData: SensorReading[] = [
  { timestamp: "14:00", temperature: 23.2, humidity: 62, vibration: 6.8, noise: 45 },
  { timestamp: "14:05", temperature: 23.8, humidity: 64, vibration: 7.1, noise: 47 },
  { timestamp: "14:10", temperature: 24.1, humidity: 65, vibration: 7.5, noise: 48 },
  { timestamp: "14:15", temperature: 24.5, humidity: 65, vibration: 8.2, noise: 52 },
  { timestamp: "14:20", temperature: 24.3, humidity: 63, vibration: 7.8, noise: 49 },
  { timestamp: "14:25", temperature: 24.0, humidity: 62, vibration: 7.2, noise: 46 },
  { timestamp: "14:30", temperature: 23.9, humidity: 61, vibration: 6.9, noise: 44 }
];

const IoTDashboard = () => {
  const { t } = useLanguage();
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [realTimeData, setRealTimeData] = useState(sensorData);
  const [showConfig, setShowConfig] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [config, setConfig] = useState({
    alertThreshold: 3.0,
    samplingRate: 30,
    calibrationOffset: 0.1,
    maintenanceInterval: 7
  });

  const handleConfigure = () => {
    setShowConfig(true);
  };

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  const handleSaveConfig = () => {
    setShowConfig(false);
    toast.success("Configuration saved successfully");
  };

  const historicalData = [
    { time: "14:00", depth: 4.1, velocity: 0.7, safe: true },
    { time: "13:30", depth: 4.0, velocity: 0.8, safe: true },
    { time: "13:00", depth: 3.9, velocity: 0.9, safe: true },
    { time: "12:30", depth: 4.3, velocity: 0.6, safe: true },
    { time: "12:00", depth: 4.2, velocity: 0.8, safe: true },
    { time: "11:30", depth: 4.1, velocity: 0.7, safe: true },
    { time: "11:00", depth: 3.8, velocity: 1.0, safe: false }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newReading = {
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
          temperature: 23 + Math.random() * 3,
          humidity: 60 + Math.random() * 10,
          vibration: 6 + Math.random() * 3,
          noise: 40 + Math.random() * 15
        };
        return [...prev.slice(1), newReading];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getDeviceIcon = (type: string, name?: string) => {
    if (name?.toLowerCase().includes('smoke') || name?.toLowerCase().includes('fire')) {
      return <Flame className="h-4 w-4 text-red-500" />;
    }
    if (name?.toLowerCase().includes('water')) {
      return <Droplets className="h-4 w-4 text-blue-500" />;
    }
    switch (type) {
      case "sensor": return <Thermometer className="h-4 w-4 text-blue-500" />;
      case "camera": return <Activity className="h-4 w-4 text-purple-500" />;
      case "controller": return <Settings className="h-4 w-4 text-gray-600" />;
      case "gateway": return <Radio className="h-4 w-4 text-green-500" />;
      default: return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const onlineDevices = iotDevices.filter(d => d.status === "online").length;
  const criticalAlerts = iotDevices.filter(d => d.status === "critical" || d.status === "warning").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("iot_title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("iot_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Radio className="h-4 w-4 mr-2" />
            Network Config
          </Button>
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* IoT Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{iotDevices.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{t("total_devices")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{onlineDevices}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{t("online")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{t("alerts")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">98.5%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{t("uptime")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Device List */}
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Wifi className="h-4 w-4 sm:h-5 sm:w-5" />
              {t("connected_devices")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {iotDevices.map((device) => (
                <div 
                  key={device.id}
                  className={`p-2 sm:p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedDevice?.id === device.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(device.status)}`} />
                      <div className="p-1 sm:p-2 bg-muted rounded flex-shrink-0">
                        {getDeviceIcon(device.type, device.name)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm truncate">{device.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{device.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <Badge variant={device.status === "online" ? "default" : 
                                   device.status === "warning" ? "secondary" : "destructive"}
                             className={`text-xs ${
                               device.status === "warning" && device.name?.toLowerCase().includes('water') 
                                 ? "bg-orange-500 text-white hover:bg-orange-600" 
                                 : ""
                             }`}>
                        {device.status.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Signal: {device.signal}%
                      </div>
                    </div>
                  </div>
                  
                  {device.battery && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Battery</span>
                        <span>{device.battery}%</span>
                      </div>
                      <Progress value={device.battery} className="h-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Sensor Data */}
        <Card className="order-1 lg:order-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              Real-time Sensor Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} name="Temperature (°C)" />
                <Line type="monotone" dataKey="vibration" stroke="#ef4444" strokeWidth={2} name="Vibration (mm/s)" />
                <Line type="monotone" dataKey="noise" stroke="#10b981" strokeWidth={2} name="Noise (dB)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Details */}
      {selectedDevice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getDeviceIcon(selectedDevice.type, selectedDevice.name)}
              Device Details - {selectedDevice.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Device Information</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{selectedDevice.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="truncate ml-2">{selectedDevice.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span className="text-xs">{selectedDevice.lastSeen}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Signal Strength:</span>
                      <span>{selectedDevice.signal}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Current Readings</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedDevice.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground capitalize">
                          {key.replace('_', ' ')}:
                        </span>
                        <span className={`font-medium ${
                          (key === 'fire_detected' && value === true) || 
                          (key === 'flood_risk' && value === 'high') ||
                          (key === 'smoke_level' && value > 0.1) ? 'text-red-600' :
                          (key === 'water_level' && value < 2.0) ||
                          (key === 'low_water_alert' && value === true) ? 'text-orange-600' :
                          (key === 'navigation_safe' && value === true) ||
                          (key === 'air_quality' && value === 'good') ? 'text-green-600' : ''
                        }`}>
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                          {key === 'temperature' && '°C'}
                          {key === 'humidity' && '%'}
                          {key === 'vibration' && ' mm/s'}
                          {key === 'smoke_level' && ' ppm'}
                          {key === 'water_level' && ' m'}
                          {key === 'flow_rate' && ' m/s'}
                          {key === 'current_depth' && ' m'}
                          {key === 'flow_velocity' && ' m/s'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Dialog open={showConfig} onOpenChange={setShowConfig}>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full sm:w-auto" onClick={handleConfigure}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Device Configuration - {selectedDevice.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="threshold">Alert Threshold (meters)</Label>
                      <Input
                        id="threshold"
                        type="number"
                        step="0.1"
                        value={config.alertThreshold}
                        onChange={(e) => setConfig(prev => ({ ...prev, alertThreshold: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sampling">Sampling Rate (seconds)</Label>
                      <Input
                        id="sampling"
                        type="number"
                        value={config.samplingRate}
                        onChange={(e) => setConfig(prev => ({ ...prev, samplingRate: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="offset">Calibration Offset</Label>
                      <Input
                        id="offset"
                        type="number"
                        step="0.01"
                        value={config.calibrationOffset}
                        onChange={(e) => setConfig(prev => ({ ...prev, calibrationOffset: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maintenance">Maintenance Interval (days)</Label>
                      <Input
                        id="maintenance"
                        type="number"
                        value={config.maintenanceInterval}
                        onChange={(e) => setConfig(prev => ({ ...prev, maintenanceInterval: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveConfig} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Configuration
                      </Button>
                      <Button variant="outline" onClick={() => setShowConfig(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleViewHistory}>
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Historical Data - {selectedDevice.name}</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="readings" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="readings">Recent Readings</TabsTrigger>
                      <TabsTrigger value="alerts">Alert History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="readings" className="space-y-4">
                      <div className="max-h-96 overflow-y-auto">
                        <div className="space-y-2">
                          {historicalData.map((reading, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  reading.safe ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <div>
                                  <div className="font-medium text-sm">{reading.time}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Depth: {reading.depth}m | Velocity: {reading.velocity}m/s
                                  </div>
                                </div>
                              </div>
                              <div className={`text-xs font-medium ${
                                reading.safe ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {reading.safe ? 'SAFE' : 'ALERT'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="alerts" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/50">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <div>
                              <div className="font-medium text-sm">Low Water Alert</div>
                              <div className="text-xs text-muted-foreground">11:00 - Water depth below safe threshold</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-red-600">CRITICAL</div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/50">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <div>
                              <div className="font-medium text-sm">High Flow Velocity</div>
                              <div className="text-xs text-muted-foreground">10:30 - Flow velocity exceeded normal range</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-yellow-600">WARNING</div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
                          <div className="flex items-center gap-3">
                            <Activity className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="font-medium text-sm">Calibration Complete</div>
                              <div className="text-xs text-muted-foreground">09:15 - Sensor recalibrated successfully</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-blue-600">INFO</div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => toast.success("History exported to CSV")} className="flex-1">
                      Export Data
                    </Button>
                    <Button variant="outline" onClick={() => setShowHistory(false)}>
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {selectedDevice.status !== "online" && (
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Troubleshoot
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IoTDashboard;