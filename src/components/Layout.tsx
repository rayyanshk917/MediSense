import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, FileText, Settings, LogOut, HeartPulse, Clock } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useStore } from "@/src/lib/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useStore();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Clinical Chat", icon: MessageSquare, path: "/chat" },
    { name: "New Case", icon: FileText, path: "/patient-form" },
    { name: "History", icon: Clock, path: "/history" },
    { name: "Profile", icon: Settings, path: "/profile" },
  ];

  if (location.pathname === "/") return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <HeartPulse className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">MediSense AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-4">
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
        
        {/* Safety Disclaimer Footer */}
        <footer className="mt-auto p-8 border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <p className="text-xs text-slate-500 text-center">
            Disclaimer: This system is for clinical decision support only and not a substitute for professional medical judgment. 
            Always verify AI outputs with established clinical protocols and peer-reviewed literature.
          </p>
        </footer>
      </main>
    </div>
  );
}
