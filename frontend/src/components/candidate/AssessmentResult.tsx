import React from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  UserCheck, 
  Download,
  Share2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIBadge } from '../common/AIBadge';

export const AssessmentResult: React.FC = () => {
  const { candidate, setCurrentView, setIsScoreModalOpen, setRole, setSelectedCandidateForReview, t, addAuditLog } = useApp();

  const handleSendToAssessor = () => {
    setSelectedCandidateForReview(candidate);
    setRole('assessor');
    addAuditLog('Portfolio Submitted to Assessor', `Candidate Arun Kumar submitted assessment portfolio for evaluator review.`, candidate.name);
    setCurrentView('assessor-review');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                AI Assessment Complete
              </span>
              <AIBadge confidence={93} text="Multi-Modal Synthesized" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Holistic AI Skill Assessment Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Candidate: <strong className="text-white">{candidate.name}</strong> • Trade: <strong className="text-white">{candidate.primaryTrade} (NSQF Level 4)</strong>
            </p>
          </div>

          {/* Holistic Score Badge */}
          <div className="bg-slate-950/80 border border-slate-700/80 rounded-2xl p-4 text-center shrink-0 min-w-44">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Overall RPL Score</span>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-sky-400 mt-1">
              {candidate.scores.overall}%
            </div>
            <span className="text-xs font-bold text-emerald-400 mt-0.5 inline-block">
              Strong RPL Candidate
            </span>
          </div>
        </div>

        {/* 5-Factor Score Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Knowledge</span>
            <div className="text-lg font-bold text-slate-100">{candidate.scores.knowledge}%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Weight: 30%</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Practical Demo</span>
            <div className="text-lg font-bold text-slate-100">{candidate.scores.practical}%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Weight: 35%</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Safety Protocols</span>
            <div className="text-lg font-bold text-emerald-400">{candidate.scores.safety}%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Weight: 20%</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Work Evidence</span>
            <div className="text-lg font-bold text-slate-100">{candidate.scores.evidence}%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Weight: 10%</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Voice Technical</span>
            <div className="text-lg font-bold text-slate-100">{candidate.scores.communication}%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Weight: 5%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Competency Matrix & Assessor Submission Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: National Competency Matrix Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">National Occupational Standards Competency Matrix</h3>
            <button
              onClick={() => setIsScoreModalOpen(true)}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Scoring Rationale</span>
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800">1. Workplace Safety & 1000V Isolation (IS 732)</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                PASS (94%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800">2. Domestic Conduit Wiring & Circuit Layout</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                PASS (92%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800">3. Distribution Board, MCB & RCCB Assembly</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                PASS (89%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800">4. Circuit Continuity & Earth Ground Resistance</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                PASS (88%)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800">5. 3-Phase Industrial Fault Diagnosis</span>
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                PARTIAL (72%) — Bridge Advised
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Assessor Submission Flow */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Assessor Review & Authorization</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your AI-assisted assessment results, video demonstrations, and workplace evidence are compiled into an official RPL Evaluation Portfolio.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-snug">
              <strong>Human-in-the-Loop Governance:</strong> AI models never make standalone certification decisions. An authorized assessor reviews this portfolio to authorize the final NSQF certificate.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handleSendToAssessor}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Submit Portfolio to Authorized Assessor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
