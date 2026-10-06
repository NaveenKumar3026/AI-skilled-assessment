import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Compass,
  Zap,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { AIBadge } from '../common/AIBadge';

export const AISkillProfile: React.FC = () => {
  const { candidate, setCurrentView, t } = useApp();

  // Radar chart data comparing candidate's detected skills vs NSQF Level 4 Benchmark
  const radarData = [
    { subject: 'Wiring & Conduit', candidate: 95, benchmark: 80, fullMark: 100 },
    { subject: 'Electrical Safety', candidate: 96, benchmark: 85, fullMark: 100 },
    { subject: 'DB & MCB Assembly', candidate: 91, benchmark: 75, fullMark: 100 },
    { subject: 'Circuit Testing', candidate: 89, benchmark: 75, fullMark: 100 },
    { subject: 'Earth Testing', candidate: 88, benchmark: 70, fullMark: 100 },
    { subject: 'Fault Troubleshooting', candidate: 72, benchmark: 80, fullMark: 100 },
    { subject: 'Customer Estimate', candidate: 84, benchmark: 65, fullMark: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Phase 2: Intelligence Profiling
            </span>
            <AIBadge confidence={candidate.experienceConfidence} text="NSQF Mapped" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t.candidate.skillProfileTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.candidate.skillProfileSubtitle}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('job-roles')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <span>{t.candidate.viewRecommendations}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Radar Chart + Skill Decomposition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Graph Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-sky-600" />
                  <span>{t.candidate.radarTitle}</span>
                </h3>
                <p className="text-[11px] text-slate-500">Candidate vs National Standard Benchmark</p>
              </div>
              <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                NSQF Level {candidate.nsqfTargetLevel}
              </span>
            </div>

            {/* Recharts Radar Visualization */}
            <div className="h-68 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <Radar name="Candidate Proficiency" dataKey="candidate" stroke="#0284c7" fill="#0284c7" fillOpacity={0.45} />
                  <Radar name="NSQF Level 4 Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 leading-snug">
              <strong>Notice:</strong> AI-generated profile based on experience discovery. All competency indicators require validation by an authorized RPL assessor.
            </div>
          </div>
        </div>

        {/* Structured Competencies Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">National Occupational Standards (NOS) Mapping</h3>
              <p className="text-[11px] text-slate-500">Breakdown of validated competencies against Indian Electricity Standards</p>
            </div>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              {candidate.extractedSkills.length} Standards Mapped
            </span>
          </div>

          {/* Skill Progress Bar Items */}
          <div className="space-y-3">
            {candidate.extractedSkills.map((sk, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      sk.category === 'safety' ? 'bg-emerald-500' :
                      sk.category === 'diagnostic' ? 'bg-amber-500' :
                      sk.category === 'soft' ? 'bg-purple-500' : 'bg-sky-500'
                    }`}></span>
                    <span className="font-bold text-slate-900">{sk.name}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-white text-slate-700 font-semibold border border-slate-200">
                      {sk.level}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-800 text-xs">{sk.confidence}%</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sk.confidence >= 90 ? 'bg-emerald-500' :
                      sk.confidence >= 80 ? 'bg-sky-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${sk.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Matches <strong className="text-slate-800">3 RPL Certification Pathways</strong>
            </span>
            <button
              onClick={() => setCurrentView('job-roles')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <span>Select Job Pathway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
