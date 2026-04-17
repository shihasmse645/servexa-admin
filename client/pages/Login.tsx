import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate("/");
    };
    check();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Login successful");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#06090f] px-4">
      <div className="flex w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/5">

        {/* ── Left panel ── */}
        <div className="hidden lg:flex flex-col justify-between flex-1 relative p-12 bg-[#0a0f1e] overflow-hidden">
          {/* Geometric background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 640"
            xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <circle cx="400" cy="80"  r="160" fill="rgba(79,110,247,0.08)"/>
            <circle cx="80"  cy="500" r="200" fill="rgba(167,139,250,0.06)"/>
            <circle cx="300" cy="380" r="100" fill="rgba(79,110,247,0.05)"/>
            <line x1="0" y1="200" x2="480" y2="340" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
            <line x1="0" y1="340" x2="480" y2="200" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
            <rect x="340" y="220" width="80" height="80" rx="8"
              fill="none" stroke="rgba(129,140,248,0.12)" strokeWidth="0.5"/>
            <rect x="360" y="240" width="80" height="80" rx="8"
              fill="none" stroke="rgba(129,140,248,0.07)" strokeWidth="0.5"/>
            <circle cx="120" cy="180" r="3"   fill="rgba(129,140,248,0.4)"/>
            <circle cx="360" cy="440" r="2.5" fill="rgba(167,139,250,0.35)"/>
          </svg>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4f6ef7] to-[#a78bfa]
                            flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 3L4 7v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7l-8-4z"
                  fill="white" opacity="0.9"/>
                <path d="M9 12l2 2 4-4" stroke="#4f6ef7"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-white font-bold text-lg tracking-tight">
                Servexa Neo
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-[2px]">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10">
            <h1 style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-white text-[30px] font-extrabold leading-tight tracking-tight">
              Manage services<br />
              with <span className="text-[#818cf8]">precision</span><br />
              and speed.
            </h1>
            <p className="text-white/40 text-sm mt-4 leading-relaxed max-w-[260px]">
              Your centralized hub for bookings, technicians, and service operations.
            </p>
            <div className="flex gap-1.5 mt-6">
              <span className="w-5 h-1.5 rounded-full bg-[#818cf8]"/>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20"/>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20"/>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full lg:w-[380px] bg-white dark:bg-zinc-900 flex flex-col
                        justify-center px-10 py-14">
          <h2 style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 mb-8">
            Sign in to your admin account
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[10px] font-medium text-zinc-400 uppercase
                               tracking-[1.5px] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="admin@servexa.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-700
                         bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm
                         outline-none focus:border-[#4f6ef7] focus:ring-2 focus:ring-[#4f6ef7]/15
                         transition placeholder:text-zinc-400"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[10px] font-medium text-zinc-400 uppercase
                               tracking-[1.5px] mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full h-11 px-3.5 rounded-lg border border-zinc-200 dark:border-zinc-700
                         bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm
                         outline-none focus:border-[#4f6ef7] focus:ring-2 focus:ring-[#4f6ef7]/15
                         transition placeholder:text-zinc-400"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[#4f6ef7] hover:bg-[#3b5be0] active:scale-[0.99]
                       text-white text-sm font-semibold tracking-wide transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {loading ? "Signing in…" : "Sign in to Dashboard"}
          </button>

          {/* Footer badges */}
          <div className="flex items-center gap-3 mt-7">
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"/>
            <span className="text-[10px] text-zinc-400 uppercase tracking-[1px]">
              secured by
            </span>
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"/>
          </div>
          <div className="flex gap-2 justify-center mt-4">
            {["Supabase Auth", "256-bit SSL"].map((label) => (
              <span key={label}
                className="flex items-center gap-1.5 text-[11px] text-zinc-500 border
                           border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"/>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}