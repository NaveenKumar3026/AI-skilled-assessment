import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Eye, 
  Trash2, 
  ArrowRight, 
  ShieldCheck,
  Building,
  Calendar,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { EvidenceDocument } from '../../types';
import { AIBadge } from '../common/AIBadge';

export const EvidenceVerification: React.FC = () => {
  const { evidenceDocs, addEvidenceDoc, setCurrentView, t } = useApp();
  const [selectedDocId, setSelectedDocId] = useState<string>(evidenceDocs[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);

  const selectedDoc = evidenceDocs.find((d) => d.id === selectedDocId) || evidenceDocs[0];

  const handleSimulateUpload = async () => {
    setIsUploading(true);
    try {
      const newDocData = await AIService.analyzeEvidence(
        'Government_Subcontractor_Work_Affidavit.pdf',
        'contractor_affidavit'
      );
      const fullDoc: EvidenceDocument = {
        id: newDocData.id || `doc-${Date.now()}`,
        fileName: newDocData.fileName || 'Workplace_Evidence.pdf',
        fileType: 'contractor_affidavit',
        fileSize: '2.1 MB',
        uploadDate: newDocData.uploadDate || '06-Oct-2026',
        aiVerificationStatus: 'verified',
        aiRelevanceScore: 95,
        extractedData: newDocData.extractedData || {
          employerOrContractor: 'Tamil Nadu Electricity Board (TNEB) Registered Contractor',
          statedRole: 'Senior Electrical Wireman',
          duration: '2020 – 2026',
          detectedSkills: ['Conduit Wiring', 'Distribution Board Assembly', 'Safety Lockout'],
          tamperingRisk: 'Low',
        },
      };
      addEvidenceDoc(fullDoc);
      setSelectedDocId(fullDoc.id);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Phase 7: Workplace Evidence
            </span>
            <AIBadge confidence={94} text="AI OCR & Authenticity Extraction" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Workplace Documentation & Evidence Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload contractor letters, site photos, or affidavits — parsed by AI for occupational verification.
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer self-start md:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{isUploading ? 'Extracting OCR Entities...' : '+ Upload Sample Evidence Document'}</span>
        </button>
      </div>

      {/* Main Grid: Upload List & AI OCR Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Documents List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Uploaded Evidence Files ({evidenceDocs.length})</h3>
              <span className="text-[11px] text-slate-500">Click to inspect AI extracted entities</span>
            </div>

            <div className="space-y-2.5">
              {evidenceDocs.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{doc.fileName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span>Uploaded {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-emerald-600 block">{doc.aiRelevanceScore}%</span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {doc.aiVerificationStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: AI OCR Entity Extraction Details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 h-full flex flex-col justify-between">
            {selectedDoc ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <h3 className="text-sm font-bold text-slate-900">AI OCR Entity Extraction</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {selectedDoc.aiRelevanceScore}% Trade Relevance
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Employer / Contractor</span>
                    <div className="font-semibold text-slate-900">{selectedDoc.extractedData.employerOrContractor}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Stated Role</span>
                      <div className="font-semibold text-slate-900">{selectedDoc.extractedData.statedRole}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Verified Duration</span>
                      <div className="font-semibold text-slate-900">{selectedDoc.extractedData.duration}</div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Detected Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedDoc.extractedData.detectedSkills.map((sk, idx) => (
                        <span key={idx} className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Document Authenticity Risk:</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                      Low Tampering Risk
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-snug">
                  <strong>Notice:</strong> Document OCR extraction is an AI-assisted recommendation. Official physical verification is confirmed by the assigned assessor.
                </div>
              </div>
            ) : null}

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentView('skill-gaps')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                <span>Proceed to Skill Gap & Bridging Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
