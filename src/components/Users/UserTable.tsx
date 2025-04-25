
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, Trash, Key } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface UserTableProps {
  users: any[];
  loading: boolean;
  type: "customers" | "agents";
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onResetPassword: (user: any) => void;
}

export function UserTable({ users, loading, type, onEdit, onDelete, onResetPassword }: UserTableProps) {
  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg font-medium">No users found</p>
        <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-muted-foreground bg-muted">
              <th className="px-6 py-3 text-xs font-medium">Name</th>
              <th className="px-6 py-3 text-xs font-medium">Email</th>
              <th className="px-6 py-3 text-xs font-medium">Status</th>
              <th className="px-6 py-3 text-xs font-medium">Date Created</th>
              <th className="px-6 py-3 text-xs font-medium w-12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">ID: #{user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  {user.isActive ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">
                      Inactive
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil size={14} className="mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(user)}>
                        <Key size={14} className="mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash size={14} className="mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
