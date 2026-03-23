import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Mail, Bell, Save, CheckCircle2, Camera } from "lucide-react";
import { useStore } from "@/src/lib/store";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

export default function Profile() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser({ name, role });
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-slate-500">Manage your account information and clinical preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          {[
            { label: "General", icon: User, active: true },
            { label: "Security", icon: Shield, active: false },
            { label: "Notifications", icon: Bell, active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                item.active 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be displayed on your clinical reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700">
                    {name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-transform group-hover:scale-110">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-slate-500">{role}</p>
                  <Badge variant="secondary" className="mt-2">Verified Professional</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Dr. Jane Smith" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clinical Role</label>
                  <Input 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    placeholder="Emergency Medicine Physician" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Input 
                      disabled 
                      value="rayyan.is@somaiya.edu" 
                      className="pl-10 bg-slate-50 dark:bg-slate-900/50" 
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400">Email cannot be changed manually. Contact admin for updates.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-primary text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Changes saved successfully
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="ml-auto gap-2 bg-primary hover:bg-primary/90"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinical Preferences</CardTitle>
              <CardDescription>Customize how the AI assistant interacts with you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <p className="text-sm font-medium">Detailed Reasoning</p>
                  <p className="text-xs text-slate-500">Show full clinical logic in AI reports.</p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <p className="text-sm font-medium">Auto-Save Cases</p>
                  <p className="text-xs text-slate-500">Automatically save analyzed cases to history.</p>
                </div>
                <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
