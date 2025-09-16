import { useState, useEffect, useRef } from "react";
import { Network, Search, Filter, Maximize2, Users, FileText, Building, AlertTriangle, Zap, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GraphNode {
  id: string;
  label: string;
  type: "document" | "person" | "department" | "topic";
  connections: number;
  priority?: "Low" | "Medium" | "High" | "Critical";
}

const graphNodes: GraphNode[] = [
  { id: "1", label: "Safety Protocol Station 12", type: "document", connections: 8, priority: "High" },
  { id: "2", label: "Operations Team", type: "department", connections: 12 },
  { id: "3", label: "Emergency Procedures", type: "topic", connections: 15 },
  { id: "4", label: "Chief Safety Officer", type: "person", connections: 6 },
  { id: "5", label: "Maintenance Schedule Q1", type: "document", connections: 5, priority: "Medium" },
  { id: "6", label: "CMRS Compliance", type: "document", connections: 9, priority: "Critical" },
  { id: "7", label: "Technical Services", type: "department", connections: 11 },
  { id: "8", label: "Rolling Stock Manager", type: "person", connections: 7 },
  { id: "9", label: "Platform Safety", type: "topic", connections: 13 },
  { id: "10", label: "Training Manual", type: "document", connections: 4, priority: "Medium" },
  { id: "11", label: "Quality Assurance", type: "department", connections: 8 },
  { id: "12", label: "Station Manager", type: "person", connections: 10 }
];

const KnowledgeGraphImproved = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [animationStep, setAnimationStep] = useState(0);
  const [showConnections, setShowConnections] = useState(true);
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
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Knowledge Graph</h1>
          <p className="text-lg text-muted-foreground">
            Discover hidden connections between documents, people, and processes
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Maximize2 className="h-4 w-4 mr-2" />
          Full Screen
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
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
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Network className="h-5 w-5" />
                Interactive Network View
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowConnections(!showConnections)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {showConnections ? "Hide" : "Show"} Links
                </Button>
              </div>

              <div className="relative h-full bg-gradient-to-br from-muted/10 to-muted/30 rounded-lg overflow-hidden">
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
                      <line x1={nodePositions["1"].x + 50} y1={nodePositions["1"].y + 30} x2={nodePositions["2"].x + 50} y2={nodePositions["2"].y + 30} stroke={hoveredNode === "1" || hoveredNode === "2" ? "#ef4444" : "#3b82f6"} strokeWidth={hoveredNode === "1" || hoveredNode === "2" ? "3" : "2"} markerEnd={hoveredNode === "1" || hoveredNode === "2" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.7" strokeDasharray="5,5" strokeDashoffset={`-${animationStep}`} />
                      <line x1={nodePositions["1"].x + 50} y1={nodePositions["1"].y + 30} x2={nodePositions["9"].x + 50} y2={nodePositions["9"].y + 30} stroke={hoveredNode === "1" || hoveredNode === "9" ? "#ef4444" : "#10b981"} strokeWidth={hoveredNode === "1" || hoveredNode === "9" ? "3" : "2"} markerEnd={hoveredNode === "1" || hoveredNode === "9" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.7" strokeDasharray="5,5" strokeDashoffset={`-${animationStep}`} />
                      <line x1={nodePositions["1"].x + 50} y1={nodePositions["1"].y + 30} x2={nodePositions["12"].x + 50} y2={nodePositions["12"].y + 30} stroke={hoveredNode === "1" || hoveredNode === "12" ? "#ef4444" : "#f59e0b"} strokeWidth={hoveredNode === "1" || hoveredNode === "12" ? "3" : "2"} markerEnd={hoveredNode === "1" || hoveredNode === "12" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.6" strokeDasharray="3,7" strokeDashoffset={`-${animationStep * 0.8}`} />
                      <line x1={nodePositions["2"].x + 50} y1={nodePositions["2"].y + 30} x2={nodePositions["4"].x + 50} y2={nodePositions["4"].y + 30} stroke={hoveredNode === "2" || hoveredNode === "4" ? "#ef4444" : "#8b5cf6"} strokeWidth={hoveredNode === "2" || hoveredNode === "4" ? "3" : "2"} markerEnd={hoveredNode === "2" || hoveredNode === "4" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.8" strokeDasharray="2,3" strokeDashoffset={`-${animationStep * 1.2}`} />
                      <line x1={nodePositions["6"].x + 50} y1={nodePositions["6"].y + 30} x2={nodePositions["2"].x + 50} y2={nodePositions["2"].y + 30} stroke={hoveredNode === "6" || hoveredNode === "2" ? "#ef4444" : "#dc2626"} strokeWidth={hoveredNode === "6" || hoveredNode === "2" ? "3" : "2"} markerEnd={hoveredNode === "6" || hoveredNode === "2" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.8" strokeDasharray="6,2" strokeDashoffset={`-${animationStep * 1.5}`} />
                      <line x1={nodePositions["7"].x + 50} y1={nodePositions["7"].y + 30} x2={nodePositions["4"].x + 50} y2={nodePositions["4"].y + 30} stroke={hoveredNode === "7" || hoveredNode === "4" ? "#ef4444" : "#059669"} strokeWidth={hoveredNode === "7" || hoveredNode === "4" ? "3" : "2"} markerEnd={hoveredNode === "7" || hoveredNode === "4" ? "url(#arrowhead-active)" : "url(#arrowhead)"} opacity="0.6" strokeDasharray="7,3" strokeDashoffset={`-${animationStep * 1.1}`} />
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
                  {/* Safety Protocol - Center */}
                  <div 
                    className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg ${
                      hoveredNode === "1" ? "scale-125 shadow-2xl bg-red-500 text-white" : "hover:scale-110 bg-primary text-primary-foreground"
                    } ${
                      selectedNode?.id === "1" ? "ring-4 ring-red-400 ring-offset-2" : ""
                    }`}
                    style={{ 
                      left: `${nodePositions["1"].x}px`, 
                      top: `${nodePositions["1"].y}px`,
                      zIndex: hoveredNode === "1" ? 20 : 10
                    }}
                    onClick={() => setSelectedNode(filteredNodes[0])}
                    onMouseEnter={() => setHoveredNode("1")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => {
                      setDraggedNode("1");
                      const rect = e.currentTarget.getBoundingClientRect();
                      dragOffset.current = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      };
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-medium">Safety Protocol</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">8 connections</div>
                    <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs h-4 px-1">High</Badge>
                  </div>
                  
                  {/* Operations Team */}
                  <div 
                    className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg ${
                      hoveredNode === "2" ? "scale-125 shadow-2xl bg-red-500 text-white" : "hover:scale-110 bg-priority-medium text-white"
                    }`}
                    style={{ left: `${nodePositions["2"].x}px`, top: `${nodePositions["2"].y}px`, zIndex: hoveredNode === "2" ? 20 : 10 }}
                    onClick={() => setSelectedNode(filteredNodes[1])}
                    onMouseEnter={() => setHoveredNode("2")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => {
                      setDraggedNode("2");
                      const rect = e.currentTarget.getBoundingClientRect();
                      dragOffset.current = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      };
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="text-xs font-medium">Operations</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">12 connections</div>
                  </div>
                  
                  {/* Platform Safety */}
                  <div 
                    className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg ${
                      hoveredNode === "9" ? "scale-125 shadow-2xl bg-red-500 text-white" : "hover:scale-110 bg-priority-high text-white"
                    }`}
                    style={{ left: `${nodePositions["9"].x}px`, top: `${nodePositions["9"].y}px`, zIndex: hoveredNode === "9" ? 20 : 10 }}
                    onClick={() => setSelectedNode(filteredNodes[8])}
                    onMouseEnter={() => setHoveredNode("9")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => {
                      setDraggedNode("9");
                      const rect = e.currentTarget.getBoundingClientRect();
                      dragOffset.current = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      };
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      <span className="text-xs font-medium">Platform Safety</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">13 connections</div>
                  </div>
                  
                  {/* Chief Safety Officer */}
                  <div 
                    className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg ${
                      hoveredNode === "4" ? "scale-125 shadow-2xl bg-red-500 text-white" : "hover:scale-110 bg-priority-low text-white"
                    }`}
                    style={{ left: `${nodePositions["4"].x}px`, top: `${nodePositions["4"].y}px`, zIndex: hoveredNode === "4" ? 20 : 10 }}
                    onClick={() => setSelectedNode(filteredNodes[3])}
                    onMouseEnter={() => setHoveredNode("4")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => {
                      setDraggedNode("4");
                      const rect = e.currentTarget.getBoundingClientRect();
                      dragOffset.current = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      };
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-medium">Safety Officer</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">6 connections</div>
                  </div>
                  
                  {/* CMRS Compliance */}
                  <div 
                    className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg ${
                      hoveredNode === "6" ? "scale-125 shadow-2xl bg-red-500 text-white" : "hover:scale-110 bg-red-600 text-white"
                    }`}
                    style={{ left: `${nodePositions["6"].x}px`, top: `${nodePositions["6"].y}px`, zIndex: hoveredNode === "6" ? 20 : 10 }}
                    onClick={() => setSelectedNode(filteredNodes[5])}
                    onMouseEnter={() => setHoveredNode("6")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => {
                      setDraggedNode("6");
                      const rect = e.currentTarget.getBoundingClientRect();
                      dragOffset.current = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      };
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-medium">CMRS</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">9 connections</div>
                    <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs h-4 px-1">Critical</Badge>
                  </div>
                  
                  {/* Station Manager */}
                  <div 
                    className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg ${
                      hoveredNode === "12" ? "scale-125 shadow-2xl bg-red-500 text-white" : "hover:scale-110 bg-orange-600 text-white"
                    }`}
                    style={{ left: `${nodePositions["12"].x}px`, top: `${nodePositions["12"].y}px`, zIndex: hoveredNode === "12" ? 20 : 10 }}
                    onClick={() => setSelectedNode(filteredNodes[11])}
                    onMouseEnter={() => setHoveredNode("12")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => {
                      setDraggedNode("12");
                      const rect = e.currentTarget.getBoundingClientRect();
                      dragOffset.current = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      };
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-xs font-medium">Station Mgr</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">10 connections</div>
                  </div>
                  
                  {/* Technical Services */}
                  <div 
                    className={`absolute p-3 rounded-lg cursor-move transition-all duration-300 shadow-lg ${
                      hoveredNode === "7" ? "scale-125 shadow-2xl bg-red-500 text-white" : "hover:scale-110 bg-green-600 text-white"
                    }`}
                    style={{ left: `${nodePositions["7"].x}px`, top: `${nodePositions["7"].y}px`, zIndex: hoveredNode === "7" ? 20 : 10 }}
                    onClick={() => setSelectedNode(filteredNodes[6])}
                    onMouseEnter={() => setHoveredNode("7")}
                    onMouseLeave={() => setHoveredNode(null)}
                    onMouseDown={(e) => {
                      setDraggedNode("7");
                      const rect = e.currentTarget.getBoundingClientRect();
                      dragOffset.current = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                      };
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="text-xs font-medium">Technical</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">11 connections</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                    {selectedNode.priority && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant={selectedNode.priority === "High" ? "destructive" : "secondary"}>
                          {selectedNode.priority}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Click on a node to view details
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Graph Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Nodes:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connections:</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departments:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Personnel:</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphImproved;