import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  BrainCircuit, 
  Activity, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  Download,
  Share2,
  Calendar,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";
import { cn } from "@/src/lib/utils";

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
}

export default function CaseDetailModal({ isOpen, onClose, caseData }: CaseDetailModalProps) {
  if (!caseData) return null;

  const { analysis } = caseData;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  {caseData.patientName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{caseData.patientName}</h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {caseData.age}y • {caseData.gender}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(caseData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Risk Banner */}
              <Alert variant={analysis?.risk_level === 'Critical' || analysis?.risk_level === 'High' ? 'destructive' : 'info'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{analysis?.risk_level} Risk Level Detected</AlertTitle>
                <AlertDescription>
                  AI assessment indicates a {analysis?.risk_level?.toLowerCase()} risk profile.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Differential Diagnosis */}
                <Card className="lg:col-span-2 border-none bg-slate-50/50 dark:bg-slate-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BrainCircuit className="w-5 h-5 text-primary" />
                      Differential Diagnosis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis?.diagnosis.map((diag: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold">{diag.condition}</h4>
                          <Badge variant={diag.confidence > 0.7 ? 'success' : 'warning'}>
                            {Math.round(diag.confidence * 100)}% Confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {diag.reasoning}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <div className="space-y-6">
                  <Card className="border-none bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis?.recommendations.map((rec: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs">
                          <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[8px] font-bold">
                            {i + 1}
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">{rec}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Suggested Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {analysis?.suggested_tests.map((test: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0">
                          {test}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Clinical Notes */}
              <Card className="border-none bg-slate-50/50 dark:bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-slate-500" />
                    Clinical Reasoning & Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {analysis?.clinical_notes}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share Report
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
