import React from 'react';
import { Award, Phone, Mail, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { t, setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 md:pb-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SkillSet AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Recognition of Prior Learning (RPL) transforming informal experience into nationally recognized NSQF qualifications under Ministry of Skill Development and Entrepreneurship (MSDE).
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400 pt-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>NCVET Framework Compliant</span>
            </div>
          </div>

          {/* Supported Trades */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Core RPL Sectors</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('experience-discovery')}>
                ⚡ Electrical & Electronics (ESSCI)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('experience-discovery')}>
                🔧 Capital Goods & Welding (CGSC)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('experience-discovery')}>
                ☀️ Green Jobs & Solar Installation (SCGJ)
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('experience-discovery')}>
                🪡 Apparel, Made-Ups & Home Furnishing
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('experience-discovery')}>
                🚗 Automotive Service & Maintenance (ASDC)
              </li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Candidate Workflow</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('experience-discovery')}>
                Voice Experience Interview
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('ai-skill-profile')}>
                AI Skill Profiling Radar
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('adaptive-quiz')}>
                Adaptive Knowledge Quiz
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('practical-video')}>
                Computer Vision Practical Demo
              </li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('evidence-verification')}>
                Workplace Evidence Verification
              </li>
            </ul>
          </div>

          {/* National Helpline & Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Toll-Free RPL Helpline</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-semibold">1800-123-9626 (Kaushal Vikas)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>support-rpl@msde.gov.in</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                Operating Hours: 09:00 AM – 06:00 PM IST (Mon–Sat) in 12 Indian Languages
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer and Hackathon Attribution */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SkillSet AI • Ministry of Skill Development and Entrepreneurship (MSDE).
          </div>
          <div className="text-center md:text-right text-[11px] text-amber-400/90 font-medium">
            Smart India Hackathon SIH26242 Prototype • AI aids assessment; final recognition is authorized by certified assessors.
          </div>
        </div>
      </div>
    </footer>
  );
};
