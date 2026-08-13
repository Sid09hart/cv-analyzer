"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("cvAnalysis");
    if (storedData) {
      setAnalysis(JSON.parse(storedData));
    } else {
      router.push("/");
    }
  }, [router]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin shadow-sm"></div>
      </div>
    );
  }

  // Animation Timings
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  // Math for Circular Progress
  const circleRadius = 70;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circleCircumference - (analysis.overall_score / 100) * circleCircumference;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden pb-20">
      
      {/* 1. Soft Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[70%] bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[80%] bg-indigo-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
              AI Profile Analysis
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Neural assessment complete. Here are your actionable insights.</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem("cvAnalysis"); router.push("/"); }}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Scan Another CV
          </button>
        </div>

        <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
          
          {/* TOP ROW: Metrics & Score */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Metrics */}
            <motion.div variants={itemVars} className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-center space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <MetricBar title="Resume Impact" score={analysis.metrics.impact} color="bg-indigo-400" />
              <MetricBar title="Writing Style" score={analysis.metrics.style} color="bg-purple-400" />
            </motion.div>

            {/* Center Score Card */}
            <motion.div variants={itemVars} className="bg-white border border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center relative shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-6">ATS Match Score</h2>
              <div className="relative">
                <svg width="220" height="220" className="transform -rotate-90">
                  <circle cx="110" cy="110" r={circleRadius} stroke="#f1f5f9" strokeWidth="16" fill="none" />
                  <motion.circle 
                    cx="110" cy="110" r={circleRadius} 
                    stroke="#34d399" strokeWidth="16" fill="none" strokeLinecap="round"
                    strokeDasharray={circleCircumference}
                    initial={{ strokeDashoffset: circleCircumference }}
                    animate={{ strokeDashoffset: strokeOffset }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl font-black text-slate-800 tracking-tighter">{analysis.overall_score}</span>
                </div>
              </div>
            </motion.div>

            {/* Right Metrics */}
            <motion.div variants={itemVars} className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-center space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <MetricBar title="Brevity & Clarity" score={analysis.metrics.brevity} color="bg-emerald-400" />
              <MetricBar title="Keyword Match" score={analysis.metrics.skills_match} color="bg-rose-400" />
            </motion.div>
          </div>

          {/* MIDDLE ROW: Deep Insights */}
          <motion.div variants={itemVars} className="grid md:grid-cols-3 gap-6">
            
            {/* Strengths */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 hover:bg-emerald-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold">✓</div>
                <h3 className="text-xl font-extrabold text-slate-800">Top Strengths</h3>
              </div>
              <ul className="space-y-4">
                {analysis.insights.strengths.map((item, i) => (
                  <li key={i} className="text-slate-600 font-medium leading-relaxed flex items-start gap-3">
                    <span className="text-emerald-500 mt-1">✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 hover:bg-rose-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 text-xl font-bold">✕</div>
                <h3 className="text-xl font-extrabold text-slate-800">Critical Gaps</h3>
              </div>
              <ul className="space-y-4">
                {analysis.insights.gaps.map((item, i) => (
                  <li key={i} className="text-slate-600 font-medium leading-relaxed flex items-start gap-3">
                    <span className="text-rose-400 mt-1">✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Plan */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 hover:bg-indigo-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">⚡</div>
                <h3 className="text-xl font-extrabold text-slate-800">Action Plan</h3>
              </div>
              <ul className="space-y-4">
                {analysis.insights.action_plan.map((item, i) => (
                  <li key={i} className="text-slate-600 font-medium leading-relaxed flex items-start gap-3">
                    <span className="text-indigo-400 mt-1">✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* BOTTOM ROW: Extracted Tech Stack */}
          <motion.div variants={itemVars} className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">
             <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-8">Detected Tech Stack</h3>
             <div className="flex flex-wrap justify-center gap-3">
              {analysis.extracted_skills.map((skill, idx) => (
                <motion.span 
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-5 py-2.5 bg-slate-50 text-slate-700 hover:text-indigo-600 text-sm font-bold rounded-xl border border-slate-200 cursor-default shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

// Updated Reusable Component for the Horizontal Progress Bars (Light Theme)
function MetricBar({ title, score, color }) {
  return (
    <div className="cursor-default">
      <div className="flex justify-between text-sm font-bold mb-3">
        <span className="text-slate-600">{title}</span>
        <span className="text-slate-800">{score}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}