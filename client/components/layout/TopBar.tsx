// import { Search, Bell, Settings, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export function TopBar() {
//   return (
//     <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
//       {/* Search Bar */}
//       <div className="flex-1 max-w-md relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//         <Input
//           placeholder="Search requests, technicians..."
//           className="pl-10 bg-muted border-muted"
//         />
//       </div>

//       {/* Right Side Actions */}
//       <div className="flex items-center gap-4">
//         {/* Notifications */}
//         <Button variant="ghost" size="icon">
//           <Bell className="w-5 h-5 text-muted-foreground" />
//         </Button>

//         {/* Settings */}
//         <Button variant="ghost" size="icon">
//           <Settings className="w-5 h-5 text-muted-foreground" />
//         </Button>

//         {/* Profile */}
//         <Button variant="ghost" size="icon" className="rounded-full">
//           <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
//             <User className="w-4 h-4 text-primary-foreground" />
//           </div>
//         </Button>
//       </div>
//     </div>
//   );
// }
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function TopBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white border-b border-border flex items-center justify-end px-6 sticky top-0 z-10">
      {/* Profile Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}