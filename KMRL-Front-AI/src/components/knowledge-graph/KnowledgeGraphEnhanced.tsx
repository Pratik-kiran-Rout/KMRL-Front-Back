import { useState, useEffect, useRef } from "react";
import { Network, Search, Filter, Maximize2, Users, FileText, Building, AlertTriangle, Zap, Eye, Download, Share2, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/i18n/LanguageProvider";

interface GraphNode {
  id: string;
  label: string;
  type: "document" | "person" | "department" | "topic";
  connections: number;
  priority?: "Low" | "Medium" | "High" | "Critical";
  lastUpdated?: string;
  size?: number;
}

const graphNodes: GraphNode[] = [
  { id: "1", label: "Safety Protocol Station 12", type: "document", connections: 8, priority: "High", lastUpdated: "2 hours ago", size: 80 },
  { id: "2", label: "Operations Team", type: "department", connections: 12, lastUpdated: "1 day ago", size: 100 },
  { id: "3", label: "Emergency Procedures", type: "topic", connections: 15, lastUpdated: "3 hours ago", size: 120 },
  { id: "4", label: "Chief Safety Officer", type: "person", connections: 6, lastUpdated: "5 hours ago", size: 60 },
  { id: "5", label: "Maintenance Schedule Q1", type: "document", connections: 5, priority: "Medium", lastUpdated: "1 day ago", size: 50 },
  { id: "6", label: "CMRS Compliance", type: "document", connections: 9, priority: "Critical", lastUpdated: "30 min ago", size: 90 },
  { id: "7", label: "Technical Services", type: "department", connections: 11, lastUpdated: "2 days ago", size: 110 },
  { id: "8", label: "Rolling Stock Manager", type: "person", connections: 7, lastUpdated: "4 hours ago", size: 70 },
  { id: "9", label: "Platform Safety", type: "topic", connections: 13, lastUpdated: "1 hour ago", size: 130 },
  { id: "10", label: "Training Manual", type: "document", connections: 4, priority: "Medium", lastUpdated: "6 hours ago", size: 40 },
  { id: "11", label: "Quality Assurance", type: "department", connections: 8, lastUpdated: "3 days ago", size: 80 },
  { id: "12", label: "Station Manager", type: "person", connections: 10, lastUpdated: "2 hours ago", size: 100 }
];

const KnowledgeGraphEnhanced = () => {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [animationStep, setAnimationStep] = useState(0);
  const [showConnections, setShowConnections] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [connectionStrength, setConnectionStrength] = useState([50]);
  const [showLabels, setShowLabels] = useState(true);
  const [layoutMode, setLayoutMode] = useState("force");
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState({
    "1": { x: 220, y: 90 },
    "2": { x: 150, y: 170 },
    "9": { x: 350, y: 170 },
    "4": { x: 250, y: 270 },
    "6": { x: 80, y: 90 },
    "12": { x: 420, y: 90 },
    "7": { x: 150, y: 370 }
  });
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 100);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="h-4 w-4" />;
      case "person": return <Users className="h-4 w-4" />;
      case "department": return <Building className="h-4 w-4" />;
      case "topic": return <Network className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const filteredNodes = filterType === "all" 
    ? graphNodes 
    : graphNodes.filter(node => node.type === filterType);

  const handleExportGraph = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    if (ctx) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1e293b';
      ctx.font = '16px Arial';
      ctx.fillText('KMRL Knowledge Graph Export', 20, 30);
    }
    const link = document.createElement('a');
    link.download = 'kmrl-knowledge-graph.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShareGraph = () => {
    const shareText = `KMRL Knowledge Graph - Interactive network visualization showing connections between documents, people, and departments. View at: ${window.location.href}`;
    navigator.clipboard.writeText(shareText);
  };

  const handleResetLayout = () => {
    setNodePositions({
      "1": { x: 220, y: 90 },
      "2": { x: 150, y: 170 },
      "9": { x: 350, y: 170 },
      "4": { x: 250, y: 270 },
      "6": { x: 80, y: 90 },
      "12": { x: 420, y: 90 },
      "7": { x: 150, y: 370 }
    });
    setZoomLevel([100]);
    setConnectionStrength([50]);
    setLayoutMode("force");
  };

  const handleNodeAnalysis = (nodeId: string) => {
    const node = graphNodes.find(n => n.id === nodeId);
    setSelectedNode(node);
    setHoveredNode(nodeId);
    setTimeout(() => setHoveredNode(null), 2000);
  };

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleShortestPath = () => {
    // Highlight shortest path between two most connected nodes
    const sortedNodes = graphNodes.sort((a, b) => b.connections - a.connections);
    const node1 = sortedNodes[0];
    const node2 = sortedNodes[1];
    setSelectedNode(node1);
    setHoveredNode(node2.id);
    setTimeout(() => setHoveredNode(null), 3000);
  };

  const handleCommunityDetection = () => {
    // Group nodes by type and highlight communities
    const communities = graphNodes.reduce((acc, node) => {
      if (!acc[node.type]) acc[node.type] = [];
      acc[node.type].push(node);
      return acc;
    }, {});
    
    // Highlight largest community
    const largestCommunity = Object.values(communities).reduce((a, b) => a.length > b.length ? a : b);
    setSelectedNode(largestCommunity[0]);
  };

  const handleRiskAnalysis = () => {
    // Highlight critical priority nodes
    const criticalNodes = graphNodes.filter(node => node.priority === "Critical" || node.priority === "High");
    if (criticalNodes.length > 0) {
      setSelectedNode(criticalNodes[0]);
      setHoveredNode(criticalNodes[0].id);
      setTimeout(() => setHoveredNode(null), 3000);
    }
  };

  const handleInfluenceMapping = () => {
    // Highlight most connected node (highest influence)
    const mostInfluential = graphNodes.reduce((prev, current) => 
      prev.connections > current.connections ? prev : current
    );
    setSelectedNode(mostInfluential);
    setHoveredNode(mostInfluential.id);
    setTimeout(() => setHoveredNode(null), 3000);
  };

  const handleLayoutModeChange = (mode: string) => {
    setLayoutMode(mode);
    const newPositions = {};
    
    if (mode === "circular") {
      const centerX = 250;
      const centerY = 200;
      const radius = 150;
      const angleStep = (2 * Math.PI) / graphNodes.length;
      graphNodes.forEach((node, index) => {
        const angle = index * angleStep;
        newPositions[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
    } else if (mode === "grid") {
      const cols = Math.ceil(Math.sqrt(graphNodes.length));
      graphNodes.forEach((node, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        newPositions[node.id] = {
          x: 100 + col * 120,
          y: 100 + row * 100
        };
      });
    } else if (mode === "force") {
      graphNodes.forEach((node, index) => {
        const angle = (index / graphNodes.length) * 2 * Math.PI;
        const radius = 100 + Math.random() * 100;
        newPositions[node.id] = {
          x: 250 + radius * Math.cos(angle) + (Math.random() - 0.5) * 50,
          y: 200 + radius * Math.sin(angle) + (Math.random() - 0.5) * 50
        };
      });
    } else if (mode === "hierarchical") {
      const nodesByType = graphNodes.reduce((acc, node) => {
        if (!acc[node.type]) acc[node.type] = [];
        acc[node.type].push(node.id);
        return acc;
      }, {});
      
      let yOffset = 80;
      Object.values(nodesByType).forEach((typeNodes) => {
        const xSpacing = 400 / (typeNodes.length + 1);
        typeNodes.forEach((id, index) => {
          newPositions[id] = {
            x: 50 + (index + 1) * xSpacing,
            y: yOffset
          };
        });
        yOffset += 120;
      });
    }
    
    setNodePositions(newPositions);
  };

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value);
  };

  const handleConnectionStrengthChange = (value: number[]) => {
    setConnectionStrength(value);
  };

  const handleShowLabelsChange = (checked: boolean) => {
    setShowLabels(checked);
  };

  const handleShowConnectionsChange = (checked: boolean) => {
    setShowConnections(checked);
  };

  const handleViewDetails = () => {
    if (selectedNode) {
      // Simulate opening detailed view by highlighting connected nodes
      const connectedNodeIds = Object.keys(nodePositions).filter(id => id !== selectedNode.id).slice(0, 3);
      connectedNodeIds.forEach((id, index) => {
        setTimeout(() => {
          setHoveredNode(id);
          setTimeout(() => setHoveredNode(null), 1000);
        }, index * 500);
      });
    }
  };

  const handleAnalyzeNode = () => {
    if (selectedNode) {
      // Highlight node and show analysis by pulsing effect
      setHoveredNode(selectedNode.id);
      setTimeout(() => setHoveredNode(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t('knowledge_graph_title')}</h1>
          <p className="text-lg text-muted-foreground">
            Discover hidden connections between documents, people, and processes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportGraph}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareGraph}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullScreen}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
        </div>
      </div>

      {/* Enhanced Controls */}
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search & Filter</TabsTrigger>
              <TabsTrigger value="layout">Layout Controls</TabsTrigger>
              <TabsTrigger value="analysis">Analysis Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search nodes and connections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="person">People</SelectItem>
                    <SelectItem value="department">Departments</SelectItem>
                    <SelectItem value="topic">Topics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Zoom Level</label>
                  <Slider
                    value={zoomLevel}
                    onValueChange={handleZoomChange}
                    max={200}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{zoomLevel[0]}%</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Connection Strength</label>
                  <Slider
                    value={connectionStrength}
                    onValueChange={handleConnectionStrengthChange}
                    max={100}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{connectionStrength[0]}%</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Layout Mode</label>
                  <Select value={layoutMode} onValueChange={handleLayoutModeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="force">Force Directed</SelectItem>
                      <SelectItem value="circular">Circular</SelectItem>
                      <SelectItem value="hierarchical">Hierarchical</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Options</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch checked={showLabels} onCheckedChange={handleShowLabelsChange} />
                      <span className="text-xs">Show Labels</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={showConnections} onCheckedChange={handleShowConnectionsChange} />
                      <span className="text-xs">Show Links</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={handleShortestPath}>
                  <Zap className="h-4 w-4 mr-2" />
                  Find Shortest Path
                </Button>
                <Button size="sm" variant="outline" onClick={handleCommunityDetection}>
                  <Network className="h-4 w-4 mr-2" />
                  Detect Communities
                </Button>
                <Button size="sm" variant="outline" onClick={handleRiskAnalysis}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Risk Analysis
                </Button>
                <Button size="sm" variant="outline" onClick={handleInfluenceMapping}>
                  <Users className="h-4 w-4 mr-2" />
                  Influence Mapping
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Interactive Network View
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAnimating(!isAnimating)}
                  >
                    {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResetLayout}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="relative h-full bg-gradient-to-br from-muted/10 to-muted/30 rounded-lg overflow-hidden"
                   style={{ transform: `scale(${zoomLevel[0] / 100})`, transformOrigin: 'center' }}>
                <svg className="w-full h-full">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                    <marker id="arrowhead-active" markerWidth="12" markerHeight="9" 
                            refX="10" refY="4.5" orient="auto">
                      <polygon points="0 0, 12 4.5, 0 9" fill="#ef4444" />
                    </marker>
                  </defs>
                  
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {showConnections && (
                    <g>
                      <line x1={nodePositions["1"].x + 50} y1={nodePositions["1"].y + 30} x2={nodePositions["2"].x + 50} y2={nodePositions["2"].y + 30} stroke={hoveredNode === "1" || hoveredNode === "2" ? "#ef4444" : "#3b82f6"} strokeWidth={hoveredNode === "1" || hoveredNode === "2" ? "3" : `${connectionStrength[0] / 25}`} markerEnd={hoveredNode === "1" || hoveredNode === "2" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.7" strokeDasharray="5,5" strokeDashoffset={`-${animationStep}`} />
                      <line x1={nodePositions["1"].x + 50} y1={nodePositions["1"].y + 30} x2={nodePositions["9"].x + 50} y2={nodePositions["9"].y + 30} stroke={hoveredNode === "1" || hoveredNode === "9" ? "#ef4444" : "#10b981"} strokeWidth={hoveredNode === "1" || hoveredNode === "9" ? "3" : `${connectionStrength[0] / 25}`} markerEnd={hoveredNode === "1" || hoveredNode === "9" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.7" strokeDasharray="5,5" strokeDashoffset={`-${animationStep}`} />
                      <line x1={nodePositions["1"].x + 50} y1={nodePositions["1"].y + 30} x2={nodePositions["12"].x + 50} y2={nodePositions["12"].y + 30} stroke={hoveredNode === "1" || hoveredNode === "12" ? "#ef4444" : "#f59e0b"} strokeWidth={hoveredNode === "1" || hoveredNode === "12" ? "3" : `${connectionStrength[0] / 25}`} markerEnd={hoveredNode === "1" || hoveredNode === "12" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.6" strokeDasharray="3,7" strokeDashoffset={`-${animationStep * 0.8}`} />
                      <line x1={nodePositions["2"].x + 50} y1={nodePositions["2"].y + 30} x2={nodePositions["4"].x + 50} y2={nodePositions["4"].y + 30} stroke={hoveredNode === "2" || hoveredNode === "4" ? "#ef4444" : "#8b5cf6"} strokeWidth={hoveredNode === "2" || hoveredNode === "4" ? "3" : `${connectionStrength[0] / 25}`} markerEnd={hoveredNode === "2" || hoveredNode === "4" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.8" strokeDasharray="2,3" strokeDashoffset={`-${animationStep * 1.2}`} />
                      <line x1={nodePositions["6"].x + 50} y1={nodePositions["6"].y + 30} x2={nodePositions["2"].x + 50} y2={nodePositions["2"].y + 30} stroke={hoveredNode === "6" || hoveredNode === "2" ? "#ef4444" : "#dc2626"} strokeWidth={hoveredNode === "6" || hoveredNode === "2" ? "3" : `${connectionStrength[0] / 25}`} markerEnd={hoveredNode === "6" || hoveredNode === "2" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.8" strokeDasharray="6,2" strokeDashoffset={`-${animationStep * 1.5}`} />
                      <line x1={nodePositions["7"].x + 50} y1={nodePositions["7"].y + 30} x2={nodePositions["4"].x + 50} y2={nodePositions["4"].y + 30} stroke={hoveredNode === "7" || hoveredNode === "4" ? "#ef4444" : "#059669"} strokeWidth={hoveredNode === "7" || hoveredNode === "4" ? "3" : `${connectionStrength[0] / 25}`} markerEnd={hoveredNode === "7" || hoveredNode === "4" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.6" strokeDasharray="7,3" strokeDashoffset={`-${animationStep * 1.1}`} />
                    </g>
                  )}
                </svg>
                
                <div 
                  className="absolute inset-0"
                  onMouseMove={(e) => {
                    if (draggedNode) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left - dragOffset.current.x;
                      const y = e.clientY - rect.top - dragOffset.current.y;
                      setNodePositions(prev => ({
                        ...prev,
                        [draggedNode]: { x: Math.max(0, Math.min(x, rect.width - 100)), y: Math.max(0, Math.min(y, rect.height - 60)) }
                      }));
                    }
                  }}
                  onMouseUp={() => setDraggedNode(null)}
                  onMouseLeave={() => setDraggedNode(null)}
                >
                  {/* Enhanced Nodes with more interactive features */}
                  {graphNodes.filter(node => nodePositions[node.id]).map((node) => {
                    const position = nodePositions[node.id];
                    if (!position) return null;
                    
                    return (
                      <div
                        key={node.id}
                        className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg text-white ${
                          hoveredNode === node.id ? "scale-125 shadow-2xl bg-red-500" : 
                          node.priority === "Critical" ? "hover:scale-110 bg-red-600" :
                          node.priority === "High" ? "hover:scale-110 bg-orange-500" :
                          node.type === "department" ? "hover:scale-110 bg-blue-500" :
                          node.type === "person" ? "hover:scale-110 bg-green-500" :
                          "hover:scale-110 bg-gray-500"
                        } ${
                          selectedNode?.id === node.id ? "ring-4 ring-white ring-offset-2" : ""
                        }`}
                        style={{ 
                          left: `${position.x}px`, 
                          top: `${position.y}px`,
                          zIndex: hoveredNode === node.id ? 20 : 10
                        }}
                        onClick={() => {
                          setSelectedNode(node);
                          handleNodeAnalysis(node.id);
                        }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onMouseDown={(e) => {
                          setDraggedNode(node.id);
                          const rect = e.currentTarget.getBoundingClientRect();
                          dragOffset.current = {
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                          };
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {getNodeIcon(node.type)}
                          {showLabels && (
                            <span className="text-xs font-medium truncate max-w-20">
                              {node.label.split(' ').slice(0, 2).join(' ')}
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          <div>{node.connections} connections</div>
                          {node.priority && (
                            <div className="text-xs font-bold mt-1">{node.priority} Priority</div>
                          )}
                        </div>
                        {node.priority && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs h-4 px-1">
                            {node.priority}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Node Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getNodeIcon(selectedNode.type)}
                    <span className="font-medium">{selectedNode.label}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{selectedNode.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connections:</span>
                      <span className="font-medium">{selectedNode.connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{selectedNode.lastUpdated}</span>
                    </div>
                    {selectedNode.priority && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant={selectedNode.priority === "High" || selectedNode.priority === "Critical" ? "destructive" : "secondary"}>
                          {selectedNode.priority}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={handleViewDetails}>
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1" onClick={handleAnalyzeNode}>
                      Analyze
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a node to view details and analysis
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Connection Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-priority-high/10 rounded-lg border border-priority-high/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-3 w-3 text-priority-high" />
                    <span className="text-xs font-medium">Critical Path</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Safety protocols are highly connected to operations team
                  </p>
                </div>
                
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Network className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium">Hub Detection</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Platform Safety is a central topic with 13 connections
                  </p>
                </div>

                <div className="p-3 bg-priority-medium/10 rounded-lg border border-priority-medium/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-3 w-3 text-priority-medium" />
                    <span className="text-xs font-medium">Bottleneck Alert</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Chief Safety Officer is a potential single point of failure
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Color Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span>Critical Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Departments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>People</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span>Other Items</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{graphNodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents:</span>
                  <span className="font-medium">{graphNodes.filter(n => n.type === "document").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">People:</span>
                  <span className="font-medium">{graphNodes.filter(n => n.type === "person").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departments:</span>
                  <span className="font-medium">{graphNodes.filter(n => n.type === "department").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Critical Items:</span>
                  <span className="font-medium text-red-600">{graphNodes.filter(n => n.priority === "Critical").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Connections:</span>
                  <span className="font-medium">{graphNodes.reduce((sum, n) => sum + n.connections, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphEnhanced;