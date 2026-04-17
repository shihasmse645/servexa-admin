import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";


interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [checkingAuth, setCheckingAuth] = useState(true);
const navigate = useNavigate();
  const { pathname } = useLocation();
useEffect(() => {
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      navigate("/login");
    } else {
      setCheckingAuth(false);
    }
  };

  checkAuth();
}, []);
if (checkingAuth) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar currentPath={pathname} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
