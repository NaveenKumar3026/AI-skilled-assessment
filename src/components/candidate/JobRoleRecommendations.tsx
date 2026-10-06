import React from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Users, 
  Zap, 
  Briefcase,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JOB_ROLES } from '../../services/mockData';
import { AIBadge } from '../common/AIBadge';

export const JobRoleRecommendations: React.FC = () => {
  const { candidate, setCandidate, setCurrentView, t, addAuditLog } = useApp();

  const handleSelectRole = (roleId: string, roleTitle: string, nsqfLevel: number) => {
    setCandidate((prev) => ({
      ...prev,
      selectedJobRole: roleId,
      nsqfTargetLevel: nsqfLevel,
    }));
    addAuditLog('RPL Pathway Selected', `Selected qualification: ${roleTitle} (NSQF Level ${nsqfLevel})`, candidate.name);
    setCurrentView('adaptive-quiz');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Phase 3: RPL Pathway Matching
              </span>
              <AIBadge confidence={94} text="AI Occupational Matcher" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Recommended National RPL Qualifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Based on your 7 years of work experience, our AI engine has matched these top NSQF qualifications.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Highest Match: 92%</span>
          </div>
        </div>
      </div>

      {/* 3 Interactive Pathway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {JOB_ROLES.map((role) => {
          const isSelected = candidate.selectedJobRole === role.id;
          return (
            <div
              key={role.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'border-sky-500 ring-2 ring-sky-200 shadow-md'
                  : 'border-slate-200 hover:border-sky-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Match percentage badge & NSQF Level */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    role.matchScore >= 90
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : role.matchScore >= 80
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {role.matchScore}% Skill Match
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[11px]">
                    NSQF Level {role.nsqfLevel}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">{role.title}</h3>
                <p className="text-[11px] text-sky-700 font-semibold mb-3">{role.sector}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{role.description}</p>

                {/* Required Competencies list */}
                <div className="space-y-1.5 mb-5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Key Competency Standards
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.requiredSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Demand & Wage growth info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 mb-5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Market Demand:</span>
                    <span className="font-bold text-emerald-600">{role.demandLevel}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Wage Impact:</span>
                    <span className="font-bold text-slate-800">{role.avgSalaryGrowth}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectRole(role.id, role.title, role.nsqfLevel)}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-sky-600 hover:bg-sky-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{isSelected ? 'Continue Assessment for This Role' : 'Select Pathway & Start Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
