import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  User, 
  ShieldCheck, 
  Settings2, 
  Menu, 
  X, 
  Award,
  BookOpen,
  HelpCircle,
  BarChart3,
  Layers
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { Language, UserRole } from '../../types';

export const Header: React.FC<{ onOpenAuth?: () => void }> = ({ onOpenAuth }) => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    currentView, 
    setCurrentView,
    triggerDemoStep,
    candidate
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'candidate') {
      setCurrentView('candidate-dashboard');
    } else if (newRole === 'assessor') {
      setCurrentView('assessor-dashboard');
    } else if (newRole === 'admin') {
      setCurrentView('admin-dashboard');
    }
  };

  const navItems: { label: string; view: ActiveView; icon: any }[] = [
    { label: t.nav.home, view: 'landing', icon: Sparkles },
    ...(role === 'candidate' ? [
      { label: 'My RPL Journey', view: 'candidate-dashboard' as ActiveView, icon: Award },
      { label: 'AI Experience', view: 'experience-discovery' as ActiveView, icon: BookOpen },
      { label: 'Assessments', view: 'adaptive-quiz' as ActiveView, icon: Layers },
      { label: 'Practical Demo', view: 'practical-video' as ActiveView, icon: BarChart3 },
      { label: 'My Certificate', view: 'certificate' as ActiveView, icon: Award },
    ] : role === 'assessor' ? [
      { label: 'Assessor Desk', view: 'assessor-dashboard' as ActiveView, icon: ShieldCheck },
      { label: 'Candidate Review', view: 'assessor-review' as ActiveView, icon: User },
    ] : [
      { label: 'National Analytics', view: 'admin-dashboard' as ActiveView, icon: BarChart3 },
    ])
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Government of India Top Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="font-semibold text-slate-100">{t.msdeBadge}</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">Smart India Hackathon SIH26242</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-white text-xs border-none focus:outline-hidden cursor-pointer font-medium"
              >
                <option value="en" className="bg-slate-900 text-white">English (EN)</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-md border border-slate-700">
              <button
                onClick={() => handleRoleChange('candidate')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  role === 'candidate' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Candidate
              </button>
              <button
                onClick={() => handleRoleChange('assessor')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  role === 'assessor' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Assessor
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  role === 'admin' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">{t.appName}</span>
                <span className="px-1.5 py-0.2 bg-sky-100 text-sky-800 text-[10px] font-bold rounded-sm border border-sky-300">
                  RPL 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">Your Experience. Your Skills. Your Recognition.</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Demo Walkthrough Trigger */}
            <button
              onClick={() => triggerDemoStep(1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-900 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>{t.nav.demoMode}</span>
            </button>

            {/* Profile Avatar / Logged in indicator */}
            <div 
              onClick={() => setCurrentView(role === 'candidate' ? 'candidate-dashboard' : role === 'assessor' ? 'assessor-dashboard' : 'admin-dashboard')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden">
                <img 
                  src={role === 'candidate' ? candidate.avatarUrl : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} 
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-800">
                  {role === 'candidate' ? candidate.name : role === 'assessor' ? 'Priya Sharma' : 'MSDE Admin'}
                </div>
                <div className="text-[10px] text-slate-700 capitalize font-medium">{role}</div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentView === item.view
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4 text-sky-600" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                triggerDemoStep(1);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav.demoMode}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
