import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  ShieldCheck, 
  BrainCircuit, 
  ArrowRight, 
  RotateCcw,
  FileAudio,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VOICE_DEMO_DATA } from '../../services/mockData';
import { AIService } from '../../services/aiService';
import { AIBadge } from '../common/AIBadge';

export const VoiceAssessment: React.FC = () => {
  const { candidate, setCandidate, setCurrentView, language, t, addAuditLog } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceResult, setVoiceResult] = useState<any>(VOICE_DEMO_DATA);
  const [showResult, setShowResult] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const getPromptQuestion = () => {
    if (language === 'ta' && voiceResult.promptQuestionTa) return voiceResult.promptQuestionTa;
    if (language === 'hi' && voiceResult.promptQuestionHi) return voiceResult.promptQuestionHi;
    return voiceResult.promptQuestion;
  };

  const handleStartRecording = () => {
    setShowResult(false);
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    try {
      const data = await AIService.analyzeVoice();
      setVoiceResult(data);
      setShowResult(true);
      setCandidate((prev) => ({
        ...prev,
        scores: {
          ...prev.scores,
          communication: data.scores.communication,
          safety: Math.max(prev.scores.safety, data.scores.safetyAwareness),
        },
      }));
      addAuditLog(
        'Voice Assessment Evaluated',
        `Technical Knowledge: ${data.scores.technicalKnowledge}%, Safety Awareness: ${data.scores.safetyAwareness}%`,
        candidate.name
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Phase 5: Voice Interview
              </span>
              <AIBadge confidence={91} text="Speech-to-Concept NLP" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Conversational Voice Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Speak your answer naturally in Hindi, Tamil, or English — evaluated on technical logic and safety awareness.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 self-start sm:self-center">
            <Radio className="w-4 h-4 text-sky-600 animate-pulse" />
            <span>Whisper-Gov Speech AI</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Voice Recording Prompt & Studio */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase">
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>AI Technical Question Prompt</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                "{getPromptQuestion()}"
              </h3>
            </div>

            {/* Recorder Studio Box */}
            <div className={`p-6 rounded-2xl border transition-all text-center ${
              isRecording ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200' : 'bg-slate-50 border-slate-200'
            }`}>
              {isRecording ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
                    <span className="text-xs font-bold text-rose-700">
                      Listening & Recording ({seconds}s)
                    </span>
                  </div>

                  {/* Animated Waveform */}
                  <div className="flex items-center justify-center gap-1.5 h-16">
                    {[40, 70, 90, 60, 100, 80, 50, 95, 30, 85, 60, 90, 75, 55, 80, 45].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDuration: `${0.3 + (i % 3) * 0.2}s` }}
                      ></div>
                    ))}
                  </div>

                  <button
                    onClick={handleStopRecording}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>Complete Recording & Analyze</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
                    <Mic className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Voice Response Mode</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explain step-by-step how you isolate circuits and check with a multimeter.
                  </p>
                  <button
                    onClick={handleStartRecording}
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Speaking Answer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Transcript Box */}
            {showResult && !isRecording && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileAudio className="w-4 h-4 text-sky-600" />
                  AI Voice Transcript (Recognized Audio)
                </span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto italic">
                  "{voiceResult.transcript}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 6 Cols: Multi-Dimensional AI Voice Evaluation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-sky-600" />
                  <span>Speech Competency Breakdown</span>
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  Passed Voice Assessment
                </span>
              </div>

              {isAnalyzing ? (
                <div className="py-16 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
                  <div className="text-xs font-bold text-slate-800">Transcribing & Scoring Concepts...</div>
                </div>
              ) : (
                <div className="space-y-4 pt-3">
                  {/* 4 Score Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[11px] text-slate-500 font-semibold">Technical Knowledge</span>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">{voiceResult.scores.technicalKnowledge}%</div>
                      <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${voiceResult.scores.technicalKnowledge}%` }}></div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[11px] text-slate-500 font-semibold">Safety Awareness</span>
                      <div className="text-lg font-bold text-emerald-600 mt-0.5">{voiceResult.scores.safetyAwareness}%</div>
                      <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${voiceResult.scores.safetyAwareness}%` }}></div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[11px] text-slate-500 font-semibold">Procedure Precision</span>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">{voiceResult.scores.procedureUnderstanding}%</div>
                      <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${voiceResult.scores.procedureUnderstanding}%` }}></div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[11px] text-slate-500 font-semibold">Communication Clarity</span>
                      <div className="text-lg font-bold text-slate-900 mt-0.5">{voiceResult.scores.communication}%</div>
                      <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${voiceResult.scores.communication}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Identified Concepts */}
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2">
                      Key Concepts Identified by AI
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {voiceResult.keyConceptsIdentified.map((c: string, idx: number) => (
                        <span key={idx} className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentView('practical-video')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
              >
                <span>Proceed to Practical Video Demonstration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
