import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Video, 
  Mic, 
  Award, 
  ArrowLeft, 
  Sparkles,
  Sliders,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIBadge } from '../common/AIBadge';

export const AssessorReview: React.FC = () => {
  const { 
    selectedCandidateForReview, 
    candidate, 
    setCurrentView, 
    approveCandidateByAssessor, 
    requestReassessmentByAssessor,
    t 
  } = useApp();

  const activeCand = selectedCandidateForReview || candidate;

  const [remarks, setRemarks] = useState(
    activeCand.assessorRemarks || 
    "Candidate demonstrates exemplary safety adherence (1000V PPE verified via computer vision) and high domestic wiring competence. Recommend for NSQF Level 4 Certification with minor advisory on 3-phase star-delta starters."
  );

  const [practicalScore, setPracticalScore] = useState(activeCand.scores.practical || 85);
  const [safetyScore, setSafetyScore] = useState(activeCand.scores.safety || 94);
  const [knowledgeScore, setKnowledgeScore] = useState(activeCand.scores.knowledge || 89);
  const [isDecisionSubmitted, setIsDecisionSubmitted] = useState(activeCand.assessmentStatus === 'certified');

  const handleApprove = () => {
    approveCandidateByAssessor(activeCand.id, remarks, {
      practical: practicalScore,
      safety: safetyScore,
      knowledge: knowledgeScore,
      overall: Math.round(knowledgeScore * 0.3 + practicalScore * 0.35 + safetyScore * 0.2 + activeCand.scores.evidence * 0.1 + activeCand.scores.communication * 0.05),
    });
    setIsDecisionSubmitted(true);
    setCurrentView('certificate');
  };

  const handleReassessment = () => {
    requestReassessmentByAssessor(activeCand.id, remarks);
    setIsDecisionSubmitted(true);
    setCurrentView('assessor-dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentView('assessor-dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Evaluation Queue</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Assessor Review & Final Audit
            </span>
            <AIBadge text="AI Evaluation Audit Desk" showInfoButton={false} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Candidate Audit: {activeCand.name}
          </h1>
          <p className="text-xs text-slate-500">
            Target Trade: <strong className="text-slate-800">{activeCand.primaryTrade} (NSQF Level {activeCand.nsqfTargetLevel})</strong> • {activeCand.yearsOfExperience} Years Experience
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {activeCand.assessmentStatus === 'certified' ? (
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Certified & Authorized</span>
            </span>
          ) : (
            <span className="px-4 py-2 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Awaiting Assessor Signature</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Review Grid: 3 Pillars (AI Video/Audio Evidence + Scores + Decision Desk) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Multi-Modal Evidence Portfolio */}
        <div className="lg:col-span-7 space-y-4">
          {/* Practical CV Observations Audit */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase">Practical Demonstration CV Audit</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                AI Score: 85%
              </span>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="font-mono">REC Frame ID: VID-EL4-0048</span>
                <span className="text-emerald-400">4 Milestones Detected</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="text-emerald-400 font-bold">✓ 1000V Insulated Gloves</span>
                  <p className="text-slate-400 text-[10px]">Class 0 PPE verified at 00:04</p>
                </div>
                <div className="p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="text-emerald-400 font-bold">✓ VDE Screwdriver</span>
                  <p className="text-slate-400 text-[10px]">Terminal torque verified at 00:09</p>
                </div>
              </div>
              <div className="text-[11px] text-amber-300 pt-1">
                <strong>Assessor Note:</strong> Candidate executed continuity tests correctly before concluding.
              </div>
            </div>
          </div>

          {/* Voice Interview Audit */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase">Voice Technical Interview Transcript</h3>
              </div>
              <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                AI Knowledge: 89%
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic leading-relaxed">
              "{activeCand.experienceDescription || 'Candidate described 7 years domestic and LT wiring, conduit pipe laying, and earth resistance testing.'}"
            </div>
          </div>

          {/* Workplace Documents Audit */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase">Verified Workplace Evidence</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Authenticity: High (94%)
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">ABC_Electrical_Contractors_Experience_Letter.pdf</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">7 Yrs Verified</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Residential_Site_Installation_Photos.jpg</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Panel Board Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Assessor Decision Desk & Score Overrides */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-600" />
                  <span>Evaluator Score Adjustment & Audit</span>
                </h3>
                <span className="text-xs font-bold text-slate-800">Assessor Override</span>
              </div>

              {/* Slider Overrides */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 font-semibold">Practical Demonstration Score:</span>
                    <span className="font-bold text-slate-900">{practicalScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={practicalScore}
                    onChange={(e) => setPracticalScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 font-semibold">Safety Compliance Score:</span>
                    <span className="font-bold text-emerald-600">{safetyScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={safetyScore}
                    onChange={(e) => setSafetyScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 font-semibold">Knowledge Assessment Score:</span>
                    <span className="font-bold text-slate-900">{knowledgeScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={knowledgeScore}
                    onChange={(e) => setKnowledgeScore(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                </div>
              </div>

              {/* Assessor Remarks Textarea */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Official Assessor Remarks & Certification Endorsement
                </label>
                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 leading-relaxed resize-none"
                  placeholder="Enter evaluator remarks regarding candidate competencies..."
                />
              </div>
            </div>

            {/* Decision Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <button
                onClick={handleApprove}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Authorize & Issue Official RPL Certificate</span>
              </button>

              <button
                onClick={handleReassessment}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                Request Targeted Reassessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
