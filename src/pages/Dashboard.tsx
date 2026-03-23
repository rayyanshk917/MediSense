import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Activity, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/src/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import CaseDetailModal from "@/src/components/CaseDetailModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', cases: 12 },
  { name: 'Tue', cases: 19 },
  { name: 'Wed', cases: 15 },
  { name: 'Thu', cases: 22 },
  { name: 'Fri', cases: 30 },
  { name: 'Sat', cases: 10 },
  { name: 'Sun', cases: 8 },
];

export default function Dashboard() {
  const { cases, user } = useStore();
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCase = (c: any) => {
    setSelectedCase(c);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-slate-500">Here is what's happening in your clinic today.</p>
        </div>
        <Link to="/patient-form">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Patient Case
          </Button>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cases", value: "1,284", icon: Users, color: "text-primary" },
          { label: "Critical Risks", value: "12", icon: AlertCircle, color: "text-red-600" },
          { label: "Avg. Analysis Time", value: "1.4s", icon: Clock, color: "text-amber-600" },
          { label: "System Uptime", value: "99.9%", icon: Activity, color: "text-slate-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-slate-50 dark:bg-slate-800", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Case Volume Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(222.2, 47.4%, 11.2%)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(222.2, 47.4%, 11.2%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="cases" stroke="hsl(222.2, 47.4%, 11.2%)" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Cases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Cases</CardTitle>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {cases.map((c) => (
              <div 
                key={c.id} 
                className="flex items-center justify-between p-3 rounded-xl border hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => handleOpenCase(c)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {c.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{c.patientName}</p>
                    <p className="text-xs text-slate-500">{c.age}y • {c.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.analysis?.risk_level === 'High' ? 'destructive' : 'success'}>
                    {c.analysis?.risk_level || 'Low'}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <CaseDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        caseData={selectedCase} 
      />
    </div>
  );
}
