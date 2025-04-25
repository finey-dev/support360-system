
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { createUser, updateUser } from "@/lib/db";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  type: "customers" | "agents";
  onSuccess: () => void;
  isResetPassword?: boolean;
}

export function UserForm({ isOpen, onClose, user, type, onSuccess, isResetPassword = false }: UserFormProps) {
  const isEditing = !!user;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't populate password for editing
        isActive: user.isActive !== false, // Default to true if undefined
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        isActive: true,
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        // Update existing user
        await updateUser(user.id, {
          ...formData,
          // Only send password if it has been changed
          ...(formData.password ? { password: formData.password } : {})
        });
        
        const message = isResetPassword 
          ? "Password has been reset successfully."
          : `${type === "customers" ? "Customer" : "Agent"} has been successfully updated.`;
        
        toast({
          title: isResetPassword ? "Password Reset" : "User updated",
          description: message,
        });
      } else {
        // Create new user
        await createUser({
          ...formData,
          role: type === "customers" ? "customer" : "agent",
        });
        toast({
          title: "User created",
          description: `${type === "customers" ? "Customer" : "Agent"} has been successfully created.`,
        });
      }
      
      // Close dialog first to prevent UI jank
      onClose();
      
      // Then trigger the success callback to refresh data
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} user. Please try again.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const dialogTitle = isResetPassword 
    ? "Reset Password" 
    : isEditing 
      ? "Edit" 
      : "Add";

  const dialogDescription = isResetPassword
    ? "Enter a new password for this user."
    : isEditing 
      ? "Make changes to the user details below."
      : `Create a new ${type === "customers" ? "customer" : "agent"} account.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {dialogTitle} {!isResetPassword && (type === "customers" ? "Customer" : "Agent")}
          </DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!isResetPassword && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    required
                    readOnly={isEditing}
                  />
                </div>
              </>
            )}
            <div className="grid gap-2">
              <Label htmlFor="password">
                {isResetPassword ? "New Password" : isEditing ? "New Password (leave empty to keep current)" : "Password"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEditing ? "••••••••" : ""}
                required={!isEditing || isResetPassword}
              />
            </div>
            {!isResetPassword && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isActive">Active Account</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isResetPassword ? "Reset Password" : isEditing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
