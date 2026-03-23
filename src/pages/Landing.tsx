import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, ShieldCheck, Zap, BrainCircuit, ArrowRight, ChevronRight, Star, Quote, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <HeartPulse className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">MediSense AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
              <Zap className="w-3 h-3" />
              POWERED BY GEMINI 1.5 PRO
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Clinical Intelligence <br />
              <span className="text-primary">Reimagined.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
              The next-generation Clinical Decision Support System that helps medical professionals analyze complex cases with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 bg-primary hover:bg-primary/90">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                Book a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-slate-600 dark:text-slate-400">Designed to augment clinical expertise, not replace it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Differential Diagnosis",
                desc: "AI-powered ranking of possible conditions based on symptoms and history.",
                icon: BrainCircuit,
                color: "bg-primary"
              },
              {
                title: "Risk Assessment",
                desc: "Real-time analysis of patient vitals and lab results to identify critical risks.",
                icon: ShieldCheck,
                color: "bg-primary"
              },
              {
                title: "Clinical Chat",
                desc: "Interactive assistant for researching medical literature and case analysis.",
                icon: Zap,
                color: "bg-primary/80"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Three simple steps to clinical insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Input Data", desc: "Enter patient symptoms, vitals, and medical history into our secure form." },
              { step: "02", title: "AI Analysis", desc: "Our Gemini-powered engine processes data against vast medical knowledge bases." },
              { step: "03", title: "Review Insights", desc: "Receive structured differential diagnoses and suggested next steps." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-slate-100 dark:text-slate-800 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Professionals</h2>
            <p className="text-primary-foreground/80">See what clinicians are saying about MediSense AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Dr. Sarah Chen", role: "Internal Medicine", text: "MediSense has become an indispensable tool in my daily rounds. The differential diagnosis ranking is remarkably accurate." },
              { name: "Dr. James Wilson", role: "Emergency Medicine", text: "In the ER, every second counts. MediSense helps us quickly identify high-risk cases that need immediate attention." }
            ].map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <Quote className="w-10 h-10 text-white/50 mb-6 opacity-50" />
                <p className="text-lg mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {t.name.charAt(4)}
                  </div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-white/70">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Enhance Your Practice?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">
            Join thousands of medical professionals using MediSense AI to improve patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90">Sign Up Free</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-primary text-primary hover:bg-primary/10">Log In</Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> HIPAA Compliant</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <HeartPulse className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">MediSense AI</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 MediSense AI. For clinical decision support only.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
