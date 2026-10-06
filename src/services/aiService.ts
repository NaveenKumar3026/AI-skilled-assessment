import { SkillItem, VoiceAssessmentData, PracticalAssessmentData, EvidenceDocument, SkillGapItem, JobRole, CandidateProfile } from '../types';
import { VOICE_DEMO_DATA, PRACTICAL_DEMO_DATA, SKILL_GAPS, JOB_ROLES } from './mockData';

export class AIService {
  /**
   * Simulates AI natural language processing on candidate's spoken or written work experience
   */
  static async analyzeExperience(input: string): Promise<{
    yearsOfExperience: number;
    detectedTrade: string;
    extractedSkills: SkillItem[];
    experienceConfidence: number;
    recommendedNSQFLevel: number;
    summary: string;
  }> {
    // Realistic AI latency simulation
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const lower = input.toLowerCase();
    let detectedTrade = 'Electrician';
    let yearsOfExperience = 7;
    let nsqfLevel = 4;

    if (lower.includes('tailor') || lower.includes('stitch') || lower.includes('sewing') || lower.includes('cloth') || lower.includes('garment')) {
      detectedTrade = 'Apparel & Tailoring Specialist';
      yearsOfExperience = 5;
      nsqfLevel = 3;
    } else if (lower.includes('weld') || lower.includes('metal') || lower.includes('gas cut') || lower.includes('smaw')) {
      detectedTrade = 'Shielded Metal Arc Welder (SMAW)';
      yearsOfExperience = 8;
      nsqfLevel = 4;
    } else if (lower.includes('plumb') || lower.includes('pipe') || lower.includes('sanitary') || lower.includes('leakage')) {
      detectedTrade = 'Plumber (General & Commercial)';
      yearsOfExperience = 6;
      nsqfLevel = 4;
    } else if (lower.includes('solar') || lower.includes('inverter') || lower.includes('panel')) {
      detectedTrade = 'Solar PV System Installation Specialist';
      yearsOfExperience = 4;
      nsqfLevel = 4;
    }

    const extractedSkills: SkillItem[] = [
      { name: 'Electrical Wiring & Conduit Laying', category: 'core', confidence: 95, level: 'Advanced' },
      { name: 'Distribution Board & MCB Installation', category: 'core', confidence: 91, level: 'Advanced' },
      { name: 'Electrical Safety & PPE Compliance', category: 'safety', confidence: 96, level: 'Expert' },
      { name: 'Circuit Testing & Multimeter Operation', category: 'diagnostic', confidence: 89, level: 'Intermediate' },
      { name: 'Earth Resistance & Grounding', category: 'core', confidence: 88, level: 'Intermediate' },
      { name: '3-Phase Motor Starter Fault Diagnosis', category: 'diagnostic', confidence: 72, level: 'Basic' },
      { name: 'Customer Communication & Work Estimates', category: 'soft', confidence: 84, level: 'Intermediate' },
    ];

    return {
      yearsOfExperience,
      detectedTrade,
      extractedSkills,
      experienceConfidence: 92,
      recommendedNSQFLevel: nsqfLevel,
      summary: `AI identified strong experiential vocabulary for ${detectedTrade} spanning ~${yearsOfExperience} years with heavy practical emphasis on safety, circuit installations, and diagnostics.`,
    };
  }

  /**
   * Simulates AI Speech-to-Text, intent parsing, and domain competency evaluation
   */
  static async analyzeVoice(sampleText?: string): Promise<VoiceAssessmentData> {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    return {
      ...VOICE_DEMO_DATA,
      transcript: sampleText || VOICE_DEMO_DATA.transcript,
    };
  }

  /**
   * Simulates Computer Vision frame analysis on practical video demonstrations
   */
  static async analyzePracticalVideo(customNote?: string): Promise<PracticalAssessmentData> {
    await new Promise((resolve) => setTimeout(resolve, 2200));
    return {
      ...PRACTICAL_DEMO_DATA,
    };
  }

  /**
   * Simulates AI document OCR, signature verification, and relevance scoring
   */
  static async analyzeEvidence(fileName: string, fileType: string): Promise<Partial<EvidenceDocument>> {
    await new Promise((resolve) => setTimeout(resolve, 1600));

    return {
      id: `doc-${Date.now()}`,
      fileName,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      aiVerificationStatus: 'verified',
      aiRelevanceScore: 93,
      extractedData: {
        employerOrContractor: 'Verified Electrical Contractor Affiliated Facility',
        statedRole: 'Senior Domestic & Commercial Electrician',
        duration: '2019 – 2026 (7 Years Cumulative)',
        detectedSkills: ['Conduit Wiring', 'Distribution Board Assembly', 'Safety Lockout'],
        tamperingRisk: 'Low',
      },
    };
  }

  /**
   * Synthesizes skill gaps against National Occupational Standards (NOS)
   */
  static async generateSkillGap(candidate: CandidateProfile): Promise<SkillGapItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return SKILL_GAPS;
  }

  /**
   * Generates final holistic score and assessor decision recommendation
   */
  static calculateFinalScore(scores: CandidateProfile['scores']): {
    overall: number;
    readinessStatus: string;
    weights: { knowledge: number; practical: number; safety: number; evidence: number; communication: number };
  } {
    // Weights: Knowledge (30%), Practical (35%), Safety (20%), Evidence (10%), Communication (5%)
    const weights = {
      knowledge: 0.30,
      practical: 0.35,
      safety: 0.20,
      evidence: 0.10,
      communication: 0.05,
    };

    const overall = Math.round(
      scores.knowledge * weights.knowledge +
      scores.practical * weights.practical +
      scores.safety * weights.safety +
      scores.evidence * weights.evidence +
      scores.communication * weights.communication
    );

    let readinessStatus = 'Strong RPL Candidate';
    if (overall < 70) readinessStatus = 'Requires Bridging Modules';
    else if (overall >= 90) readinessStatus = 'Exemplary Master Craftsman';

    return { overall, readinessStatus, weights };
  }
}
