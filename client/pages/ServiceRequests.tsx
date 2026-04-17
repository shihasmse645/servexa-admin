import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Edit2,
  UserPlus,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react";


const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];


const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "done":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const getStatusLabel = (status: string) => {
  return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
};

export default function ServiceRequests() {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phone: "",
    address: "",
    preferred_date: "",
    status_id: 1, // default = pending
    service_type_id: "",
    technician_id: "",
  });
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const filteredRequests = requests.filter((request) => {
    const statusName = request.statuses?.name;

    const statusMatch =
      filterStatus === "all" || statusName === filterStatus;

    const typeMatch =
      filterType === "all" ||
      request.service_type?.toLowerCase() === filterType;

    const searchMatch =
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id?.toString().includes(searchTerm);

    return statusMatch && typeMatch && searchMatch;
  });
  const filteredTechs = technicians.filter(
    (tech) =>
      tech.is_available &&
      tech.service_type_id === Number(formData.service_type_id)
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true); // 👈 start

        const { data: requestsData, error: reqError } = await supabase
          .from("service_requests")
          .select(`
        *,
        statuses(name),
        technicians(name)
      `);

        if (reqError) throw reqError;

        const { data: typesData, error: typeError } = await supabase
          .from("service_types")
          .select("*");

        if (typeError) throw typeError;

        const { data: techData, error: techError } = await supabase
          .from("technicians")
          .select("*");

        if (techError) throw techError;

        setRequests(requestsData || []);
        setServiceTypes(typesData || []);
        setTechnicians(techData || []);

      } catch (error) {
        console.error(error);
      } finally {
        setPageLoading(false); // 👈 stop
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async () => {
    // ✅ validation
    if (
      !formData.title ||
      !formData.phone ||
      !formData.address ||
      !formData.preferred_date ||
      !formData.service_type_id
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitLoading(true);

      const hasTechnician = !!formData.technician_id;

      const { error } = await supabase
        .from("service_requests")
        .insert([
          {
            ...formData,
            service_type_id: Number(formData.service_type_id),
            technician_id: hasTechnician ? formData.technician_id : null,
            status_id: hasTechnician ? 2 : 1,
          },
        ]);

      if (error) throw error;

      if (hasTechnician) {
        await supabase
          .from("technicians")
          .update({ is_available: false })
          .eq("id", formData.technician_id);
      }

      toast.success("Request created successfully");

      // ✅ reset form
      setFormData({
        title: "",
        description: "",
        phone: "",
        address: "",
        preferred_date: "",
        status_id: 1,
        service_type_id: "",
        technician_id: "",
      });

      // ✅ close modal
      setOpen(false);

      await fetchData();

    } catch (error) {
      console.error(error);
      toast.error("Failed to create request");
    } finally {
      setSubmitLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      setPageLoading(true); // 👈 start

      const { data: requestsData, error: reqError } = await supabase
        .from("service_requests")
        .select(`
        *,
        statuses(name),
        technicians(name)
      `);

      if (reqError) throw reqError;

      const { data: typesData, error: typeError } = await supabase
        .from("service_types")
        .select("*");

      if (typeError) throw typeError;

      const { data: techData, error: techError } = await supabase
        .from("technicians")
        .select("*");

      if (techError) throw techError;

      setRequests(requestsData || []);
      setServiceTypes(typesData || []);
      setTechnicians(techData || []);

    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false); // 👈 stop
    }
  };
  const handleAssign = async (technicianId: string) => {
    if (!selectedRequest) return;

    try {
      setAssignLoading(true);

      const { error: assignError } = await supabase
        .from("service_requests")
        .update({
          technician_id: technicianId,
          status_id: 2,
        })
        .eq("id", selectedRequest.id);

      if (assignError) throw assignError;

      const { error: techError } = await supabase
        .from("technicians")
        .update({ is_available: false })
        .eq("id", technicianId);

      if (techError) throw techError;

      await fetchData();
      setTechModalOpen(false);

      toast.success("Technician assigned successfully");

    } catch (error) {
      console.error(error);
      toast.error("Failed to assign technician");
    } finally {
      setAssignLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await supabase.from("service_requests").delete().eq("id", id);

      toast.success("Deleted successfully");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (

    <MainLayout>
      {pageLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Service Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all service requests
            </p>
          </div>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>


        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  {/* <th className="px-6 py-3 text-left text-sm font-semibold">
                    ID
                  </th> */}
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Preferred Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    {/* <td className="px-6 py-4 text-sm font-mono text-primary">
                      #{request.id}
                    </td> */}
                    <td className="px-6 py-4 text-sm font-medium">
                      {request.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {request.description}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          request.statuses?.name || ""
                        )}`}
                      >
                        {getStatusLabel(request.statuses?.name || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={
                          (request.technicians?.name || "Unassigned") === "Unassigned"
                            ? "text-muted-foreground"
                            : ""
                        }
                      >
                        {request.technicians?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(request.preferred_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View details"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/service-requests/view/${request.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          title="Edit"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/service-requests/edit/${request.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button> */}
                        <Button onClick={() => handleDelete(request.id)}
                           variant="ghost"
                          size="sm"
                          title="Delete"
                          className="h-8 w-8 p-0">
                          🗑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Assign technician"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedRequest(request);
                            setTechModalOpen(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-muted-foreground">
                No requests found. Try adjusting your filters.
              </p>
            </div>
          )}
        </Card>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">New Service Request</h2>
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
            <Select
              value={formData.technician_id}
              onValueChange={(value) =>
                setFormData({ ...formData, technician_id: value })
              }
              disabled={!formData.service_type_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Technician (Optional)" />
              </SelectTrigger>

              <SelectContent>
                {filteredTechs.length === 0 ? (
                  <SelectItem disabled value="none">
                    No available technicians
                  </SelectItem>
                ) : (
                  filteredTechs.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <Input
              type="date"
              value={formData.preferred_date}
              onChange={(e) =>
                setFormData({ ...formData, preferred_date: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={submitLoading}>
                Cancel
              </Button>

              <Button onClick={handleSubmit} disabled={submitLoading}>
                {submitLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      {techModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Assign Technician</h2>

            <Select
              onValueChange={(value) => handleAssign(value)}
              disabled={assignLoading}
            >
              {assignLoading && (
                <div className="flex justify-center">
                  <div className="h-5 w-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                </div>
              )}
              <SelectTrigger>                     
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians
                  .filter(
                    (tech) =>
                      tech.is_available &&
                      tech.service_type_id === selectedRequest?.service_type_id
                  )
                  .map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setTechModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>

  );
}
