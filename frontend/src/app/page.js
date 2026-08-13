"use client";

import CvUploadBox from "@/components/features/CvUploadBox";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#f8fafc] font-sans text-slate-900">
      
      {/* 1. Soft Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[70%] bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[80%] bg-indigo-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[100px]" />
      </div>

      {/* 2. Simple Mock Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-bold text-xl tracking-tight text-emerald-600">MadeToFit</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Resume</span>
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Tools</span>
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Organizations</span>
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Pricing</span>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="px-5 py-2 text-sm font-bold text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50">Sign In</button>
          <button className="px-5 py-2 text-sm font-bold text-white bg-emerald-500 rounded-md hover:bg-emerald-600">Get Started</button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 lg:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT COLUMN: Copy & Upload */}
        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-4 block">
              RESUME CHECKER
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-800 leading-[1.1] mb-6">
              Is your resume good enough?
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              A free and fast AI resume checker doing crucial checks to ensure your resume's content, layout and design is technically compatible with the applicant tracking systems and get you interview callbacks.
            </p>
          </motion.div>

          <CvUploadBox />
        </div>

        {/* RIGHT COLUMN: The High-Fidelity Animated Mockup */}
        <div className="relative hidden lg:block h-[650px] w-full">
          
          {/* FIX: Wrapper div handles positioning & scaling so it doesn't fight Framer Motion */}
          <div className="absolute left-0 xl:left-12 top-0 origin-top-left scale-[0.80] xl:scale-100 z-0">
            
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-[680px] h-[550px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex overflow-hidden"
            >
              {/* Mockup Left Sidebar */}
              <div className="w-[220px] bg-white border-r border-slate-100 flex flex-col items-center pt-8">
                <span className="text-lg font-semibold text-slate-700 mb-4">Resume Score</span>
                
                {/* Custom Animated SVG Half-Gauge */}
                <div className="relative w-32 h-16 mb-2">
                  <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                    <motion.path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      strokeWidth="10" 
                      strokeLinecap="round"
                      initial={{ pathLength: 0.1, stroke: "#fb7185" }} 
                      animate={{ pathLength: 0.92, stroke: "#34d399" }} 
                      transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
                    />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="#cbd5e1" strokeWidth="2" />
                    <circle cx="50" cy="50" r="2.5" fill="#64748b" />
                  </svg>
                </div>
                
                <div className="text-center mb-8">
                  <motion.div 
                    initial={{ color: "#fb7185" }} 
                    animate={{ color: "#34d399" }} 
                    transition={{ duration: 2.5, delay: 0.5 }}
                    className="text-3xl font-bold"
                  >
                    92<span className="text-xl">/100</span>
                  </motion.div>
                  <span className="text-xs text-slate-400 font-medium">24 Issues</span>
                </div>

                <div className="w-full px-6 space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                    <span>CONTENT</span>
                    <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">90%</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-600 font-medium">
                    <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> ATS Parse Rate</li>
                    <li className="flex gap-2 items-center"><span className="text-emerald-500">✓</span> Quantifying Impact</li>
                    <li className="flex gap-2 items-center"><span className="text-rose-400">✕</span> Repetition</li>
                    <li className="flex gap-2 items-center"><span className="text-slate-400">🔒</span> Spelling & Grammar</li>
                  </ul>
                </div>
              </div>

              {/* Mockup Right Area (Content Checks) */}
              <div className="flex-1 bg-[#f8fafc] p-8">
                <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </div>
                    <span className="font-bold text-slate-700 tracking-wide text-lg">CONTENT</span>
                  </div>
                  <span className="text-xs font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm text-slate-600">8 ISSUES FOUND</span>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-600 mb-6 flex items-center gap-2">
                    <span className="text-indigo-400">📎</span> ATS PARSE RATE
                  </h3>

                  <div className="space-y-3 mb-8">
                    <div className="h-2.5 w-full bg-slate-100 rounded-full" />
                    <div className="h-2.5 w-full bg-slate-100 rounded-full" />
                    <div className="h-2.5 w-3/4 bg-slate-100 rounded-full" />
                  </div>

                  <div className="relative w-full h-4 bg-slate-100 rounded-full mt-12 mb-6 shadow-inner border border-slate-200/50">
                    <motion.div 
                      className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400"
                      initial={{ width: "20%" }} 
                      animate={{ width: "85%" }} 
                      transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
                    >
                      <motion.div 
                        className="absolute right-0 top-0 -mt-7 -mr-2"
                        initial={{ color: "#fb7185" }} 
                        animate={{ color: "#34d399" }} 
                        transition={{ duration: 2.5, delay: 0.5 }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="space-y-3 mt-8">
                    <div className="h-2.5 w-full bg-slate-100 rounded-full" />
                    <div className="h-2.5 w-full bg-slate-100 rounded-full" />
                    <div className="h-2.5 w-5/6 bg-slate-100 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
    </main>
  );
}