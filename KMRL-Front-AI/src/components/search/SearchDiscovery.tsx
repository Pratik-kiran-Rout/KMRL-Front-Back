import { useState } from "react";
import { Search, Filter, Calendar, FileText, Clock, MapPin, Users, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/i18n/LanguageProvider";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  department: string;
  summary: string;
  relevanceScore: number;
  lastModified: string;
  tags: string[];
  priority: "Low" | "Medium" | "High" | "Critical";
}

const sampleResults: SearchResult[] = [
  {
    id: "1",
    title: "Safety Protocol Update - Station 12",
    type: "Safety Notice",
    department: "Operations & Safety",
    summary: "Updated safety protocols for platform operations including 2-meter distance requirements and emergency procedures.",
    relevanceScore: 98,
    lastModified: "2024-12-15",
    tags: ["safety", "platform", "emergency", "station-12"],
    priority: "High"
  },
  {
    id: "2", 
    title: "Maintenance Schedule Q1 2025",
    type: "Maintenance Report",
    department: "Technical Services",
    summary: "Quarterly maintenance schedule for rolling stock and infrastructure systems.",
    relevanceScore: 87,
    lastModified: "2024-12-14",
    tags: ["maintenance", "schedule", "rolling-stock"],
    priority: "Medium"
  },
  {
    id: "3",
    title: "CMRS Compliance Audit Report",
    type: "Compliance Report", 
    department: "Quality Assurance",
    summary: "Annual CMRS compliance audit findings with 94.2% overall compliance score.",
    relevanceScore: 82,
    lastModified: "2024-12-13",
    tags: ["compliance", "audit", "cmrs", "quality"],
    priority: "High"
  }
];

const SearchDiscovery = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [results, setResults] = useState<SearchResult[]>(sampleResults);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "outline";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">{t("search")}</h1>
        <p className="text-lg text-muted-foreground">
          Semantic search across all documents with AI-powered insights
        </p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Search className="h-5 w-5" />
            Intelligent Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by meaning, not just keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="w-full sm:w-auto">
              {isSearching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="safety">Safety Notices</SelectItem>
                <SelectItem value="maintenance">Maintenance Reports</SelectItem>
                <SelectItem value="compliance">Compliance Reports</SelectItem>
                <SelectItem value="training">Training Materials</SelectItem>
                <SelectItem value="operational">Operational Procedures</SelectItem>
                <SelectItem value="emergency">Emergency Protocols</SelectItem>
                <SelectItem value="audit">Audit Reports</SelectItem>
                <SelectItem value="policy">Policy Documents</SelectItem>
                <SelectItem value="technical">Technical Specifications</SelectItem>
                <SelectItem value="procurement">Procurement Documents</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="operations">Operations & Safety</SelectItem>
                <SelectItem value="technical">Technical Services</SelectItem>
                <SelectItem value="quality">Quality Assurance</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="finance">Finance & Accounts</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="admin">Administration</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="environment">Environment & Sustainability</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick searches:</p>
            <div className="flex flex-wrap gap-2">
              {["safety protocols", "maintenance schedules", "compliance reports", "emergency procedures", "training materials"].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">
              Search Results ({results.length})
            </h3>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary hover:underline">
                        {result.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm text-muted-foreground mt-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs sm:text-sm">{result.type}</span>
                        <span className="hidden sm:inline">•</span>
                        <Users className="h-3 w-3" />
                        <span className="text-xs sm:text-sm">{result.department}</span>
                        <span className="hidden sm:inline">•</span>
                        <Clock className="h-3 w-3" />
                        <span className="text-xs sm:text-sm">{result.lastModified}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={getPriorityColor(result.priority)} className={result.priority === "Medium" ? "border-orange-500 text-orange-600 bg-orange-50" : ""}>
                        {result.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.relevanceScore}% match
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.summary}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      View Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Insights Sidebar */}
        <div className="space-y-4 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Search Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Documents</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Indexed Today</span>
                  <span className="font-medium text-primary">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Search Time</span>
                  <span className="font-medium">0.12s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Platform Safety", "Emergency Response", "Maintenance Protocols", "Compliance Standards"].map((topic) => (
                  <Button
                    key={topic}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-primary">Recent Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {["safety protocols station 12", "maintenance schedule Q1", "compliance audit findings"].map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-muted-foreground"
                    onClick={() => setSearchQuery(search)}
                  >
                    <Clock className="h-3 w-3 mr-2" />
                    {search}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SearchDiscovery;