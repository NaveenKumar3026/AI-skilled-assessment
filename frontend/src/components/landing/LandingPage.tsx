import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Mic, 
  Video, 
  BrainCircuit, 
  ShieldCheck, 
  TrendingUp, 
  Globe2, 
  FileCheck2, 
  Users, 
  Zap, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIBadge } from '../common/AIBadge';

export const LandingPage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { t, setCurrentView, triggerDemoStep } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const domains = [
    { title: 'Electrical & Power', icon: '⚡', trades: 'Electrician, Wireman, Panel Board Specialist', count: '14,200+ Assessed', nsqf: 'Level 4' },
    { title: 'Welding & Fabrication', icon: '🔥', trades: 'SMAW 3G/4G Welder, Gas Cutter, TIG Welder', count: '9,800+ Assessed', nsqf: 'Level 4' },
    { title: 'Renewable & Solar Energy', icon: '☀️', trades: 'Solar PV Installer, Rooftop Inverter Tech', count: '6,400+ Assessed', nsqf: 'Level 4' },
    { title: 'Plumbing & Sanitation', icon: '🔧', trades: 'General Plumber, Pipe Fitter, Sanitary Wireman', count: '8,100+ Assessed', nsqf: 'Level 4' },
    { title: 'Apparel & Garments', icon: '🪡', trades: 'Self-Employed Tailor, Pattern Master, Finisher', count: '11,500+ Assessed', nsqf: 'Level 3' },
    { title: 'Automotive & Mobility', icon: '🚗', trades: 'Two-Wheeler / Four-Wheeler Service Tech', count: '10,300+ Assessed', nsqf: 'Level 4' },
    { title: 'Construction & Carpentry', icon: '🏗️', trades: 'Mason, Wooden Joinery Carpenter, Bar Bender', count: '15,600+ Assessed', nsqf: 'Level 4' },
    { title: 'Healthcare & Wellness', icon: '🩺', trades: 'General Duty Assistant, Home Health Aide', count: '7,900+ Assessed', nsqf: 'Level 4' },
  ];

  const faqs = [
    {
      q: "What is Recognition of Prior Learning (RPL)?",
      a: "Recognition of Prior Learning (RPL) is a government initiative under the Ministry of Skill Development and Entrepreneurship (MSDE) that assesses and certifies skills acquired by individuals through informal work experience, family occupations, apprenticeships, or on-the-job self-learning, giving them formal NSQF equivalence."
    },
    {
      q: "Do I need formal educational certificates to participate?",
      a: "No! SkillSet AI is specifically built for workers without formal school or college certificates. You can describe your experience naturally using regional voice input, demonstrate your practical skills on video, and take an adaptive visual quiz."
    },
    {
      q: "Does AI decide whether I pass or fail?",
      a: "No. The AI provides objective preliminary evaluations, tool detection, safety checks, and question personalization. The final certification decision is always authenticated and signed by a certified National RPL Assessor."
    },
    {
      q: "Which languages are supported?",
      a: "The prototype provides full support for English, Tamil (தமிழ்), and Hindi (हिन्दी), with architectural readiness for Telugu, Kannada, Malayalam, Bengali, and Marathi voice interfaces."
    },
    {
      q: "Is the certificate recognized across India?",
      a: "Yes. Certificates mapped to the National Skills Qualification Framework (NSQF) are recognized nationwide for formal employment, bank micro-loans (PM Mudra / PM Vishwakarma), government tenders, and overseas employment."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-5 backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{t.hero.tagline} • SIH26242 Smart Education</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-5">
              {t.hero.title}{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 via-teal-300 to-amber-300">
                {t.hero.highlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => {
                  onOpenAuth();
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer hover:scale-102"
              >
                <span>{t.hero.startBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => triggerDemoStep(1)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-semibold text-sm transition-all cursor-pointer backdrop-blur-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch Interactive Demo Story</span>
              </button>
            </div>
          </div>

          {/* REALISTIC HERO FLOW ILLUSTRATION */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">End-to-End RPL Digital Pipeline</span>
              </div>
              <AIBadge confidence={94} text="Multi-Modal AI Pipeline" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div 
                onClick={() => setCurrentView('experience-discovery')}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wide mb-1">Step 1 • Experience</div>
                <h4 className="text-sm font-bold text-white mb-1">Voice & NLP Discovery</h4>
                <p className="text-xs text-slate-400 leading-snug">Describe work experience naturally; AI extracts years, trade vocabulary, and tools.</p>
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => setCurrentView('adaptive-quiz')}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wide mb-1">Step 2 • Knowledge</div>
                <h4 className="text-sm font-bold text-white mb-1">Adaptive Domain Quiz</h4>
                <p className="text-xs text-slate-400 leading-snug">Dynamic difficulty questions with regional voice explanations for limited literacy.</p>
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => setCurrentView('practical-video')}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wide mb-1">Step 3 • Demonstration</div>
                <h4 className="text-sm font-bold text-white mb-1">Computer Vision CV</h4>
                <p className="text-xs text-slate-400 leading-snug">Candidate records practical task; AI verifies PPE, tool handling, and posture safety.</p>
              </div>

              {/* Step 4 */}
              <div 
                onClick={() => setCurrentView('assessor-dashboard')}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide mb-1">Step 4 • Certification</div>
                <h4 className="text-sm font-bold text-white mb-1">Assessor Validation</h4>
                <p className="text-xs text-slate-400 leading-snug">Human evaluator audits AI observations, validates evidence, and signs NSQF certificate.</p>
              </div>
            </div>
          </div>

          {/* National Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
              <div className="text-xl sm:text-2xl font-black text-white">4.8 Lakh+</div>
              <div className="text-xs text-slate-400 mt-0.5">Informal Workers Assessed</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">93.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Assessor Validation Concordance</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
              <div className="text-xl sm:text-2xl font-black text-sky-400">150+</div>
              <div className="text-xs text-slate-400 mt-0.5">NSQF Certified Job Roles</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
              <div className="text-xl sm:text-2xl font-black text-amber-400">12</div>
              <div className="text-xs text-slate-400 mt-0.5">Regional Indian Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY RPL MATTERS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Socio-Economic Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-3">
            Why Recognition of Prior Learning Matters in India
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Over 90% of India's skilled workforce learns on the job or through family traditions. Without formal papers, they face lower wages, zero credit access, and limited career mobility. SkillSet AI bridges this gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">35% Average Wage Enhancement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Certified workers with NSQF credentials qualify for government contractors, commercial contracts, and standardized wage brackets under PM Vishwakarma.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Formal Financial & Loan Inclusion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              RPL certificates serve as verified proof of occupational competence for collateral-free bank loans under PM Mudra Yojana and SIDBI.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Overseas Migration & Mobility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              NSQF Level 4 certificates align with international vocational qualification frameworks across GCC, EU, and Southeast Asian employment agreements.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORTED SKILL DOMAINS */}
      <section className="py-14 bg-slate-100/70 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vocational Diversity</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Supported High-Impact Skill Domains</h2>
              <p className="text-xs text-slate-600 mt-1">Covering 150+ Sector Skill Council (SSC) occupational standards</p>
            </div>
            <button
              onClick={() => setCurrentView('job-roles')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer self-start md:self-auto"
            >
              <span>Explore All 150+ Job Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {domains.map((d, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentView('experience-discovery')}
                className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{d.icon}</div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{d.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 my-1.5">{d.trades}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-400">{d.count}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">{d.nsqf}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI ASSESSMENT HIGHLIGHTS & ARCHITECTURE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <AIBadge text="Next-Generation Multi-Modal AI" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
            Engineered for Accessibility & Real-World Accuracy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            How our AI engines process voice, video, and experience without replacing human governance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-sky-400 text-xs font-bold uppercase mb-2">
              <Mic className="w-4 h-4" />
              <span>Vernacular Voice & Experience Extraction</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero-Friction Conversational Interview</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Workers describe their work in spoken Hindi, Tamil, or conversational English. Whisper-Gov Speech-to-Text and NLP models map their colloquial trade vocabulary into standardized NSQF competencies.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-700/60 font-mono text-[11px] text-slate-300">
              <span className="text-emerald-400">Input:</span> "7 years house wiring, repair fan, MCB board..."<br/>
              <span className="text-sky-400">AI Output:</span> 92% match ➔ Electrician Level 4 (Conduit, DB dressing)
            </div>
          </div>

          <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-amber-400 text-xs font-bold uppercase mb-2">
              <Video className="w-4 h-4" />
              <span>Computer Vision Practical Evaluation</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Tool & Safety Posture Detection</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              During video demonstration tasks, custom vision models track PPE compliance (gloves, eye protection), tool handling precision, and flag omitted safety isolation steps on a frame-by-frame timeline.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-700/60 font-mono text-[11px] text-slate-300">
              <span className="text-emerald-400">✓ Detected:</span> 1000V Insulated Gloves, VDE Screwdriver<br/>
              <span className="text-amber-400">⚠ Observation:</span> Neutral connection clamp checked at 00:32
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-14 bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Questions About RPL Assessment</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-900 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="bg-sky-600 text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Ready to Certify Your Practical Experience?
          </h2>
          <p className="text-sm text-sky-100 max-w-xl mx-auto mb-6">
            Join over 4.8 lakh skilled Indian craftspersons. Experience the seamless AI-assisted RPL evaluation workflow today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
            >
              Start Skill Assessment Now
            </button>
            <button
              onClick={() => triggerDemoStep(1)}
              className="px-6 py-3 bg-white text-sky-800 hover:bg-sky-50 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Launch Hackathon Guided Walkthrough
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
