import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Users,
  TrendingUp,
} from "lucide-react";



const requestTrendData = [
  { date: "Mon", requests: 12 },
  { date: "Tue", requests: 19 },
  { date: "Wed", requests: 15 },
  { date: "Thu", requests: 25 },
  { date: "Fri", requests: 22 },
  { date: "Sat", requests: 28 },
  { date: "Sun", requests: 32 },
];



const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: string;
  color: string;
}) => (
  <Card className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        {trend && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
);

export default function Dashboard() {

  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const totalRequests = requests.length;

  const pending = requests.filter(r => r.status_id === 1).length;
  const inProgress = requests.filter(r => r.status_id === 2).length;
  const completed = requests.filter(r => r.status_id === 3).length;
  const availableTech = technicians.filter(t => t.is_available === true).length;
  useEffect(() => {
    const fetchData = async () => {
      const { data: types } = await supabase
        .from("service_types")
        .select("*");

      const { data: reqs } = await supabase
        .from("service_requests")
        .select("*");
      const { data: techs } = await supabase
        .from("technicians")
        .select("*");
      setServiceTypes(types || []);
      setRequests(reqs || []);
      setTechnicians(techs || []);
    };

    fetchData();
  }, []);
  const statusData = [
    { name: "Pending", value: pending, fill: "#eab308" },
    { name: "In Progress", value: inProgress, fill: "#3b82f6" },
    { name: "Completed", value: completed, fill: "#22c55e" },
  ];
  const technicianData = serviceTypes.map((type) => {
    const techs = technicians.filter(
      (t) => t.service_type_id === type.id
    );

    return {
      name: type.name,
      available: techs.filter((t) => t.is_available).length,
      busy: techs.filter((t) => !t.is_available).length,
    };
  });
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your service booking system
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard
            title="Total Requests"
            value={totalRequests}
            subtitle="All time"
            icon={ClipboardList}
            color="bg-blue-500"
            trend="+12% this week"
          />
          <SummaryCard
            title="Pending"
            value={pending}
            subtitle="Awaiting assignment"
            icon={AlertCircle}
            color="bg-yellow-500"
          />
          <SummaryCard
            title="In Progress"
            value={inProgress}
            subtitle="Being serviced"
            icon={TrendingUp}
            color="bg-blue-600"
          />
          <SummaryCard
            title="Completed"
            value={completed}
            subtitle="This month"
            icon={CheckCircle2}
            color="bg-green-500"
          />
          <SummaryCard
            title="Available Tech"
            value={availableTech}
            subtitle="Ready for assignment"
            icon={Users}
            color="bg-purple-500"
          />
        </div>


        {/* Recent Requests Preview */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Requests</h3>
          <div className="space-y-3">
            {requests.slice(0, 5).map((req) => (
              <div key={req.id} className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Request #{req.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {req.title || "Service request"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs px-2 py-1 rounded bg-gray-200">
                    {req.status_id === 1
                      ? "Pending"
                      : req.status_id === 2
                        ? "In Progress"
                        : "Completed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
