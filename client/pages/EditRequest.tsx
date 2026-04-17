import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({});
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("service_requests")
        .select("*")
        .eq("id", id)
        .single();

      const { data: techs } = await supabase
        .from("technicians")
        .select("*");

      setFormData(data);
      setTechnicians(techs || []);
    };

    fetchData();
  }, [id]);

  const filteredTechs = technicians.filter(
    (t: any) =>
      t.is_available &&
      t.service_type_id === formData.service_type_id
  );

  const handleUpdate = async () => {
    try {
      await supabase
        .from("service_requests")
        .update({
          ...formData,
          technician_id: formData.technician_id,
          status_id: formData.technician_id ? 2 : formData.status_id,
        })
        .eq("id", id);

      if (formData.technician_id) {
        await supabase
          .from("technicians")
          .update({ is_available: false })
          .eq("id", formData.technician_id);
      }

      toast.success("Updated successfully");
      navigate("/service-requests");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Edit Request</h2>

      <input
        value={formData.title || ""}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
      />

      <select
        value={formData.technician_id || ""}
        onChange={(e) =>
          setFormData({ ...formData, technician_id: e.target.value })
        }
      >
        <option value="">Unassigned</option>
        {filteredTechs.map((t: any) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}