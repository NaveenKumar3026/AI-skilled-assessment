import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileCheck2, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CandidateProfile } from '../../types';
import { AIBadge } from '../common/AIBadge';

export const AssessorDashboard: React.FC = () => {
  const { assessorQueue, setSelectedCandidateForReview, setCurrentView, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrade, setFilterTrade] = useState('all');

  const filteredCandidates = assessorQueue.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.primaryTrade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrade = filterTrade === 'all' || c.primaryTrade.toLowerCase().includes(filterTrade.toLowerCase());
    return matchesSearch && matchesTrade;
  });

  const handleReviewCandidate = (candidate: CandidateProfile) => {
    setSelectedCandidateForReview(candidate);
    setCurrentView('assessor-review');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Evaluator Portal
            </span>
            <AIBadge text="Assessor Authorized Desk" showInfoButton={false} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t.assessor.portalTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluator: <strong className="text-slate-800">Priya Sharma (Assessor ID: ASS-TN-094)</strong> • Regional Council: Tamil Nadu NSDC
          </p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl max-w-sm text-[11px] text-amber-900 leading-snug">
          <strong>Governance Principle:</strong> {t.assessor.aiNotice}
        </div>
      </div>

      {/* 4 Assessor Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">{t.assessor.awaitingReview}</span>
          <div className="text-2xl font-black text-slate-900 mt-1">42</div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">8 High-Priority</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">{t.assessor.assessmentsCompleted}</span>
          <div className="text-2xl font-black text-slate-900 mt-1">128</div>
          <span className="text-[11px] text-sky-700 font-semibold mt-0.5 block">This Month</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">{t.assessor.pendingVerification}</span>
          <div className="text-2xl font-black text-slate-900 mt-1">17</div>
          <span className="text-[11px] text-slate-700 font-semibold mt-0.5 block">Awaiting Physical Audit</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-700 block">{t.assessor.certifiedCandidates}</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">96</div>
          <span className="text-[11px] text-emerald-800 font-semibold mt-0.5 block">93.4% Approval Rate</span>
        </div>
      </div>

      {/* Candidate Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Assessor Review Queue</h3>

          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate name or trade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 w-56"
              />
            </div>

            <select
              value={filterTrade}
              onChange={(e) => setFilterTrade(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Trades</option>
              <option value="electrician">Electrician</option>
              <option value="tailor">Tailor</option>
              <option value="welder">Welder</option>
              <option value="mechanic">Mechanic</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Candidate</th>
                <th className="p-3">Trade & NSQF Target</th>
                <th className="p-3 text-center">AI Holistic</th>
                <th className="p-3 text-center">Practical Demo</th>
                <th className="p-3">Workplace Evidence</th>
                <th className="p-3">Decision Status</th>
                <th className="p-3 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((c) => {
                const isApproved = c.assessorDecision === 'approved' || c.assessmentStatus === 'certified';
                const isReassess = c.assessorDecision === 'reassessment' || c.assessmentStatus === 'reassessment_needed';

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.location} • {c.yearsOfExperience} Yrs</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{c.primaryTrade}</div>
                      <div className="text-[10px] text-sky-600 font-medium">NSQF Level {c.nsqfTargetLevel}</div>
                    </td>

                    <td className="p-3 text-center font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{c.scores.overall}%</span>
                    </td>

                    <td className="p-3 text-center font-bold text-emerald-600">
                      <span className="bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200">{c.scores.practical}%</span>
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>

                    <td className="p-3">
                      {isApproved ? (
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          ✓ Approved & Certified
                        </span>
                      ) : isReassess ? (
                        <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                          Reassessment
                        </span>
                      ) : (
                        <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                          Awaiting Sign-off
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleReviewCandidate(c)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                      >
                        <span>Audit Desk</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
