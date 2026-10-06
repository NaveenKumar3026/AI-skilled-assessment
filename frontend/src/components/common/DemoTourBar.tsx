import React, { useState } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, RotateCcw, CheckCircle2, Award, UserCheck, Play, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DEMO_STEPS = [
  { id: 0, title: '1. Landing Page', subtitle: 'Public Portal & Value Prop', role: 'candidate' },
  { id: 1, title: '2. Candidate Hub', subtitle: 'Arun Kumar Dashboard', role: 'candidate' },
  { id: 2, title: '3. Experience Discovery', subtitle: 'AI Voice & NLP Interview', role: 'candidate' },
  { id: 3, title: '4. AI Skill Profiling', subtitle: 'Radar Chart & NSQF Matrix', role: 'candidate' },
  { id: 4, title: '5. RPL Pathways', subtitle: 'Job Matches & Qualifications', role: 'candidate' },
  { id: 5, title: '6. Adaptive Quiz', subtitle: 'Difficulty Scaling & Rationale', role: 'candidate' },
  { id: 6, title: '7. Voice Assessment', subtitle: 'Speech Technical Analysis', role: 'candidate' },
  { id: 7, title: '8. Practical Video CV', subtitle: 'Computer Vision Bounding Boxes', role: 'candidate' },
  { id: 8, title: '9. Workplace Evidence', subtitle: 'OCR & Letter Verification', role: 'candidate' },
  { id: 9, title: '10. Skill Gaps', subtitle: 'Bridge Modules & Micro-Learning', role: 'candidate' },
  { id: 10, title: '11. Assessment Report', subtitle: 'Holistic 87% Readiness', role: 'candidate' },
  { id: 11, title: '12. Assessor Portal', subtitle: 'Human-in-the-Loop Audit & Sign-off', role: 'assessor' },
  { id: 12, title: '13. Official Certificate', subtitle: 'Govt NSQF Credential + QR', role: 'candidate' },
  { id: 13, title: '14. Admin Analytics', subtitle: 'National MSDE Macro Insights', role: 'admin' },
];

export const DemoTourBar: React.FC = () => {
  const { demoStepIndex, triggerDemoStep, resetCandidateDemo } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);

  const currentStep = DEMO_STEPS[demoStepIndex] || DEMO_STEPS[0];

  const handleNext = () => {
    if (demoStepIndex < DEMO_STEPS.length - 1) {
      triggerDemoStep(demoStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (demoStepIndex > 0) {
      triggerDemoStep(demoStepIndex - 1);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-5xl w-[94vw] bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl shadow-slate-950/50 transition-all duration-300">
      {/* Top micro bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH26242 Demo Navigator</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Story Flow: Informal Worker (Arun) → AI Engine → Assessor Validation → NSQF Certificate
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetCandidateDemo}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
            title="Reset All Mock Data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Story</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {isExpanded ? 'Minimize Bar' : 'Expand Steps'}
          </button>
        </div>
      </div>

      {/* Main Bar Controls */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Step Indicator & Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-sky-500/30 shrink-0">
            {demoStepIndex + 1}
          </div>
          <div>
            <div className="text-xs font-medium text-sky-400 flex items-center gap-1.5">
              <span>Step {demoStepIndex + 1} of {DEMO_STEPS.length}</span>
              <span className="text-slate-500">•</span>
              <span className="uppercase text-[10px] tracking-wider text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                Role: {currentStep.role}
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentStep.title}</span>
              <span className="text-slate-400 font-normal text-xs hidden md:inline">— {currentStep.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Quick Stepper Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handlePrev}
            disabled={demoStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {demoStepIndex === DEMO_STEPS.length - 1 ? (
            <button
              onClick={() => triggerDemoStep(0)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Tour</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-white hover:bg-sky-400 transition-all shadow-md shadow-sky-500/30 font-medium"
            >
              <span>Next Demo Stage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Quick Step Jump Grid */}
      {isExpanded && (
        <div className="px-4 pb-3 pt-1 border-t border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
            {DEMO_STEPS.map((step) => {
              const isActive = step.id === demoStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => triggerDemoStep(step.id)}
                  className={`text-left p-2 rounded-lg text-xs transition-all border ${
                    isActive
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold shadow-xs'
                      : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="truncate font-semibold text-[11px]">{step.title}</div>
                  <div className="truncate text-[10px] text-slate-400">{step.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
