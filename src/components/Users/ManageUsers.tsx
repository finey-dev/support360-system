
import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "@/lib/db";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ManageUsersProps {
  type: "customers" | "agents";
}

export const ManageUsers = ({ type }: ManageUsersProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"active" | "all" | "inactive">("active");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const fetchUsers = () => {
    setLoading(true);
    const role = type === "customers" ? "customer" : "agent";
    const fetchedUsers = getUsers(role);
    setUsers(fetchedUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [type]);
  
  // Filter users based on search query and active status
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery 
      ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = view === "all" 
      ? true 
      : view === "active" 
        ? user.isActive 
        : !user.isActive;
    
    return matchesSearch && matchesStatus;
  });
  
  const totalCount = users.length;
  const activeCount = users.filter(u => u.isActive).length;
  const inactiveCount = users.filter(u => !u.isActive).length;

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddUserOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      try {
        // In a real app, we would call an API here
        deleteUser(selectedUser.id);
        toast({
          title: "User deleted",
          description: `${selectedUser.name} has been deleted.`,
        });
        fetchUsers(); // Refresh user list
        setIsDeleteDialogOpen(false); // Close the dialog after successful deletion
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title={type === "customers" ? "Manage Customers" : "Manage Agents"} 
        description={type === "customers" 
          ? "View and manage all customer accounts" 
          : "View and manage all support agent accounts"
        }
        actions={
          <div className="flex gap-2">
            <Button className="space-x-2" onClick={handleAddUser}>
              <Plus size={16} />
              <span>Add {type === "customers" ? "Customer" : "Agent"}</span>
            </Button>
          </div>
        }
      />
      
      {/* Filter and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs 
          defaultValue="active"
          value={view}
          onValueChange={(value) => setView(value as "active" | "all" | "inactive")}
        >
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({totalCount})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive ({inactiveCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder={`Search ${type}...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* User table */}
      <UserTable 
        users={filteredUsers} 
        loading={loading} 
        type={type}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser} 
      />

      {/* Add/Edit User Dialog */}
      {isAddUserOpen && (
        <UserForm
          isOpen={isAddUserOpen}
          onClose={() => setIsAddUserOpen(false)}
          type={type}
          onSuccess={fetchUsers}
        />
      )}

      {isEditUserOpen && selectedUser && (
        <UserForm
          isOpen={isEditUserOpen}
          onClose={() => setIsEditUserOpen(false)}
          user={selectedUser}
          type={type}
          onSuccess={fetchUsers}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedUser?.name}'s account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
