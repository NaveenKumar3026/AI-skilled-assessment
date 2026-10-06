# 🇮🇳 SkillSet AI — AI-Powered Recognition of Prior Learning (RPL)

> **Smart India Hackathon (SIH26242)**  
> **Ministry of Skill Development and Entrepreneurship (MSDE)**  
> **Theme:** Smart Education  
> **Branding Tagline:** *"Your Experience. Your Skills. Your Recognition."*

---

## 🌟 Executive Summary

Over **90% of India's vocational craftspersons** (electricians, welders, tailors, plumbers, solar technicians) develop valuable practical skills through years of on-the-job informal learning, community apprenticeships, and family occupations. However, without formal educational credentials, they face depressed wages, zero collateral-free bank loan access, and restricted career progression.

**SkillSet AI** is a state-of-the-art, accessible digital platform engineered for the **Recognition of Prior Learning (RPL 2.0)**. It transforms informal experience into nationally recognized **National Skills Qualification Framework (NSQF)** certifications through multi-modal AI assessments (Voice NLP, Adaptive Visual Quizzes, Computer Vision Demonstration Verification, and OCR Document Parsing) with **strict Human-in-the-Loop governance by certified assessors**.

---

## 🚀 Key Innovation: Human-in-the-Loop AI Architecture

> ⚠️ **Core AI Principle:** AI never acts as the sole certification authority. AI reduces assessment friction, creates dynamic vernacular interviews, tracks physical tool & safety compliance, and surfaces verifiable evidence so authorized human assessors can make faster, fairer, and fraud-resistant recognition decisions.

```
                   ┌─────────────────────────────────────────┐
                   │    Informal Craftsperson (Arun Kumar)   │
                   └────────────────────┬────────────────────┘
                                        │
                         1. Multilingual Voice / NLP
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │       AI Experience Discovery           │
                   │ (Extracts 7 Yrs, Tools, Safety Vocab)   │
                   └────────────────────┬────────────────────┘
                                        │
                         2. NOS & NSQF Ontology Mapping
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │   AI Skill Profile & Radar Matrix       │
                   │ (92% Match ➔ NSQF Level 4 Electrician)  │
                   └────────────────────┬────────────────────┘
                                        │
                         3. Multi-Modal Assessments
                                        ▼
     ┌──────────────────────┬──────────────────────┬──────────────────────┐
     │   Adaptive Domain    │   Voice Technical    │   Computer Vision    │
     │      Visual Quiz     │     Interview        │    Practical Demo    │
     │     (IS 732 Rules)   │  (Whisper-Gov NLP)   │  (1000V PPE & Tools) │
     └──────────┬───────────┴──────────┬───────────┴──────────┬───────────┘
                │                      │                      │
                └──────────────────────┼──────────────────────┘
                                       │
                         4. Workplace Evidence OCR
                                       ▼
                   ┌─────────────────────────────────────────┐
                   │    AI Assessment Report (87% Score)     │
                   │  - 30% Knowledge  - 35% Practical       │
                   │  - 20% Safety     - 10% Evidence        │
                   │  - 5% Communication                     │
                   └────────────────────┬────────────────────┘
                                       │
                         5. Mandatory Human Evaluation
                                       ▼
                   ┌─────────────────────────────────────────┐
                   │   Authorized RPL Assessor Audit Desk    │
                   │ (Priya Sharma: Video Audit & Sign-Off)  │
                   └────────────────────┬────────────────────┘
                                       │
                                       ▼
                   ┌─────────────────────────────────────────┐
                   │  Official Government-Grade Certificate  │
                   │ (NSQF Level 4 • DigiLocker Hash & QR)   │
                   └─────────────────────────────────────────┘
```

---

## ⚡ 14-Step Complete Hackathon Demo Story

The application includes an **Interactive Demo Navigator** at the bottom of the screen with a single-click walkthrough covering the exact journey of **Arun Kumar (32-year-old Electrician from Chennai with 7 years informal experience)**:

1. **National Public Landing Page**: Value proposition, impact statistics, and Sector Skill Council ecosystem.
2. **Candidate Hub**: Greeting, 85% profile completion, 7 years informal experience, 87% RPL readiness.
3. **AI Experience Discovery**: Spoken voice recording with live animated waveform; real-time NLP extraction.
4. **AI Skill Profile Radar**: Polar grid comparing candidate vs NSQF Level 4 benchmark across 7 competencies.
5. **RPL Job Pathway Matches**: Job cards for Electrician (92%), Electrical Maintenance (81%), Solar PV (74%).
6. **Adaptive Knowledge Assessment**: 4-level difficulty quiz with dynamic scaling and *"Explain in Simple Words"* audio assistant.
7. **Voice Assessment**: Spoken response recording with speech-to-concept extraction.
8. **Computer Vision Practical Demo**: Simulated CV bounding boxes (1000V insulated gloves, VDE screwdriver, wire stripping quality, neutral safety warning).
9. **Workplace Documentation**: OCR entity extraction from employer letters and installation site photographs.
10. **Skill Gap & Bridge Learning**: Gap identification in 3-Phase Industrial Starters with recommended 45-min Skill India micro-courses.
11. **Holistic Assessment Report**: Multi-dimensional score synthesis (87% overall readiness).
12. **Assessor Review Desk**: Evaluator Priya Sharma audits video frames, overrides scores, adds remarks, and authorizes recognition.
13. **Official Prototype Certificate**: National RPL Certificate with Government emblem, QR verification, and printable PDF layout.
14. **Admin Telemetry & Analytics**: Macro insights across states (Tamil Nadu, Maharashtra, UP) and SSC demand trends.

---

## 🛠️ Project Structure

```
ai-assisted-skill-assessment/
├── index.html                     # Government typography & meta tags
├── package.json                   # Dependencies (React, Vite, Tailwind, Recharts, Lucide)
├── tsconfig.json                  # TypeScript bundler configuration
├── vite.config.ts                 # Vite + React + Tailwind v4 plugins
├── src/
│   ├── types/
│   │   └── index.ts               # Domain models (Candidate, Assessor, Question, Evidence, Certificate)
│   ├── i18n/
│   │   └── translations.ts        # Multilingual dictionary (English, Tamil, Hindi)
│   ├── services/
│   │   ├── aiService.ts           # AI abstraction layer (NLP, CV, Speech, OCR, Scoring)
│   │   └── mockData.ts            # Realistic candidates, job roles, question banks, CV frames
│   ├── context/
│   │   └── AppContext.tsx         # Global state, role switcher, judge demo tour controller
│   ├── components/
│   │   ├── common/
│   │   │   ├── AIBadge.tsx        # "AI-Assisted" transparency badge
│   │   │   ├── HowScoreCalculatedModal.tsx # Explainable AI weights breakdown
│   │   │   └── DemoTourBar.tsx    # 14-step floating hackathon tour controller
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Government banner, role switcher, language selector
│   │   │   ├── Footer.tsx         # MSDE & NCVET helpline, links, disclaimers
│   │   │   └── Sidebar.tsx        # Responsive role-aware sidebar
│   │   ├── landing/
│   │   │   └── LandingPage.tsx    # Public portal, pipeline diagram, FAQ
│   │   ├── auth/
│   │   │   └── AuthModal.tsx      # Mobile OTP login & trade registration
│   │   ├── candidate/
│   │   │   ├── CandidateDashboard.tsx     # Candidate overview & milestones
│   │   │   ├── ExperienceDiscovery.tsx    # Voice/Text conversational interview
│   │   │   ├── AISkillProfile.tsx         # Radar charts & NOS taxonomy mapping
│   │   │   ├── JobRoleRecommendations.tsx # RPL pathway selection cards
│   │   │   ├── AssessmentEngine.tsx       # Adaptive knowledge quiz engine
│   │   │   ├── VoiceAssessment.tsx        # Voice recording & speech analysis
│   │   │   ├── PracticalAssessment.tsx    # Computer Vision video detection
│   │   │   ├── EvidenceVerification.tsx   # OCR document extraction & verification
│   │   │   ├── SkillGapAnalysis.tsx       # Current vs benchmark gap bridging
│   │   │   └── AssessmentResult.tsx       # Holistic 87% report & assessor submission
│   │   ├── assessor/
│   │   │   ├── AssessorDashboard.tsx      # Candidate evaluation queue & filters
│   │   │   └── AssessorReview.tsx         # Video/voice audit, score sliders & sign-off
│   │   ├── certificate/
│   │   │   └── CertificateView.tsx        # Official RPL Certificate with QR & print
│   │   └── admin/
│   │       └── AdminDashboard.tsx         # National RPL telemetry & state metrics
│   ├── App.tsx                    # View router & layout orchestrator
│   ├── main.tsx                   # React root entry point
│   └── index.css                  # Tailwind styles, animations & typography
```

---

## 💻 Local Setup & Execution

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **npm**: v9.0.0 or higher

### Steps
1. Navigate to the project directory:
   ```bash
   cd "AI assisted Skill Assessment"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open the browser at `http://localhost:5173/` (or the port displayed in your terminal).

---

## 🔑 Demo Credentials & Fast-Track Controls

For demonstration, all roles are accessible without authentication:

| Role | Name | Default Context | Access Method |
|---|---|---|---|
| **Candidate** | Arun Kumar | 32 Yrs, Electrician (7 Yrs Exp), Chennai | Click **"Candidate"** in top header pill |
| **Assessor** | Priya Sharma | Certified RPL Assessor (TN/094) | Click **"Assessor"** in top header pill |
| **Admin** | MSDE Directorate | National Skill Mission Analytics | Click **"Admin"** in top header pill |

> 💡 **Hackathon Evaluator Tip:** Click the **"⚡ Instant Demo Walkthrough"** button in the header or use the floating **SIH26242 Demo Navigator** at the bottom of the screen to jump instantly to any of the 14 project stages.

---

## 🌐 Multilingual & Digital Accessibility Features

1. **Language Switcher**: Instant switching between **English (EN)**, **தமிழ் (Tamil)**, and **हिन्दी (Hindi)**.
2. **"Explain in Simple Words" Voice Assistant**: Simplifies technical jargon into colloquial explanations with optional Web Speech synthesis audio readout.
3. **Mobile-First Responsive Layout**: Optimized for low-cost smartphones widely used by informal craftspersons.
4. **Large Touch Targets & Visual Iconography**: Minimal form filling; emphasis on conversational voice inputs and video recording.

---

## 🔮 Future Production AI Integrations

When connecting to production cloud infrastructure:
1. **ASR / Speech-to-Text**: Integrate **Bhashini AI / AI4Bharat** APIs for 22 Indian regional languages and dialectal variations.
2. **Computer Vision**: Deploy **YOLOv11-Pose** and spatial-temporal action recognition models (VideoMAE) on GPU nodes to analyze live video feeds for PPE, tool classification, and procedural adherence.
3. **LLM Reasoning**: Connect **Gemini 1.5 Pro / Flash** for dynamic National Occupational Standards (NOS) question generation and candidate rationale explanations.
4. **Identity & Document Trust**: Integration with **DigiLocker API** and **Aadhaar e-Sign** for instant verified credentials.

---

## ⚖️ Prototype Limitations & Disclaimers

1. **Prototype Certificate**: All certificates generated are simulations for Smart India Hackathon evaluation and are clearly watermarked as prototypes.
2. **Simulated Computer Vision**: Video bounding boxes and timeline detections are deterministically simulated to provide zero-lag, reliable demonstrations without requiring paid GPU instances.
3. **No Real Aadhaar Collection**: In compliance with privacy standards and DPDP Act guidelines, no actual government identity numbers are collected.

---

## 🏆 Smart India Hackathon SIH26242 Alignment

- **Ministry**: Ministry of Skill Development and Entrepreneurship (MSDE)
- **Theme**: Smart Education / Recognition of Prior Learning
- **Outcome**: A national-scale, accessible, multi-modal AI platform empowering India's informal workforce with recognized, verifiable qualifications.
