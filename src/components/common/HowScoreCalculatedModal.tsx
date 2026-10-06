import React from 'react';
import { X, ShieldCheck, Cpu, Scale, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowScoreCalculatedModal: React.FC = () => {
  const { isScoreModalOpen, setIsScoreModalOpen, t, candidate } = useApp();

  if (!isScoreModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={() => setIsScoreModalOpen(false)}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-400/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Scoring & Transparency Matrix</h3>
              <p className="text-xs text-slate-300">National Council for Vocational Education and Training (NCVET) Alignment</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Formula Weight breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-sky-600" />
              Standard RPL Assessment Weight Distribution
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] text-slate-700 font-semibold uppercase">Practical Demo</span>
                <div className="text-xl font-bold text-slate-800 mt-1">35%</div>
                <div className="text-[11px] text-slate-600">CV video & tool accuracy ({candidate.scores.practical}%)</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] text-slate-700 font-semibold uppercase">Knowledge Quiz</span>
                <div className="text-xl font-bold text-slate-800 mt-1">30%</div>
                <div className="text-[11px] text-slate-600">Adaptive domain quiz ({candidate.scores.knowledge}%)</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] text-slate-700 font-semibold uppercase">Safety Protocol</span>
                <div className="text-xl font-bold text-slate-800 mt-1">20%</div>
                <div className="text-[11px] text-slate-600">PPE & isolation check ({candidate.scores.safety}%)</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] text-slate-700 font-semibold uppercase">Workplace Evidence</span>
                <div className="text-xl font-bold text-slate-800 mt-1">10%</div>
                <div className="text-[11px] text-slate-600">Verified letters & photos ({candidate.scores.evidence}%)</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[11px] text-slate-700 font-semibold uppercase">Voice Technical</span>
                <div className="text-xl font-bold text-slate-800 mt-1">5%</div>
                <div className="text-[11px] text-slate-600">Spoken technical clarity ({candidate.scores.communication}%)</div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
                <span className="text-[11px] text-sky-800 font-bold uppercase">Weighted Overall</span>
                <div className="text-xl font-extrabold text-sky-800 mt-1">{candidate.scores.overall}%</div>
                <div className="text-[11px] text-sky-800 font-medium">Strong RPL Fit</div>
              </div>
            </div>
          </div>

          {/* AI Role in Evaluation */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block text-amber-950 mb-0.5">Responsible AI & Human-in-the-Loop Governance:</strong>
              AI models never make standalone certification decisions. The AI provides objective preliminary evaluations, computer vision posture/tool analytics, and OCR evidence parsing to assist human evaluators. The final RPL credential is authenticated exclusively by a certified National RPL Assessor.
            </div>
          </div>

          {/* Privacy & Compliance */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong className="font-semibold block text-emerald-950 mb-0.5">Data Privacy Guarantee:</strong>
              Video recordings, voice transcripts, and employment documents are encrypted and utilized solely for skill competency verification under the Digital Personal Data Protection Act (DPDP) guidelines.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => setIsScoreModalOpen(false)}
            className="px-5 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
