import React, { createContext, useContext, useState } from 'react';
import { UserRole, Language, CandidateProfile, EvidenceDocument, AuditLogItem } from '../types';
import { INITIAL_CANDIDATE, ASSESSOR_CANDIDATE_QUEUE, EVIDENCE_DOCUMENTS, AUDIT_LOGS } from '../services/mockData';
import { translations, Translations } from '../i18n/translations';
import confetti from 'canvas-confetti';

export type ActiveView = 
  | 'landing'
  | 'candidate-dashboard'
  | 'experience-discovery'
  | 'ai-skill-profile'
  | 'job-roles'
  | 'adaptive-quiz'
  | 'voice-assessment'
  | 'practical-video'
  | 'evidence-verification'
  | 'skill-gaps'
  | 'assessment-results'
  | 'certificate'
  | 'assessor-dashboard'
  | 'assessor-review'
  | 'admin-dashboard';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  candidate: CandidateProfile;
  setCandidate: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  assessorQueue: CandidateProfile[];
  setAssessorQueue: React.Dispatch<React.SetStateAction<CandidateProfile[]>>;
  selectedCandidateForReview: CandidateProfile | null;
  setSelectedCandidateForReview: (cand: CandidateProfile | null) => void;
  evidenceDocs: EvidenceDocument[];
  addEvidenceDoc: (doc: EvidenceDocument) => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, details: string, actor?: string) => void;
  isScoreModalOpen: boolean;
  setIsScoreModalOpen: (open: boolean) => void;
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
  demoStepIndex: number;
  setDemoStepIndex: (step: number) => void;
  triggerDemoStep: (step: number) => void;
  resetCandidateDemo: () => void;
  approveCandidateByAssessor: (candId: string, remarks: string, scoreOverrides?: Partial<CandidateProfile['scores']>) => void;
  requestReassessmentByAssessor: (candId: string, remarks: string) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('candidate');
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ActiveView>('landing');
  const [candidate, setCandidate] = useState<CandidateProfile>(INITIAL_CANDIDATE);
  const [assessorQueue, setAssessorQueue] = useState<CandidateProfile[]>(ASSESSOR_CANDIDATE_QUEUE);
  const [selectedCandidateForReview, setSelectedCandidateForReview] = useState<CandidateProfile | null>(INITIAL_CANDIDATE);
  const [evidenceDocs, setEvidenceDocs] = useState<EvidenceDocument[]>(EVIDENCE_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(AUDIT_LOGS);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isDemoTourActive, setIsDemoTourActive] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);

  const t = translations[language] || translations.en;

  const addEvidenceDoc = (doc: EvidenceDocument) => {
    setEvidenceDocs((prev) => [doc, ...prev]);
    setCandidate((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        evidence: 92,
      },
      profileCompletion: Math.min(100, prev.profileCompletion + 5),
    }));
    addAuditLog('Evidence Uploaded', `Document "${doc.fileName}" uploaded and analyzed by OCR entity extractor.`, candidate.name);
  };

  const addAuditLog = (action: string, details: string, actor = 'System') => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' Today',
      actor,
      role: role === 'candidate' ? 'Candidate' : role === 'assessor' ? 'Assessor' : 'Administrator',
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#10b981', '#f59e0b', '#6366f1'],
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  const approveCandidateByAssessor = (candId: string, remarks: string, scoreOverrides?: Partial<CandidateProfile['scores']>) => {
    const certId = `RPL-IND-2026-EL4-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setCandidate((prev) => ({
      ...prev,
      assessmentStatus: 'certified',
      assessorDecision: 'approved',
      assessorRemarks: remarks,
      certificateId: certId,
      certifiedDate: dateStr,
      scores: scoreOverrides ? { ...prev.scores, ...scoreOverrides } : prev.scores,
    }));

    setAssessorQueue((prev) =>
      prev.map((c) =>
        c.id === candId
          ? {
              ...c,
              assessmentStatus: 'certified',
              assessorDecision: 'approved',
              assessorRemarks: remarks,
              certificateId: certId,
              certifiedDate: dateStr,
              scores: scoreOverrides ? { ...c.scores, ...scoreOverrides } : c.scores,
            }
          : c
      )
    );

    addAuditLog(
      'Certification Approved & Signed',
      `Assessor Priya Sharma approved RPL recognition for ${candId}. Certificate ID: ${certId} issued.`,
      'Priya Sharma (RPL Evaluator)'
    );

    triggerConfetti();
  };

  const requestReassessmentByAssessor = (candId: string, remarks: string) => {
    setCandidate((prev) => ({
      ...prev,
      assessmentStatus: 'reassessment_needed',
      assessorDecision: 'reassessment',
      assessorRemarks: remarks,
    }));

    setAssessorQueue((prev) =>
      prev.map((c) =>
        c.id === candId
          ? {
              ...c,
              assessmentStatus: 'reassessment_needed',
              assessorDecision: 'reassessment',
              assessorRemarks: remarks,
            }
          : c
      )
    );

    addAuditLog(
      'Reassessment Requested',
      `Targeted reassessment requested for ${candId}. Remarks: ${remarks}`,
      'Priya Sharma (RPL Evaluator)'
    );
  };

  const resetCandidateDemo = () => {
    setCandidate(INITIAL_CANDIDATE);
    setAssessorQueue(ASSESSOR_CANDIDATE_QUEUE);
    setEvidenceDocs(EVIDENCE_DOCUMENTS);
    setCurrentView('landing');
    setRole('candidate');
    setDemoStepIndex(0);
  };

  // Demo step navigation for Judges / Hackathon Walkthrough
  const triggerDemoStep = (stepNumber: number) => {
    setDemoStepIndex(stepNumber);
    switch (stepNumber) {
      case 0: // Landing Page
        setRole('candidate');
        setCurrentView('landing');
        break;
      case 1: // Candidate Dashboard
        setRole('candidate');
        setCurrentView('candidate-dashboard');
        break;
      case 2: // AI Experience Discovery Interview (Voice / NLP)
        setRole('candidate');
        setCurrentView('experience-discovery');
        break;
      case 3: // AI Skill Profiling & Radar
        setRole('candidate');
        setCurrentView('ai-skill-profile');
        break;
      case 4: // Recommended RPL Pathways
        setRole('candidate');
        setCurrentView('job-roles');
        break;
      case 5: // Adaptive Knowledge Quiz
        setRole('candidate');
        setCurrentView('adaptive-quiz');
        break;
      case 6: // Voice Assessment
        setRole('candidate');
        setCurrentView('voice-assessment');
        break;
      case 7: // Practical Video CV Analysis
        setRole('candidate');
        setCurrentView('practical-video');
        break;
      case 8: // Evidence Verification
        setRole('candidate');
        setCurrentView('evidence-verification');
        break;
      case 9: // Skill Gap Analysis
        setRole('candidate');
        setCurrentView('skill-gaps');
        break;
      case 10: // Holistic Assessment Results
        setRole('candidate');
        setCurrentView('assessment-results');
        break;
      case 11: // Assessor Review Portal
        setRole('assessor');
        setSelectedCandidateForReview(candidate);
        setCurrentView('assessor-review');
        break;
      case 12: // Official Prototype Certificate
        setRole('candidate');
        setCurrentView('certificate');
        triggerConfetti();
        break;
      case 13: // Admin National Analytics
        setRole('admin');
        setCurrentView('admin-dashboard');
        break;
      default:
        setCurrentView('candidate-dashboard');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        currentView,
        setCurrentView,
        candidate,
        setCandidate,
        assessorQueue,
        setAssessorQueue,
        selectedCandidateForReview,
        setSelectedCandidateForReview,
        evidenceDocs,
        addEvidenceDoc,
        auditLogs,
        addAuditLog,
        isScoreModalOpen,
        setIsScoreModalOpen,
        isDemoTourActive,
        setIsDemoTourActive,
        demoStepIndex,
        setDemoStepIndex,
        triggerDemoStep,
        resetCandidateDemo,
        approveCandidateByAssessor,
        requestReassessmentByAssessor,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
