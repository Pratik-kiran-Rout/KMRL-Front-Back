import { useState } from "react";
import { BookOpen, Award, Clock, Users, Play, CheckCircle, Star, Target, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "expired";
  points: number;
  dueDate?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

const trainingModules: TrainingModule[] = [
  {
    id: "1",
    title: "Platform Safety Protocols",
    category: "Safety",
    duration: "45 min",
    difficulty: "Intermediate",
    progress: 100,
    status: "completed",
    points: 150,
    dueDate: "2025-03-15"
  },
  {
    id: "2",
    title: "Emergency Response Procedures",
    category: "Safety",
    duration: "60 min", 
    difficulty: "Advanced",
    progress: 75,
    status: "in_progress",
    points: 200,
    dueDate: "2025-01-20"
  },
  {
    id: "3",
    title: "CMRS Compliance Standards",
    category: "Compliance",
    duration: "30 min",
    difficulty: "Beginner",
    progress: 0,
    status: "not_started",
    points: 100,
    dueDate: "2025-02-10"
  },
  {
    id: "4",
    title: "Rolling Stock Maintenance",
    category: "Technical",
    duration: "90 min",
    difficulty: "Advanced",
    progress: 40,
    status: "in_progress",
    points: 250
  }
];

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Safety Champion",
    description: "Completed all safety training modules",
    icon: "🛡️",
    earned: true,
    earnedDate: "2024-12-10"
  },
  {
    id: "2",
    title: "Quick Learner",
    description: "Completed 5 modules in one week",
    icon: "⚡",
    earned: true,
    earnedDate: "2024-11-25"
  },
  {
    id: "3",
    title: "Compliance Expert",
    description: "Master all compliance modules",
    icon: "📋",
    earned: false
  },
  {
    id: "4",
    title: "Team Leader",
    description: "Help 10 colleagues complete training",
    icon: "👥",
    earned: false
  }
];

const TrainingCenter = () => {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("modules");
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [modules, setModules] = useState(trainingModules);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [goals, setGoals] = useState({
    monthlyTarget: 3,
    focusArea: "Safety",
    deadline: "2025-03-31",
    notes: ""
  });

  const handleStartModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      if (module.status === "completed") {
        toast.success(`Reviewing: ${module.title}`);
      } else {
        setModules(prev => prev.map(m => 
          m.id === moduleId 
            ? { ...m, status: "in_progress" as const, progress: Math.max(m.progress, 10) }
            : m
        ));
        toast.success(`Started: ${module.title}`);
      }
    }
  };

  const handleSetGoals = () => {
    setShowGoalsDialog(true);
  };

  const handleSaveGoals = () => {
    setShowGoalsDialog(false);
    toast.success("Goals saved successfully!");
  };

  const handleViewCertificate = () => {
    setShowCertificate(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-blue-600";
      case "not_started": return "text-gray-600";
      case "expired": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalPoints = trainingModules.reduce((acc, module) => 
    module.status === "completed" ? acc + module.points : acc, 0
  );

  const completedModules = trainingModules.filter(m => m.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("training_center")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("training_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleSetGoals}>
                <Target className="h-4 w-4 mr-2" />
                Set Goals
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Set Learning Goals</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="target">Monthly Target (modules)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={goals.monthlyTarget}
                    onChange={(e) => setGoals(prev => ({ ...prev, monthlyTarget: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="focus">Focus Area</Label>
                  <Input
                    id="focus"
                    value={goals.focusArea}
                    onChange={(e) => setGoals(prev => ({ ...prev, focusArea: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Target Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={goals.deadline}
                    onChange={(e) => setGoals(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or motivation..."
                    value={goals.notes}
                    onChange={(e) => setGoals(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveGoals} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Goals
                  </Button>
                  <Button variant="outline" onClick={() => setShowGoalsDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={handleViewCertificate}>
                <Award className="h-4 w-4 mr-2" />
                View Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Training Certificate</DialogTitle>
              </DialogHeader>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg border-2 border-primary/20">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🏆</div>
                  <h2 className="text-2xl font-bold text-primary">Certificate of Completion</h2>
                  <div className="text-lg">This certifies that</div>
                  <div className="text-2xl font-bold">John Doe</div>
                  <div className="text-lg">has successfully completed</div>
                  <div className="text-xl font-semibold text-primary">KMRL Safety Training Program</div>
                  <div className="flex justify-between items-center pt-8">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Completion Date</div>
                      <div className="font-semibold">December 15, 2024</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Score</div>
                      <div className="font-semibold">92%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Certificate ID</div>
                      <div className="font-semibold">KMRL-2024-001</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => toast.success("Certificate downloaded as PDF")} className="flex-1">
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => toast.success("Certificate link copied to clipboard")}>
                  Share Link
                </Button>
                <Button variant="outline" onClick={() => setShowCertificate(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{completedModules}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Modules Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{totalPoints}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Points Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {achievements.filter(a => a.earned).length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Achievements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">92%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="modules" className="text-xs sm:text-sm">Training Modules</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs sm:text-sm">My Progress</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs sm:text-sm">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-xs sm:text-sm">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4">
            {modules.map((module) => (
              <Card 
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedModule?.id === module.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedModule(module)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base truncate">{module.title}</h4>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          <span>{module.category}</span>
                          <span className="hidden sm:inline">•</span>
                          <Clock className="h-3 w-3" />
                          <span>{module.duration}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className={getDifficultyColor(module.difficulty) + " px-2 py-1 rounded-full text-xs"}>
                            {module.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                      <div className="text-center sm:text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                          <span className="font-medium text-sm">{module.points}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <div className={`font-medium text-sm ${getStatusColor(module.status)}`}>
                          {module.progress}%
                        </div>
                        <Progress value={module.progress} className="w-12 sm:w-16 h-2 mt-1" />
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant={module.status === "completed" ? "outline" : "default"}
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartModule(module.id);
                        }}
                      >
                        {module.status === "completed" ? (
                          <>
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {module.status === "not_started" ? "Start" : "Continue"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {module.dueDate && (
                    <div className="mt-3 text-xs text-muted-foreground">
                      Due: {module.dueDate}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Safety Certification", "Technical Mastery", "Compliance Expert"].map((path, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{path}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 40) + 60}%
                      </span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 40) + 60} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={achievement.earned ? "bg-primary/5 border-primary/20" : ""}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl flex-shrink-0">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <span className="truncate">{achievement.title}</span>
                        {achievement.earned && (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {achievement.earnedDate && (
                        <p className="text-xs text-green-600 mt-1">
                          Earned on {achievement.earnedDate}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Department Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Operations Team", points: 2450, members: 12 },
                  { rank: 2, name: "Technical Services", points: 2280, members: 15 },
                  { rank: 3, name: "Safety Department", points: 2150, members: 8 },
                  { rank: 4, name: "Quality Assurance", points: 1980, members: 6 }
                ].map((team) => (
                  <div key={team.rank} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      team.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                      team.rank === 2 ? "bg-gray-100 text-gray-800" :
                      team.rank === 3 ? "bg-orange-100 text-orange-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {team.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {team.members} members
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{team.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingCenter;