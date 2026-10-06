import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { DemoTourBar } from './components/common/DemoTourBar';
import { HowScoreCalculatedModal } from './components/common/HowScoreCalculatedModal';
import { AuthModal } from './components/auth/AuthModal';

import { LandingPage } from './components/landing/LandingPage';
import { CandidateDashboard } from './components/candidate/CandidateDashboard';
import { ExperienceDiscovery } from './components/candidate/ExperienceDiscovery';
import { AISkillProfile } from './components/candidate/AISkillProfile';
import { JobRoleRecommendations } from './components/candidate/JobRoleRecommendations';
import { AssessmentEngine } from './components/candidate/AssessmentEngine';
import { VoiceAssessment } from './components/candidate/VoiceAssessment';
import { PracticalAssessment } from './components/candidate/PracticalAssessment';
import { EvidenceVerification } from './components/candidate/EvidenceVerification';
import { SkillGapAnalysis } from './components/candidate/SkillGapAnalysis';
import { AssessmentResult } from './components/candidate/AssessmentResult';
import { CertificateView } from './components/certificate/CertificateView';
import { AssessorDashboard } from './components/assessor/AssessorDashboard';
import { AssessorReview } from './components/assessor/AssessorReview';
import { AdminDashboard } from './components/admin/AdminDashboard';

export const AppContent: React.FC = () => {
  const { currentView, role } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isLanding = currentView === 'landing';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Content Area */}
      {isLanding ? (
        <main className="flex-1">
          <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Role Aware Sidebar */}
          <Sidebar />

          {/* Core App View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentView === 'candidate-dashboard' && <CandidateDashboard />}
            {currentView === 'experience-discovery' && <ExperienceDiscovery />}
            {currentView === 'ai-skill-profile' && <AISkillProfile />}
            {currentView === 'job-roles' && <JobRoleRecommendations />}
            {currentView === 'adaptive-quiz' && <AssessmentEngine />}
            {currentView === 'voice-assessment' && <VoiceAssessment />}
            {currentView === 'practical-video' && <PracticalAssessment />}
            {currentView === 'evidence-verification' && <EvidenceVerification />}
            {currentView === 'skill-gaps' && <SkillGapAnalysis />}
            {currentView === 'assessment-results' && <AssessmentResult />}
            {currentView === 'certificate' && <CertificateView />}
            {currentView === 'assessor-dashboard' && <AssessorDashboard />}
            {currentView === 'assessor-review' && <AssessorReview />}
            {currentView === 'admin-dashboard' && <AdminDashboard />}
          </main>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Floating Demo Navigator for Judges */}
      <DemoTourBar />

      {/* Modals */}
      <HowScoreCalculatedModal />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
