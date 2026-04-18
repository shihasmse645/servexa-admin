import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  Phone,
  Mail,
  Wrench,
} from "lucide-react";



export default function Technicians() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTech, setSelectedTech] = useState<any>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service_type_id: "",
  });
  const fetchServiceTypes = async () => {
    const { data } = await supabase.from("service_types").select("*");
    setServiceTypes(data || []);
  };
  const toggleActive = async (id: string, current: boolean) => {
    try {
      setToggleLoading(true);

      const { error } = await supabase
        .from("technicians")
        .update({ is_active: !current })
        .eq("id", id);

      if (error) throw error;

      await fetchTechnicians();
    } catch (error) {
      console.error(error);
    } finally {
      setToggleLoading(false);
    }
  };



  useEffect(() => {
    fetchTechnicians();
    fetchServiceTypes();
  }, []);
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.phone.trim()) return "Phone is required";
    if (!formData.service_type_id) return "Service type is required";
    return null;
  };
  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      setSubmitLoading(true);

      if (editMode) {
        const { error } = await supabase
          .from("technicians")
          .update({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || null,
            service_type_id: Number(formData.service_type_id),
          })
          .eq("id", selectedTech.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("technicians")
          .insert([
            {
              name: formData.name,
              phone: formData.phone,
              email: formData.email || null,
              service_type_id: Number(formData.service_type_id),
            },
          ]);

        if (error) throw error;
      }

      setOpen(false);
      resetForm();
      fetchTechnicians();
    } catch (err: any) {
      console.error(err);
      alert(err.message); // shows unique constraint errors too
    } finally {
      setSubmitLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      service_type_id: "",
    });
    setEditMode(false);
    setSelectedTech(null);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this technician?")) return;

    try {
      setDeleteLoading(id);

      const { error } = await supabase
        .from("technicians")
        .delete()
        .eq("id", id);

      if (error) throw error;

      fetchTechnicians();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };
  const fetchTechnicians = async (search = "") => {
    try {
      setLoading(true);

      let query = supabase
        .from("technicians")
        .select(`
        *,
        service_types(name)
      `)
        .order("created_at", { ascending: true });

      // 🔍 Apply search only if value exists
      if (search.trim()) {
        query = query.or(
          `name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      setTechnicians(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (

    <MainLayout>
      {toggleLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Technicians</h1>
            <p className="text-muted-foreground mt-1">
              Manage your service technician team
            </p>
          </div>
          <Button className="gap-2" onClick={() => {
            resetForm();
            setOpen(true);
          }}>
            <Plus className="w-4 h-4" />
            Add Technician
          </Button>
        </div>



        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {technicians.length} of {technicians.length} technicians
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <Card key={tech.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{tech.name}</h3>
                    <p className="text-sm text-primary flex items-center gap-1 mt-1">
                      <Wrench className="w-4 h-4" />
                      {tech.service_types?.name || "N/A"}
                    </p>
                  </div>

                </div>

                {/* Contact Info */}
                <div className="space-y-2 border-t border-b border-border py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{tech.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{tech.email}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Status</p>

                  <p
                    className={`text-xs ${tech.is_active
                      ? tech.is_available
                        ? "text-green-600"
                        : "text-yellow-600"
                      : "text-red-600"
                      }`}
                  >
                    {!tech.is_active
                      ? "Inactive"
                      : tech.is_available
                        ? "Available"
                        : "On Work"}
                  </p>

                  <Switch
                    checked={tech.is_active}
                    disabled={toggleLoading}
                    onCheckedChange={() => toggleActive(tech.id, tech.is_active)}
                  />

                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => {
                      setEditMode(true);
                      setSelectedTech(tech);
                      setFormData({
                        name: tech.name,
                        phone: tech.phone,
                        email: tech.email || "",
                        service_type_id: String(tech.service_type_id || ""),
                      });
                      setOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 text-destructive hover:text-destructive"
                    disabled={deleteLoading === tech.id}
                    onClick={() => handleDelete(tech.id)}
                  >
                    {deleteLoading === tech.id ? (
                      "..."
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {technicians.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No technicians found. Try adjusting your filters.
            </p>
          </Card>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">
              {editMode ? "Edit Technician" : "Add Technician"}
            </h2>

            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <Input
              placeholder="Email (optional)"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <Select
              value={formData.service_type_id}
              onValueChange={(value) =>
                setFormData({ ...formData, service_type_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Service Type" />
              </SelectTrigger>

              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                resetForm();
                setOpen(false);
              }}>
                Cancel
              </Button>

              <Button onClick={handleSubmit} disabled={submitLoading}>
                {submitLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : editMode ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
