export type UserRole = 'candidate' | 'assessor' | 'admin';

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: Language;
  avatarUrl?: string;
  location: string;
}

export interface SkillItem {
  name: string;
  category: 'core' | 'safety' | 'tool' | 'diagnostic' | 'soft';
  confidence: number; // 0-100
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  verifiedByAssessor?: boolean;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  phone: string;
  location: string;
  avatarUrl: string;
  yearsOfExperience: number;
  primaryTrade: string;
  profileCompletion: number;
  nsqfTargetLevel: number;
  selectedJobRole?: string;
  experienceDescription: string;
  extractedSkills: SkillItem[];
  experienceConfidence: number;
  assessmentStatus: 'not_started' | 'profiling' | 'knowledge_in_progress' | 'voice_in_progress' | 'practical_in_progress' | 'evidence_uploaded' | 'under_assessor_review' | 'certified' | 'reassessment_needed';
  scores: {
    knowledge: number;
    practical: number;
    safety: number;
    evidence: number;
    communication: number;
    overall: number;
  };
  assessorRemarks?: string;
  assessorDecision?: 'pending' | 'approved' | 'reassessment' | 'rejected';
  certificateId?: string;
  certifiedDate?: string;
}

export interface JobRole {
  id: string;
  title: string;
  sector: string;
  nsqfLevel: number;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  certifiedCandidatesCount: number;
  demandLevel: 'Very High' | 'High' | 'Moderate';
  avgSalaryGrowth: string;
}

export interface Question {
  id: string;
  roleId: string;
  competency: string;
  difficultyLevel: 1 | 2 | 3 | 4;
  questionText: string;
  questionTextTa?: string;
  questionTextHi?: string;
  options: {
    id: string;
    text: string;
    textTa?: string;
    textHi?: string;
  }[];
  correctOptionId: string;
  explanation: string;
  simpleExplanation: string;
  simpleExplanationTa?: string;
  simpleExplanationHi?: string;
}

export interface VoiceAssessmentData {
  promptQuestion: string;
  promptQuestionTa?: string;
  promptQuestionHi?: string;
  transcript: string;
  durationSeconds: number;
  scores: {
    technicalKnowledge: number;
    procedureUnderstanding: number;
    safetyAwareness: number;
    communication: number;
  };
  keyConceptsIdentified: string[];
  safetyMentions: string[];
}

export interface CVBoundingBox {
  timestamp: string;
  label: string;
  status: 'passed' | 'warning' | 'alert';
  box: { x: number; y: number; width: number; height: number }; // percentage coords
  description: string;
}

export interface PracticalAssessmentData {
  taskTitle: string;
  taskInstructions: string;
  videoUrl?: string;
  videoThumbnail?: string;
  duration: string;
  observations: CVBoundingBox[];
  scores: {
    taskCompletion: number;
    safetyCompliance: number;
    toolHandling: number;
    procedureAccuracy: number;
    overallPractical: number;
  };
  timelineEvents: {
    time: string;
    title: string;
    status: 'success' | 'warning' | 'info';
    detail: string;
  }[];
}

export interface EvidenceDocument {
  id: string;
  fileName: string;
  fileType: 'experience_letter' | 'contractor_affidavit' | 'salary_slip' | 'site_photo' | 'id_proof';
  fileSize: string;
  uploadDate: string;
  aiVerificationStatus: 'verified' | 'needs_review' | 'flagged';
  aiRelevanceScore: number;
  extractedData: {
    employerOrContractor: string;
    statedRole: string;
    duration: string;
    detectedSkills: string[];
    tamperingRisk: 'Low' | 'Medium' | 'High';
  };
}

export interface SkillGapItem {
  skillName: string;
  currentLevelScore: number;
  requiredLevelScore: number;
  status: 'PASS' | 'GAP' | 'PARTIAL';
  recommendedBridgeModule: {
    title: string;
    duration: string;
    partner: string;
    linkUrl: string;
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
}
