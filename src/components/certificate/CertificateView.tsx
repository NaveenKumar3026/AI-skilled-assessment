import React from 'react';
import { 
  Award, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  ArrowLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CertificateView: React.FC = () => {
  const { candidate, setCurrentView, triggerConfetti, t } = useApp();

  const handlePrint = () => {
    triggerConfetti();
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Top Action Toolbar (Hidden in print) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => setCurrentView('candidate-dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerConfetti}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Celebrate Confetti</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government-Grade RPL Certificate Frame */}
      <div className="bg-white border-8 border-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center text-slate-900">
        {/* Subtle Watermark & Guilloche Border Styling */}
        <div className="absolute inset-3 border-2 border-amber-500/40 rounded-2xl pointer-events-none"></div>
        <div className="absolute inset-5 border border-slate-200 rounded-xl pointer-events-none"></div>

        {/* Diagonal Prototype Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-25deg] select-none">
          <span className="text-4xl sm:text-6xl font-black uppercase text-slate-900 tracking-widest text-center">
            SkillSet AI Prototype Demonstration
          </span>
        </div>

        {/* Certificate Header: Government Emblem & MSDE / NCVET Title */}
        <div className="space-y-2 mb-8 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-md border-2 border-amber-400">
              <Award className="w-7 h-7" />
            </div>
          </div>

          <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-700">
            Government of India • Ministry of Skill Development and Entrepreneurship (MSDE)
          </div>
          <div className="text-[11px] font-semibold tracking-wider uppercase text-sky-700">
            National Council for Vocational Education and Training (NCVET)
          </div>

          <div className="pt-4">
            <span className="px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 font-bold text-xs uppercase tracking-widest">
              Skill India Recognition of Prior Learning (RPL 2.0)
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif pt-3">
            Certificate of Prior Learning Competency
          </h1>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 max-w-2xl mx-auto my-6 text-sm relative z-10">
          <p className="text-slate-600 italic">This is to officially certify that</p>

          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide uppercase border-b-2 border-slate-900 pb-2 inline-block px-8">
            {candidate.name}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
            having satisfactorily demonstrated occupational competence and informal work experience of <strong className="text-slate-900">{candidate.yearsOfExperience} Years</strong> through AI-assisted multi-modal assessments, computer vision practical evaluation, and authorized assessor review, is hereby certified in:
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-lg sm:text-xl font-extrabold text-sky-900 uppercase">
              {candidate.primaryTrade} (Domestic & Commercial Installations)
            </div>
            <div className="text-xs font-bold text-emerald-700 mt-1">
              Aligned with National Skills Qualification Framework (NSQF) Level {candidate.nsqfTargetLevel}
            </div>
          </div>
        </div>

        {/* Signatures, Verification QR & Metadata Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-6 border-t border-slate-200 relative z-10 text-xs text-left">
          {/* Left: Metadata */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Certificate Details</div>
            <div>Certificate ID: <strong className="font-mono">{candidate.certificateId || 'RPL-IND-2026-EL4-9842'}</strong></div>
            <div>Candidate ID: <strong className="font-mono">CAND-TN-2026-8812</strong></div>
            <div>Issue Date: <strong>{candidate.certifiedDate || '06-Oct-2026'}</strong></div>
            <div className="text-emerald-600 font-bold flex items-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DigiLocker Verified Credential</span>
            </div>
          </div>

          {/* Center: Dynamic QR Code Placeholder */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 border-2 border-slate-800 rounded-xl p-2 flex items-center justify-center shadow-xs">
              <QrCode className="w-full h-full text-slate-800" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Scan to Verify Authenticity</span>
          </div>

          {/* Right: Evaluator Signature Badge */}
          <div className="text-right flex flex-col justify-end space-y-1">
            <div className="font-serif italic text-base text-slate-800 font-bold border-b border-slate-300 pb-1">
              Priya Sharma
            </div>
            <div className="text-xs font-bold text-slate-900">Priya Sharma</div>
            <div className="text-[10px] text-slate-500">Certified Senior RPL Assessor (TN/094)</div>
            <div className="text-[10px] text-slate-500">Ministry of Skill Development & Entrepreneurship</div>
          </div>
        </div>

        {/* Prototype Legal Disclaimer Box */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center relative z-10">
          PROTOTYPE DEMONSTRATION DOCUMENT • SMART INDIA HACKATHON SIH26242 • FOR DEMO PURPOSES ONLY
        </div>
      </div>
    </div>
  );
};
