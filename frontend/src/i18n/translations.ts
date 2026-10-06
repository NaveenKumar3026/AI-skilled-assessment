import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  nationalPortal: string;
  msdeBadge: string;
  nav: {
    home: string;
    howItWorks: string;
    domains: string;
    benefits: string;
    faq: string;
    login: string;
    register: string;
    dashboard: string;
    assessorPortal: string;
    adminPortal: string;
    demoMode: string;
    switchRole: string;
  };
  hero: {
    tagline: string;
    title: string;
    highlight: string;
    description: string;
    startBtn: string;
    howItWorksBtn: string;
    statsWorkers: string;
    statsPassRate: string;
    statsJobRoles: string;
  };
  candidate: {
    greeting: string;
    profileCompletion: string;
    experience: string;
    skillConfidence: string;
    assessmentProgress: string;
    primaryTrade: string;
    detectedSkills: string;
    continueAssessment: string;
    experienceInterviewTitle: string;
    experienceInterviewSubtitle: string;
    voicePrompt: string;
    micStart: string;
    micStop: string;
    listening: string;
    analyzingExperience: string;
    aiExtractedInsights: string;
    viewRecommendations: string;
    skillProfileTitle: string;
    skillProfileSubtitle: string;
    radarTitle: string;
    targetNSQF: string;
    adaptiveQuizTitle: string;
    explainQuestion: string;
    nextQuestion: string;
    submitQuiz: string;
    practicalTitle: string;
    evidenceTitle: string;
    skillGapsTitle: string;
    resultTitle: string;
  };
  assessor: {
    portalTitle: string;
    awaitingReview: string;
    assessmentsCompleted: string;
    pendingVerification: string;
    certifiedCandidates: string;
    reviewCandidate: string;
    approve: string;
    requestReassessment: string;
    aiNotice: string;
  };
  common: {
    aiAssisted: string;
    disclaimer: string;
    howScoreCalculated: string;
    years: string;
    status: string;
    action: string;
    viewDetails: string;
    close: string;
    print: string;
    downloadCert: string;
    prototypeWatermark: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "SkillSet AI",
    appSubtitle: "AI-Powered Recognition of Prior Learning (RPL)",
    nationalPortal: "Government of India — National RPL Portal",
    msdeBadge: "Ministry of Skill Development and Entrepreneurship (MSDE)",
    nav: {
      home: "Home",
      howItWorks: "How It Works",
      domains: "Skill Domains",
      benefits: "Why RPL?",
      faq: "FAQ",
      login: "Login",
      register: "Register",
      dashboard: "Candidate Hub",
      assessorPortal: "Assessor Portal",
      adminPortal: "Admin Analytics",
      demoMode: "⚡ Instant Demo Walkthrough",
      switchRole: "Role",
    },
    hero: {
      tagline: "National Skill Recognition Initiative",
      title: "Turn Experience Into",
      highlight: "Recognized Certification.",
      description: "AI-assisted digital assessment helping informal workers transform years of on-the-job experience into government-accredited NSQF qualifications.",
      startBtn: "Start Free Skill Assessment",
      howItWorksBtn: "Explore How It Works",
      statsWorkers: "4.8 Lakh+ Assessed Workers",
      statsPassRate: "93.4% RPL Validation",
      statsJobRoles: "150+ NSQF Trades",
    },
    candidate: {
      greeting: "Good morning",
      profileCompletion: "Profile Completion",
      experience: "Experience",
      skillConfidence: "AI Skill Confidence",
      assessmentProgress: "RPL Readiness",
      primaryTrade: "Primary Trade",
      detectedSkills: "Identified Core Competencies",
      continueAssessment: "Continue Assessment",
      experienceInterviewTitle: "AI Experience Discovery Interview",
      experienceInterviewSubtitle: "Tell us about your work naturally in your own words or voice — no complex forms required.",
      voicePrompt: "Press microphone and explain your daily work, tools used, and safety steps.",
      micStart: "Start Voice Recording",
      micStop: "Finish & Process AI Analysis",
      listening: "Listening to your voice...",
      analyzingExperience: "AI Engine analyzing domain vocabulary, years, and safety competencies...",
      aiExtractedInsights: "AI Extracted Skill Intelligence",
      viewRecommendations: "View RPL Job Pathway Matches",
      skillProfileTitle: "AI Skill Competency Matrix",
      skillProfileSubtitle: "Detailed mapping against National Skills Qualification Framework (NSQF).",
      radarTitle: "Competency Radar Analysis",
      targetNSQF: "Target NSQF Level",
      adaptiveQuizTitle: "Adaptive Knowledge Assessment",
      explainQuestion: "Explain in Simple Words",
      nextQuestion: "Submit & Next Question",
      submitQuiz: "Complete Knowledge Assessment",
      practicalTitle: "Computer Vision Practical Demonstration",
      evidenceTitle: "Evidence & Workplace Documentation",
      skillGapsTitle: "Skill Gap & Bridge Learning",
      resultTitle: "Holistic AI Skill Assessment Report",
    },
    assessor: {
      portalTitle: "Authorized RPL Assessor Evaluation Desk",
      awaitingReview: "Candidates Awaiting Review",
      assessmentsCompleted: "AI Assessments Evaluated",
      pendingVerification: "Pending Workplace Evidence",
      certifiedCandidates: "Certifications Recommended",
      reviewCandidate: "Audit & Review Candidate",
      approve: "Authorize & Issue Certificate",
      requestReassessment: "Request Targeted Reassessment",
      aiNotice: "AI generates recommendations. Final recognition is determined by an authorized assessor.",
    },
    common: {
      aiAssisted: "AI-Assisted Assessment",
      disclaimer: "Official prototype for Smart India Hackathon. Final certification requires authorized evaluator sign-off.",
      howScoreCalculated: "How was this score calculated?",
      years: "Years",
      status: "Status",
      action: "Action",
      viewDetails: "View Details",
      close: "Close",
      print: "Print Official Certificate",
      downloadCert: "Download Prototype Certificate",
      prototypeWatermark: "PROTOTYPE DEMONSTRATION — MINISTRY OF SKILL DEVELOPMENT & ENTREPRENEURSHIP",
    },
  },
  ta: {
    appName: "SkillSet AI",
    appSubtitle: "முன் கற்றல் அங்கீகாரத்திற்கான AI தளம் (RPL)",
    nationalPortal: "இந்திய அரசு — தேசிய RPL திறன் தளம்",
    msdeBadge: "திறன் மேம்பாடு மற்றும் தொழில்முனைவோர் அமைச்சகம் (MSDE)",
    nav: {
      home: "முகப்பு",
      howItWorks: "செயல்முறை",
      domains: "தொழில் துறைகள்",
      benefits: "RPL நன்மைகள்",
      faq: "கேள்விகள்",
      login: "உள்நுழைவு",
      register: "பதிவு செய்க",
      dashboard: "பணியாளர் பக்கம்",
      assessorPortal: "மதிப்பீட்டாளர் பக்கம்",
      adminPortal: "நிர்வாகப் பகுப்பாய்வு",
      demoMode: "⚡ உடனடி டெமோ வழிகாட்டி",
      switchRole: "பங்கு",
    },
    hero: {
      tagline: "தேசிய திறன் அங்கீகார முயற்சி",
      title: "உங்கள் அனுபவத்தை",
      highlight: "சான்றிதழாக மாற்றுங்கள்.",
      description: "முறையான சான்றிதழ் இல்லாத தொழிலாளர்களின் பல ஆண்டு பணி அனுபவத்தை AI மூலம் மதிப்பிட்டு அரசு அங்கீகாரம் பெற்ற சான்றிதழாக மாற்றுகிறது.",
      startBtn: "திறன் மதிப்பீட்டைத் தொடங்கு",
      howItWorksBtn: "செயல்முறையை அறிக",
      statsWorkers: "4.8 லட்சம்+ தொழிலாளர்கள்",
      statsPassRate: "93.4% RPL தேர்ச்சி",
      statsJobRoles: "150+ தொழிற்பிரிவுகள்",
    },
    candidate: {
      greeting: "வணக்கம்",
      profileCompletion: "சுயவிவர நிறைவு",
      experience: "பணி அனுபவம்",
      skillConfidence: "AI திறன் நம்பிக்கை",
      assessmentProgress: "RPL தயார்நிலை",
      primaryTrade: "முக்கிய தொழில்",
      detectedSkills: "கண்டறியப்பட்ட திறன்கள்",
      continueAssessment: "மதிப்பீட்டைத் தொடர்க",
      experienceInterviewTitle: "AI அனுபவக் கண்டறிதல் உரையாடல்",
      experienceInterviewSubtitle: "உங்கள் பணி அனுபவத்தை உங்கள் சொந்த குரலில் அல்லது சொற்களில் எளிதாக விளக்குங்கள்.",
      voicePrompt: "மைக்ரோஃபோனை அழுத்தி உங்கள் தினசரி வேலை, பயன்படுத்தும் கருவிகள் மற்றும் பாதுகாப்பு முறைகளைப் பற்றி பேசுங்கள்.",
      micStart: "குரல் பதிவைத் தொடங்கு",
      micStop: "பதிவை முடித்து AI பகுப்பாய்வு செய்",
      listening: "உங்கள் குரலைக் கேட்கிறது...",
      analyzingExperience: "AI உங்கள் தொழில் சொற்களையும் பாதுகாப்பு திறன்களையும் பகுப்பாய்வு செய்கிறது...",
      aiExtractedInsights: "AI கண்டறிந்த திறன் விவரங்கள்",
      viewRecommendations: "பொருத்தமான வேலைப் பாதைகளைக் காண்க",
      skillProfileTitle: "AI திறன் வரைபடம்",
      skillProfileSubtitle: "தேசிய திறன் கட்டமைப்பு (NSQF) உடன் ஒப்பீடு.",
      radarTitle: "திறன் வரைபட பகுப்பாய்வு",
      targetNSQF: "இலக்கு NSQF நிலை",
      adaptiveQuizTitle: "தகவமைப்பு அறிவு மதிப்பீடு",
      explainQuestion: "எளிய தமிழில் விளக்குக",
      nextQuestion: "சமர்ப்பித்து அடுத்த கேள்வி",
      submitQuiz: "அறிவு மதிப்பீட்டை முடிக்கவும்",
      practicalTitle: "கணினி பார்வை செய்முறை மதிப்பீடு",
      evidenceTitle: "பணி ஆதாரங்கள் & ஆவணங்கள்",
      skillGapsTitle: "திறன் இடைவெளி & கூடுதல் பயிற்சி",
      resultTitle: "முழுமையான AI மதிப்பீட்டு அறிக்கை",
    },
    assessor: {
      portalTitle: "அங்கீகரிக்கப்பட்ட RPL மதிப்பீட்டாளர் பகுதி",
      awaitingReview: "மதிப்பாய்வு செய்ய வேண்டியவர்கள்",
      assessmentsCompleted: "முடிந்த மதிப்பீடுகள்",
      pendingVerification: "சரிபார்க்க வேண்டிய ஆவணங்கள்",
      certifiedCandidates: "சான்றளிக்கப்பட்டவர்கள்",
      reviewCandidate: "விண்ணப்பதாரரை ஆய்வு செய்க",
      approve: "சான்றிதழை அங்கீகரித்து வழங்குக",
      requestReassessment: "மறுமதிப்பீடு கோருக",
      aiNotice: "AI பரிந்துரைகளை மட்டுமே வழங்குகிறது. இறுதி அங்கீகாரத்தை அதிகாரப்பூர்வ மதிப்பீட்டாளர் தீர்மானிக்கிறார்.",
    },
    common: {
      aiAssisted: "AI-உதவி மதிப்பீடு",
      disclaimer: "ஸ்மார்ட் இந்தியா ஹேக்கத்தான் மாதிரி திட்டம். அதிகாரப்பூர்வ மதிப்பீட்டாளர் ஒப்புதல் தேவை.",
      howScoreCalculated: "மதிப்பெண் எவ்வாறு கணக்கிடப்பட்டது?",
      years: "ஆண்டுகள்",
      status: "நிலை",
      action: "செயல்",
      viewDetails: "விவரங்களைக் காண்க",
      close: "மூடு",
      print: "அதிகாரப்பூர்வ சான்றிதழ் அச்சிடு",
      downloadCert: "மாதிரி சான்றிதழ் பதிவிறக்கம்",
      prototypeWatermark: "மாதிரி டெமோ — திறன் மேம்பாடு மற்றும் தொழில்முனைவோர் அமைச்சகம்",
    },
  },
  hi: {
    appName: "SkillSet AI",
    appSubtitle: "पूर्व शिक्षण की मान्यता हेतु AI मंच (RPL)",
    nationalPortal: "भारत सरकार — राष्ट्रीय RPL पोर्टल",
    msdeBadge: "कौशल विकास और उद्यमिता मंत्रालय (MSDE)",
    nav: {
      home: "मुख्य पृष्ठ",
      howItWorks: "कार्यप्रणाली",
      domains: "कौशल क्षेत्र",
      benefits: "RPL लाभ",
      faq: "प्रश्नोत्तरी",
      login: "लॉग इन",
      register: "पंजीकरण",
      dashboard: "उम्मीदवार डैशबोर्ड",
      assessorPortal: "मूल्यांकनकर्ता पोर्टल",
      adminPortal: "प्रशासनिक विश्लेषिकी",
      demoMode: "⚡ त्वरित डेमो टूर",
      switchRole: "भूमिका",
    },
    hero: {
      tagline: "राष्ट्रीय कौशल मान्यता पहल",
      title: "अपने अनुभव को",
      highlight: "मान्यता प्राप्त प्रमाणपत्र में बदलें।",
      description: "AI-सहायक मूल्यांकन जो असंगठित क्षेत्र के कारीगरों के वर्षों के व्यावहारिक अनुभव को सरकारी मान्यता प्राप्त NSQF योग्यता में बदलता है।",
      startBtn: "निःशुल्क कौशल मूल्यांकन शुरू करें",
      howItWorksBtn: "जानें कैसे काम करता है",
      statsWorkers: "4.8 लाख+ मूल्यांकित कामगार",
      statsPassRate: "93.4% RPL सत्यापन दर",
      statsJobRoles: "150+ NSQF ट्रेड",
    },
    candidate: {
      greeting: "नमस्ते",
      profileCompletion: "प्रोफ़ाइल पूर्णता",
      experience: "कार्य अनुभव",
      skillConfidence: "AI कौशल विश्वास",
      assessmentProgress: "RPL तैयारी",
      primaryTrade: "मुख्य व्यवसाय",
      detectedSkills: "पहचाने गए मुख्य कौशल",
      continueAssessment: "मूल्यांकन जारी रखें",
      experienceInterviewTitle: "AI अनुभव खोज साक्षात्कार",
      experienceInterviewSubtitle: "अपने काम के बारे में अपनी आवाज़ या शब्दों में स्वाभाविक रूप से बताएं।",
      voicePrompt: "माइक बटन दबाएं और अपने दैनिक काम, औजारों और सुरक्षा उपायों के बारे में बोलें।",
      micStart: "आवाज़ रिकॉर्डिंग शुरू करें",
      micStop: "रिकॉर्डिंग समाप्त करें और AI विश्लेषण करें",
      listening: "आपकी आवाज़ सुनी जा रही है...",
      analyzingExperience: "AI आपके तकनीकी शब्दों और सुरक्षा कौशलों का विश्लेषण कर रहा है...",
      aiExtractedInsights: "AI द्वारा निकाला गया कौशल विवरण",
      viewRecommendations: "अनुशंसित नौकरी के रास्ते देखें",
      skillProfileTitle: "AI कौशल क्षमता मैट्रिक्स",
      skillProfileSubtitle: "राष्ट्रीय कौशल योग्यता फ्रेमवर्क (NSQF) के अनुसार मैपिंग।",
      radarTitle: "कौशल रडार विश्लेषण",
      targetNSQF: "लक्षित NSQF स्तर",
      adaptiveQuizTitle: "अनुकूली ज्ञान मूल्यांकन",
      explainQuestion: "सरल भाषा में समझाएं",
      nextQuestion: "उत्तर दें और अगला प्रश्न",
      submitQuiz: "ज्ञान मूल्यांकन पूरा करें",
      practicalTitle: "कंप्यूटर विज़न व्यावहारिक प्रदर्शन",
      evidenceTitle: "कार्यस्थल दस्तावेज़ और साक्ष्य",
      skillGapsTitle: "कौशल अंतर और ब्रिज लर्निंग",
      resultTitle: "समग्र AI कौशल मूल्यांकन रिपोर्ट",
    },
    assessor: {
      portalTitle: "अधिकृत RPL मूल्यांकनकर्ता डेस्क",
      awaitingReview: "समीक्षा के लिए प्रतीक्षारत",
      assessmentsCompleted: "पूर्ण मूल्यांकन",
      pendingVerification: "लंबित साक्ष्य सत्यापन",
      certifiedCandidates: "प्रमाणित उम्मीदवार",
      reviewCandidate: "उम्मीदवार की समीक्षा करें",
      approve: "प्रमाणपत्र स्वीकृत और जारी करें",
      requestReassessment: "पुनर्मूल्यांकन का अनुरोध करें",
      aiNotice: "AI केवल अनुशंसाएं प्रदान करता है। अंतिम निर्णय अधिकृत मूल्यांकनकर्ता द्वारा लिया जाता है।",
    },
    common: {
      aiAssisted: "AI-सहायक मूल्यांकन",
      disclaimer: "स्मार्ट इंडिया हैकथॉन प्रोटोटाइप। अंतिम प्रमाणीकरण अधिकृत मूल्यांकनकर्ता द्वारा आवश्यक है।",
      howScoreCalculated: "यह स्कोर कैसे तैयार किया गया?",
      years: "वर्ष",
      status: "स्थिति",
      action: "कार्रवाई",
      viewDetails: "विवरण देखें",
      close: "बंद करें",
      print: "आधिकारिक प्रमाणपत्र प्रिंट करें",
      downloadCert: "प्रोटोटाइप प्रमाणपत्र डाउनलोड करें",
      prototypeWatermark: "प्रोटोटाइप प्रदर्शन — कौशल विकास एवं उद्यमिता मंत्रालय",
    },
  },
  te: {} as any,
  kn: {} as any,
};

translations.te = translations.en;
translations.kn = translations.en;
