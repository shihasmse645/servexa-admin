import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ViewRequest() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("service_requests")
        .select(`
          *,
          statuses(name),
          technicians(name),
          service_types(name)
        `)
        .eq("id", id)
        .single();

      setData(data);
    };

    fetchData();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-3">
      <h2 className="text-xl font-bold">Request Details</h2>

      <p><b>Title:</b> {data.title}</p>
      <p><b>Description:</b> {data.description}</p>
      <p><b>Status:</b> {data.statuses?.name}</p>
      <p><b>Service:</b> {data.service_types?.name}</p>
      <p><b>Technician:</b> {data.technicians?.name || "Unassigned"}</p>
      <p><b>Phone:</b> {data.phone}</p>
      <p><b>Address:</b> {data.address}</p>
      <p><b>Date:</b> {data.preferred_date}</p>
    </div>
  );
}