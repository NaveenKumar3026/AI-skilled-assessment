import React, { useState } from 'react';
import { X, Sparkles, Phone, Mail, User, MapPin, Briefcase, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'register' }) => {
  const { setRole, setCurrentView, setCandidate, candidate, setLanguage } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [phone, setPhone] = useState('9840123456');
  const [otp, setOtp] = useState('4491');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [fullName, setFullName] = useState('Arun Kumar');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [experienceYears, setExperienceYears] = useState('7');
  const [primaryTrade, setPrimaryTrade] = useState('Electrician');
  const [preferredLang, setPreferredLang] = useState<Language>('en');

  if (!isOpen) return null;

  const handleQuickDemoFill = () => {
    setFullName('Arun Kumar');
    setPhone('9840123456');
    setLocation('Chennai, Tamil Nadu');
    setExperienceYears('7');
    setPrimaryTrade('Electrician');
    setPreferredLang('en');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidate((prev) => ({
      ...prev,
      name: fullName,
      phone: `+91 ${phone}`,
      location,
      yearsOfExperience: parseInt(experienceYears) || 7,
      primaryTrade,
    }));
    setLanguage(preferredLang);
    setRole('candidate');
    setCurrentView('candidate-dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {tab === 'register' ? 'Candidate RPL Registration' : 'Citizen / Assessor Login'}
              </h3>
              <p className="text-xs text-slate-300">National Skill Recognition & NSQF Certification Portal</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-xl mt-5 border border-slate-700">
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              New Candidate Register
            </button>
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mobile OTP Login
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Demo Pre-fill Helper */}
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs text-amber-900 font-medium">Hackathon Evaluator Fast-Track</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer"
            >
              Auto-Fill Arun Kumar (7 Yrs)
            </button>
          </div>

          {tab === 'register' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Arun Kumar"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Occupation / Trade</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={primaryTrade}
                      onChange={(e) => setPrimaryTrade(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    >
                      <option value="Electrician">Electrician (Domestic & Commercial)</option>
                      <option value="Welder">Shielded Metal Arc Welder (SMAW)</option>
                      <option value="Plumber">Plumber (General)</option>
                      <option value="Solar Technician">Solar PV System Installer</option>
                      <option value="Tailor">Apparel & Garment Tailor</option>
                      <option value="Mechanic">Automotive Service Mechanic</option>
                      <option value="Carpenter">Carpenter & Wooden Joinery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Informal Experience</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    >
                      <option value="2">2 - 3 Years</option>
                      <option value="5">4 - 6 Years</option>
                      <option value="7">7 - 10 Years</option>
                      <option value="12">10+ Years (Master Craftsman)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Location / City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Chennai, Tamil Nadu"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Assessment Language</label>
                  <select
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value as Language)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="en">English (English)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98401 23456"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
                  />
                </div>
              </div>

              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={() => setIsOtpSent(true)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors"
                >
                  Send One-Time Password (OTP)
                </button>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-emerald-300 rounded-lg text-sm text-slate-800 font-mono tracking-widest text-center"
                    placeholder="4491"
                  />
                  <p className="text-[11px] text-emerald-600 mt-1">✓ Demo OTP 4491 verified</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 text-sm transition-all cursor-pointer"
            >
              <span>{tab === 'register' ? 'Register & Start AI Assessment' : 'Login to Candidate Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
