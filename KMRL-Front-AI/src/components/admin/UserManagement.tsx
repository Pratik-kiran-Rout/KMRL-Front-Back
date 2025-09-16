import { useState } from "react";
import { Users, UserPlus, Shield, Settings, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Save, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  permissions: string[];
}

const users: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@kmrl.co.in",
    role: "Chief Safety Officer",
    department: "Operations & Safety",
    status: "active",
    lastLogin: "2024-12-15 09:30",
    permissions: ["safety_management", "audit_access", "report_generation"]
  },
  {
    id: "2",
    name: "Priya Nair",
    email: "priya.nair@kmrl.co.in", 
    role: "Station Manager",
    department: "Operations",
    status: "active",
    lastLogin: "2024-12-15 08:45",
    permissions: ["station_operations", "staff_management", "incident_reporting"]
  },
  {
    id: "3",
    name: "Arun Menon",
    email: "arun.menon@kmrl.co.in",
    role: "Technical Engineer",
    department: "Technical Services",
    status: "active",
    lastLogin: "2024-12-14 16:20",
    permissions: ["maintenance_access", "technical_reports", "equipment_management"]
  },
  {
    id: "4",
    name: "Deepa Thomas",
    email: "deepa.thomas@kmrl.co.in",
    role: "Quality Analyst",
    department: "Quality Assurance",
    status: "pending",
    lastLogin: "Never",
    permissions: ["quality_audits", "compliance_reports"]
  }
];

const UserManagement = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>(users);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [] as string[]
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showManagePermissions, setShowManagePermissions] = useState(false);
  const [permissionUser, setPermissionUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const allPermissions = [
    "safety_management", "audit_access", "report_generation", "station_operations", 
    "staff_management", "incident_reporting", "maintenance_access", "technical_reports", 
    "equipment_management", "quality_audits", "compliance_reports", "document_upload", 
    "user_management", "system_settings", "backup_access", "audit_logs"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "pending": return "outline";
      default: return "secondary";
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes("Chief") || role.includes("Manager")) return "bg-primary text-primary-foreground";
    if (role.includes("Engineer") || role.includes("Technical")) return "bg-blue-100 text-blue-800";
    if (role.includes("Analyst") || role.includes("Quality")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const filteredUsers = userList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("user_management")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("user_management_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Permissions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Global Permission Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3">System Permissions</h4>
                    <div className="space-y-2">
                      {["user_management", "system_settings", "backup_access", "audit_logs"].map(perm => (
                        <div key={perm} className="flex items-center space-x-2">
                          <Checkbox id={perm} />
                          <Label htmlFor={perm} className="text-sm">{perm.replace('_', ' ').toUpperCase()}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Operational Permissions</h4>
                    <div className="space-y-2">
                      {["document_upload", "safety_management", "station_operations", "maintenance_access"].map(perm => (
                        <div key={perm} className="flex items-center space-x-2">
                          <Checkbox id={perm} />
                          <Label htmlFor={perm} className="text-sm">{perm.replace('_', ' ').toUpperCase()}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => { setShowPermissions(false); toast.success("Permission settings updated"); }}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button variant="outline" onClick={() => setShowPermissions(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@kmrl.co.in"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Station Manager">Station Manager</SelectItem>
                      <SelectItem value="Technical Engineer">Technical Engineer</SelectItem>
                      <SelectItem value="Quality Analyst">Quality Analyst</SelectItem>
                      <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newUser.department} onValueChange={(value) => setNewUser(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Technical Services">Technical Services</SelectItem>
                      <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                      <SelectItem value="Operations & Safety">Operations & Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => {
                    if (newUser.name && newUser.email && newUser.role && newUser.department) {
                      const user: User = {
                        id: (userList.length + 1).toString(),
                        ...newUser,
                        status: "pending",
                        lastLogin: "Never",
                        permissions: ["basic_access"]
                      };
                      setUserList(prev => [...prev, user]);
                      setNewUser({ name: "", email: "", role: "", department: "", permissions: [] });
                      setShowAddUser(false);
                      toast.success("User added successfully");
                    } else {
                      toast.error("Please fill all required fields");
                    }
                  }} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{userList.length}</div>
            <div className="text-sm text-muted-foreground">{t("total_users")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {userList.filter(u => u.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">{t("active_users_count")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {userList.filter(u => u.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">{t("pending_approval")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">{t("departments")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Operations & Safety">Operations & Safety</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Technical Services">Technical Services</SelectItem>
                <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Chief Safety Officer">Chief Safety Officer</SelectItem>
                <SelectItem value="Station Manager">Station Manager</SelectItem>
                <SelectItem value="Technical Engineer">Technical Engineer</SelectItem>
                <SelectItem value="Quality Analyst">Quality Analyst</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div 
                key={user.id}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedUser?.id === user.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{user.name}</h4>
                    <Badge variant={getStatusColor(user.status)}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRoleColor(user.role) + " text-xs"}>
                      {user.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{user.department}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">Last Login</div>
                  <div className="text-xs text-muted-foreground">{user.lastLogin}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {user.permissions.length} permissions
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowUserDetails(true); }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setEditingUser(user); setShowEditUser(true); }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { 
                        setPermissionUser(user); 
                        setSelectedPermissions(user.permissions); 
                        setShowManagePermissions(true); 
                      }}>
                        <Shield className="h-4 w-4 mr-2" />
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => {
                        setUserList(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
                        toast.success(`User ${user.status === "active" ? "deactivated" : "activated"} successfully`);
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Details Panel */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Permissions - {selectedUser.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Current Permissions</h4>
                <div className="space-y-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{permission.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Available Permissions</h4>
                <div className="space-y-2">
                  {["document_upload", "user_management", "system_settings", "backup_access"].map((permission, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        {permission.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button size="sm" onClick={() => {
                setPermissionUser(selectedUser);
                setSelectedPermissions(selectedUser.permissions);
                setShowManagePermissions(true);
              }}>
                <Shield className="h-4 w-4 mr-2" />
                Manage Permissions
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                if (selectedUser?.status === "pending") {
                  setUserList(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: "active", lastLogin: new Date().toLocaleString() } : u));
                  setSelectedUser(prev => prev ? { ...prev, status: "active", lastLogin: new Date().toLocaleString() } : null);
                  toast.success("User approved and activated");
                }
              }}>
                <Check className="h-4 w-4 mr-2" />
                {selectedUser?.status === "pending" ? "Approve User" : "Role Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User - {editingUser?.name}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select value={editingUser.role} onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, role: value } : null)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Station Manager">Station Manager</SelectItem>
                    <SelectItem value="Technical Engineer">Technical Engineer</SelectItem>
                    <SelectItem value="Quality Analyst">Quality Analyst</SelectItem>
                    <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                    <SelectItem value="Chief Safety Officer">Chief Safety Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setUserList(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
                  setShowEditUser(false);
                  toast.success("User updated successfully");
                }} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditUser(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedUser.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                    <div><span className="font-medium">Role:</span> {selectedUser.role}</div>
                    <div><span className="font-medium">Department:</span> {selectedUser.department}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className="ml-2" variant={getStatusColor(selectedUser.status)}>
                        {selectedUser.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Activity Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Last Login:</span> {selectedUser.lastLogin}</div>
                    <div><span className="font-medium">Permissions:</span> {selectedUser.permissions.length}</div>
                    <div><span className="font-medium">Account Created:</span> Dec 1, 2024</div>
                    <div><span className="font-medium">Last Modified:</span> Dec 15, 2024</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Current Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUser.permissions.map((perm, index) => (
                    <Badge key={index} variant="outline" className="justify-start">
                      <Check className="h-3 w-3 mr-1 text-green-500" />
                      {perm.replace('_', ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => { setEditingUser(selectedUser); setShowUserDetails(false); setShowEditUser(true); }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
                <Button variant="outline" onClick={() => setShowUserDetails(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Manage Permissions Dialog */}
      <Dialog open={showManagePermissions} onOpenChange={setShowManagePermissions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Permissions - {permissionUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">System Permissions</h4>
                <div className="space-y-3">
                  {["user_management", "system_settings", "backup_access", "audit_logs", "report_generation"].map(perm => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox 
                        id={perm}
                        checked={selectedPermissions.includes(perm)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPermissions(prev => [...prev, perm]);
                          } else {
                            setSelectedPermissions(prev => prev.filter(p => p !== perm));
                          }
                        }}
                      />
                      <Label htmlFor={perm} className="text-sm cursor-pointer">
                        {perm.replace('_', ' ').toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Operational Permissions</h4>
                <div className="space-y-3">
                  {["safety_management", "station_operations", "maintenance_access", "technical_reports", "equipment_management", "quality_audits", "compliance_reports", "document_upload", "staff_management", "incident_reporting", "audit_access"].map(perm => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox 
                        id={perm}
                        checked={selectedPermissions.includes(perm)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPermissions(prev => [...prev, perm]);
                          } else {
                            setSelectedPermissions(prev => prev.filter(p => p !== perm));
                          }
                        }}
                      />
                      <Label htmlFor={perm} className="text-sm cursor-pointer">
                        {perm.replace('_', ' ').toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Selected Permissions ({selectedPermissions.length})</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedPermissions(allPermissions)}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedPermissions([])}>
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {selectedPermissions.map(perm => (
                  <Badge key={perm} variant="secondary" className="text-xs">
                    {perm.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={() => {
                if (permissionUser) {
                  setUserList(prev => prev.map(u => 
                    u.id === permissionUser.id ? { ...u, permissions: selectedPermissions } : u
                  ));
                  if (selectedUser?.id === permissionUser.id) {
                    setSelectedUser(prev => prev ? { ...prev, permissions: selectedPermissions } : null);
                  }
                  setShowManagePermissions(false);
                  toast.success(`Permissions updated for ${permissionUser.name}`);
                }
              }} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Permissions
              </Button>
              <Button variant="outline" onClick={() => setShowManagePermissions(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;