import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Calendar, 
  User as UserIcon, 
  ChevronRight, 
  ArrowUpDown,
  FileText,
  AlertCircle
} from "lucide-react";
import { useStore } from "@/src/lib/store";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import CaseDetailModal from "@/src/components/CaseDetailModal";

export default function History() {
  const { cases } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCases = cases.filter(c => 
    c.patientName.toLowerCase().includes(search.toLowerCase()) ||
    c.analysis?.diagnosis[0]?.condition.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCase = (c: any) => {
    setSelectedCase(c);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case History</h1>
          <p className="text-slate-500">Review and manage all past clinical analyses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search patients or conditions..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredCases.length > 0 ? (
          filteredCases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                className="hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => handleOpenCase(c)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                    {/* Patient Info */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-600">
                        {c.patientName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold group-hover:text-primary transition-colors">{c.patientName}</h3>
                        <p className="text-xs text-slate-500">{c.age}y • {c.gender}</p>
                      </div>
                    </div>

                    {/* Analysis Summary */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={c.analysis?.risk_level === 'High' || c.analysis?.risk_level === 'Critical' ? 'destructive' : 'success'}>
                          {c.analysis?.risk_level} Risk
                        </Badge>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        Primary Diagnosis: <span className="text-slate-900 dark:text-slate-100">{c.analysis?.diagnosis[0]?.condition}</span>
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {c.analysis?.diagnosis[0]?.reasoning}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 justify-end">
                      <div className="hidden md:flex flex-col items-end text-right">
                        <p className="text-xs font-medium text-slate-400">Confidence</p>
                        <p className="text-sm font-bold text-primary">{Math.round(c.analysis?.diagnosis[0]?.confidence * 100)}%</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">No cases found</h3>
              <p className="text-slate-500">Try adjusting your search or create a new patient case.</p>
            </div>
            <Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button>
          </div>
        )}
      </div>

      <CaseDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        caseData={selectedCase} 
      />
    </div>
  );
}
