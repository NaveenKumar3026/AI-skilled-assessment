import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Mic, 
  BrainCircuit, 
  Compass, 
  CheckSquare, 
  Video, 
  FileText, 
  TrendingUp, 
  Award, 
  Settings, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { role, currentView, setCurrentView, candidate } = useApp();

  // Navigation configurations based on role
  const candidateNavItems = [
    { id: 'candidate-dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'experience-discovery', label: 'AI Experience Discovery', icon: Mic, badge: 'AI' },
    { id: 'ai-skill-profile', label: 'AI Skill Profile', icon: BrainCircuit, badge: `${candidate.experienceConfidence}%` },
    { id: 'job-roles', label: 'RPL Job Pathways', icon: Compass, badge: '3 Matches' },
    { id: 'adaptive-quiz', label: 'Knowledge Quiz', icon: CheckSquare, badge: 'Adaptive' },
    { id: 'voice-assessment', label: 'Voice Assessment', icon: Mic, badge: 'Audio' },
    { id: 'practical-video', label: 'Practical Video CV', icon: Video, badge: 'Vision' },
    { id: 'evidence-verification', label: 'Workplace Evidence', icon: FileText, badge: '3 Docs' },
    { id: 'skill-gaps', label: 'Skill Gaps & Bridge', icon: TrendingUp, badge: '1 Gap' },
    { id: 'assessment-results', label: 'Assessment Report', icon: FileCheck, badge: `${candidate.scores.overall}%` },
    { 
      id: 'certificate', 
      label: 'RPL Certificate', 
      icon: Award, 
      badge: candidate.assessmentStatus === 'certified' ? 'Issued' : 'Preview' 
    },
  ];

  const assessorNavItems = [
    { id: 'assessor-dashboard', label: 'Evaluation Queue', icon: Users, badge: '42 Pending' },
    { id: 'assessor-review', label: 'Candidate Audit Desk', icon: ShieldCheck, badge: 'Arun Kumar' },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'National RPL Analytics', icon: BarChart3, badge: 'Live' },
  ];

  const items = role === 'candidate' ? candidateNavItems : role === 'assessor' ? assessorNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 shrink-0 hidden lg:flex flex-col border-r border-slate-800 select-none">
      {/* Role Profile Info Card */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={role === 'candidate' ? candidate.avatarUrl : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} 
              alt="Avatar" 
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">
              {role === 'candidate' ? candidate.name : role === 'assessor' ? 'Priya Sharma' : 'MSDE Admin'}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {role === 'candidate' ? `${candidate.primaryTrade} (${candidate.yearsOfExperience} Yrs)` : role === 'assessor' ? 'Senior RPL Evaluator' : 'National Directorate'}
            </p>
          </div>
        </div>

        {role === 'candidate' && (
          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400">RPL Readiness</span>
              <span className="text-sky-400 font-bold">{candidate.scores.overall}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-linear-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${candidate.scores.overall}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 py-1.5">
          {role === 'candidate' ? 'Candidate Workflow' : role === 'assessor' ? 'Assessor Workspace' : 'Administration'}
        </div>

        {items.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ActiveView)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-sky-700/80 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Help / Call Support */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/30">
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Assistance?</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Use voice input or click <strong className="text-slate-200">"Explain in Simple Words"</strong> on any question.
          </p>
        </div>
      </div>
    </aside>
  );
};
