import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  PlayCircle, 
  ExternalLink, 
  ArrowRight, 
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SKILL_GAPS } from '../../services/mockData';
import { AIBadge } from '../common/AIBadge';

export const SkillGapAnalysis: React.FC = () => {
  const { candidate, setCurrentView, t } = useApp();
  const [completedBridge, setCompletedBridge] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Phase 8: Competency Gap Analysis
            </span>
            <AIBadge confidence={96} text="NOS Alignment Engine" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Current Skill Level vs Required Qualification Benchmark
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Target Qualification: <strong className="text-slate-800">Electrician (Domestic & Commercial) — NSQF Level 4</strong>
          </p>
        </div>

        <button
          onClick={() => setCurrentView('assessment-results')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <span>View Final Assessment Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Comparison Table + Bridge Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Skill Gap Comparison Matrix */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Competency Comparison Breakdown</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              4 of 5 Standards Passed
            </span>
          </div>

          <div className="space-y-3">
            {SKILL_GAPS.map((gap, idx) => {
              const isGap = gap.status === 'GAP';
              return (
                <div key={idx} className="p-3.5 rounded-xl border bg-slate-50 border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{gap.skillName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isGap ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {isGap ? '⚠️ Minor Gap (72%)' : '✓ Standard Met'}
                    </span>
                  </div>

                  {/* Dual Bar (Current vs Benchmark) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Candidate Score: <strong>{gap.currentLevelScore}%</strong></span>
                      <span>Required Threshold: <strong>{gap.requiredLevelScore}%</strong></span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${isGap ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${gap.currentLevelScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Recommended Bridge Learning Modules */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Personalized RPL Bridge Modules</h3>
            </div>

            <p className="text-xs text-slate-600 my-3 leading-relaxed">
              Targeted short-duration digital video refreshers by Skill India Digital to bridge identified competency gaps before formal sign-off.
            </p>

            {/* Bridge Card */}
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-800 uppercase bg-white px-2 py-0.5 rounded border border-sky-200">
                  Micro-Course • 45 Mins
                </span>
                <span className="text-[11px] text-slate-500">Skill India Digital</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                Star-Delta Starter Wiring & Industrial Troubleshooting Refresher
              </h4>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setCompletedBridge(!completedBridge)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    completedBridge
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {completedBridge ? '✓ Completed Bridge Video' : '▶ Watch 15-Min Summary'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('assessment-results')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <span>View Comprehensive AI Assessment Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
