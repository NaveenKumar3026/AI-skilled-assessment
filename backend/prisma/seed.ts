import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SkillSet AI database...');

  // ─── Cleanup ──────────────────────────────────────────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.assessorReview.deleteMany();
  await prisma.skillGap.deleteMany();
  await prisma.skillScore.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.practicalAssessment.deleteMany();
  await prisma.assessmentResponse.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.question.deleteMany();
  await prisma.jobRole.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // ─── Job Roles ────────────────────────────────────────────────────────────
  const electricianRole = await prisma.jobRole.create({
    data: {
      id: 'role-electrician-l4',
      title: 'Electrician (Domestic & Commercial)',
      sector: 'Electrical & Electronics Sector Skill Council (ESSCI)',
      nsqfLevel: 4,
      description:
        'Performs installation, testing, and maintenance of domestic and commercial electrical wiring, distribution boards, safety switches, and lighting systems as per Indian Standard (IS 732).',
      requiredSkills: JSON.stringify(['Conduit Wiring', 'Earthing & Bonding', 'Safety Regulations', 'Testing Instruments', 'Fault Finding']),
      certifiedCandidatesCount: 14200,
      demandLevel: 'VERY_HIGH',
      avgSalaryGrowth: '+38% post-certification',
    },
  });

  await prisma.jobRole.create({
    data: {
      id: 'role-elec-maint-l4',
      title: 'Electrical Maintenance Technician',
      sector: 'Capital Goods Skill Council',
      nsqfLevel: 4,
      description:
        'Conducts preventive, breakdown, and periodic electrical maintenance of motors, transformers, switchgear, and control panels in light manufacturing facilities.',
      requiredSkills: JSON.stringify(['Preventive Maintenance', 'Control Panels', 'Motor Testing', 'Lock-Out Tag-Out (LOTO)']),
      certifiedCandidatesCount: 9850,
      demandLevel: 'HIGH',
      avgSalaryGrowth: '+32% post-certification',
    },
  });

  await prisma.jobRole.create({
    data: {
      id: 'role-solar-pv-l4',
      title: 'Solar PV System Installation Specialist',
      sector: 'Skill Council for Green Jobs (SCGJ)',
      nsqfLevel: 4,
      description:
        'Mounts solar photovoltaic panels, connects solar inverters, runs DC/AC cabling, and installs net-metering systems under Pradhan Mantri Surya Ghar scheme.',
      requiredSkills: JSON.stringify(['Solar Inverter Setup', 'DC Cabling', 'Roof Mounting', 'Grid Synchronization']),
      certifiedCandidatesCount: 6400,
      demandLevel: 'VERY_HIGH',
      avgSalaryGrowth: '+45% post-certification',
    },
  });

  console.log('✅ Created 3 job roles');

  // ─── Questions ────────────────────────────────────────────────────────────
  await prisma.question.createMany({
    data: [
      {
        id: 'q1-safety-l1',
        jobRoleId: electricianRole.id,
        competency: 'Electrical Safety & PPE (Level 1)',
        difficultyLevel: 1,
        questionText:
          'You are preparing to install a new 16A power socket in an existing residential building. What is the MANDATORY first step before touching any conductor?',
        questionTextTa:
          'ஒரு குடியிருப்பில் புதிய 16A சாக்கெட் பொருத்துவதற்கு முன், வயரைத் தொடுவதற்கு முன்பு செய்ய வேண்டிய கட்டாய முதல் படி என்ன?',
        questionTextHi:
          'एक आवासीय भवन में नया 16A सॉकेट लगाने से पहले, तारों को छूने से पूर्व पहला अनिवार्य कदम क्या होना चाहिए?',
        options: JSON.stringify([
          { id: 'opt-a', text: 'Select matching switch plate color' },
          { id: 'opt-b', text: 'Isolate main supply breaker (MCB) and verify zero voltage with tester' },
          { id: 'opt-c', text: 'Measure room ambient temperature' },
          { id: 'opt-d', text: 'Directly strip the live cable using bare pliers' },
        ]),
        correctOptionId: 'opt-b',
        explanation:
          'Lockout/Tagout and isolating the incoming main supply followed by testing for zero potential is mandatory under Indian Electricity Rules 1956.',
        simpleExplanation: 'Always turn off the main switch and check with a tester so no electric shock can happen.',
      },
      {
        id: 'q2-wiring-l2',
        jobRoleId: electricianRole.id,
        competency: 'Wiring Practices & Color Codes (Level 2)',
        difficultyLevel: 2,
        questionText:
          'As per standard Indian Single-Phase AC wiring conventions (IS 732), what are the designated insulation colors for Phase (Line), Neutral, and Earth conductors?',
        options: JSON.stringify([
          { id: 'opt-a', text: 'Phase: Red/Brown | Neutral: Black/Blue | Earth: Green/Green-Yellow' },
          { id: 'opt-b', text: 'Phase: Green | Neutral: Red | Earth: Black' },
          { id: 'opt-c', text: 'Phase: Yellow | Neutral: White | Earth: Red' },
          { id: 'opt-d', text: 'Any color can be used interchangeably' },
        ]),
        correctOptionId: 'opt-a',
        explanation: 'In India, Phase is Red/Brown, Neutral is Black or Royal Blue, and Protective Earth is mandatory Green with Yellow stripes.',
        simpleExplanation: 'Red/Brown carries current (Phase), Black/Blue returns current (Neutral), and Green protects against leakage (Earth).',
      },
      {
        id: 'q3-fault-l3',
        jobRoleId: electricianRole.id,
        competency: 'Fault Diagnosis & Earth Leakage (Level 3)',
        difficultyLevel: 3,
        questionText:
          'An RCCB (Residual Current Circuit Breaker) in a house trips continuously as soon as an electric water heater is switched on. What is the most probable root cause?',
        options: JSON.stringify([
          { id: 'opt-a', text: 'The heater heating element has insulation breakdown leaking current to ground/water' },
          { id: 'opt-b', text: 'The room ceiling fan is running at high speed' },
          { id: 'opt-c', text: 'The utility meter is recording unit usage' },
          { id: 'opt-d', text: 'The water temperature is set too cold' },
        ]),
        correctOptionId: 'opt-a',
        explanation:
          'RCCBs detect differential currents between Phase and Neutral (typically 30mA threshold). When a faulty heating element leaks current to the earthed body/water tank, the RCCB trips instantly.',
        simpleExplanation: 'Current is leaking from the heater rod to earth/water. The RCCB senses this leakage and cuts power to protect human life.',
      },
      {
        id: 'q4-troubleshoot-l4',
        jobRoleId: electricianRole.id,
        competency: 'Advanced Industrial Troubleshooting (Level 4)',
        difficultyLevel: 4,
        questionText:
          'When troubleshooting a 3-phase induction motor that hums loudly but fails to rotate on pressing the DOL starter, what should you verify with a clamp meter and multimeter?',
        options: JSON.stringify([
          { id: 'opt-a', text: 'Single-phasing condition (absence of one phase voltage/blown backup fuse)' },
          { id: 'opt-b', text: 'Check motor paint surface finish' },
          { id: 'opt-c', text: 'Increase supply frequency artificially' },
          { id: 'opt-d', text: 'Swap live phase and earth wires' },
        ]),
        correctOptionId: 'opt-a',
        explanation:
          'Single phasing occurs when one line conductor is open. The motor experiences an unbalanced alternating field, draws heavy locked-rotor current, hums, and cannot generate starting torque.',
        simpleExplanation: 'Check if one of the three phases is missing due to a blown fuse or loose contact in the starter.',
      },
    ],
  });

  console.log('✅ Created 4 assessment questions');

  // ─── Users ────────────────────────────────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      id: 'user-admin-01',
      email: 'admin@skillset.ai',
      phone: '0000000001',
      passwordHash: await bcrypt.hash('Admin@123', 10),
      name: 'System Admin',
      role: 'ADMIN',
      location: 'New Delhi, India',
    },
  });

  const assessorUser = await prisma.user.create({
    data: {
      id: 'user-assessor-01',
      email: 'assessor@skillset.ai',
      phone: '0000000002',
      passwordHash: await bcrypt.hash('Assessor@123', 10),
      name: 'Priya Sharma',
      role: 'ASSESSOR',
      location: 'Chennai, Tamil Nadu',
    },
  });

  const arunUser = await prisma.user.create({
    data: {
      id: 'user-arun-01',
      email: 'arun@example.com',
      phone: '9840123456',
      passwordHash: await bcrypt.hash('Arun@123', 10),
      name: 'Arun Kumar',
      role: 'CANDIDATE',
      location: 'Chennai, Tamil Nadu',
      language: 'en',
    },
  });

  const meeraUser = await prisma.user.create({
    data: {
      id: 'user-meera-02',
      email: 'meera@example.com',
      phone: '9443287654',
      passwordHash: await bcrypt.hash('Meera@123', 10),
      name: 'Meera Devi',
      role: 'CANDIDATE',
      location: 'Coimbatore, Tamil Nadu',
    },
  });

  const rajeshUser = await prisma.user.create({
    data: {
      id: 'user-rajesh-03',
      email: 'rajesh@example.com',
      phone: '9825011223',
      passwordHash: await bcrypt.hash('Rajesh@123', 10),
      name: 'Rajesh Patel',
      role: 'CANDIDATE',
      location: 'Surat, Gujarat',
    },
  });

  console.log('✅ Created 5 users (1 admin, 1 assessor, 3 candidates)');

  // ─── Candidate Profiles ───────────────────────────────────────────────────
  const arunProfile = await prisma.candidateProfile.create({
    data: {
      id: 'cand-arun-01',
      userId: arunUser.id,
      age: 32,
      yearsOfExperience: 7,
      primaryTrade: 'Electrician',
      profileCompletion: 85,
      nsqfTargetLevel: 4,
      selectedJobRoleId: electricianRole.id,
      experienceDescription:
        'I have been working as an electrician for 7 years in domestic and commercial premises. I do conduit pipe laying, 3-phase wiring, distribution board assembly, MCB sizing, fan/light fittings, earthing resistance testing, and troubleshooting short circuits and fault isolation.',
      experienceConfidence: 92,
      assessmentStatus: 'UNDER_ASSESSOR_REVIEW',
      knowledgeScore: 89,
      practicalScore: 85,
      safetyScore: 94,
      evidenceScore: 88,
      communicationScore: 81,
      overallScore: 87,
      assessorRemarks:
        'Candidate exhibits robust practical competency in domestic installations and exemplary safety protocol execution. Recommended for NSQF Level 4 RPL Certification with a minor bridge advisory in 3-phase industrial fault isolation.',
      assessorDecision: 'APPROVED',
      certificateId: 'RPL-IND-2026-EL4-9842',
      certifiedAt: new Date('2026-10-06'),
    },
  });

  await prisma.candidateProfile.create({
    data: {
      id: 'cand-meera-02',
      userId: meeraUser.id,
      age: 29,
      yearsOfExperience: 5,
      primaryTrade: 'Apparel & Tailoring',
      profileCompletion: 90,
      nsqfTargetLevel: 3,
      experienceDescription: '5 years stitching blouses, salwar suits, industrial uniforms, pattern drafting, and operating motorized sewing machines.',
      experienceConfidence: 94,
      assessmentStatus: 'UNDER_ASSESSOR_REVIEW',
      knowledgeScore: 86,
      practicalScore: 91,
      safetyScore: 90,
      evidenceScore: 84,
      communicationScore: 85,
      overallScore: 87,
      assessorDecision: 'PENDING',
    },
  });

  await prisma.candidateProfile.create({
    data: {
      id: 'cand-rajesh-03',
      userId: rajeshUser.id,
      age: 38,
      yearsOfExperience: 9,
      primaryTrade: 'Shielded Metal Arc Welder (SMAW)',
      profileCompletion: 80,
      nsqfTargetLevel: 4,
      experienceDescription: '9 years welding MS structural pipes, pressure vessel flanges, flux core welding, gas cutting.',
      experienceConfidence: 89,
      assessmentStatus: 'UNDER_ASSESSOR_REVIEW',
      knowledgeScore: 82,
      practicalScore: 93,
      safetyScore: 92,
      evidenceScore: 80,
      communicationScore: 76,
      overallScore: 85,
      assessorDecision: 'PENDING',
    },
  });

  console.log('✅ Created 3 candidate profiles');

  // ─── Skills for Arun ──────────────────────────────────────────────────────
  await prisma.skill.createMany({
    data: [
      { candidateProfileId: arunProfile.id, name: 'Electrical Wiring & Conduit Laying', category: 'CORE', confidence: 95, level: 'ADVANCED', verifiedByAssessor: true },
      { candidateProfileId: arunProfile.id, name: 'Distribution Board & MCB Installation', category: 'CORE', confidence: 91, level: 'ADVANCED', verifiedByAssessor: true },
      { candidateProfileId: arunProfile.id, name: 'Electrical Safety & PPE Compliance', category: 'SAFETY', confidence: 96, level: 'EXPERT', verifiedByAssessor: true },
      { candidateProfileId: arunProfile.id, name: 'Circuit Testing & Multimeter Operation', category: 'DIAGNOSTIC', confidence: 89, level: 'INTERMEDIATE', verifiedByAssessor: true },
      { candidateProfileId: arunProfile.id, name: 'Earth Resistance & Grounding', category: 'CORE', confidence: 88, level: 'INTERMEDIATE', verifiedByAssessor: true },
      { candidateProfileId: arunProfile.id, name: '3-Phase Motor Starter Fault Diagnosis', category: 'DIAGNOSTIC', confidence: 72, level: 'BASIC', verifiedByAssessor: false },
      { candidateProfileId: arunProfile.id, name: 'Customer Communication & Work Estimates', category: 'SOFT', confidence: 84, level: 'INTERMEDIATE', verifiedByAssessor: true },
    ],
  });

  console.log('✅ Created 7 skills for Arun');

  // ─── Experience for Arun ──────────────────────────────────────────────────
  await prisma.experience.create({
    data: {
      candidateProfileId: arunProfile.id,
      description:
        'I have been working as an electrician for 7 years in domestic and commercial premises. Conduit pipe laying, 3-phase wiring, distribution board assembly, MCB sizing, earthing resistance testing.',
      yearsOfExperience: 7,
      employer: 'ABC Electrical Works & Infrastructure Pvt Ltd, Chennai',
      role: 'Senior Domestic & Commercial Electrician',
      location: 'Chennai, Tamil Nadu',
    },
  });

  // ─── Evidence for Arun ────────────────────────────────────────────────────
  await prisma.evidence.createMany({
    data: [
      {
        candidateProfileId: arunProfile.id,
        fileName: 'ABC_Electrical_Contractors_Experience_Letter.pdf',
        fileType: 'EXPERIENCE_LETTER',
        fileSize: '1.4 MB',
        filePath: 'uploads/demo/exp_letter.pdf',
        aiVerificationStatus: 'VERIFIED',
        aiRelevanceScore: 94,
        extractedData: JSON.stringify({
          employerOrContractor: 'ABC Electrical Works & Infrastructure Pvt Ltd, Chennai',
          statedRole: 'Senior Domestic & Commercial Electrician',
          duration: 'May 2019 – Present (7 Years)',
          detectedSkills: ['Conduit Wiring', 'DB Dressing', 'Earth Testing', 'LT Switchgear Setup'],
          tamperingRisk: 'Low',
        }),
        aiGenerated: true,
        aiConfidence: 0.94,
        requiresHumanValidation: true,
      },
      {
        candidateProfileId: arunProfile.id,
        fileName: 'Residential_Project_Site_Photos.jpg',
        fileType: 'SITE_PHOTO',
        fileSize: '3.8 MB',
        filePath: 'uploads/demo/site_photo.jpg',
        aiVerificationStatus: 'VERIFIED',
        aiRelevanceScore: 89,
        extractedData: JSON.stringify({
          employerOrContractor: 'Direct Client Work: 12-Unit Apartment Complex',
          statedRole: 'Lead Wiring Craftsman',
          duration: 'Completed Nov 2025',
          detectedSkills: ['Main Distribution Panel Wiring', 'Cable Tray Route Installation'],
          tamperingRisk: 'Low',
        }),
        aiGenerated: true,
        aiConfidence: 0.89,
        requiresHumanValidation: true,
      },
      {
        candidateProfileId: arunProfile.id,
        fileName: 'Contractor_Affidavit_Declaration.pdf',
        fileType: 'CONTRACTOR_AFFIDAVIT',
        fileSize: '820 KB',
        filePath: 'uploads/demo/affidavit.pdf',
        aiVerificationStatus: 'NEEDS_REVIEW',
        aiRelevanceScore: 82,
        extractedData: JSON.stringify({
          employerOrContractor: 'Licensed Contractor (Lic No. TN/EB/44910)',
          statedRole: 'Apprentice to Senior Wireman',
          duration: '2017 – 2019',
          detectedSkills: ['Basic Wiring', 'Appliance Repair'],
          tamperingRisk: 'Low',
        }),
        aiGenerated: true,
        aiConfidence: 0.82,
        requiresHumanValidation: true,
      },
    ],
  });

  console.log('✅ Created 3 evidence documents for Arun');

  // ─── Skill Score for Arun ─────────────────────────────────────────────────
  await prisma.skillScore.create({
    data: {
      candidateProfileId: arunProfile.id,
      knowledge: 89,
      practical: 85,
      safety: 94,
      evidence: 88,
      communication: 81,
      overall: 87,
      aiGenerated: true,
      aiConfidence: 0.92,
      requiresHumanValidation: true,
    },
  });

  // ─── Skill Gaps for Arun ──────────────────────────────────────────────────
  await prisma.skillGap.createMany({
    data: [
      {
        candidateProfileId: arunProfile.id,
        skillName: 'Electrical Safety & PPE Regulations',
        currentLevelScore: 94,
        requiredLevelScore: 80,
        status: 'PASS',
        bridgeModuleTitle: 'Advanced High-Voltage Safety Standards (Refresher)',
        bridgeModuleDuration: '20 Mins',
        bridgeModulePartner: 'Skill India Digital Hub',
        bridgeModuleLinkUrl: '#',
      },
      {
        candidateProfileId: arunProfile.id,
        skillName: 'Domestic & Commercial Conduit Wiring',
        currentLevelScore: 92,
        requiredLevelScore: 75,
        status: 'PASS',
        bridgeModuleTitle: 'IS 732 Wiring Standards & Smart Home Conduit Systems',
        bridgeModuleDuration: '35 Mins',
        bridgeModulePartner: 'ESSCI Sector Council',
        bridgeModuleLinkUrl: '#',
      },
      {
        candidateProfileId: arunProfile.id,
        skillName: 'Distribution Board & RCCB Installation',
        currentLevelScore: 89,
        requiredLevelScore: 80,
        status: 'PASS',
        bridgeModuleTitle: 'Surge Protection Devices (SPD) Sizing and Wiring',
        bridgeModuleDuration: '25 Mins',
        bridgeModulePartner: 'National Skill Development Corporation',
        bridgeModuleLinkUrl: '#',
      },
      {
        candidateProfileId: arunProfile.id,
        skillName: '3-Phase Motor Starters & Industrial Fault Diagnosis',
        currentLevelScore: 72,
        requiredLevelScore: 80,
        status: 'GAP',
        bridgeModuleTitle: 'Star-Delta Starter Wiring & Overload Relay Troubleshooting',
        bridgeModuleDuration: '45 Mins Modular Video',
        bridgeModulePartner: 'Skill India / NCVET FastTrack',
        bridgeModuleLinkUrl: '#',
      },
      {
        candidateProfileId: arunProfile.id,
        skillName: 'Customer Communication & Cost Estimation',
        currentLevelScore: 81,
        requiredLevelScore: 70,
        status: 'PASS',
        bridgeModuleTitle: 'Digital Invoicing & Bill of Quantities (BOQ) Basics',
        bridgeModuleDuration: '15 Mins',
        bridgeModulePartner: 'MSDE Entrepreneurship Cell',
        bridgeModuleLinkUrl: '#',
      },
    ],
  });

  console.log('✅ Created 5 skill gaps for Arun');

  // ─── Assessment for Arun ──────────────────────────────────────────────────
  const arunAssessment = await prisma.assessment.create({
    data: {
      id: 'assess-arun-01',
      candidateProfileId: arunProfile.id,
      jobRoleId: electricianRole.id,
      type: 'KNOWLEDGE',
      status: 'COMPLETED',
      totalQuestions: 4,
      answeredQuestions: 4,
      score: 89,
      startedAt: new Date('2026-10-06T09:00:00Z'),
      completedAt: new Date('2026-10-06T09:30:00Z'),
    },
  });

  // Assessment responses
  await prisma.assessmentResponse.createMany({
    data: [
      { assessmentId: arunAssessment.id, questionId: 'q1-safety-l1', selectedOptionId: 'opt-b', isCorrect: true },
      { assessmentId: arunAssessment.id, questionId: 'q2-wiring-l2', selectedOptionId: 'opt-a', isCorrect: true },
      { assessmentId: arunAssessment.id, questionId: 'q3-fault-l3', selectedOptionId: 'opt-a', isCorrect: true },
      { assessmentId: arunAssessment.id, questionId: 'q4-troubleshoot-l4', selectedOptionId: 'opt-a', isCorrect: true },
    ],
  });

  // ─── Practical Assessment for Arun ────────────────────────────────────────
  await prisma.practicalAssessment.create({
    data: {
      candidateProfileId: arunProfile.id,
      taskTitle: 'Safe Installation of 1-Way Switch with 16A Solderless Socket & Continuity Check',
      taskInstructions: 'Wear recommended PPE (gloves/glasses), isolate test rig power, strip 1.5 sq mm copper wire to 10mm without copper strand nicking, fasten securely into terminal lugs, and verify insulation integrity.',
      duration: '00:48',
      observations: JSON.stringify([
        { timestamp: '00:04', label: 'PPE Compliance: 1000V Insulated Gloves', status: 'passed', box: { x: 18, y: 35, width: 26, height: 38 }, description: 'Candidate verified wearing Class 0 certified electrical hand gloves.' },
        { timestamp: '00:09', label: 'Tool Selection: VDE Insulated Terminal Screwdriver', status: 'passed', box: { x: 55, y: 40, width: 22, height: 30 }, description: 'Correct insulated screwdriver selected matching terminal slot width.' },
        { timestamp: '00:18', label: 'Wire Stripping: Zero Strand Nicking', status: 'passed', box: { x: 38, y: 48, width: 28, height: 32 }, description: 'Stripper gauge calibrated accurately; no copper conductor deformation detected.' },
        { timestamp: '00:32', label: 'Notice: Pre-testing Neutral Isolation Step', status: 'warning', box: { x: 30, y: 22, width: 35, height: 45 }, description: 'Candidate connected phase first before tightening neutral retention clamp.' },
      ]),
      timelineEvents: JSON.stringify([
        { time: '00:04', title: 'Safety Gear & Workplace Setup', status: 'success', detail: 'Insulated mat, safety glasses, and 1000V gloves verified by CV detector.' },
        { time: '00:09', title: 'Tool Calibration & Inspection', status: 'success', detail: 'Tester, insulation stripper, and torque screwdriver verified.' },
        { time: '00:18', title: 'Conductor Preparation & Stripping', status: 'success', detail: 'Clean 10mm strip without damaging core copper strands.' },
        { time: '00:32', title: 'Switch Terminal Fastening', status: 'warning', detail: 'Slight looseness noted on terminal 2 before final torque verification.' },
        { time: '00:44', title: 'Post-Install Continuity Verification', status: 'success', detail: 'Zero ohm resistance on closed circuit; infinite resistance on open.' },
      ]),
      taskCompletionScore: 78,
      safetyComplianceScore: 91,
      toolHandlingScore: 88,
      procedureAccuracyScore: 84,
      overallPracticalScore: 85,
      aiGenerated: true,
      aiConfidence: 0.87,
      requiresHumanValidation: true,
      analyzedAt: new Date('2026-10-06T09:48:00Z'),
    },
  });

  // ─── Assessor Review ──────────────────────────────────────────────────────
  await prisma.assessorReview.create({
    data: {
      assessmentId: arunAssessment.id,
      assessorId: assessorUser.id,
      candidateProfileId: arunProfile.id,
      decision: 'APPROVED',
      remarks:
        'Candidate exhibits robust practical competency in domestic installations and exemplary safety protocol execution. Recommended for NSQF Level 4 RPL Certification with a minor bridge advisory in 3-phase industrial fault isolation.',
      reviewedAt: new Date('2026-10-06T10:14:00Z'),
    },
  });

  // ─── Certification ────────────────────────────────────────────────────────
  await prisma.certification.create({
    data: {
      candidateProfileId: arunProfile.id,
      certificateId: 'RPL-IND-2026-EL4-9842',
      jobRoleTitle: 'Electrician (Domestic & Commercial)',
      nsqfLevel: 4,
      issuedAt: new Date('2026-10-06'),
      isValid: true,
    },
  });

  console.log('✅ Created assessment, practical assessment, assessor review & certification for Arun');

  // ─── Audit Logs ───────────────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: assessorUser.id,
        actorName: 'Priya Sharma (Assessor ID: ASS-TN-094)',
        actorRole: 'Assessor',
        action: 'Certification Approval Signed',
        details: 'Approved candidate Arun Kumar (cand-arun-01) for NSQF Level 4 RPL Electrician Certification.',
        entityType: 'CandidateProfile',
        entityId: arunProfile.id,
      },
      {
        actorName: 'AI Skill Engine v3.4',
        actorRole: 'System',
        action: 'Computer Vision Analysis Generated',
        details: 'Processed practical demonstration video for cand-arun-01. Score: 85% with 4 key safety/tool milestones verified.',
        entityType: 'PracticalAssessment',
      },
      {
        actorName: 'AI Voice Engine (Whisper-Gov MultiLang)',
        actorRole: 'System',
        action: 'Voice Response Transcribed & Evaluated',
        details: 'Transcribed audio for cand-arun-01 in Tamil/English mix. Technical Knowledge Score: 89%.',
        entityType: 'Assessment',
        entityId: arunAssessment.id,
      },
      {
        actorId: arunUser.id,
        actorName: 'Arun Kumar',
        actorRole: 'Candidate',
        action: 'Evidence Documents Submitted',
        details: 'Uploaded experience letter (ABC Electrical) and site installation photos.',
        entityType: 'Evidence',
        entityId: arunProfile.id,
      },
    ],
  });

  console.log('✅ Created 4 audit log entries');
  console.log('\n🎉 Database seeded successfully!\n');
  console.log('─────────────────────────────────────────');
  console.log('Demo Credentials:');
  console.log('  Candidate : arun@example.com     / Arun@123');
  console.log('  Assessor  : assessor@skillset.ai / Assessor@123');
  console.log('  Admin     : admin@skillset.ai    / Admin@123');
  console.log('─────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
