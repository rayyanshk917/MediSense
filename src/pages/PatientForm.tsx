import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stethoscope, 
  Activity, 
  Thermometer, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  ArrowLeft,
  FileText,
  Download,
  Share2,
  Zap
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";
import { analyzeClinicalCase, ClinicalAnalysis } from "@/src/lib/gemini";
import { useStore } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";

const formSchema = z.object({
  patientName: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(0).max(150),
  gender: z.string().min(1, "Gender is required"),
  symptoms: z.string().min(5, "Please describe symptoms in detail"),
  vitals: z.object({
    bp: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Format: 120/80"),
    hr: z.coerce.number().min(30).max(250),
    temp: z.coerce.number().min(90).max(110),
    spo2: z.coerce.number().min(50).max(100),
  }),
  history: z.string().optional(),
  labResults: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PatientForm() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ClinicalAnalysis | null>(null);
  const { addCase } = useStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      patientName: "",
      age: 0,
      gender: "Male",
      symptoms: "",
      vitals: { bp: "120/80", hr: 72, temp: 98.6, spo2: 98 }
    }
  });

  const onSubmit = async (data: any) => {
    const formData = data as FormValues;
    setIsAnalyzing(true);
    try {
      const result = await analyzeClinicalCase(formData);
      setAnalysis(result);
      addCase({
        id: Math.random().toString(36).substr(2, 9),
        patientName: formData.patientName,
        age: formData.age,
        gender: formData.gender,
        symptoms: formData.symptoms.split(','),
        vitals: { bp: formData.vitals.bp, hr: formData.vitals.hr, temp: formData.vitals.temp },
        analysis: result,
        createdAt: new Date().toISOString(),
      });
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Case Analysis</h1>
          <p className="text-slate-500">Input patient data for AI-driven differential diagnosis and risk assessment.</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step === s ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
              )}
            >
              {s}
            </div>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Patient Information
                </CardTitle>
                <CardDescription>Basic patient details and clinical presentation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input {...register("patientName")} placeholder="John Doe" />
                    {errors.patientName && <p className="text-xs text-red-500">{errors.patientName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input type="number" {...register("age")} placeholder="45" />
                    {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <select 
                      {...register("gender")}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Chief Complaint & Symptoms</label>
                  <textarea 
                    {...register("symptoms")}
                    className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Describe symptoms, duration, and severity..."
                  />
                  {errors.symptoms && <p className="text-xs text-red-500">{errors.symptoms.message}</p>}
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} className="gap-2">
                    Next: Vitals & Labs
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Vitals & Clinical Data
                </CardTitle>
                <CardDescription>Input objective measurements and patient history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" /> BP
                    </label>
                    <Input {...register("vitals.bp")} placeholder="120/80" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Activity className="w-3 h-3 text-blue-500" /> HR
                    </label>
                    <Input type="number" {...register("vitals.hr")} placeholder="72" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-500" /> Temp
                    </label>
                    <Input type="number" step="0.1" {...register("vitals.temp")} placeholder="98.6" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-500" /> SpO2
                    </label>
                    <Input type="number" {...register("vitals.spo2")} placeholder="98" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical History (Optional)</label>
                  <textarea 
                    {...register("history")}
                    className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                    placeholder="Past conditions, surgeries, medications..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lab Results (Optional)</label>
                  <textarea 
                    {...register("labResults")}
                    className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                    placeholder="Recent blood work, imaging results, etc."
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit(onSubmit)} className="gap-2 bg-primary hover:bg-primary/90" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing Case...
                      </>
                    ) : (
                      <>
                        Run AI Analysis
                        <BrainCircuit className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && analysis && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 pb-12"
          >
            {/* Risk Banner */}
            <Alert variant={analysis.risk_level === 'Critical' || analysis.risk_level === 'High' ? 'destructive' : 'info'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{analysis.risk_level} Risk Level Detected</AlertTitle>
              <AlertDescription>
                AI assessment indicates a {analysis.risk_level.toLowerCase()} risk profile. Please prioritize clinical evaluation.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Differential Diagnosis */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    Differential Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysis.diagnosis.map((diag, i) => (
                    <div key={i} className="p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg">{diag.condition}</h4>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Suggested Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {analysis.suggested_tests.map((test, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1">
                        {test}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Clinical Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  Clinical Reasoning & Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {analysis.clinical_notes}
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                New Analysis
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BrainCircuit(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 4 4 0 0 0 5.327 2.7c.23.34.474.667.73.978" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105 4 4 0 0 1-5.327 2.7c-.23.34-.474.667-.73.978" />
      <path d="M12 13v8" />
      <path d="M12 13l-4-4" />
      <path d="M12 13l4-4" />
    </svg>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
