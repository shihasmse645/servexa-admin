import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Wrench,
  Droplet,
  Zap,
  Wind,
  Plus,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";

interface ServiceType {
  id: number;
  name: string;
  description: string;
  icon: string;
  technicianCount: number;
  requestCount: number;
}



const iconMap: Record<string, any> = {
  droplet: Droplet,
  zap: Zap,
  wind: Wind,
  wrench: Wrench,
};

export default function ServiceTypes() {
  // const [serviceTypes, setServiceTypes] = useState(mockServiceTypes);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [selectedType, setSelectedType] = useState<ServiceType | null>(null);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "wrench" });
  const fetchServiceTypes = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("service_types")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      setServiceTypes(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load service types", {
  duration: 1000, // 1 second
});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServiceTypes();
  }, []);
  const handleAddServiceType = async () => {
    if (!formData.name.trim()) {
      toast.error("Service type name is required", {
  duration: 1000, // 1 second
});
      return;
    }

    try {
      setSubmitLoading(true);

      const { error } = await supabase
        .from("service_types")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
          },
        ]);

      if (error) throw error;
      toast.success("Service type added successfully", {
  duration: 1000, // 1 second
});
      setIsAddDialogOpen(false);
      setFormData({ name: "", description: "", icon: "wrench" });

      fetchServiceTypes();
    } catch (err: any) {
      if (err.message.includes("duplicate")) {
        // alert("Service type already exists");
        toast.error("Service type already exists", {
  duration: 1000, // 1 second
});
      } else {
        // alert("Failed to add");

        toast.error("Failed to add service type", {
  duration: 1000, // 1 second
});
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const openAddDialog = () => {
    setFormData({ name: "", description: "", icon: "wrench" });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (type: ServiceType) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description,
      icon: type.icon,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (type: ServiceType) => {
    setSelectedType(type);
    setIsDeleteDialogOpen(true);
  };


  const handleEditServiceType = async () => {
    if (!selectedType) return;

    if (!formData.name.trim()) {
      toast.error("Service type name is required", {
  duration: 1000, // 1 second
});
      return;
    }

    try {
      setSubmitLoading(true);

      const { error } = await supabase
        .from("service_types")
        .update({
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
        })
        .eq("id", selectedType.id);

      if (error) throw error;
  toast.success("Service type Updated successfully", {
  duration: 1000, // 1 second
});
      setIsEditDialogOpen(false);
      fetchServiceTypes();
    } catch (err) {
      if (err.message.includes("duplicate")) {
         toast.error("Service type already exists", {
  duration: 1000, // 1 second
});
      } else {
      toast.error("Failed to update service type", {
  duration: 1000, // 1 second
});
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteServiceType = async () => {
    if (!selectedType) return;

    try {
      setDeleteLoading(true);

      const { error } = await supabase
        .from("service_types")
        .delete()
        .eq("id", selectedType.id);

      if (error) throw error;
toast.success("Service type deleted successfully", {
  duration: 1000, // 1 second
});
      setIsDeleteDialogOpen(false);
      fetchServiceTypes();
    } catch (err: any) {
      if (err.message.includes("foreign key")) {
         toast.error("Cannot delete. This type is assigned to technicians.", {
  duration: 1000, // 1 second
});
      } else {
        toast.error("Failed to delete service type", {
  duration: 1000, // 1 second
});
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <MainLayout>
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Service Types</h1>
            <p className="text-muted-foreground mt-1">
              Manage available service categories
            </p>
          </div>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            New Service Type
          </Button>
        </div>



        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {serviceTypes.length} of {serviceTypes.length} service types
        </div>

        {/* Service Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceTypes.map((type) => {
            const IconComponent = iconMap[type.icon] || Wrench;
            return (
              <Card key={type.id} className="p-6">
                <div className="space-y-4">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{type.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>



                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(type)}
                      className="flex-1 gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(type)}
                      className="flex-1 gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {serviceTypes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No service types found. Try adjusting your search.
            </p>
          </Card>
        )}

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Type</DialogTitle>
              <DialogDescription>
                Create a new service type for your technicians to offer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Service Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Plumbing"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe this service type"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger id="icon" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="droplet">Droplet (Plumbing)</SelectItem>
                    <SelectItem value="zap">Zap (Electrical)</SelectItem>
                    <SelectItem value="wind">Wind (HVAC)</SelectItem>
                    <SelectItem value="wrench">Wrench (Carpentry)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setFormData({ name: "", description: "", icon: "wrench" });
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              {/* <Button onClick={handleAddServiceType}>Add Service Type</Button> */}
              <Button onClick={handleAddServiceType} disabled={submitLoading}>
                {submitLoading ? "..." : "Add Service Type"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}> */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setFormData({ name: "", description: "", icon: "wrench" });
            }
            setIsEditDialogOpen(open);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service Type</DialogTitle>
              <DialogDescription>
                Update the service type information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Service Type Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger id="edit-icon" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="droplet">Droplet (Plumbing)</SelectItem>
                    <SelectItem value="zap">Zap (Electrical)</SelectItem>
                    <SelectItem value="wind">Wind (HVAC)</SelectItem>
                    <SelectItem value="wrench">Wrench (Carpentry)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setFormData({ name: "", description: "", icon: "wrench" });
                setIsEditDialogOpen(false);
              }}>
                Cancel
              </Button>
              {/* <Button onClick={handleEditServiceType}>Update Service Type</Button> */}
              <Button onClick={handleEditServiceType} disabled={submitLoading}>
                {submitLoading ? "..." : "Update Service Type"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Service Type?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedType?.name}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteServiceType}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
