import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  BrainCircuit, 
  Volume2, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle,
  FileText,
  Video
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { AIBadge } from '../common/AIBadge';

export const ExperienceDiscovery: React.FC = () => {
  const { candidate, setCandidate, setCurrentView, t, addAuditLog } = useApp();
  
  const [inputText, setInputText] = useState(
    candidate.experienceDescription || 
    "I have been working as an electrician for 7 years. I install domestic house wiring, conduit pipes, repair fans, switches, distribution boards with MCB/RCCB, and perform continuity and earthing resistance testing."
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Timer effect for voice recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartVoice = () => {
    setIsRecording(true);
  };

  const handleStopVoice = async () => {
    setIsRecording(false);
    await triggerAIAnalysis();
  };

  const triggerAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeExperience(inputText);
      setAnalysisResult(result);
      setCandidate((prev) => ({
        ...prev,
        yearsOfExperience: result.yearsOfExperience,
        primaryTrade: result.detectedTrade,
        extractedSkills: result.extractedSkills,
        experienceConfidence: result.experienceConfidence,
        experienceDescription: inputText,
        nsqfTargetLevel: result.recommendedNSQFLevel,
      }));
      addAuditLog(
        'AI Experience Interview Analyzed',
        `Extracted ${result.yearsOfExperience} years in ${result.detectedTrade} with ${result.extractedSkills.length} competencies.`,
        candidate.name
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleTrade = (tradeName: string, text: string) => {
    setInputText(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Phase 1: Discovery
              </span>
              <AIBadge confidence={candidate.experienceConfidence} text="Conversational NLP" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t.candidate.experienceInterviewTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.candidate.experienceInterviewSubtitle}
            </p>
          </div>

          {/* Quick preset trade chips */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
            <button
              onClick={() => loadSampleTrade('Electrician', "I have been working as an electrician for 7 years. I install house wiring, repair fans, switches, distribution boards with MCB and test earthing resistance.")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              ⚡ Electrician (7 Yrs)
            </button>
            <button
              onClick={() => loadSampleTrade('Welder', "I have 8 years experience in SMAW 3G welding of mild steel structural pipes, gas cutting, safety goggles, and electrode angle handling.")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              🔥 Welder (8 Yrs)
            </button>
            <button
              onClick={() => loadSampleTrade('Tailor', "I have 5 years experience cutting patterns for salwar suits, blouse stitching, motorized Usha sewing machine repair, and zipper fixing.")}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              🪡 Tailor (5 Yrs)
            </button>
          </div>
        </div>
      </div>

      {/* Main Experience Input & Voice Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Recording + Text Input (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Describe Your Practical Work & Experience</span>
              <span className="text-[11px] font-normal text-slate-400">Speak or Type in your language</span>
            </h3>

            {/* Live Voice Recorder Area */}
            <div className={`p-5 rounded-2xl border transition-all text-center ${
              isRecording 
                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              {isRecording ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
                    <span className="text-xs font-bold text-rose-700">
                      Recording Spoken Voice... ({recordingSeconds}s)
                    </span>
                  </div>

                  {/* Animated Simulated Audio Waveform */}
                  <div className="flex items-center justify-center gap-1 h-12">
                    {[35, 75, 45, 90, 60, 100, 80, 50, 95, 40, 85, 60, 70, 90, 45, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                        style={{ 
                          height: `${Math.max(15, (h * (0.5 + Math.random() * 0.5)))}%`,
                          animationDuration: `${0.4 + (i % 4) * 0.2}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  <button
                    onClick={handleStopVoice}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>{t.candidate.micStop}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Spoken Voice Experience Capture</div>
                      <div className="text-[11px] text-slate-500">Supports Hindi, Tamil, and English accents</div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartVoice}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{t.candidate.micStart}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Text Editor Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Transcribed Description / Written Summary
              </label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe: 1) How many years you worked, 2) Tools used, 3) Installations or repairs done, 4) Safety precautions followed..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white leading-relaxed resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                {inputText.split(' ').filter(Boolean).length} words entered
              </span>
              <button
                onClick={triggerAIAnalysis}
                disabled={isAnalyzing || !inputText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
                    <span>Processing NLP Extraction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Analyze with AI Skill Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Extraction Insights (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-sky-600" />
                  <span>AI Extracted Skill Intelligence</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  92% Confidence
                </span>
              </div>

              {isAnalyzing ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto animate-bounce">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Analyzing domain vocabulary...</div>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Mapping informal experience to National Occupational Standards (NOS)
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-3">
                  {/* Extracted Core Cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-slate-600">Detected Experience</span>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">
                        {analysisResult?.yearsOfExperience || candidate.yearsOfExperience} Years
                      </div>
                      <span className="text-[10px] text-emerald-700 font-medium">Informal / Practical</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-slate-600">Target NSQF Level</span>
                      <div className="text-lg font-bold text-sky-800 mt-0.5">
                        Level {analysisResult?.recommendedNSQFLevel || candidate.nsqfTargetLevel}
                      </div>
                      <span className="text-[10px] text-sky-800 font-medium">Craftsman Equivalent</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-700 block mb-2">
                      Identified Competency Nodes
                    </span>
                    <div className="space-y-1.5">
                      {(analysisResult?.extractedSkills || candidate.extractedSkills).slice(0, 5).map((sk: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{sk.name}</span>
                          </div>
                          <span className="font-bold text-slate-700 text-[11px] shrink-0 ml-2">{sk.confidence}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-700 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    "{analysisResult?.summary || 'AI identified strong experiential vocabulary for Electrician spanning 7 years with heavy emphasis on wiring and circuit testing.'}"
                  </p>
                </div>
              )}
            </div>

            {/* Progression CTA */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentView('ai-skill-profile')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                <span>View Full AI Skill Radar & Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
