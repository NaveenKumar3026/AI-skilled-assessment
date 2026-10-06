import { AIOutput } from '../types';

// ─── Exported Type Definitions ────────────────────────────────────────────────

export interface ExtractedSkill {
  name: string;
  category: 'CORE' | 'SAFETY' | 'TOOL' | 'DIAGNOSTIC' | 'SOFT';
  confidence: number;
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface ExperienceAnalysis {
  yearsOfExperience: number;
  detectedTrade: string;
  extractedSkills: ExtractedSkill[];
  experienceConfidence: number;
  recommendedNSQFLevel: number;
  summary: string;
}

export interface SkillExtraction {
  skills: ExtractedSkill[];
  totalSkillsFound: number;
}

export interface JobRoleMatch {
  recommendedRoleId: string;
  recommendedRoleTitle: string;
  matchScore: number;
  alternativeRoles: { roleId: string; title: string; matchScore: number }[];
}

export interface AssessmentPlan {
  questionIds: string[];
  difficultyDistribution: { level1: number; level2: number; level3: number; level4: number };
  estimatedDurationMinutes: number;
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  explanation: string;
  partialCredit: number;
}

export interface VoiceAnalysis {
  technicalKnowledge: number;
  procedureUnderstanding: number;
  safetyAwareness: number;
  communication: number;
  keyConceptsIdentified: string[];
  safetyMentions: string[];
  transcript: string;
  durationSeconds: number;
}

export interface PracticalAnalysis {
  taskCompletion: number;
  safetyCompliance: number;
  toolHandling: number;
  procedureAccuracy: number;
  overallPractical: number;
  observations: {
    timestamp: string;
    label: string;
    status: string;
    description: string;
  }[];
  timelineEvents: {
    time: string;
    title: string;
    status: string;
    detail: string;
  }[];
}

export interface EvidenceAnalysis {
  verificationStatus: 'VERIFIED' | 'NEEDS_REVIEW' | 'FLAGGED';
  relevanceScore: number;
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

export interface SkillGapAnalysis {
  gaps: SkillGapItem[];
  totalGaps: number;
  totalPass: number;
  totalPartial: number;
}

export interface Recommendation {
  overallScore: number;
  readinessStatus: string;
  recommendedAction: string;
  certificationEligible: boolean;
  bridgeModules: { title: string; duration: string; partner: string }[];
}

// ─── AI Service ───────────────────────────────────────────────────────────────

/**
 * AIService - Mock AI implementation with realistic responses.
 * 
 * ARCHITECTURE NOTE: All methods return AIOutput<T> with:
 *   - aiGenerated: true  (always, AI is never final authority)
 *   - confidence: number (0-1)
 *   - requiresHumanValidation: true (always)
 * 
 * To connect real AI (OpenAI, Google Gemini, etc.), replace the
 * implementation of each method. The interface stays the same.
 * Controllers never need to change.
 */
export class AIService {
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static wrapOutput<T>(data: T, confidence: number): AIOutput<T> {
    return {
      data,
      aiGenerated: true,
      confidence,
      requiresHumanValidation: true,
    };
  }

  // ─── Score calculation (shared utility) ─────────────────────────────────────

  /**
   * Calculate overall RPL score using weighted formula:
   * Knowledge: 40%, Practical: 30%, Safety: 20%, Evidence: 10%
   */
  static calculateOverallScore(scores: {
    knowledge: number;
    practical: number;
    safety: number;
    evidence: number;
    communication?: number;
  }): number {
    return Math.round(
      scores.knowledge * 0.40 +
      scores.practical * 0.30 +
      scores.safety * 0.20 +
      scores.evidence * 0.10
    );
  }

  static getCompetencyStatus(score: number): 'PASS' | 'PARTIAL' | 'GAP' {
    if (score >= 80) return 'PASS';
    if (score >= 60) return 'PARTIAL';
    return 'GAP';
  }

  // ─── Experience Analysis ──────────────────────────────────────────────────────

  static async analyzeExperience(description: string): Promise<AIOutput<ExperienceAnalysis>> {
    await AIService.delay(1400);

    const lower = description.toLowerCase();
    let detectedTrade = 'Electrician';
    let yearsOfExperience = 7;
    let nsqfLevel = 4;

    if (lower.includes('tailor') || lower.includes('stitch') || lower.includes('sewing')) {
      detectedTrade = 'Apparel & Tailoring Specialist';
      yearsOfExperience = 5;
      nsqfLevel = 3;
    } else if (lower.includes('weld') || lower.includes('smaw') || lower.includes('metal arc')) {
      detectedTrade = 'Shielded Metal Arc Welder (SMAW)';
      yearsOfExperience = 8;
      nsqfLevel = 4;
    } else if (lower.includes('plumb') || lower.includes('pipe fitting') || lower.includes('sanitary')) {
      detectedTrade = 'Plumber (General & Commercial)';
      yearsOfExperience = 6;
      nsqfLevel = 4;
    } else if (lower.includes('solar') || lower.includes('photovoltaic') || lower.includes('inverter')) {
      detectedTrade = 'Solar PV System Installation Specialist';
      yearsOfExperience = 4;
      nsqfLevel = 4;
    } else if (lower.includes('mechanic') || lower.includes('engine') || lower.includes('vehicle')) {
      detectedTrade = 'Automotive Service Technician';
      yearsOfExperience = 6;
      nsqfLevel = 4;
    } else if (lower.includes('carpenter') || lower.includes('woodwork') || lower.includes('furniture')) {
      detectedTrade = 'Carpenter & Wooden Joinery Specialist';
      yearsOfExperience = 5;
      nsqfLevel = 3;
    }

    const extractedSkills: ExtractedSkill[] = [
      { name: 'Electrical Wiring & Conduit Laying', category: 'CORE', confidence: 95, level: 'ADVANCED' },
      { name: 'Distribution Board & MCB Installation', category: 'CORE', confidence: 91, level: 'ADVANCED' },
      { name: 'Electrical Safety & PPE Compliance', category: 'SAFETY', confidence: 96, level: 'EXPERT' },
      { name: 'Circuit Testing & Multimeter Operation', category: 'DIAGNOSTIC', confidence: 89, level: 'INTERMEDIATE' },
      { name: 'Earth Resistance & Grounding', category: 'CORE', confidence: 88, level: 'INTERMEDIATE' },
      { name: '3-Phase Motor Starter Fault Diagnosis', category: 'DIAGNOSTIC', confidence: 72, level: 'BASIC' },
      { name: 'Customer Communication & Work Estimates', category: 'SOFT', confidence: 84, level: 'INTERMEDIATE' },
    ];

    return AIService.wrapOutput<ExperienceAnalysis>(
      {
        yearsOfExperience,
        detectedTrade,
        extractedSkills,
        experienceConfidence: 92,
        recommendedNSQFLevel: nsqfLevel,
        summary: `AI identified strong experiential vocabulary for ${detectedTrade} spanning approximately ${yearsOfExperience} years with emphasis on safety, installations, and diagnostics.`,
      },
      0.92
    );
  }

  // ─── Skill Extraction ─────────────────────────────────────────────────────────

  static async extractSkills(description: string, trade: string): Promise<AIOutput<SkillExtraction>> {
    await AIService.delay(800);

    const skills: ExtractedSkill[] = [
      { name: `${trade} Core Techniques`, category: 'CORE', confidence: 90, level: 'ADVANCED' },
      { name: `${trade} Safety Standards`, category: 'SAFETY', confidence: 88, level: 'ADVANCED' },
      { name: 'Tool Handling & Maintenance', category: 'TOOL', confidence: 82, level: 'INTERMEDIATE' },
      { name: 'Fault Diagnosis & Troubleshooting', category: 'DIAGNOSTIC', confidence: 78, level: 'INTERMEDIATE' },
      { name: 'Professional Communication', category: 'SOFT', confidence: 75, level: 'INTERMEDIATE' },
    ];

    return AIService.wrapOutput<SkillExtraction>(
      { skills, totalSkillsFound: skills.length },
      0.88
    );
  }

  // ─── Job Role Identification ──────────────────────────────────────────────────

  static async identifyJobRole(
    _skills: ExtractedSkill[],
    trade: string
  ): Promise<AIOutput<JobRoleMatch>> {
    await AIService.delay(600);

    const tradeMap: Record<string, { id: string; title: string; score: number }> = {
      electrician: { id: 'role-electrician-l4', title: 'Electrician (Domestic & Commercial)', score: 92 },
      welder: { id: 'role-elec-maint-l4', title: 'Electrical Maintenance Technician', score: 85 },
      solar: { id: 'role-solar-pv-l4', title: 'Solar PV System Installation Specialist', score: 88 },
    };

    const matched = tradeMap[trade.toLowerCase()] || tradeMap['electrician'];

    return AIService.wrapOutput<JobRoleMatch>(
      {
        recommendedRoleId: matched.id,
        recommendedRoleTitle: matched.title,
        matchScore: matched.score,
        alternativeRoles: [
          { roleId: 'role-elec-maint-l4', title: 'Electrical Maintenance Technician', matchScore: 81 },
          { roleId: 'role-solar-pv-l4', title: 'Solar PV System Installation Specialist', matchScore: 74 },
        ],
      },
      0.87
    );
  }

  // ─── Assessment Generation ────────────────────────────────────────────────────

  static async generateAssessment(
    _jobRoleId: string,
    questionIds: string[]
  ): Promise<AIOutput<AssessmentPlan>> {
    await AIService.delay(500);

    return AIService.wrapOutput<AssessmentPlan>(
      {
        questionIds,
        difficultyDistribution: { level1: 1, level2: 1, level3: 1, level4: 1 },
        estimatedDurationMinutes: 30,
      },
      0.90
    );
  }

  // ─── Answer Evaluation ────────────────────────────────────────────────────────

  static async evaluateAnswer(
    _questionId: string,
    selectedOption: string,
    correctOption: string
  ): Promise<AIOutput<AnswerEvaluation>> {
    await AIService.delay(200);

    const isCorrect = selectedOption === correctOption;

    return AIService.wrapOutput<AnswerEvaluation>(
      {
        isCorrect,
        explanation: isCorrect
          ? 'Correct! Your understanding of the concept is accurate.'
          : `Incorrect. The correct answer demonstrates proper safety protocol. Selected: ${selectedOption}, Expected: ${correctOption}.`,
        partialCredit: isCorrect ? 1.0 : 0,
      },
      0.99
    );
  }

  // ─── Voice Analysis ───────────────────────────────────────────────────────────

  static async analyzeVoice(transcript: string): Promise<AIOutput<VoiceAnalysis>> {
    await AIService.delay(1800);

    const hasKeyTerms = transcript.toLowerCase().includes('isolat') ||
      transcript.toLowerCase().includes('safety') ||
      transcript.toLowerCase().includes('test');

    return AIService.wrapOutput<VoiceAnalysis>(
      {
        technicalKnowledge: hasKeyTerms ? 89 : 72,
        procedureUnderstanding: 84,
        safetyAwareness: 94,
        communication: 81,
        keyConceptsIdentified: [
          'Sub-circuit sequential isolation',
          'RCCB/ELCB trip correlation',
          'Multimeter continuity testing',
          'Phase-Neutral / Phase-Earth short detection',
          'Junction box inspection',
        ],
        safetyMentions: [
          'Insulated gloves & footwear',
          'Main supply isolation before opening panel',
          'Zero-energy state verification',
        ],
        transcript: transcript || 'No transcript provided.',
        durationSeconds: 38,
      },
      0.87
    );
  }

  // ─── Practical Video Analysis ─────────────────────────────────────────────────

  static async analyzePracticalVideo(
    _videoPath: string,
    _taskTitle: string
  ): Promise<AIOutput<PracticalAnalysis>> {
    await AIService.delay(2200);

    return AIService.wrapOutput<PracticalAnalysis>(
      {
        taskCompletion: 78,
        safetyCompliance: 91,
        toolHandling: 88,
        procedureAccuracy: 84,
        overallPractical: 85,
        observations: [
          {
            timestamp: '00:04',
            label: 'PPE Compliance: 1000V Insulated Gloves',
            status: 'passed',
            description: 'Candidate verified wearing Class 0 certified electrical hand gloves.',
          },
          {
            timestamp: '00:09',
            label: 'Tool Selection: VDE Insulated Terminal Screwdriver',
            status: 'passed',
            description: 'Correct insulated screwdriver selected matching terminal slot width.',
          },
          {
            timestamp: '00:18',
            label: 'Wire Stripping: Zero Strand Nicking',
            status: 'passed',
            description: 'Stripper gauge calibrated accurately; no copper conductor deformation detected.',
          },
          {
            timestamp: '00:32',
            label: 'Notice: Pre-testing Neutral Isolation Step',
            status: 'warning',
            description: 'Candidate connected phase first before tightening neutral retention clamp.',
          },
        ],
        timelineEvents: [
          { time: '00:04', title: 'Safety Gear & Workplace Setup', status: 'success', detail: 'Insulated mat, safety glasses, and 1000V gloves verified.' },
          { time: '00:09', title: 'Tool Calibration & Inspection', status: 'success', detail: 'Tester, insulation stripper, and torque screwdriver verified.' },
          { time: '00:18', title: 'Conductor Preparation & Stripping', status: 'success', detail: 'Clean 10mm strip without damaging core copper strands.' },
          { time: '00:32', title: 'Switch Terminal Fastening', status: 'warning', detail: 'Slight looseness noted on terminal 2 before final torque verification.' },
          { time: '00:44', title: 'Post-Install Continuity Verification', status: 'success', detail: 'Zero ohm resistance on closed circuit; infinite resistance on open.' },
        ],
      },
      0.87
    );
  }

  // ─── Evidence Analysis ────────────────────────────────────────────────────────

  static async analyzeEvidence(
    fileName: string,
    fileType: string,
    _filePath: string
  ): Promise<AIOutput<EvidenceAnalysis>> {
    await AIService.delay(1600);

    const isSitePhoto = fileType === 'SITE_PHOTO';
    const isAffidavit = fileType === 'CONTRACTOR_AFFIDAVIT';

    return AIService.wrapOutput<EvidenceAnalysis>(
      {
        verificationStatus: isAffidavit ? 'NEEDS_REVIEW' : 'VERIFIED',
        relevanceScore: isSitePhoto ? 89 : isAffidavit ? 82 : 94,
        extractedData: {
          employerOrContractor: isAffidavit
            ? 'Licensed Contractor (Lic No. TN/EB/44910)'
            : 'ABC Electrical Works & Infrastructure Pvt Ltd, Chennai',
          statedRole: isAffidavit ? 'Apprentice to Senior Wireman' : 'Senior Domestic & Commercial Electrician',
          duration: isAffidavit ? '2017 – 2019' : '2019 – Present (7 Years)',
          detectedSkills: isAffidavit
            ? ['Basic Wiring', 'Appliance Repair']
            : ['Conduit Wiring', 'DB Dressing', 'Earth Testing', 'LT Switchgear Setup'],
          tamperingRisk: 'Low',
        },
      },
      isAffidavit ? 0.82 : 0.94
    );
  }

  // ─── Skill Gap Calculation ────────────────────────────────────────────────────

  static async calculateSkillGap(
    _candidateSkills: ExtractedSkill[],
    _jobRoleId: string
  ): Promise<AIOutput<SkillGapAnalysis>> {
    await AIService.delay(800);

    const gaps: SkillGapItem[] = [
      {
        skillName: 'Electrical Safety & PPE Regulations',
        currentLevelScore: 94,
        requiredLevelScore: 80,
        status: 'PASS',
        recommendedBridgeModule: {
          title: 'Advanced High-Voltage Safety Standards (Refresher)',
          duration: '20 Mins',
          partner: 'Skill India Digital Hub',
          linkUrl: '#',
        },
      },
      {
        skillName: 'Domestic & Commercial Conduit Wiring',
        currentLevelScore: 92,
        requiredLevelScore: 75,
        status: 'PASS',
        recommendedBridgeModule: {
          title: 'IS 732 Wiring Standards & Smart Home Conduit Systems',
          duration: '35 Mins',
          partner: 'ESSCI Sector Council',
          linkUrl: '#',
        },
      },
      {
        skillName: 'Distribution Board & RCCB Installation',
        currentLevelScore: 89,
        requiredLevelScore: 80,
        status: 'PASS',
        recommendedBridgeModule: {
          title: 'Surge Protection Devices (SPD) Sizing and Wiring',
          duration: '25 Mins',
          partner: 'National Skill Development Corporation',
          linkUrl: '#',
        },
      },
      {
        skillName: '3-Phase Motor Starters & Industrial Fault Diagnosis',
        currentLevelScore: 72,
        requiredLevelScore: 80,
        status: 'GAP',
        recommendedBridgeModule: {
          title: 'Star-Delta Starter Wiring & Overload Relay Troubleshooting',
          duration: '45 Mins Modular Video',
          partner: 'Skill India / NCVET FastTrack',
          linkUrl: '#',
        },
      },
      {
        skillName: 'Customer Communication & Cost Estimation',
        currentLevelScore: 81,
        requiredLevelScore: 70,
        status: 'PASS',
        recommendedBridgeModule: {
          title: 'Digital Invoicing & Bill of Quantities (BOQ) Basics',
          duration: '15 Mins',
          partner: 'MSDE Entrepreneurship Cell',
          linkUrl: '#',
        },
      },
    ];

    const totalGaps = gaps.filter((g) => g.status === 'GAP').length;
    const totalPass = gaps.filter((g) => g.status === 'PASS').length;
    const totalPartial = gaps.filter((g) => g.status === 'PARTIAL').length;

    return AIService.wrapOutput<SkillGapAnalysis>(
      { gaps, totalGaps, totalPass, totalPartial },
      0.88
    );
  }

  // ─── Final Recommendation ─────────────────────────────────────────────────────

  static async generateRecommendation(
    _candidateProfile: Record<string, unknown>,
    scores: {
      knowledge: number;
      practical: number;
      safety: number;
      evidence: number;
      communication: number;
    }
  ): Promise<AIOutput<Recommendation>> {
    await AIService.delay(600);

    const overall = AIService.calculateOverallScore(scores);
    let readinessStatus = 'Strong RPL Candidate';
    let recommendedAction = 'Proceed to Assessor Review for final certification recommendation.';
    let certificationEligible = true;

    if (overall < 60) {
      readinessStatus = 'Requires Bridging Modules';
      recommendedAction = 'Complete recommended bridge modules before reassessment.';
      certificationEligible = false;
    } else if (overall < 75) {
      readinessStatus = 'Partial Competency — Targeted Upskilling Advised';
      recommendedAction = 'Complete targeted skill gap modules, then proceed to assessor review.';
      certificationEligible = false;
    } else if (overall >= 90) {
      readinessStatus = 'Exemplary Master Craftsman';
      recommendedAction = 'Recommend for NSQF Level 4 RPL Certification — Fast Track.';
    }

    return AIService.wrapOutput<Recommendation>(
      {
        overallScore: overall,
        readinessStatus,
        recommendedAction,
        certificationEligible,
        bridgeModules: [
          {
            title: 'Star-Delta Starter Wiring & Overload Relay Troubleshooting',
            duration: '45 Mins',
            partner: 'Skill India / NCVET FastTrack',
          },
        ],
      },
      0.89
    );
  }
}
