import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Database,
  Plus,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { useApp } from '../../context/AppContext';
import { JOB_ROLES } from '../../services/mockData';
import { AIBadge } from '../common/AIBadge';

export const AdminDashboard: React.FC = () => {
  const { auditLogs, t } = useApp();

  // State analytics data
  const stateData = [
    { state: 'Tamil Nadu', candidates: 94200, certified: 88400 },
    { state: 'Maharashtra', candidates: 86500, certified: 81200 },
    { state: 'Uttar Pradesh', candidates: 78900, certified: 72600 },
    { state: 'Gujarat', candidates: 64100, certified: 60500 },
    { state: 'Karnataka', candidates: 58400, certified: 54800 },
    { state: 'Kerala', candidates: 48200, certified: 45900 },
  ];

  // Monthly certification trend
  const trendData = [
    { month: 'Apr', assessments: 24000, certified: 22100 },
    { month: 'May', assessments: 31000, certified: 28900 },
    { month: 'Jun', assessments: 38000, certified: 35400 },
    { month: 'Jul', assessments: 44000, certified: 41200 },
    { month: 'Aug', assessments: 51000, certified: 47800 },
    { month: 'Sep', assessments: 59000, certified: 55400 },
    { month: 'Oct', assessments: 68000, certified: 63800 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              National Directorate Admin
            </span>
            <AIBadge text="MSDE Real-Time Telemetry" showInfoButton={false} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            National RPL Telemetry & Skill Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Macro insights across all Sector Skill Councils, State Skill Missions, and Assessment Centers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 self-start md:self-auto">
          <Activity className="w-4 h-4 text-purple-600 animate-pulse" />
          <span>Live Telemetry Active</span>
        </div>
      </div>

      {/* 4 Macro Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">Total Registered Workers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">4,82,450</div>
          <span className="text-[11px] text-emerald-800 font-semibold mt-0.5 block flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this quarter
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">Certified NSQF Candidates</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">4,50,600</div>
          <span className="text-[11px] text-slate-700 font-semibold mt-0.5 block">93.4% Validation Rate</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">AI-Assessor Concordance</span>
          <div className="text-2xl font-black text-sky-800 mt-1">94.8%</div>
          <span className="text-[11px] text-sky-800 font-semibold mt-0.5 block">High Model Reliability</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">Authorized Evaluators</span>
          <div className="text-2xl font-black text-purple-800 mt-1">2,480</div>
          <span className="text-[11px] text-purple-800 font-semibold mt-0.5 block">Active across 36 States/UTs</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: State wise candidates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">RPL Candidates by State (Top 6)</h3>
            <span className="text-xs font-semibold text-slate-400">Total Volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="candidates" name="Assessed" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="certified" name="Certified" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Monthly RPL Assessment & Certification Growth</h3>
            <span className="text-xs font-semibold text-emerald-600">FY 2026-27</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAssess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCert" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="assessments" name="Assessments" stroke="#0284c7" fillOpacity={1} fill="url(#colorAssess)" />
                <Area type="monotone" dataKey="certified" name="Certified" stroke="#10b981" fillOpacity={1} fill="url(#colorCert)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live System Audit Logs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Security & Assessment Audit Trail</h3>
            <p className="text-[11px] text-slate-500">Immutable logging of candidate activities, AI engine inference, and assessor authorizations.</p>
          </div>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.2 rounded font-semibold border border-sky-200">
                    {log.actor} ({log.role})
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{log.details}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
