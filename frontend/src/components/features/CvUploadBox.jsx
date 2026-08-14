"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CvUploadBox() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState("");

 const handleAnalyze = async () => {
    // Require at least a file OR a URL to proceed
    if (!selectedFile && !profileUrl.trim()) return; 
    
    setIsUploading(true);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    if (profileUrl.trim()) {
      formData.append("url", profileUrl.trim());
    }

    try {
      const response = await fetch("https://cv-analyzer-0f4b.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem("cvAnalysis", JSON.stringify(responseData.analysis));
        router.push("/dashboard"); 
      } else {
        const errorText = await response.text();
        console.error(`Upload failed:`, errorText);
        alert("Server is currently busy or encountered an error. Please try again.");
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full relative"
    >
      <div className="relative bg-white/60 backdrop-blur-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors group shadow-sm">
        
        {/* Hidden File Input */}
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        <div className="mb-6 space-y-1">
          <p className="text-slate-700 font-medium">
            {selectedFile ? <span className="text-emerald-600 font-bold">{selectedFile.name}</span> : "Drop your resume here or choose a file."}
          </p>
          <p className="text-slate-400 text-sm">PDF only. Max 5MB file size.</p>
        </div>
        {/* NEW: Profile URL Input */}
        <div className="w-full max-w-md mx-auto mb-6 relative z-30">
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
            <span className="pl-4 pr-3 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </span>
            <input 
              type="url" 
              placeholder="Paste LinkedIn, GitHub, or Portfolio URL..."
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full py-3 pr-4 text-sm text-slate-700 outline-none bg-transparent placeholder:text-slate-400"
            />
          </div>
        </div>

   <button
          onClick={(e) => {
            if (selectedFile || profileUrl.trim()) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
          // Physically disables the button while uploading or if no data is provided
          disabled={isUploading || (!selectedFile && !profileUrl.trim())}
          className={`relative z-30 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-3 w-full max-w-md mx-auto ${
            (selectedFile || profileUrl.trim()) && !isUploading
              ? "bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg cursor-pointer" 
              : "bg-emerald-400 opacity-80 cursor-not-allowed"
          }`}
        >
          {/* Render the rotating spinner ONLY when isUploading is true */}
          {isUploading && (
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          
          {/* Button Text Logic */}
          <span>
            {isUploading 
              ? "Analyzing Profile..." 
              : (selectedFile || profileUrl.trim()) 
                ? "Analyze Profile" 
                : "Upload CV or Paste Link"}
          </span>
        </button>
        
        {/* Privacy Lock */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
          </svg>
          We never share your data with 3rd parties or use it for AI model training.
        </div>
      </div>
    </motion.div>
  );
}