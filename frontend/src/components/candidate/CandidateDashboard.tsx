import React from 'react';
import { 
  Award, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  BrainCircuit, 
  Video, 
  FileText, 
  AlertCircle, 
  PlayCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIBadge } from '../common/AIBadge';

export const CandidateDashboard: React.FC = () => {
  const { candidate, t, setCurrentView, triggerDemoStep, triggerConfetti } = useApp();

  const isCertified = candidate.assessmentStatus === 'certified';

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Greeting & State Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active RPL Candidate
              </span>
              <AIBadge confidence={candidate.experienceConfidence} text="AI Profiled" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.candidate.greeting}, {candidate.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Target Qualification: <strong className="text-white">NSQF Level {candidate.nsqfTargetLevel} — Electrician (Domestic & Commercial)</strong>
            </p>
          </div>

          {/* Quick Primary Action */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {isCertified ? (
              <button
                onClick={() => {
                  setCurrentView('certificate');
                  triggerConfetti();
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Official Certificate</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('adaptive-quiz')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{t.candidate.continueAssessment}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setCurrentView('assessment-results')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
            >
              View Full Report
            </button>
          </div>
        </div>

        {/* 4 Core Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">Profile Completion</span>
            <div className="text-xl font-bold text-white mt-1">{candidate.profileCompletion}%</div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${candidate.profileCompletion}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">Informal Experience</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{candidate.yearsOfExperience} Years</div>
            <span className="text-[10px] text-slate-400">Domestic & LT Wiring</span>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">AI Skill Confidence</span>
            <div className="text-xl font-bold text-sky-400 mt-1">{candidate.experienceConfidence}%</div>
            <span className="text-[10px] text-slate-400">7 Competencies Parsed</span>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium">Overall RPL Score</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{candidate.scores.overall}%</div>
            <span className="text-[10px] text-emerald-400 font-medium">Strong RPL Fit</span>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Skill Profile Card & RPL Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Skill Profile Card & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Skill Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-sky-600" />
                  AI-Extracted Skill Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Extracted automatically from voice description & verified evidence
                </p>
              </div>
              <button
                onClick={() => setCurrentView('ai-skill-profile')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Skill Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Extracted Skill Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {candidate.extractedSkills.map((skill, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${skill.confidence >= 90 ? 'text-emerald-600' : 'text-sky-600'}`} />
                    <span className="text-xs font-semibold text-slate-800 truncate">{skill.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0 ml-2">
                    {skill.confidence}%
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-sky-600" />
                7 core skills mapped to National Occupational Standards (NOS)
              </span>
              <button
                onClick={() => setCurrentView('experience-discovery')}
                className="font-bold text-sky-700 hover:underline cursor-pointer"
              >
                Re-describe Experience
              </button>
            </div>
          </div>

          {/* Assessment Modules Quick Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              onClick={() => setCurrentView('adaptive-quiz')}
              className="bg-white border border-slate-200 rounded-2xl p-4.5 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Knowledge Quiz</h4>
              <p className="text-[11px] text-slate-500 mb-2">Adaptive 4-level questions with regional language explainers.</p>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Score: {candidate.scores.knowledge}% (Passed)</span>
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('practical-video')}
              className="bg-white border border-slate-200 rounded-2xl p-4.5 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-105 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Practical Video Demo</h4>
              <p className="text-[11px] text-slate-500 mb-2">Computer vision tool detection & safety checks.</p>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Score: {candidate.scores.practical}% (Passed)</span>
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('evidence-verification')}
              className="bg-white border border-slate-200 rounded-2xl p-4.5 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">Workplace Evidence</h4>
              <p className="text-[11px] text-slate-500 mb-2">Experience letters & photo site proof verification.</p>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3 Documents Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: RPL Journey Progress & Assessor Status */}
        <div className="space-y-6">
          {/* Journey Roadmap Stepper */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              RPL Certification Milestones
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Experience Discovery</div>
                  <div className="text-[11px] text-slate-500">7 Yrs parsed from voice interview</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">AI Skill Profiling</div>
                  <div className="text-[11px] text-slate-500">NSQF Level 4 match confirmed</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Adaptive Knowledge & Voice</div>
                  <div className="text-[11px] text-slate-500">Knowledge: 89% | Voice: 89%</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Practical Computer Vision</div>
                  <div className="text-[11px] text-slate-500">85% score (PPE & tools verified)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Workplace Documentation</div>
                  <div className="text-[11px] text-slate-500">Employer letter authenticity 94%</div>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-bold ring-4 ring-emerald-100">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-700">Assessor Review & Approval</div>
                  <div className="text-[11px] text-slate-600">Authorized by Priya Sharma (Assessor)</div>
                </div>
              </div>
            </div>

            {/* Certificate Status Box */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>RPL Recognition Authorized</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-snug mb-3">
                  Certificate ID: <strong className="font-mono text-emerald-950">{candidate.certificateId || 'RPL-IND-2026-EL4-9842'}</strong>
                </p>
                <button
                  onClick={() => {
                    setCurrentView('certificate');
                    triggerConfetti();
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                >
                  View & Print Official Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
