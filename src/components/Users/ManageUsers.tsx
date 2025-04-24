
import { useState, useEffect } from "react";
import { getUsers } from "@/lib/db";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "./UserTable";
import { Plus, Search } from "lucide-react";

interface ManageUsersProps {
  type: "customers" | "agents";
}

export const ManageUsers = ({ type }: ManageUsersProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"active" | "all" | "inactive">("active");
  
  useEffect(() => {
    const role = type === "customers" ? "customer" : "agent";
    const fetchedUsers = getUsers(role);
    setUsers(fetchedUsers);
    setLoading(false);
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
            <Button className="space-x-2">
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${type}...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* User table */}
      <UserTable users={filteredUsers} loading={loading} type={type} />
    </div>
  );
};
